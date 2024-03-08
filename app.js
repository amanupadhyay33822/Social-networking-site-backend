const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const BodyParser = require('body-parser');



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