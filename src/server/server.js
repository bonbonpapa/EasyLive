let express = require("express");

let app = express();

app.use("/", express.static("public")); // Needed for local assets
//app.use(express.json());

app.get("/test", (req, res) => {
  console.log("in Server test endpoint");
  res.send(JSON.stringify({ success: true }));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on the port 4000");
});
