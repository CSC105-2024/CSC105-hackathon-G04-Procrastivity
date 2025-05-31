import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { GiPodium } from 'react-icons/gi';
import iron from '../picture/iron.png';
import bronze from '../picture/bronze.png';
import silver from '../picture/silver.png';
import gold from '../picture/gold.png';
import platinum from '../picture/platinum.png';

const ranks = ["iron", "bronze", "silver", "gold", "platinum"];

const rankThresholds = [
    { name: "Iron", maxXp: 0 },
    { name: "Bronze", maxXp: 40 },
    { name: "Silver", maxXp: 160 },
    { name: "Gold", maxXp: 640 },
    { name: "Platinum", maxXp: 2560 },
];

const getRankInfo = (totalXp) => {
    for (let i = 0; i < rankThresholds.length - 1; i++) {
        const current = rankThresholds[i];
        const next = rankThresholds[i + 1];

        if (totalXp < next.maxXp) {
            return {
                currentRank: current.name.toLowerCase(),
                currentXp: totalXp - current.maxXp,
                maxXp: next.maxXp - current.maxXp,
                nextRank: next.name.toLowerCase(),
                xpToNext: next.maxXp - totalXp,
                maxRank: false,
            };
        }
    }

    // Max rank case
    const max = rankThresholds[rankThresholds.length - 1];
    return {
        currentRank: max.name.toLowerCase(),
        currentXp: max.maxXp,
        maxXp: 0,
        nextRank: null,
        xpToNext: null,
        maxRank: true,
    };
};

const getRankImage = (rank) => {
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

    const mockUser = {
        userId: 1,
        username: "John Salapao",
        "password": "b1",
        "maxXp": 40,
        "currentXp": 23,
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        "rank": "Bronze",
        "maxRank": false,
        totalXp: 23,
        taskCompleted: 0,
        taskProcrastinated: 0,
    };

    const rankInfo = getRankInfo(mockUser.totalXp);

    const [profilePic, setProfilePic] = useState(mockUser.profilePicture);
    const [displayName, setDisplayName] = useState(mockUser.username);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePic(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = () => {
        setLoading(true);
        setTimeout(() => {
            setIsEditing(false);
            setLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        navigate("/login");
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
                        />
                        <img
                            src={profilePic}
                            alt={displayName}
                            className={`w-[120px] lg:w-[180px] lg:h-[180px] h-[120px] rounded-full object-cover border-[5px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] block cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
                            onClick={() => !loading && document.getElementById("fileInput").click()}
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative flex gap-10 items-center justify-center mb-2 transform -translate-y-2">
                            <img
                                src={getRankImage(rankInfo.currentRank)}
                                alt={rankInfo.currentRank}
                                className="w-16 h-16 object-contain"
                            />
                            {rankInfo.nextRank && (
                                <img
                                    src={getRankImage(rankInfo.nextRank)}
                                    alt={rankInfo.nextRank}
                                    className="w-16 h-16 object-contain"
                                />
                            )}
                        </div>

                        <div className="w-full transform -translate-y-6">
                            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-green-400 h-full transition-all duration-300"
                                    style={{ width: `${(rankInfo.currentXp / rankInfo.maxXp) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-sm text-center text-gray-600">
                            {rankInfo.maxRank ? "Max Rank" : `${rankInfo.xpToNext} XP to ${rankInfo.nextRank}`}
                        </div>

                        {isEditing ? (
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="font-bodoni text-[32px] mb-2 tracking-[0.5px] w-full px-[15px] py-[12px] border border-[#ddd] rounded font-light transition duration-200 ease-in-out focus:border-black focus:shadow text-center"
                            />
                        ) : (
                            <h1 className="font-bodoni text-[20px] font-normal tracking-[0.5px] text-center">
                                {displayName}
                            </h1>
                        )}

                        <div className="flex flex-col gap-[15px] mt-[30px] w-full items-center">
                            {isEditing ? (
                                <button
                                    className="px-[25px] py-[12px] w-full md:w-[200px] rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-black text-black hover:bg-black hover:text-white"
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
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
                        <span className="font-semibold">{rankInfo.currentXp}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaTrophy className="text-black" />
                            <span>Current rank</span>
                        </div>
                        <span className="font-semibold capitalize">{rankInfo.currentRank}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaCheckCircle className="text-green-500" />
                            <span>Tasks Completed</span>
                        </div>
                        <span className="font-semibold">{mockUser.taskCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <FaRegClock className="text-rose-500" />
                            <span>Tasks Procrastinated</span>
                        </div>
                        <span className="font-semibold">{mockUser.taskProcrastinated}</span>
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

export default Profile;
