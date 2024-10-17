//this will be the model for the polls.
//the polls will have a status field which would either be ongoing or completed
//a votes field that refrences the votes collection

import mongoose, { Schema, model } from "mongoose";

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
    option0: { type: Number, default: 0 },
    option1: { type: Number, default: 0 },
    option2: { type: Number, default: 0 },
  },
  voters: [{ 
    user: { type: Schema.Types.ObjectId, ref: "User" },
    option: { type: Number, enum: [0, 1, 2] }
  }],
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
