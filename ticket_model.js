const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Ticket = new Schema({
  username: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  ticket_timing: {
    type: String,
  },
  ticket_expired: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Ticket", Ticket);
