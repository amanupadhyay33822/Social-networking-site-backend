const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const cookieParser = require('cookie-parser');
const BodyParser = require('body-parser');

// Define the rate limiting options
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  
  // Apply the rate limiter to all requests
  app.use(limiter);

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(BodyParser.json());
// app.use(BodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(BodyParser.json())

//importing routes
const post = require("./routes/post");
const user = require("./routes/user");

//using routes
app.use("/api/v1",post)
app.use("/api/v1",user)


module.exports = app