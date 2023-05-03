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
  logger.info("/register", req.body.email);
  try {
    // Declare variables from request

    //const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const first = req.body.firstName;
    const last = req.body.lastName;
    const dateOfBirth = req.body.dateOfBirth;
    const terms = req.body.terms;

    const ip_address =
      req.header("x-forwarded-for") || req.socket.remoteAddress;
    const user_agent = req.header("User-Agent");

    if (!terms) {
      res.status(401).json({ status: -1 });
      logger.error("terms of service");
      return;
    }

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
          logger.error("user already exists");
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
              "INSERT INTO user (email, account_guid, first, last, dateOfBirth, terms) VALUES (?, ?, ?, ?, ?, ?)",
              [
                email,
                response.data.account_guid,
                first,
                last,
                dateOfBirth,
                terms,
              ],
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
                    res.json({
                      ...response.data,
                      user: {
                        email,
                        firstName: first,
                        lastName: last,
                        dateOfBirth,
                      },
                    });
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

        // get user info
        pool.query(
          "SELECT * FROM user WHERE email = ?",
          [email],
          (err, data) => {
            if (err) {
              logger.error(err);
              res.status(401).json({ status: -1 });
              return;
            }

            if (data.length < 0) {
              // username does not exist
              res.status(501).json({ status: -2 });
              return;
            }

            if(data[0].type < 0) {
              res.status(401).json({ status: -3 });
              return;
            }

            res.json({
              ...response.data,
              user: {
                email: data[0].email,
                firstName: data[0].first,
                lastName: data[0].last,
                dateOfBirth: data[0].dateOfBirth,
                type: data[0].type,
                earnings: data[0].earnings
              },
            });
          }
        );
      })
      .catch(function (error) {
        logger.info(error.data);
        res.status(500).json({ status: -1 });
      });
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

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

        // get user info
        pool.query(
          "SELECT * FROM user WHERE account_guid = ?",
          [parseJwt(refreshToken).account_guid],
          (err, data) => {
            if (err) {
              logger.error(err);
              res.status(401).json({ status: -1 });
              return;
            }

            if (data.length < 0) {
              // username does not exist
              res.status(501).json({ status: -2 });
              return;
            }

            res.json({
              ...response.data,
              user: {
                email: data[0].email,
                firstName: data[0].first,
                lastName: data[0].last,
                dateOfBirth: data[0].dateOfBirth,
                type: data[0].type,
                earnings: data[0].earnings
              },
            });
          }
        );
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

app.get("/inventory", (req, res) => {


  try {
    pool.query(
      "SELECT * FROM `inventory`",
      [],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        res.json({ inventory: data }); // send inventory to user

      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }

});

app.post("/inventory", (req, res) => {
  logger.info("POST:/inventory", req.body);

  try {
    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    const title = req.body.title;
    const image_url = req.body.image_url;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const description = req.body?.description;

    pool.query("INSERT INTO inventory (account_guid, title, image_url, quantity, price, description) VALUES (?, ?, ?, ?, ?, ?)", [account_guid, title, image_url, quantity, price, description], (err, data) => {
      if (err) {
        console.error(err);
        res.status(401).json({ status: -1 });
        return;
      }

      res.json({ status: 1 });

    });
  } catch (error) {
    res.status(500).json({ status: 0 });
  }

});

app.get("/cart", (req, res) => {
  // JWT verify

  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    pool.query(
      "SELECT * FROM `cart` WHERE account_guid = ? AND checkout = 0",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        if (typeof data[0] === 'undefined') {
          res.json({ cart: [] }); // send empty cart to user
          return;
        }

        const cart_id = typeof data[0].cart_id;

        pool.query(
          "SELECT inventory.inventory_id, inventory.title, inventory.description, inventory.image_url, inventory.price, item.quantity FROM cart LEFT JOIN item ON cart.cart_id=item.cart_id LEFT JOIN inventory ON item.inventory_id=inventory.inventory_id WHERE cart.account_guid = ? AND cart.checkout = 0",
          [account_guid],
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -1 });
              return;
            }

            if (data[0].inventory_id === null) {
              res.json({ cart: [] }); // send cart to user
              return;
            }

            res.json({ cart: data }); // send cart to user
            return;

          }
        );

      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }

});

