const express = require('express');
const router = express.Router();
const { createOrganization, listOrganizations, getOrganization } = require('../controllers/organizationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/', authorize('super_admin'), createOrganization);
router.get('/', authorize('super_admin'), listOrganizations);
router.get('/public', listOrganizations);
router.get('/:id', getOrganization);

module.exports = router;
