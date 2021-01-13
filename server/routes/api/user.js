// User model is connected to MYSQL, hence not required to declare at mongoose
// To migrate to MongoDB in future implementation

const express = require("express");
const { pool } = require("../../config/sql");
const router = express.Router();
const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  generateUniqueLink,
  verifyUniqueLink,
  sendActivationEmail,
} = require("../../util/email");
const { uploadProfilePic } = require("../../util/s3upload");

// Query Factory Function
const makeQuery = (query, pool) => {
  return async (args) => {
    const conn = await pool.getConnection();
    try {
      let results = await conn.query(query, args || []);
      return results[0];
    } catch (error) {
      // throw error to handle at endpoint
      throw error;
    } finally {
      conn.release();
    }
  };
};

// List of Query
const queryCreateUser =
  "INSERT INTO user (username, email, password) VALUES  (?,?,sha1(?))";
const queryLoginUser =
  "SELECT username,is_activated FROM user WHERE username=? AND password=sha1(?); ";
const queryCheckUserActivation =
  "SELECT is_activated FROM user WHERE username=? AND email=?";
const queryActivateUser = "UPDATE user SET is_activated=true WHERE username=?";
const queryCreateUserProfile =
  "INSERT INTO user_profile (fk_userid) VALUES (?)";
const queryGetUserProfile =
  "SELECT u.email, u.username, up.name, up.contactnum, up.profilepic FROM user as u  LEFT JOIN user_profile as up ON u.userID = up.fk_userid WHERE u.username = ?;";
const queryUpdateUserProfile =
  "UPDATE user_profile SET name=?,contactnum=?, profilepic=? WHERE fk_userid = ?;";
const queryGetUserId = "SELECT userID FROM user WHERE username=?";
// Query Function
const createUser = makeQuery(queryCreateUser, pool);
const loginUser = makeQuery(queryLoginUser, pool);
const checkUserActivation = makeQuery(queryCheckUserActivation, pool);
const ActivateUser = makeQuery(queryActivateUser, pool);
const createUserProfile = makeQuery(queryCreateUserProfile, pool);
const getUserProfile = makeQuery(queryGetUserProfile, pool);
const updateUserProfile = makeQuery(queryUpdateUserProfile, pool);
const getUserId = makeQuery(queryGetUserId, pool);

// Configure passport with a strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      // required for passing req to callback
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      // Perform authentication
      const authResult = await loginUser([username, password]);
      if (authResult.length > 0) {
        if (!authResult[0]["is_activated"]) {
          return done(null, false, {
            code: 403,
            error: "Account not activated",
          });
        }
        done(
          null,
          // Info about the user
          {
            username: authResult[0]["username"],
            is_activated: authResult[0]["is_activated"],
            loginTime: new Date().toString(),
          }
        );
      } else {
        // Incorrect login
        done(null, false, {
          code: 401,
          error: "Incorrect username and password",
        });
      }
    }
  )
);
// Create user endpoint
router.post("/", async (req, res) => {
  let { username, email, password } = req.body;
  if (!validateEmail(email)) {
    return res
      .status(401)
      .json({ error: "Please provide valid email address" });
  }
  try {
    let result = await createUser([username, email, password]);
    await createUserProfile(result["insertId"]);
    await sendActivationEmail(username, email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Login user endpoint
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (null != error) {
        res.status(401).json({ error });
        return;
      }
      if (!user) {
        res.status(info["code"]);
        res.type("application/json");
        res.json({ info });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    const currTime = new Date().getTime() / 1000;
    const token = jwt.sign(
      {
        sub: req.user,
        iss: "express",
        iat: currTime,
        exp: currTime + 1000000,
        data: {
          loginTime: req.user.loginTime,
        },
      },
      TOKEN_SECRET
    );
    res.json({ user: req.user, token });
  }
);

// Get user profile from decoded token
// Token included as part of header
router.get("/profile", verifyUserToken, async (req, res) => {
  const token = req.auth;
  try {
    let result = await getUserProfile(token["sub"]["username"]);
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update user profile from decoded token and req.body
// Token included as part of header
router.post("/profile", verifyUserToken, uploadProfilePic, async (req, res) => {
  try {
    const token = req.auth;
    const profilepic = res.req.file["location"];

    const { name, contactnum } = req.body;
    let userId = await getUserId(token["sub"]["username"]);
    let result = await updateUserProfile([
      name,
      contactnum,
      profilepic,
      userId[0]["userID"],
    ]);
    resData = {
      name,
      contactnum,
      profilepic,
    };
    res.status(200).json(resData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// Activate Account
router.get("/activation/:token", async (req, res) => {
  const token = req.params["token"];
  // Verify if token is valid and get the userInfo
  // Then check if user is activated
  try {
    const decoded = await verifyUniqueLink(token);
    const { username, email } = decoded;
    const activationRes = await checkUserActivation([username, email]);

    if (!activationRes[0]["is_activated"]) {
      await ActivateUser([username]);
    } else {
      return res.status(401).json({ error: "Account Already Activated" });
    }
    res.status(200).json({ success: "Account Activated Successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Server side validate email function
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// check user token middleware
function verifyUserToken(req, res, next) {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Please include token" });
  }
  try {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (error) {
        throw error;
      }
      req.auth = decoded;
      next();
    });
  } catch (error) {
    if (error["name"] == "TokenExpiredError") {
      return res.status(401).json(error);
    }
    return res.status(400).json(error);
  }
}

module.exports = router;
