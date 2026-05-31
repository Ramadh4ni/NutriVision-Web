function getAdminOverview(_req, res) {
  res.status(200).json({
    success: true,
    data: {
      message: "Admin-only route is accessible.",
    },
  });
}

module.exports = {
  getAdminOverview,
};
