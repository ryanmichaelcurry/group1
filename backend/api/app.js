const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

var mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const { logger, readLog } = require("./utils/logger");
const axios = require("axios").default;

// Express Initialization
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
app.set("trust proxy", true); // Used to get IP Address

// MySQL Pool Creation
var pool = mysql.createPool({
  connectionLimit: 50,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: "utf8mb4",
  port: 25060,
  multipleStatements: true,
});

/*

  Contrive CAS Passport Code

*/

/* Registration */

app.post("/register", (req, res) => {
  logger.info(process.env.AUTH_API + "/register");
  try {
    // Declare variables from request

    //const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const ip_address =
      req.header("x-forwarded-for") || req.socket.remoteAddress;
    const user_agent = req.header("User-Agent");

    // We need to check if the username is available

    pool.query(
      "SELECT email FROM user WHERE email = ?",
      [email],
      (err, data) => {
        if (err) {
          logger.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        if (data.length > 0) {
          // username already exits
          res.status(501).json({ status: -2 });
          return;
        }

        // If username does not exist
        axios
          .post(process.env.AUTH_API + "/register", {
            email: email,
            password: password,
            service_guid: process.env.SERVICE_GUID,
            service_secret: process.env.SERVICE_SECRET,
          })
          .then(function (response) {
            pool.query(
              "INSERT INTO user (email, account_guid) VALUES (?, ?)",
              [email, response.data.account_guid],
              (err, data) => {
                if (err) {
                  logger.error(err);
                  res.status(401).json({ status: -1 });
                  return;
                }

                // Log the user in after account was created

                axios
                  .post(process.env.AUTH_API + "/login", {
                    email: email,
                    password: password,
                    ip_address: ip_address,
                    user_agent: user_agent,
                    service_guid: process.env.SERVICE_GUID,
                    service_secret: process.env.SERVICE_SECRET,
                  })
                  .then(function (response) {
                    logger.info(response.data);
                    res.json(response.data);
                  })
                  .catch(function (error) {
                    logger.info(error.data);
                    res.status(500).json({ status: -1 });
                  });
              }
            );
          })

          .catch(function (error) {
            logger.info(error.data);
            res.status(500).json({ status: -1 });
          });
      }
    );
    // Make proxy request to Contrive's Authentication Server
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

/* Loging In */
app.post("/login", (req, res) => {
  // DEBUG

  logger.info("login!");
  logger.info("/login", req.body);
  try {
    // Declare variables from request

    const email = req.body.email;
    const password = req.body.password;
    const ip_address =
      req.header("x-forwarded-for") || req.socket.remoteAddress;
    const user_agent = req.header("User-Agent");

    // Make proxy request to Contrive's Authentication Server

    // DEBUG
    logger.info("env", process.env);

    axios
      .post(process.env.AUTH_API + "/login", {
        email: email,
        password: password,
        ip_address: ip_address,
        user_agent: user_agent,
        service_guid: process.env.SERVICE_GUID,
        service_secret: process.env.SERVICE_SECRET,
      })
      .then(function (response) {
        logger.info(response.data);
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error.data);
        res.status(500).json({ status: -1 });
      });
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

/* Token Refresh Proxy */
app.post("/refresh", (req, res) => {
  logger.info("/refresh", req.body);
  try {
    // Declare variables from request

    const refreshToken = req.body.refreshToken;
    let ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const user_agent = req.header("User-Agent");

    // Make proxy request to Contrive's Authentication Server

    axios
      .post(process.env.AUTH_API + "/refresh", {
        refreshToken: refreshToken,
        ip_address: ip_address,
        user_agent: user_agent,
        service_guid: process.env.SERVICE_GUID,
        service_secret: process.env.SERVICE_SECRET,
      })

      .then(function (response) {
        logger.info(response.data);
        res.json(response.data);
      })
      .catch(function (error) {
        logger.info(error);
        res.status(500).json({ status: -1 });
      });
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

/*

  Group 01 E-commerce API

*/

/* View Logs */
app.get("/logs", (request, response) => {
  try {
    const auth = "Bearer " + process.env.ACCESS_KEY;
    if (request.headers.authorization == auth) {
      const result = readLog();
      response.set("Content-Type", "text/plain");
      return response.send(result);
    } else {
      return response.sendStatus(401);
    }
  } catch (e) {
    return response.sendStatus(500);
  }
});

/* DEBUG */
app.get("/fetch", (req, res) => {
  axios
    .get("https://api.chucknorris.io/jokes/random")
    .then(function (response) {
      logger.info("Response", response.data);
      res.json(response.data.value);
    })
    .catch(function (error) {
      logger.info(error);
      res.json({ status: 0 });
    });
});

app.get("/", (req, res) => {
  res.json({ "repo": "https://github.com/ryanmichaelcurry/group1" });
});

/* Server */
server.listen(process.env.PORT ? process.env.PORT : 8080, () => {
  logger.info("Server is running at port 8080");
});