app.get("/earnings", (req, res) => {
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    pool.query(
      "SELECT user.earnings, user.type FROM user WHERE user.account_guid = ?",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        res.json({ earnings: data[0].earnings, type: data[0].type });

      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.get("/users", (req, res) => {
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (err, data) => {
        if (err) {
          logger.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        if (data[0].type == 2) // if admin
        {
          pool.query(
            "SELECT * FROM user",
            [account_guid],
            (err, data) => {
              if (err) {
                console.error(err);
                res.status(401).json({ status: -2 });
                return;
              }

              res.json(data);

            }
          );
        }

        else {
          res.status(401).json({ status: -3 });
        }
      });


  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.put("/users", (req, res) => {
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    const guid = req.body.account_guid;

    pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (err, data) => {
        if (err) {
          logger.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        if (data[0].type == 2) // if admin
        {
          pool.query("UPDATE user SET type = -1 WHERE account_guid = ?", [guid], (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -3 });
              return;
            }

            res.json({ status: 1 });

          });
        }

        else {
          res.status(401).json({ status: -3 });
        }
      });


  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.post("/cart", (req, res) => {
  // JWT verify
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;
    const inventory_id = req.body.inventory_id;
    const quantity = req.body.quantity;

    // TODO: find cart of user
    pool.query(
      "SELECT * FROM cart WHERE account_guid = ? AND checkout = 0",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        let cart_id;

        // No empty cart available
        if (data.length <= 0) {
          // TODO: create cart
          pool.query("INSERT INTO cart (account_guid, checkout) VALUES (?, ?)", [account_guid, 0], (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -2 });
              return;
            }

            cart_id = data.insertId;
            logger.info(data);
            logger.info(cart_id);

            pool.query("INSERT INTO item (cart_id, inventory_id, quantity) VALUES (?, ?, ?)", [cart_id, inventory_id, quantity], (err, data) => {
              if (err) {
                console.error(err);
                res.status(401).json({ status: -3 });
                return;
              }

              res.json({ status: 1 });

            });

          });
        }

        // Cart exists
        else {
          cart_id = data[0].cart_id;

          pool.query("INSERT INTO item (cart_id, inventory_id, quantity) VALUES (?, ?, ?)", [cart_id, inventory_id, quantity], (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -3 });
              return;
            }

            res.json({ status: 1 });

          });
        }

      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.put("/cart", (req, res) => {
  // JWT verify
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    const inventory_id = req.body.inventory_id;
    const quantity = req.body.quantity;

    // TODO: find cart of user
    pool.query(
      "SELECT * FROM cart WHERE account_guid = ? AND checkout = 0",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        const cart_id = data[0].cart_id;

        pool.query("UPDATE item SET quantity = quantity + ? WHERE item.inventory_id = ? AND item.cart_id = ?", [quantity, inventory_id, cart_id], (err, data) => {
          if (err) {
            console.error(err);
            res.status(401).json({ status: -3 });
            return;
          }

          res.json({ status: 1 });

        });


      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.delete("/cart", (req, res) => {
  // JWT verify
  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    const inventory_id = req.body.inventory_id;

    // TODO: find cart of user
    pool.query(
      "SELECT * FROM cart WHERE account_guid = ? AND checkout = 0",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        const cart_id = data[0].cart_id;

        pool.query("DELETE FROM item WHERE item.inventory_id = ? AND item.cart_id = ?", [inventory_id, cart_id], (err, data) => {
          if (err) {
            console.error(err);
            res.status(401).json({ status: -3 });
            return;
          }

          res.json({ status: 1 });

        });


      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});

app.post("/checkout", (req, res) => {
  // JWT verify
  logger.info("/checkout", req.body);

  try {
    // Declare variables from request

    const account_guid = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.ACCESS_SECRET
    ).account_guid;

    // Get the user's information

    pool.query(
      "SELECT * FROM `user` WHERE account_guid = ?",
      [account_guid],
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(401).json({ status: -1 });
          return;
        }

        const user = data[0];

        // Get the active cart
        pool.query(
          "SELECT inventory.account_guid, inventory.price, item.quantity FROM cart LEFT JOIN item ON cart.cart_id=item.cart_id LEFT JOIN inventory ON item.inventory_id=inventory.inventory_id WHERE cart.account_guid = ? AND cart.checkout = 0",
          [account_guid],
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(401).json({ status: -1 });
              return;
            }

            let result = {};

            // Loop through each object in the JSON array
            for (let i = 0; i < data.length; i++) {
              let obj = data[i];

              // Check if this account_guid has been seen before
              if (result[obj.account_guid]) {
                // If it has, add the value of price * quantity to the existing total
                result[obj.account_guid] += obj.price * obj.quantity;
              } else {
                // If it hasn't, set the total to the value of price * quantity
                result[obj.account_guid] = obj.price * obj.quantity;
              }
            }

            // Convert the resulting object into an array of objects with account_guid and earnings
            let resultList = [];
            for (let guid in result) {
              resultList.push({ account_guid: guid, earnings: result[guid] });
            }


            // increment each account_guid's earnings
            resultList.forEach(element => {
              pool.query(
                "UPDATE user SET earnings = earnings + ? WHERE account_guid = ?",
                [element.earnings, element.account_guid],
                (err, data) => {
                  if (err) {
                    console.error(err);
                    res.status(401).json({ status: -1 });
                    return;
                  }
                });
            });

            // set cart_id checkout = 1

            pool.query("UPDATE cart SET checkout = 1 WHERE account_guid = ?", [account_guid], (err, data) => {
              if (err) {
                console.error(err);
                res.status(401).json({ status: -3 });
                return;
              }

              res.json({ status: 1 });

            });


          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ status: 0 });
  }
});


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
  res.json({ repo: "https://github.com/ryanmichaelcurry/group1" });
});

/* Server */
server.listen(process.env.PORT ? process.env.PORT : 8080, () => {
  logger.info("Server is running at port 8080");
});
