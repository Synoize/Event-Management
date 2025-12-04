import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { assets } from "../assets/assets";

const Profile = () => {
    const { user, isAuthenticated, setConfirmLogout } = useAuth();
console.log("user: ", user);

    if (!isAuthenticated) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Please login to view your profile.
                </h2>
            </div>
        );
    }

    return (
        <div className="w-full bg-white max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-gray-50 p-6 md:p-10 border">

                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-600 text-center mb-8">
                    My Profile
                </h1>

                {/* Profile Card */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={assets.profile_icon}
                            alt="Profile"
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-md"
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                        <span className="inline-block bg-primary-pink/10 text-primary-pink px-4 py-2 rounded-full text-xs font-semibold">
                            {user?.role?.toUpperCase()}
                        </span>

                        <div>
                            <p className="text-gray-500 text-sm">Full Name</p>
                            <p className="text-lg md:text-xl font-semibold text-gray-800">
                                {user?.name || "User"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Email</p>
                            <p className="text-lg font-medium text-gray-800">
                                {user?.email || "example@mail.com"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t"></div>

                {/* Logout Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setConfirmLogout(true)}
                        className="px-8 py-3 text-white bg-red-600/90 hover:bg-red-600 rounded-sm text-sm font-medium transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Profile;
