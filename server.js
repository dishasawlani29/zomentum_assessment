const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;
//const todoRoutes = express.Router();
// let Todo = require("./todo_model");
const ticketRoutes = express.Router();
let Ticket = require("./ticket_model");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tickets", {
  useNewUrlParser: true,
});

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(bodyParser.json());

ticketRoutes.route("/").get(function (req, res) {
  Ticket.find(function (err, tickets) {
    if (err) {
      console.log(err);
    } else {
      res.json(tickets);
    }
  });
});

//============================================================================
//An endpoint to view the user’s details based on the ticket id.
//============================================================================
ticketRoutes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Ticket.findById(id, function (err, ticket) {
    if (err) {
      console.log(err);
    } else {
      res.json(ticket);
    }
  });
});

//============================================================================
//An endpoint to view all the tickets for a particular time.
//============================================================================
ticketRoutes.route("/time/:time").get(function (req, res) {
  let id = req.params.id;
  Ticket.find({ ticket_timing: req.params.time }, function (err, tickets) {
    if (err) {
      console.log(err);
    } else {
      res.json(tickets);
    }
  });
});

//============================================================================
//An endpoint to book a ticket using a user’s name, phone number, and timings.
//============================================================================
ticketRoutes.route("/add").post(function (req, res) {
  let ticket = new Ticket(req.body);
  ticket
    .save()
    .then((ticket) => {
      res.status(200).json({ ticket: "ticket added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new ticket failed");
    });
});

//============================================================================
//An endpoint to update a ticket timing.
//============================================================================
ticketRoutes.route("/update/:id").post(function (req, res) {
  Ticket.findById(req.params.id, function (err, ticket) {
    if (!ticket) {
      res.status(404).send("data not found");
    } else {
      ticket.ticket_timing = req.body.ticket_timing;

      ticket
        .save()
        .then((ticket) => {
          res.json("Ticket updated");
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

//============================================================================
//An endpoint to delete a particular ticket.
//============================================================================
ticketRoutes.route("/delete/:id").delete(function (req, res) {
  console.log("Delete Route");
  Ticket.findByIdAndDelete(req.params.id, function (err, ticket) {
    if (!ticket) {
      res.status(404).send("data not found");
    } else {
      res.json("Ticket Deleted");
    }
  });
});

ticketRoutes.route("/deletetime/:time").delete(function (req, res) {
  console.log("Delete Time Route");
  Ticket.deleteMany({ ticket_timing: req.params.time }, function (
    err,
    tickets
  ) {
    if (!tickets) {
      res.status(404).send("data not found");
    } else {
      res.json(tickets);
    }
  });
});

app.use("/tickets", ticketRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port " + PORT);
});
