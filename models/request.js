const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  requestedUser: {
    type: String,
    required: true,
  },
  requestedTrack: {
    type: String,
    required: true,
  },
});

requestSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

requestSchema.set("toJSON", {
  virtuals: true,
});

exports.Request = mongoose.model("Request", requestSchema);
