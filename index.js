const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const corOptions = {
  origin: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  credentials: true,
  optionSucessStatus: 200,
};
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(cors(corOptions));
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
});

app.post("/createTask", (req, res) => {
  const { name, checked } = req.body;
  const id = uuidv4();
  sqlInsert = "INSERT INTO task (id, name, checked) VALUES (?, ?, ?)";
  db.query(sqlInsert, [id, name, checked], (error, result) => {
    if (error) {
      console.log(error);
    }
  });
  res.send('Successful');
});

app.get("/getTasks", (req, res) => {
  sqlGet = "SELECT * FROM task";
  db.query(sqlGet, (error, result) => {
    res.send({ result, length: result.length });
  });
});

app.get("/getActiveTasks", (req, res) => {
  sqlGetActiveTasks = "SELECT * FROM task WHERE checked = false";
  db.query(sqlGetActiveTasks, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send({ result, length: result.length });
  });
});

app.get("/getCompletedTasks", (req, res) => {
  sqlGetActiveTasks = "SELECT * FROM task WHERE checked = true";
  db.query(sqlGetActiveTasks, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send({ result, length: result.length });
  });
});

app.put("/updateCheck/:id", (req, res) => {
  const id = req.params.id;
  const sqlUpdate = "UPDATE task SET `checked` = ? WHERE id= ?";

  db.query(sqlUpdate, [req.body.checked, id], (err, result) => {
    if (err) {
      console.log(err);
    }

    res.send(result);
  });
});

app.delete("/deleteTask/:id", (req, res) => {
  const id = req.params.id;
  sqlDelete = "DELETE FROM task WHERE id = ?";
  db.query(sqlDelete, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send("Deleted successfully");
  });
});

app.delete("/deleteAll", (req, res) => {
  sqlDeleteAll = "DELETE FROM task WHERE checked = true";
  db.query(sqlDeleteAll, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send("Cleared successfully");
  });
});

app.listen("2000", () => {
  console.log("Server is running on port 2000");
});
