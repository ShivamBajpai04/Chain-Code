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
  expiresAt: {
    type: Date
  },
}, { timestamps: true });

// Only documents carrying expiresAt are purged (at that instant); all others persist
submissionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// hot paths: submissions by user (newest first) and by problem
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1 });

export default mongoose.model('Submission', submissionSchema);