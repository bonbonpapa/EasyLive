let express = require("express");

let app = express();

app.use("/", express.static("public")); // Needed for local assets

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on the port 4000");
});
