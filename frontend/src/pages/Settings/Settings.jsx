import { useEffect, useRef, useState } from "react";
import { Camera, Shield } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const GENDER_OPTIONS = ["male", "female", "other"];
const GOAL_OPTIONS = ["cutting", "maintenance", "bulking"];
const ACTIVITY_OPTIONS = ["sedentary", "moderate", "active"];

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function Settings() {
  const { profile, profileImage, updateProfile, updateProfileImage } = useUser();
  const { currentUser, updateActiveProfile, updateUserPassword } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const avatarSrc = profileImage || DEFAULT_AVATAR;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "male",
    weight: "",
    height: "",
    goal: "maintenance",
    activityLevel: "moderate",
  });
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: profile?.fullName || currentUser?.fullName || "",
      email: profile?.email || currentUser?.email || "",
      age: profile?.age || "",
      gender: profile?.gender || "male",
      weight: profile?.weight || "",
      height: profile?.height || "",
      goal: profile?.goal || "maintenance",
      activityLevel: profile?.activityLevel || "moderate",
    });
  }, [currentUser?.email, currentUser?.fullName, profile]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      addToast("Unsupported image format.", "warning");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addToast("Image is too large. Maximum size is 5MB.", "warning");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfileImage(reader.result);
      addToast(
        "Profile photo is updated locally. Backend avatar upload is not available yet.",
        "success"
      );
    };
    reader.onerror = () => {
      addToast("Failed to read image file.", "warning");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const validateProfile = () => {
    if (!formData.age) return "Age is required.";
    if (!formData.weight) return "Weight is required.";
    if (!formData.height) return "Height is required.";
    if (!GENDER_OPTIONS.includes(formData.gender)) return "Select a valid gender.";
    if (!GOAL_OPTIONS.includes(formData.goal)) return "Select a valid goal.";
    if (!ACTIVITY_OPTIONS.includes(formData.activityLevel)) {
      return "Select a valid activity level.";
    }
    return null;
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    const error = validateProfile();

    if (error) {
      addToast(error, "warning");
      return;
    }

    setSaving(true);

    try {
      await updateActiveProfile({
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal,
        activityLevel: formData.activityLevel,
      });
      updateProfile(formData);
      addToast("Profile saved successfully.", "success");
    } catch (apiError) {
      addToast(apiError.payload?.message || apiError.message, "warning");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      addToast("Please enter your current password.", "warning");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      addToast("New password must be at least 8 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match.", "warning");
      return;
    }

    setUpdatingPassword(true);
    const result = await updateUserPassword(currentPassword, newPassword);
    setUpdatingPassword(false);

    if (!result.success) {
      addToast(result.error, "warning");
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    addToast("Password updated successfully.", "success");
  };

  return (
    <DashboardLayout>
      <div className="px-1 sm:px-2 lg:px-3 py-1" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="mb-5">
          <h1
            style={{
              color: "#1E293B",
              fontFamily: "Manrope, sans-serif",
              fontSize: "52px",
              fontWeight: "800",
              lineHeight: 1.1,
            }}
          >
            Account Settings
          </h1>
          <p
            style={{
              fontSize: "18px",
              fontFamily: "Inter, sans-serif",
              color: "#5F6F87",
              marginTop: "8px",
            }}
          >
            Manage your biometrics, goals, activity level, and password.
          </p>
        </div>

        <div
          className="bg-white"
          style={{
            borderRadius: "24px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            padding: "32px",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="object-cover cursor-pointer"
                  onClick={handleAvatarClick}
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "12px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: "#16A34A", borderRadius: "4px" }}
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    disabled
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#F1F5F9", border: "none", color: "#64748B" }}
                  />
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#F1F5F9", border: "none", color: "#64748B" }}
                  />
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  />
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {titleCase(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  />
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  />
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  >
                    {GOAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {titleCase(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                  >
                    {ACTIVITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {titleCase(option)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs" style={{ color: "#94A3B8" }}>
                  Name and email are currently read-only because the backend only exposes biometrics,
                  goal, and activity updates in this release.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: "#006D37", borderRadius: "999px", padding: "12px 26px" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-white"
          style={{ borderRadius: "24px", boxShadow: "0 6px 24px rgba(0,0,0,0.06)", padding: "32px", marginTop: "32px" }}
        >
          <div className="flex items-center gap-3 mb-5" style={{ fontFamily: "Manrope, sans-serif" }}>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "#ECFDF5", borderRadius: "10px" }}
            >
              <Shield className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <h2 style={{ color: "#1E293B", fontFamily: "Manrope, sans-serif", fontSize: "32px", fontWeight: "800" }}>
              Security
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="At least 8 characters"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                  style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                />
              </div>
              <div>
                <label className="block mb-1.5" style={{ color: "#64748B", fontSize: "13px", fontWeight: "500" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                  style={{ backgroundColor: "#E1E3E4", border: "none", color: "#1E293B" }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={updatingPassword}
                className="text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "#006D37", borderRadius: "999px", padding: "12px 26px" }}
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
