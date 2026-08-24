import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  mintTxHash: {
    type: String
  },
  minted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);