const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema(
  {
    featureKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

featureFlagSchema.index({ featureKey: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
