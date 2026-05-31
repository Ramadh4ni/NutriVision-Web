const {
  registerUser,
  loginUser,
  loginWithGoogle,
  refreshSession,
  verifyEmailToken,
  createPasswordReset,
  resetPassword,
  sanitizeUser,
} = require("../services/auth.service");
const { revokeRefreshToken } = require("../services/token.service");

async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

function googleAuth(req, res, next) {
  Promise.resolve(loginWithGoogle(req.body))
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Google authentication successful.",
        data: result,
      });
    })
    .catch(next);
}

function getCurrentUser(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
}

function refreshToken(req, res, next) {
  Promise.resolve(refreshSession(req.body.refreshToken))
    .then((tokens) => {
      res.status(200).json({
        success: true,
        message: "Session refreshed successfully.",
        data: { tokens },
      });
    })
    .catch(next);
}

function verifyEmail(req, res, next) {
  Promise.resolve(verifyEmailToken(req.body.token))
    .then((user) => {
      res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        data: { user },
      });
    })
    .catch(next);
}

function forgotPassword(req, res, next) {
  Promise.resolve(createPasswordReset(req.body.email))
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent.",
        data: result,
      });
    })
    .catch(next);
}

async function resetPasswordAction(req, res, next) {
  try {
    const user = await resetPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  if (req.body.refreshToken) {
    try {
      await revokeRefreshToken(req.body.refreshToken);
    } catch (error) {
      next(error);
      return;
    }
  }

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
}

module.exports = {
  register,
  login,
  googleAuth,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPasswordAction,
  getCurrentUser,
  logout,
};
