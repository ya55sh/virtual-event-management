require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET;

const { userDataStore } = require("../db/data.store");
const { checkUserExist } = require("../utils/user.service");
const { v4: uuidv4 } = require("uuid");

exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing username, email or password" });
    }

    //check if user already exists
    let user = checkUserExist(email);
    if (user) return res.status(200).json({ message: "User already exists" });

    let hashPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashPassword,
      event_organised: [],
      event_followed: [],
    };

    userDataStore.push(newUser);

    res.status(200).json({
      message: "User created successfully",
      user: { user: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong during signup" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let hashPassword;

    //check if user exists or not
    let user = checkUserExist(email);
    if (!user) return res.status(200).json({ message: "User does not exist" });

    hashPassword = user.password;

    let checkPassword = await bcrypt.compare(password, hashPassword);

    if (checkPassword) {
      var token = jwt.sign(
        { id: user.id, email: email, user: user.username },
        jwtSecretKey,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({ message: "Login successfull", token: token });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong while loggin in" });
  }
};
