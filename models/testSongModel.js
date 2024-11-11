const mongoose = require("mongoose");

const testSongSchema = mongoose.Schema({
  //   requestedUser: {
  //     type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the User collection
  //     ref: "User", // This refers to the 'User' model
  //     required: true,
  //   },
  requestedTrackId: {
    type: String,
    required: true,
  },
});
testSongSchema.virtual("songFeatures", {
  ref: "TestSongFeature", // Reference to the model to use
  localField: "requestedTrackId", // Field in the `Song` schema
  foreignField: "requestedTrackId", // Field in the `SongFeature` schema
});

testSongSchema.set("toJSON", {
  virtuals: true,
});

exports.TestSong = mongoose.model("TestSong", testSongSchema);
