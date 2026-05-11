const express = require('express');
const router = express.Router();
const {
  createFlag,
  listFlags,
  updateFlag,
  deleteFlag,
  checkFlag,
} = require('../controllers/featureFlagController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/check', checkFlag);

router.use(authenticate);
router.use(authorize('org_admin'));

router.get('/', listFlags);
router.post('/', createFlag);
router.put('/:id', updateFlag);
router.delete('/:id', deleteFlag);

module.exports = router;
