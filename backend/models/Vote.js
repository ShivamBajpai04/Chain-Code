import { Schema, model } from 'mongoose';

const voteSchema = new Schema({
  poll: {
    type: Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  option: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure that a user can only vote once per poll
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

const Vote = model('Vote', voteSchema);

export default Vote;
