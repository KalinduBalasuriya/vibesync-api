const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
  },
  songName: {
    type: String,
    required: true,
  },

  artistName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  requestData: {
    type: {
      isRequested: Boolean,
      requestedUser: { type: String },
      requestedTrack: { type: String },
    },
    default: {
      isRequested: false,
      requestedUser: null,
      requestedTrack: null,
    },
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  isPlayed: {
    type: Boolean,
    default: false,
  },
  userRequestCount: {
    type: Number,
    default: 0,
  },
  songFeatures: {
    type: {
      spotifyId: {
        type: String,
        default: "",
      },
      danceability: {
        type: Number,
        default: "",
      },
      bpm: {
        type: Number,
        default: "",
      },
      loudness: {
        type: Number,
        default: "",
      },
    },
  },
});

songSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

songSchema.set("toJSON", {
  virtuals: true,
});

exports.Song = mongoose.model("Song", songSchema);
