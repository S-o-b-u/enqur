"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiUser, FiMail, FiSave, FiGrid, FiTrendingUp, FiCalendar, FiBell,FiDownload,FiEye,FiSettings } from "react-icons/fi";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [qrHistory, setQrHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalQRCodes: 0,
    totalScans: 0,
    thisMonth: 0,
    memberSince: "",
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);

    // Fetch profile
    const fetchProfile = async () => {
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setName(data.user.name || "");
        setStats((prev) => ({
          ...prev,
          memberSince: data.user.createdAt
            ? new Date(data.user.createdAt).toLocaleDateString()
            : "",
        }));
        setEmailNotifications(data.user.emailNotifications ?? true);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };

    // Fetch QR history and calculate stats (same as dashboard)
    const fetchQrHistory = async () => {
      try {
        const res = await fetch("/api/qr/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const history = Array.isArray(data.history) ? data.history : [];
        setQrHistory(history);

        // Calculate stats
        setStats((prev) => ({
          ...prev,
          totalQRCodes: history.length,
          totalScans: history.reduce((sum: number, qr: { scans?: number }) => sum + (qr.scans || 0), 0),
          thisMonth: history.filter((qr: { createdAt?: string }) => {
            if (!qr.createdAt) return false;
            const qrDate = new Date(qr.createdAt);
            const now = new Date();
            return (
              qrDate.getMonth() === now.getMonth() &&
              qrDate.getFullYear() === now.getFullYear()
            );
          }).length,
        }));
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchProfile();
    fetchQrHistory();
  }, [router]);

  const updateProfile = async () => {
    if (!name.trim()) return;
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError("");
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, emailNotifications }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } else {
      setUpdateError(data.error || "Failed to update profile");
      setTimeout(() => setUpdateError(""), 3000);
    }
    setUpdating(false);
  };

  const userStats = {
    totalQRCodes: 24,
    totalScans: 156,
    thisMonth: 8,
    accountAge: "3 months"
  };

  const recentActivity = [
    { type: "QR Generated", description: "Created QR code for website", time: "2 hours ago", icon: <FiGrid /> },
    { type: "Profile Updated", description: "Changed display name", time: "1 day ago", icon: <FiUser /> },
    { type: "QR Downloaded", description: "Downloaded QR code for event", time: "3 days ago", icon: <FiDownload /> },
    { type: "QR Scanned", description: "Your QR code was scanned 5 times", time: "1 week ago", icon: <FiEye /> }
  ];

  const accountSettings = [
    { name: "Email Notifications", description: "Receive updates about your QR codes", enabled: true },
    { name: "Analytics Tracking", description: "Track scan statistics and insights", enabled: true },
    { name: "Two-Factor Authentication", description: "Add an extra layer of security", enabled: false },
    { name: "Public Profile", description: "Allow others to see your profile", enabled: false }
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* LightRays Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#8edaff"
          raysSpeed={1.5}
          lightSpread={2}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.09}
          noiseAmount={1}
          distortion={0.05}
          className="custom-rays"
        />
        {/* Subtle blue gradient overlay for extra glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top, #8edaff33 0%, #59c3ff11 70%, transparent 100%)",
            zIndex: 1,
          }}
        />
      </div>
      
      {/* Navigation Bar */}
      <Navbar activePage="profile" />

      <div className="pt-28 sm:pt-32 px-7 xs:px-3 sm:px-6 lg:px-12 max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto pb-10 sm:pb-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h1
            className="text-4xl xs:text-5xl md:text-7xl font-extrabold mb-5 sm:mb-6 text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #8edaff 0%, #59c3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              filter: "drop-shadow(0 4px 32px #8edaff55)",
              textShadow: "0 2px 24px #59c3ff44",
              borderRadius: 0,
              display: "inline-block",
            }}
          >
            Your Profile
          </h1>
          <p className="text-[#eafaff] max-w-2xl mx-auto text-lg sm:text-xl font-medium drop-shadow-lg">
            Manage your account and view your activity
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#8edaff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : user ? (
          <div className="space-y-8">
            {/* User Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-[#2226] text-center">
                <FiGrid className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8edaff]">{stats.totalQRCodes}</div>
                <div className="text-[#eafaff]/70 text-sm">QR Codes</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-[#2226] text-center">
                <FiTrendingUp className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8edaff]">{stats.totalScans}</div>
                <div className="text-[#eafaff]/70 text-sm">Total Scans</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-[#2226] text-center">
                <FiCalendar className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#8edaff]">{stats.thisMonth}</div>
                <div className="text-[#eafaff]/70 text-sm">This Month</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-[#2226] text-center">
                <FiUser className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
                <div className="text-lg font-bold text-[#8edaff]">{stats.memberSince}</div>
                <div className="text-[#eafaff]/70 text-sm">Member Since</div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1 border border-[#2226] max-w-md mx-auto"
            >
              {[
                { id: "profile", label: "Profile", icon: <FiUser className="w-4 h-4" /> },
                { id: "activity", label: "Activity", icon: <FiTrendingUp className="w-4 h-4" /> },
                { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#8edaff] text-[#0e2233]"
                      : "text-[#eafaff]/70 hover:text-[#8edaff] hover:bg-[#8edaff]/10"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_0_rgba(0,0,0,0.15)] p-6 sm:p-8 border border-[#2226]"
              style={{
                boxShadow: "0 8px 40px 0 rgba(0,0,0,0.15)",
              }}
            >
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h3 className="text-[#8edaff] font-semibold text-xl mb-6">Profile Information</h3>
                  
                  {updateSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-4 py-3 rounded-lg"
                    >
                      Profile updated successfully!
                    </motion.div>
                  )}
                  
                  {updateError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-3 rounded-lg"
                    >
                      {updateError}
                    </motion.div>
                  )}
                  
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8edaff] group-hover:text-[#59c3ff] transition-colors" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-[#2228] rounded-xl text-[#eafaff]/60 focus:outline-none"
                      style={{
                        background: "rgba(10,10,10,0.40)",
                      }}
                    />
                    <label className="block text-xs font-medium text-[#eafaff]/60 mt-1 ml-1">Email (cannot be changed)</label>
                  </div>
                  
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8edaff] group-hover:text-[#59c3ff] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-[#2228] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:border-transparent text-white placeholder-[#8edaff99] transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your name"
                      style={{
                        background: "rgba(10,10,10,0.40)",
                      }}
                    />
                    <label className="block text-xs font-medium text-[#eafaff]/60 mt-1 ml-1">Name</label>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={updateProfile}
                    disabled={updating || !name.trim()}
                    className="w-full bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8edaff] focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center"
                    style={{
                      boxShadow: "0 4px 24px 0 #8edaff44",
                    }}
                  >
                    {updating ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-[#0e2233] border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Update Profile
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <h3 className="text-[#8edaff] font-semibold text-xl mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-4 p-4 bg-black/10 rounded-xl border border-[#2226]"
                      >
                        <div className="text-[#8edaff] p-2 bg-[#8edaff]/10 rounded-lg">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-[#eafaff] font-medium text-sm">{activity.type}</div>
                          <div className="text-[#eafaff]/60 text-xs">{activity.description}</div>
                        </div>
                        <div className="text-[#eafaff]/40 text-xs">{activity.time}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h3 className="text-[#8edaff] font-semibold text-xl mb-6">Account Settings</h3>
                  <div className="flex items-center justify-between p-4 bg-black/10 rounded-xl border border-[#2226] mb-4">
                    <div className="flex items-center space-x-3">
                      <FiBell className="w-5 h-5 text-[#8edaff]" />
                      <div>
                        <div className="text-[#eafaff] font-medium text-sm">Email Notifications</div>
                        <div className="text-[#eafaff]/60 text-xs">Receive updates about your QR codes</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailNotifications((v) => !v)}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                        emailNotifications ? "bg-[#8edaff] relative" : "bg-[#2228] relative"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          emailNotifications ? "translate-x-7" : "translate-x-1"
                        }`}
                        style={{ marginTop: "2px" }}
                      />
                    </button>
                  </div>
                  <div className="text-[#eafaff]/60 text-xs mt-2">
                    More settings coming soon!
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226]"
            >
              <h3 className="text-[#8edaff] font-semibold mb-4 text-lg">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  <FiGrid className="w-4 h-4" />
                  Create New QR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 bg-black/20 border border-[#2228] text-[#8edaff] px-4 py-2 rounded-lg font-medium hover:bg-[#8edaff]/10 transition-all duration-300"
                >
                  <FiTrendingUp className="w-4 h-4" />
                  View Dashboard
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-lg relative max-w-md mx-auto"
          >
            Failed to load user data. Please try again later.
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
