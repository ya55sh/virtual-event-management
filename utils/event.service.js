const { eventDataStore } = require("../db/data.store");

exports.getEventById = (event_id) => {
  return eventDataStore.find((event) => event_id == event.event_id);
};

exports.fetchAllUserOrganisedEvents = (userId) => {
  return eventDataStore.filter((event) => userId == event.organiser_id);
};
