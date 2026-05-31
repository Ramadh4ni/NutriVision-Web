const bcrypt = require("bcryptjs");

const { updateUser } = require("../repositories/user.repository");
const { findProfileByUserId, upsertProfile } = require("../repositories/profile.repository");

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user.passwordHash) {
      const error = new Error("This account uses social login only.");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, req.user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error("Current password is invalid.");
      error.statusCode = 401;
      throw error;
    }

    await updateUser(req.user.id, {
      passwordHash: await bcrypt.hash(newPassword, 10),
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

function updateProfile(req, res, next) {
  Promise.resolve(findProfileByUserId(req.user.id))
    .then((profile) => {
      if (!profile) {
        const error = new Error("Profile not found. Complete onboarding first.");
        error.statusCode = 404;
        throw error;
      }

      const payload = {};
      if (req.body.age !== undefined) payload.age = Number(req.body.age);
      if (req.body.gender !== undefined) payload.gender = String(req.body.gender).toUpperCase();
      if (req.body.weightKg !== undefined) payload.weightKg = Number(req.body.weightKg);
      if (req.body.heightCm !== undefined) payload.heightCm = Number(req.body.heightCm);
      if (req.body.goal !== undefined) payload.goal = String(req.body.goal).toUpperCase();
      if (req.body.activityLevel !== undefined) payload.activityLevel = String(req.body.activityLevel).toUpperCase();

      return upsertProfile(req.user.id, {
        age: payload.age ?? profile.age,
        gender: payload.gender ?? profile.gender,
        weightKg: payload.weightKg ?? profile.weightKg,
        heightCm: payload.heightCm ?? profile.heightCm,
        goal: payload.goal ?? profile.goal,
        activityLevel: payload.activityLevel ?? profile.activityLevel,
      });
    })
    .then((updatedProfile) => {
      res.status(200).json({
        success: true,
        message: "Account profile updated successfully.",
        data: updatedProfile,
      });
    })
    .catch(next);
}

module.exports = {
  updatePassword,
  updateProfile,
};
