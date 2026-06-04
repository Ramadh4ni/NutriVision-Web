import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";

function truncateName(name, maxLen) {
  if (!name || name.length <= maxLen) return name || "";
  return name.slice(0, maxLen) + "...";
}

export default function DashboardHeader({ isOpen, setIsOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { profileImage, profile } = useUser();
  const { logout } = useAuth();

  const displayName = profile?.fullName?.trim() || "User";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-xl border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "#F1F5F9",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Hamburger/X Button - Mobile Only */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ color: "#64748B" }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Empty space for desktop */}
        <div className="hidden lg:block" />

        {/* Username + Avatar */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <span
            className="text-sm font-medium hidden sm:block truncate max-w-[120px] md:max-w-[160px] lg:max-w-[200px]"
            style={{ color: "#374151" }}
            title={displayName}
          >
            {displayName}
          </span>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
            style={{ lineHeight: 0 }}
          >
            <img
              src={
                profileImage ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                border: "1px solid #F1F5F9",
              }}
            >
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                style={{ color: "#374151" }}
              >
                <Settings
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#64748B" }}
                />
                Settings
              </button>
              <div style={{ height: "1px", backgroundColor: "#F1F5F9" }} />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                style={{ color: "#374151" }}
              >
                <LogOut
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#64748B" }}
                />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
