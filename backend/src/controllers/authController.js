const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const superAdminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return sendError(res, 'Email and password are required', 400);

  if (
    email !== process.env.SUPER_ADMIN_EMAIL ||
    password !== process.env.SUPER_ADMIN_PASSWORD
  ) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const token = generateToken({ role: 'super_admin', email });
  return sendSuccess(res, { token, role: 'super_admin', email }, 'Login successful');
};

const orgAdminSignup = async (req, res, next) => {
  const { email, password, organizationId } = req.body;

  if (!email || !password || !organizationId) {
    return sendError(res, 'Email, password, and organizationId are required', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return sendError(res, 'Email already registered', 409);

  const user = await User.create({
    email,
    password,
    role: 'org_admin',
    organization: organizationId,
  });

  const token = generateToken({ id: user._id, role: user.role });
  return sendSuccess(
    res,
    { token, role: user.role, email: user.email, organization: user.organization },
    'Signup successful',
    201
  );
};

const orgAdminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return sendError(res, 'Email and password are required', 400);

  const user = await User.findOne({ email, role: 'org_admin' }).populate('organization');
  if (!user) return sendError(res, 'Invalid credentials', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return sendError(res, 'Invalid credentials', 401);

  const token = generateToken({ id: user._id, role: user.role });
  return sendSuccess(res, {
    token,
    role: user.role,
    email: user.email,
    organization: user.organization,
  }, 'Login successful');
};

module.exports = { superAdminLogin, orgAdminSignup, orgAdminLogin };
