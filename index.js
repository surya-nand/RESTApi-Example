const express = require("express");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");

dotEnv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.set("view engine", "ejs");

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  imageURL: String,
  age: Number,
});

app.get("/", (req, res) => {
  res.json({ secretMission: "successful" });
});

app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.send({
        Error_Message: "Error in fetching users",
        err1: error,
      });
    });
});

app.post("/users", (req, res) => {
  const { firstName, lastName, imageURL, age } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    imageURL,
    age,
  });
  newUser
    .save()
    .then((newUser_details) => {
      res.send({
        message: "New user added",
        Details: newUser_details,
      });
    })
    .catch((error) => {
      res.send({
        message: " New user details failed to add",
        err2: error,
      });
    });
});

app.listen(process.env.SERVER, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed", error);
    });
  console.log("server is running successfully");
});
