const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");

const port = 5000;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// THE MAIN, LANDING & DEFAULT PAGE
app.get("/", function (_req, res) {
  // redirecting page to index html file
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/newentry", function (req, res) {
//redirecting page to index html file
  res.sendFile(__dirname + "/public/newentry.html");
});

// Date format function
function formatDate(dateString) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

app.post("/newentry", function (req, res) {

  const formData = req.body;
  formData.date = formatDate(new Date());
  
  fs.readFile("data.json", function (err, data) {
    if (err) throw err;
    const entries = JSON.parse(data);
    entries.push(formData);
 
    fs.writeFile("data.json", JSON.stringify(entries), function (err) {
      if (err) throw err;
      console.log("New entry added to data.json");
      res.redirect("/guestbook");
    });
  });
});


// THE GUESTBOOK PAGE
app.get("/guestbook", (_req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      res.status(500).send("Error loading data");
      return;
    }

    const jsonData = JSON.parse(data);
    var tableData = {
      data:jsonData,
    };
    res.render("./pages/index", tableData);

  });
});

// THE ERROR FUNCTION
app.get("*", function (_req, res) {
  res.status(404).send("Can't find requested page");
});

// PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


