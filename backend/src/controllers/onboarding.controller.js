const { upsertProfile } = require("../repositories/profile.repository");

async function upsertOnboarding(req, res, next) {
  try {
    const { age, gender, weightKg, heightCm, goal, activityLevel } = req.body;
    const updatedProfile = await upsertProfile(req.user.id, {
      age: Number(age),
      gender: String(gender).toUpperCase(),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      goal: String(goal).toUpperCase(),
      activityLevel: String(activityLevel).toUpperCase(),
    });

    res.status(200).json({
      success: true,
      message: "Onboarding profile saved successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upsertOnboarding,
};
