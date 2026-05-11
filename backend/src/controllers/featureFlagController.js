const FeatureFlag = require('../models/FeatureFlag');
const { sendSuccess, sendError } = require('../utils/response');

const createFlag = async (req, res, next) => {
  const { featureKey, description, isEnabled } = req.body;
  if (!featureKey) return sendError(res, 'featureKey is required', 400);

  const orgId = req.user.organization._id || req.user.organization;

  const existing = await FeatureFlag.findOne({ featureKey: featureKey.toLowerCase(), organization: orgId });
  if (existing) return sendError(res, 'Feature key already exists for this organization', 409);

  const flag = await FeatureFlag.create({
    featureKey: featureKey.toLowerCase(),
    description,
    isEnabled: isEnabled ?? false,
    organization: orgId,
    createdBy: req.user._id,
  });

  return sendSuccess(res, flag, 'Feature flag created', 201);
};

const listFlags = async (req, res, next) => {
  const orgId = req.user.organization._id || req.user.organization;
  const flags = await FeatureFlag.find({ organization: orgId }).sort({ createdAt: -1 });
  return sendSuccess(res, flags, 'Feature flags fetched');
};

const updateFlag = async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.organization._id || req.user.organization;

  const flag = await FeatureFlag.findOne({ _id: id, organization: orgId });
  if (!flag) return sendError(res, 'Feature flag not found', 404);

  const { featureKey, description, isEnabled } = req.body;

  if (featureKey && featureKey.toLowerCase() !== flag.featureKey) {
    const duplicate = await FeatureFlag.findOne({
      featureKey: featureKey.toLowerCase(),
      organization: orgId,
      _id: { $ne: id },
    });
    if (duplicate) return sendError(res, 'Feature key already exists for this organization', 409);
    flag.featureKey = featureKey.toLowerCase();
  }

  if (description !== undefined) flag.description = description;
  if (isEnabled !== undefined) flag.isEnabled = isEnabled;

  await flag.save();
  return sendSuccess(res, flag, 'Feature flag updated');
};

const deleteFlag = async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.organization._id || req.user.organization;

  const flag = await FeatureFlag.findOneAndDelete({ _id: id, organization: orgId });
  if (!flag) return sendError(res, 'Feature flag not found', 404);

  return sendSuccess(res, null, 'Feature flag deleted');
};

const checkFlag = async (req, res, next) => {
  const { featureKey, organizationId } = req.body;

  if (!featureKey || !organizationId) {
    return sendError(res, 'featureKey and organizationId are required', 400);
  }

  const flag = await FeatureFlag.findOne({
    featureKey: featureKey.toLowerCase(),
    organization: organizationId,
  });

  if (!flag) {
    return sendSuccess(res, { featureKey, isEnabled: false, exists: false }, 'Feature flag not found');
  }

  return sendSuccess(res, { featureKey: flag.featureKey, isEnabled: flag.isEnabled, exists: true }, 'Feature flag status fetched');
};

module.exports = { createFlag, listFlags, updateFlag, deleteFlag, checkFlag };
