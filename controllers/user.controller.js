require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET;

const { userDataStore, eventDataStore } = require("../db/data.store");
const { v4: uuidv4 } = require("uuid");

exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    //check if user already exists
    console.log(req.body);

    let user = userDataStore.filter((item) => item.email == email);
    if (user.length != 0)
      return res.status(200).json({ message: "User already exists" });

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
    console.log(newUser);

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
    let user = userDataStore.filter((user) => user.email == email);

    if (user.length == 0)
      return res.status(200).json({ message: "User does not exist" });

    hashPassword = user[0].password;

    let checkPassword = await bcrypt.compare(password, hashPassword);

    if (checkPassword) {
      var token = jwt.sign(
        { id: user[0].id, email: email, user: user[0].username },
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

// exports.events = async (req, res) => {
//   try {
//     let { description, location, date, time, status } = req.body;
//     let { id, email, user } = req.user;

//     let newEvent = {
//       event_id: uuidv4(),
//       description,
//       location,
//       date,
//       time,
//       organiser_id: id,
//       organiser: user,
//       organiser_email: email,
//       status,
//     };

//     eventDataStore.push(newEvent);
//     let updateUserOrganisedEvent = userDataStore.filter(
//       (user) => id == user.id
//     )[0];
//     updateUserOrganisedEvent.event_organised.push(newEvent.event_id);

//     res.status(200).json({
//       message: "Event create successfully",
//       event: newEvent,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Something went wrong while creating the event" });
//   }
// };

// exports.fetchAllEvents = async (req, res) => {
//   try {
//     let { id } = req.user;

//     let userOrganisedEvents = eventDataStore.filter(
//       (event) => id == event.organiser_id
//     );

//     res.status(200).json({ message: userOrganisedEvents });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Something went wrong while getting event list" });
//   }
// };

// exports.updateEvent = async (req, res) => {
//   try {
//     console.log(req.params);
//     console.log(req.query);
//     let event_id = req.params.id;
//     let updateEventDetails = eventDataStore.filter(
//       (event) => event_id == event.event_id
//     )[0];

//     if (!updateEventDetails) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     //loop over req.body and update the fields accordingly
//     for (let key in req.body) {
//       const value = req.body[key];
//       if (value !== undefined && value !== null && value !== "") {
//         updateEventDetails[key] = value;
//       }
//     }
//     res.status(200).json({
//       message: "Event updated successfully",
//       event: updateEventDetails,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Something went wrong while updating event" });
//   }
// };
