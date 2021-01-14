require("dotenv").config();
const express = require("express");
const connectMongo = require("./server/config/db");
const morgan = require("morgan");
const { connectSQL } = require("./server/config/sql");
const passport = require("passport");
const expressWs = require("express-ws");
const path = require("path");
const helmet = require("helmet");
const {
  generateUniqueLink,
  verifyUniqueLink,
  sendActivationEmail,
} = require("./server/util/email");
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
const app = express();
// warp ws with app
const appWs = expressWs(app);
app.use(morgan("combined"));
// Init Middleware
app.use(helmet());
app.use(express.json({ extended: false, limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(passport.initialize(app));

// App API Router
app.use("/api/busservice/", require("./server/routes/api/busService"));
app.use("/api/busstop/", require("./server/routes/api/busStop"));
app.use("/api/busarrival/", require("./server/routes/api/busArrival"));
app.use("/api/user/", require("./server/routes/api/user"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  console.log("here");
  // Set static folder
  app.use(express.static("dist/busChecker"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "busChecker", "index.html"));
  });
}

// Test all DB connection before launching server
Promise.all([connectSQL(), connectMongo()])
  .then(() => {
    app.listen(PORT, () =>
      console.info(
        `Application started on port http://localhost:${PORT}/ at ${new Date()}`
      )
    );
  })
  .catch((err) => {
    console.error("Cannot connect: ", err);
    process.exit(1);
  });
