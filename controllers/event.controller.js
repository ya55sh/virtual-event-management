require("dotenv").config();

const { userDataStore, eventDataStore } = require("../db/data.store");
const sendMail = require("../utils/email.service");

const { v4: uuidv4 } = require("uuid");

exports.createEvent = async (req, res) => {
  try {
    let { description, location, date, time, status } = req.body;
    let { id, email, user } = req.user;

    let newEvent = {
      event_id: uuidv4(),
      description,
      location,
      date,
      time,
      organiser_id: id,
      organiser: user,
      organiser_email: email,
      status,
      participants: [],
    };

    eventDataStore.push(newEvent);

    //update user organised event in the user data store
    let updateUserOrganisedEvent = userDataStore.filter(
      (user) => id == user.id
    )[0];
    updateUserOrganisedEvent.event_organised.push(newEvent.event_id);

    res.status(200).json({
      message: "Event create successfully",
      event: newEvent,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while creating the event" });
  }
};

exports.fetchAllEvents = async (req, res) => {
  try {
    let { id } = req.user;

    let userOrganisedEvents = eventDataStore.filter(
      (event) => id == event.organiser_id
    );

    if (userOrganisedEvents.length == 0) {
      return res.status(400).json({
        message: "No events organised",
      });
    }

    res.status(200).json({ message: userOrganisedEvents });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while getting event list" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    let event_id = req.params.id;
    let updateEventDetails = eventDataStore.filter(
      (event) => event_id == event.event_id
    )[0];

    if (!updateEventDetails) {
      return res.status(404).json({ message: "Event not found" });
    }

    //loop over req.body and update the fields accordingly
    for (let key in req.body) {
      const value = req.body[key];
      if (value !== undefined && value !== null && value !== "") {
        updateEventDetails[key] = value;
      }
    }
    res.status(200).json({
      message: "Event updated successfully",
      event: updateEventDetails,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while updating the event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    let event_id = req.params.id;

    let getEventById = eventDataStore.find(
      (event) => event.event_id == event_id
    );

    if (!getEventById) {
      return res.status(404).json({ message: "Event does not exist" });
    }

    const index = eventDataStore.findIndex(
      (event) => event.event_id == event_id
    );
    if (index !== -1) {
      eventDataStore.splice(index, 1);
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while registering the event" });
  }
};

exports.registerEvent = async (req, res) => {
  try {
    const event_id = req.params.id;
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({ message: "Invalid participant data" });
    }
    // Check if event exists
    const getEventById = eventDataStore.find(
      (event) => event.event_id == event_id
    );
    if (!getEventById) {
      return res.status(404).json({ message: "Event does not exist" });
    }

    // Check if user exists
    const userDataById = userDataStore.find((user) => user.id == id);
    if (!userDataById) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Check if user is already following this event
    const userEventfollow = userDataById.event_followed.find(
      (event) => event.event_id == event_id
    );
    if (userEventfollow) {
      return res.status(409).json({ message: "Already following this event" });
    }

    // Check if user is already registered as a participant
    const checkParticipant = getEventById.participants.find(
      (participant) => participant.id == id
    );
    if (checkParticipant) {
      return res.status(409).json({ message: "User is already registered" });
    }

    // Add user to participants and update user's followed events
    getEventById.participants.push({ id, name, email });
    userDataById.event_followed.push({ event_id });

    await sendMail({
      to: email,
      subject: "You're registered for the event!",
      text: `Hey ${name}, you've been registered for the event ${getEventById.description} successfully.`,
    });

    res.status(201).json({ message: "Event registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while registering for the event",
    });
  }
};
