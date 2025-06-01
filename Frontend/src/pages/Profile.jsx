import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { GiPodium } from 'react-icons/gi';
import iron from '../picture/iron.png';
import bronze from '../picture/bronze.png';
import silver from '../picture/silver.png';
import gold from '../picture/gold.png';
import platinum from '../picture/platinum.png';
import { useUser } from '../contexts/UserContext';
import { userService } from "../services/userServices.js";

const ranks = ["iron", "bronze", "silver", "gold", "platinum"];



const getRankImage = (rank) => {
    console.log(rank)
    switch (rank.toLowerCase()) {
        case "iron": return iron;
        case "bronze": return bronze;
        case "silver": return silver;
        case "gold": return gold;
        case "platinum": return platinum;
        default: return bronze;
    }
};

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, logout, loading, refreshUser } = useUser();
    const [profilePic, setProfilePic] = useState(user?.profilePicture || '');
    const [displayName, setDisplayName] = useState(user?.username || '');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        document.title = "Procrastivity - Profile";
    }, []);

    // Update local state when user data changes
    useEffect(() => {
        if (user) {
            setProfilePic(user.profilePicture || '');
            setDisplayName(user.username || '');
        }
    }, [user]);

    React.useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    if (loading || !user) return null;

    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        data.append("cloud_name", "drwqidr6o");

        const result = await fetch(
            "https://api.cloudinary.com/v1_1/drwqidr6o/image/upload",
            {
                method: "POST",
                body: data
            }
        );

        const img = await result.json();
        const image = img.url

        setSaving(true);
        setSaveStatus('Processing image...');

        const reader = new FileReader();
        reader.onloadend = () => {
            const newProfilePic = reader.result;

            // Update local state immediately
            setProfilePic(newProfilePic);


            // Update user context immediately for real-time UI update
            const updatedUser = { ...user, profilePicture: newProfilePic };
            setUser(updatedUser);

            // Also update localStorage to persist the change
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSaving(false);
            setSaveStatus('Image updated!');
            setTimeout(() => setSaveStatus(''), 2000);
        };
        reader.readAsDataURL(file);
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setDisplayName(newName);

        // Update user context immediately for real-time display
        const updatedUser = { ...user, username: newName };
        setUser(updatedUser);

        // Also update localStorage to persist the change
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleSaveProfile = async () => {
        if (!displayName.trim()) {
            setSaveStatus('Name cannot be empty');
            setTimeout(() => setSaveStatus(''), 3000);
            return;
        }

        setSaving(true);
        setSaveStatus('Saving changes...');

        try {
            const updatedUser = {
                ...user,
                username: displayName.trim(),
                profilePicture: profilePic
            };

            // Update context and localStorage immediately
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditing(false);
            setSaveStatus('Profile updated!');
            setTimeout(() => setSaveStatus(''), 2000);

            // Optional: If you want to sync with backend later, you can call refreshUser
            // await refreshUser();
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveStatus('Error saving profile');
            setTimeout(() => setSaveStatus(''), 3000);

            // Revert changes on error
            setDisplayName(user?.username || '');
            setProfilePic(user?.profilePicture || '');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset to original values
        setDisplayName(user.username || '');
        setProfilePic(user.profilePicture || '');
        setIsEditing(false);
        setSaveStatus('');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <div className="flex items-center justify-center p-5">
                <div className="flex flex-col items-center justify-center py-1 gap-15px px-5 lg:flex-row">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                            accept="image/*"
                            disabled={saving}
                        />
                        <img
                            src={profilePic || user.profilePicture}
                            alt={displayName || user.username}
                            className={`w-[120px] lg:w-[180px] lg:h-[180px] h-[120px] rounded-full object-cover border-[5px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] block cursor-pointer transition-opacity duration-200 ${saving ? "opacity-50 pointer-events-none" : ""}`}
                            onClick={() => !saving && document.getElementById("fileInput").click()}
                        />
                        {saving && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative flex gap-10 items-center justify-center mb-2 transform -translate-y-2">
                            <img
                                src={getRankImage(user.rank)}
                                alt={user.rank}
                                className="w-16 h-16 object-contain"
                            />
                            <img
                                src={user.isMax? getRankImage(user.rank) : getRankImage(ranks[ranks.indexOf(user.rank.toLowerCase())+1])}
                                alt={user.rank}
                                className="w-16 h-16 object-contain"
                            />
                        </div>

                        <div className="w-full transform -translate-y-6">
                            {/* Progress Bar moved from bottom section */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="capitalize">{user?.rank}</span>
                                    <span>{user?.currentXp} / {user?.maxXp} XP</span>
                                </div>
                                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full transition-all duration-300"
                                        style={{ width: `${user?.maxXp ? Math.min(100, (user?.currentXp / user?.maxXp) * 100) : 0}%` }}
                                    />
                                </div>
                                <div className="text-xs text-right mt-1">
                                    {user?.maxRank ? 'Max Rank' : `${user?.maxXp - user?.currentXp} XP to next rank`}
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={handleNameChange}
                                    className="font-bodoni text-[32px] mb-2 tracking-[0.5px] w-full px-[15px] py-[12px] border border-[#ddd] rounded font-light transition duration-200 ease-in-out focus:border-black focus:shadow text-center"
                                    placeholder="Enter your name"
                                    maxLength={50}
                                />
                                {saveStatus && (
                                    <p className={`text-center text-sm mt-1 ${
                                        saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                        {saveStatus}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <h1 className="font-bodoni text-[20px] font-normal tracking-[0.5px]">
                                    {displayName || user.username}
                                </h1>
                                {saveStatus && (
                                    <p className={`text-sm mt-1 ${
                                        saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                        {saveStatus}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-[15px] mt-[30px] w-full items-center">
                            {isEditing ? (
                                <div className="flex gap-2 w-full">
                                    <button
                                        className="px-[25px] py-[12px] flex-1 rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-black text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSaveProfile}
                                        disabled={saving || !displayName.trim()}
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        className="px-[15px] py-[12px] rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white"
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="px-[25px] py-[12px] rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-black text-black hover:bg-black hover:text-white"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-80 mx-auto px-10 p-6 bg-white rounded-3xl shadow-xl border">
                <div className="flex items-center mb-4 space-x-2">
                    <GiPodium className="text-xl" />
                    <h2 className="text-xl font-semibold">Your progress</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaTrophy className="text-yellow-500" />
                            <span>XP points</span>
                        </div>
                        <span className="font-semibold">{user?.xp}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaTrophy className="text-black" />
                            <span>Current rank</span>
                        </div>
                        <span className="font-semibold">{user?.rank}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaCheckCircle className="text-green-500" />
                            <span>Tasks Completed</span>
                        </div>
                        <span className="font-semibold">{user?.taskCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaRegClock className="text-rose-500" />
                            <span>Tasks Procrastinated</span>
                        </div>
                        <span className="font-semibold">{user?.taskProcrastinated}</span>
                    </div>
                </div>
            </div>

            <div className="w-80 mx-auto mt-4 text-right">
                <button
                    className="px-[25px] py-[12px] mb-5 rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-black text-black hover:bg-red-500 hover:text-white"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default Profile;

