const mongoose = require("mongoose");

const partySchema = mongoose.Schema(
  {
    admin: {
      type: String,
    },
    partyId: {
      type: String,
      required: true,
    },
    partyName: {
      type: String,
      required: true,
    },
    guests: {
      type: [String],
      default: [],
    },
    songs: {
      type: [String],
      default: [],
    },
  },
  {
    createIndexes: [
      { key: { partyId: 1 }, unique: true }, // Index on partyId with unique constraint
      { key: { partyName: 1 }, unique: true }, // Index on partyName with unique constraint
    ],
  }
);

partySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

partySchema.set("toJSON", {
  virtuals: true,
});

exports.Party = mongoose.model("Party", partySchema);
