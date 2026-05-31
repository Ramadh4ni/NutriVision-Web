function sendVerificationEmail({ email, token }) {
  return {
    accepted: [email],
    previewUrl: `verification://token/${token}`,
  };
}

function sendPasswordResetEmail({ email, token }) {
  return {
    accepted: [email],
    previewUrl: `reset-password://token/${token}`,
  };
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
