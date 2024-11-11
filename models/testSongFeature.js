const mongoose = require("mongoose");

const testSongFeatureSchema = mongoose.Schema({
  requestedTrackId: {
    type: String,
    required: true,
  },
  bpm: {
    type: String,
    required: true,
    default: "123",
  },
});

exports.TestSongFeature = mongoose.model(
  "TestSongFeature",
  testSongFeatureSchema
);
