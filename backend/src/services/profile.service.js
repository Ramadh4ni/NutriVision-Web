function calculateDailyCalories(profile) {
  if (!profile) {
    return null;
  }

  const baseCalories = {
    sedentary: 1800,
    moderate: 2200,
    active: 2600,
  }[profile.activityLevel] || 2000;

  const goalAdjustment = {
    cutting: -300,
    maintenance: 0,
    bulking: 300,
  }[profile.goal] || 0;

  return baseCalories + goalAdjustment;
}

module.exports = {
  calculateDailyCalories,
};
