import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-base-content">Profile</h1>
            <p className="text-sm text-base-content/70">
              Your profile information
            </p>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-300 bg-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-md
                  flex items-center justify-center
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-100" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs text-base-content/60">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Basic info */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm text-base-content/70 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 text-sm">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm text-base-content/70 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 text-sm">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account info */}
          <div className="mt-4 bg-base-100 border border-base-300 rounded-xl p-5">
            <h2 className="text-base sm:text-lg font-medium mb-4 text-base-content">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="text-base-content/80">Member Since</span>
                <span className="text-base-content/70">
                  {authUser?.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/80">Account Status</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
