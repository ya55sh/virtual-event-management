const { userDataStore } = require("../db/data.store");

exports.checkUserExist = (email) => {
  return userDataStore.find((userData) => userData.email == email);
};

exports.getUserById = (userId) => {
  return userDataStore.find((user) => userId == user.id);
};
