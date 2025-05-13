const express = require('express');
const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

router.route('/stats')
  .get(getStats);

module.exports = router;