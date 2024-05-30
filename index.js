const env = require("dotenv");
const LiteLogger = require("@kingdanx/litelogger");
const express = require("express");

env.config({ path: "./config/.config" });

const app = express();
app.use(express.json());
app.use(verifyAPIKey);

const logger = new LiteLogger(
  process.env.LOG_DIR,
  process.env.LOG_NAME,
  process.env.LOG_DIR_NAME,
  process.env.LOG_KEEP_DAYS
);

app.post("log", (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message || !type) {
      const error = new Error(
        "Message or type was not provided in the request body"
      );
      throw error;
    }

    logger.log(message, type.toUpperCase());

    res.send({ success: true });
  } catch (e) {
    res.status(500).send({ error: e.toString() });
  }
});

app.listen(process.env.REST_PORT, () => {
  console.log("Log REST listening on port:", process.env.REST_PORT);
});

function verifyAPIKey(req, res, next) {
  const API_KEY = req.headers["x-auth-key"];
  if (API_KEY === global.env.API_KEY) {
    next();
  } else {
    res.status(403).send("Unauthorized");
  }
}
