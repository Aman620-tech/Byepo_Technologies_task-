const Organization = require('../models/Organization');
const { sendSuccess, sendError } = require('../utils/response');

const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const createOrganization = async (req, res, next) => {
  const { name } = req.body;
  if (!name) return sendError(res, 'Organization name is required', 400);

  const slug = slugify(name);
  const org = await Organization.create({ name, slug });
  return sendSuccess(res, org, 'Organization created', 201);
};

const listOrganizations = async (req, res, next) => {
  const orgs = await Organization.find().sort({ createdAt: -1 });
  return sendSuccess(res, orgs, 'Organizations fetched');
};

const getOrganization = async (req, res, next) => {
  const org = await Organization.findById(req.params.id);
  if (!org) return sendError(res, 'Organization not found', 404);
  return sendSuccess(res, org, 'Organization fetched');
};

module.exports = { createOrganization, listOrganizations, getOrganization };
