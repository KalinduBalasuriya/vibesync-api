const mongoose = require("mongoose");

const songFeatureSchema = mongoose.Schema({
  spotifyId: {
    type: String,
  },
  dancability: {
    type: Number,
  },
  bpm: {
    type: Number,

    default: 118.211,
  },
  loudness: {
    type: Number,
    default: -5.883,
  },
});

exports.SongFeature = mongoose.model("SongFeature", songFeatureSchema);
