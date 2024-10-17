//this will be the model for the polls.
//the polls will have a status field which would either be ongoing or completed
//a votes field that refrences the votes collection

import { Schema, model } from "mongoose";

const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },
  votes: {
    agree: { type: Number, default: 0 },
    decline: { type: Number, default: 0 },
  },
  proposalId: {
    type: String,
    required: true,
  },
  voters: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the 'updatedAt' field on save
pollSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Poll = model("Poll", pollSchema);

export default Poll;
