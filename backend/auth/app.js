const express = require("express");
const app = express();
var mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { logger, readLog } = require("./utils/logger");

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "*");

  next();
});

var pool = mysql.createPool({
  connectionLimit: 25,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: "utf8mb4",
  port: 25060,
  multipleStatements: true,
});

function generateAccessToken(user, accessSecret, access_ttl) {
  return jwt.sign(user, accessSecret, { expiresIn: access_ttl });
}

function generateRefreshToken(user, refreshSecret, refresh_ttl) {
  return jwt.sign(user, refreshSecret, { expiresIn: refresh_ttl });
}

/* Registration */

app.post("/register", async (req, res) => {
  logger.info(req.body);
  try {
    // Initalize variables

    var service_id = 0;
    var account_guid;

    // Declare variables from request

    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);
    const service_guid = req.body.service_guid;
    const service_secret = req.body.service_secret;

    // Verify service_guid and service_secret

    pool.query(
      "SELECT service.service_secret as service_secret, service.service_id as service_id FROM service WHERE service.service_guid = ?",
      [service_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        // service_id non-existant
        if (data.length <= 0) {
          res.status(401).json({ status: -2 });
          return;
        }

        // if secret incorrect
        else if (data[0].service_secret != service_secret) {
          res.status(401).json({ status: -2 });
          return;
        } else {
          service_id = data[0].service_id; // for use when checking unique email for account within a service
        }

        // Verify unique email for specified service

        pool.query(
          "SELECT * FROM account WHERE account.service_id = ? AND account.email = ?",
          [service_id, email],
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -3 });
              return;
            }

            // if data empty break
            if (data.length != 0) {
              res.status(401).json({ status: -4 });
              return;
            }

            // Create Account

            account_guid = uuid.v4().replaceAll("-", "");
            pool.query(
              "INSERT INTO account (account_guid, service_id, email, password) VALUES (?, ?, ?, ?)",
              [account_guid, service_id, email, password],
              (err, data) => {
                if (err) {
                  console.error(err);
                  res.status(401).json({ status: -5 });
                  return;
                }

                // account created successfully! send back account guid

                res.json({ account_guid: account_guid });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(401).json({ status: 0 });
  }
});

/* Authentication */

app.post("/login", async (req, res) => {
  logger.info(req.body);
  try {
    // Initalize variables

    var service_id = 0;
    var access_secret;
    var access_ttl;
    var refresh_secret;
    var refresh_ttl;

    // Declare variables from request

    const email = req.body.email;
    const password = req.body.password;
    const ip_address = req.body.ip_address;
    const user_agent = req.body.user_agent;
    const service_guid = req.body.service_guid;
    const service_secret = req.body.service_secret;

    // Declare Outbound Variables

    var accessToken;
    var refreshToken;

    // Verify service_guid and service_secret

    pool.query(
      "SELECT * FROM service WHERE service.service_guid = ?",
      [service_guid],
      async (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        // service_id non-existant
        if (data.length <= 0) {
          res.status(401).json({ status: -2 });
          return;
        }

        // if secret incorrect
        else if (data[0].service_secret != service_secret) {
          res.status(401).json({ status: -2 });
          return;
        }

        // store vars
        else {
          service_id = data[0].service_id;
          access_secret = data[0].access_secret;
          access_ttl = data[0].access_ttl;
          refresh_secret = data[0].refresh_secret;
          refresh_ttl = data[0].refresh_ttl;
        }

        // Get Password from Specified account for verification

        pool.query(
          "SELECT * FROM account WHERE account.service_id = ? AND account.email = ?",
          [service_id, email],
          async (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -3 });
              return;
            }

            logger.info(data);

            // if email incorrect
            if (data.length <= 0) {
              res.status(401).json({ status: -3 });
              return;
            }

            // Verify password
            else if (await bcrypt.compare(password, data[0].password)) {
              accessToken = generateAccessToken(
                { account_guid: data[0].account_guid },
                access_secret,
                access_ttl
              );
              refreshToken = generateRefreshToken(
                { account_guid: data[0].account_guid },
                refresh_secret,
                refresh_ttl
              );

              // Add refresh token to the Token table with relevant ip_address and agent fields and expire date

              pool.query(
                "INSERT INTO token (service_id, account_guid, token, created_ip, last_ip, user_agent, accessed_at, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  service_id,
                  data[0].account_guid,
                  refreshToken,
                  ip_address,
                  ip_address,
                  user_agent,
                  new Date(Date.now()),
                  new Date(Date.now() + refresh_ttl),
                ],
                (err, data) => {
                  if (err) {
                    console.error(err);
                    res.status(401).json({ status: -4 });
                    return;
                  }

                  // SUCCESS! send tokens
                  res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  });
                }
              );
            } else {
              res.status(401).json({ status: -5 });
            }
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

/* Refresh Token */

app.post("/refresh", async (req, res) => {
  logger.info(req.body);
  try {
    // Initalize variables

    var service_id = 0;
    var access_secret;
    var access_ttl;
    var refresh_secret;
    var refresh_ttl;

    // Declare variables from request

    const refreshToken = req.body.refreshToken;
    const service_guid = req.body.service_guid;
    const service_secret = req.body.service_secret;
    const ip_address = req.body.ip_address;
    const user_agent = req.body.user_agent;

    // Declare Outbound Variables

    var accessToken;
    var newRefreshToken;

    // Pull service data (token secrets)

    pool.query(
      "SELECT * FROM service WHERE service.service_guid = ?",
      [service_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        // service_id non-existant
        if (data.length <= 0) {
          res.status(401).json({ status: -2 });
          return;
        }

        // if secret incorrect
        else if (data[0].service_secret != service_secret) {
          res.status(401).json({ status: -2 });
          return;
        }

        // store vars
        else {
          service_id = data[0].service_id;
          access_secret = data[0].access_secret;
          access_ttl = data[0].access_ttl;
          refresh_secret = data[0].refresh_secret;
          refresh_ttl = data[0].refresh_ttl;
        }

        // Verify token exists in database

        pool.query(
          "SELECT * FROM token WHERE token.service_id = ? AND token.token = ?",
          [service_id, refreshToken],
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -3 });
              return;
            }

            // if token not in database
            if (data.length <= 0) {
              res.status(401).json({ status: -4 });
              return;
            }

            // Verify validity of refresh token

            jwt.verify(refreshToken, refresh_secret, (err, decoded) => {
              if (err) {
                console.error(err);
                res.status(401).json({ status: 0 });
                return;
              }

              // if agent has changed, I am assuming the token is stolen
              if (data[0].user_agent != user_agent) {
                res.status(401).json({ status: 0 });
                return;
              }

              // Update Token with last ip and last accessed (last accessed automatic)
              pool.query(
                "UPDATE token SET last_ip = ? WHERE token = ?",
                [ip_address, refreshToken],
                (err, data) => {
                  if (err) {
                    console.error(err);
                    res.status(500).json({ status: 0 });
                    return;
                  }

                  // generate new access token and send
                  accessToken = generateAccessToken(
                    { account_guid: decoded.account_guid },
                    access_secret,
                    access_ttl
                  );
                  res.json({ accessToken: accessToken });
                }
              );
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.get("/", (req, res) => {
  res.json({ "hire-me": "https://www.linkedin.com/in/ryanmichaelcurry/" });
});

/* Server */

app.listen(8080, () => {
  logger.info("Server is running at port 8080");
});
