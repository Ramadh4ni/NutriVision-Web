const { getDashboardSummary } = require("../services/dashboard.service");

async function getDashboard(req, res, next) {
  try {
    const summary = await getDashboardSummary(req.user.id);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};
