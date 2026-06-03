import { useState, useRef, useCallback } from "react";
import { Camera, Shield } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export default function Settings() {
  const { profile, updateProfile } = useUser();
  const { updateActiveProfile, updateActiveProfileImage, getActiveUser, updateUserPassword } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Get avatar from auth (source of truth) — falls back to stored or default
  const avatarSrc = getActiveUser()?.profileImage || DEFAULT_AVATAR;

  // Single source of truth: initialize from profile (set once on mount, NOT reactive)
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    age: profile?.age || "",
    gender: profile?.gender || "Male",
    weight: profile?.weight || "",
    height: profile?.height || "",
  });

  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      addToast("Please enter your current password.", "warning");
      return;
    }
    if (!newPassword) {
      addToast("Please enter a new password.", "warning");
      return;
    }
    if (newPassword.length < 8) {
      addToast("Password must be at least 8 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match.", "warning");
      return;
    }

    setUpdatingPassword(true);
    const result = updateUserPassword(currentPassword, newPassword);
    setUpdatingPassword(false);

    if (result.success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      addToast("Password updated successfully.", "success");
    } else {
      addToast(result.error, "warning");
    }
  };

  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      addToast("Unsupported image format.", "warning");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addToast("Image is too large. Maximum size is 5MB.", "warning");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        updateActiveProfileImage(reader.result);
        addToast("Profile photo updated.", "success");
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          addToast("Unable to save image. Storage limit exceeded.", "warning");
        } else {
          addToast("Failed to save profile photo.", "warning");
        }
      }
    };
    reader.onerror = () => {
      addToast("Failed to read image file.", "warning");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const validate = (data) => {
    if (!data.fullName?.trim()) return "Full name is required.";
    if (!data.email?.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return "Please enter a valid email address.";
    if (!data.age) return "Age is required.";
    const ageNum = Number(data.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150)
      return "Please enter a valid age (1–150).";
    if (!data.gender || !GENDER_OPTIONS.includes(data.gender))
      return "Please select a gender.";
    if (!data.weight) return "Weight is required.";
    const weightNum = Number(data.weight);
    if (isNaN(weightNum) || weightNum < 1)
      return "Please enter a valid weight.";
    if (!data.height) return "Height is required.";
    const heightNum = Number(data.height);
    if (isNaN(heightNum) || heightNum < 1)
      return "Please enter a valid height.";
    return null;
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const error = validate(formData);
    if (error) {
      addToast(error, "warning");
      return;
    }
    setSaving(true);
    const profileData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      age: String(formData.age),
      gender: formData.gender,
      weight: String(formData.weight),
      height: String(formData.height),
    };
    // Only update AuthContext — the single source of truth for persistence
    updateActiveProfile(profileData);
    // Also update UserContext so navbar reacts immediately
    updateProfile(profileData);
    addToast("Profile saved successfully.", "success");
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div
        className="px-1 sm:px-2 lg:px-3 py-1"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Page Header */}
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
            Fine-tune your NutriVision experience and health connectivity.
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="bg-white"
          style={{
            borderRadius: "24px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            padding: "32px",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* Avatar Section */}
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

            {/* Form Fields */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {/* Full Name */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  />
                </div>

                {/* Age */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  />
                </div>

                {/* Height */}
                <div>
                  <label
                    className="block mb-1.5"
                    style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                  >
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                  />
                </div>
              </div>

              {/* Save Button */}
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

        {/* Security Card */}
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
              <label
                className="block mb-1.5"
                style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1.5"
                  style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="At least 8 characters"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                  style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
                />
              </div>
              <div>
                <label
                  className="block mb-1.5"
                  style={{ color: "#64748B", fontSize: "13px", fontWeight: "500", fontFamily: "Inter, sans-serif" }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 text-sm placeholder-gray-400"
                  style={{ backgroundColor: "#E1E3E4", border: "none", borderRadius: "0", color: "#1E293B" }}
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