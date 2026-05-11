const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const { sendSuccess } = require('../utils/response');

router.get('/', async (req, res) => {
  const orgs = await Organization.find({ isActive: true }).select('_id name slug').sort({ name: 1 });
  return sendSuccess(res, orgs, 'Organizations fetched');
});

module.exports = router;
