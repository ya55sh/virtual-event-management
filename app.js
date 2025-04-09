const express = require("express");
const app = express();
const port = 3000;

const route = require("./routes/index.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", route);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
