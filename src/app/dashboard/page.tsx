"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiExternalLink, FiDownload, FiSettings, FiGrid, FiUser, FiTrendingUp, FiCalendar, FiBarChart2, FiRefreshCw, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const [qrHistory, setQrHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [stats, setStats] = useState({
    totalQRCodes: 0,
    totalScans: 0,
    thisMonth: 0,
    popularStyle: "Classic white"
  });
  const router = useRouter();

  useEffect(() => {
    // Prevent SSR/Next.js hydration error with localStorage
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    const fetchQrHistory = async () => {
      try {
        const res = await fetch("/api/qr/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Failed to load history");
        } else {
          setQrHistory(Array.isArray(data.history) ? data.history : []);
          // Calculate stats
          setStats({
            totalQRCodes: Array.isArray(data.history) ? data.history.length : 0,
            totalScans: Array.isArray(data.history)
              ? data.history.reduce((sum: number, qr: any) => sum + (qr.scans || 0), 0)
              : 0,
            thisMonth: Array.isArray(data.history)
              ? data.history.filter((qr: any) => {
                  if (!qr.createdAt) return false;
                  const qrDate = new Date(qr.createdAt);
                  const now = new Date();
                  return (
                    qrDate.getMonth() === now.getMonth() &&
                    qrDate.getFullYear() === now.getFullYear()
                  );
                }).length
              : 0,
            popularStyle: "Classic white" // This would come from backend
          });
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQrHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const downloadQR = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteQR = async (qrId: string) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/qr/delete?id=${qrId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Remove the deleted QR from the state
        setQrHistory(prev => prev.filter(qr => qr._id !== qrId));
        setDeleteSuccess("QR code deleted successfully!");
        setTimeout(() => setDeleteSuccess(""), 3000);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalQRCodes: prev.totalQRCodes - 1,
        }));
      } else {
        const data = await res.json();
        setError(data?.error || "Failed to delete QR code");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearAllQRs = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL your QR codes! Are you absolutely sure?")) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/qr/clear-all", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Clear all QRs from state
        setQrHistory([]);
        setDeleteSuccess(`Successfully deleted ${data.deleted} QR codes!`);
        setTimeout(() => setDeleteSuccess(""), 3000);
        
        // Update stats
        setStats({
          totalQRCodes: 0,
          totalScans: 0,
          thisMonth: 0,
          popularStyle: "Classic white"
        });
      } else {
        setError(data?.error || "Failed to clear QR codes");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const recentActivity = [
    { type: "QR Generated", description: "Created QR code for website", time: "2 hours ago" },
    { type: "QR Scanned", description: "Your QR code was scanned 5 times", time: "1 day ago" },
    { type: "QR Downloaded", description: "Downloaded QR code for event", time: "3 days ago" }
  ];

  if (!isAuthenticated) {
    return null;
  }

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
      <Navbar activePage="dashboard" />

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
            Your QR Code Collection
          </h1>
          <p className="text-[#eafaff] max-w-2xl mx-auto text-lg sm:text-xl font-medium drop-shadow-lg">
            Every scan tells a story - here's yours!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-[#2226] text-center">
            <FiGrid className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#8edaff]">{stats.totalQRCodes}</div>
            <div className="text-[#eafaff]/70 text-sm">Total QR Codes</div>
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
            <FiBarChart2 className="w-6 h-6 text-[#8edaff] mx-auto mb-2" />
            <div className="text-lg font-bold text-[#8edaff]">{stats.popularStyle}</div>
            <div className="text-[#eafaff]/70 text-sm">Popular Style</div>
          </div>
        </motion.div>

        {/* Storage Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-pink-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-radial from-pink-400/20 to-transparent rounded-full"></div>
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-pink-300 w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-pink-300 font-bold mb-2 text-lg">Storage Heads Up! 🚨</h3>
                <p className="text-pink-100 text-sm mb-3">
                  Bestie, we're running on student budget vibes here! If you don't clear your QR history 
                  occasionally, we might have to stop new generations. No cap, our database storage is limited af.
                </p>
                <p className="text-pink-200 text-xs">
                  Pro tip: Delete QRs you don't need anymore to keep things running smoothly. It's giving Marie Kondo energy! ✨
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226]">
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
                className="flex items-center gap-2 bg-black/20 border border-[#2228] text-[#8edaff] px-4 py-2 rounded-lg font-medium hover:bg-[#8edaff]/10 transition-all duration-300"
                onClick={() => window.location.reload()}
                type="button"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh Stats
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllQRs}
                disabled={deleteLoading || qrHistory.length === 0}
                className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All QRs
              </motion.button>
            </div>
            {deleteSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-500/20 border border-green-400/30 text-green-200 rounded-lg text-sm"
              >
                {deleteSuccess}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-[#2226]">
            <h3 className="text-[#8edaff] font-semibold mb-4 text-lg">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-3 bg-black/10 rounded-lg border border-[#2226]"
                >
                  <div>
                    <div className="text-[#eafaff] font-medium text-sm">{activity.type}</div>
                    <div className="text-[#eafaff]/60 text-xs">{activity.description}</div>
                  </div>
                  <div className="text-[#eafaff]/40 text-xs">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* QR Codes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#8edaff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-lg relative max-w-3xl mx-auto"
          >
            {error}
          </motion.div>
        ) : qrHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-200 px-6 py-4 rounded-lg relative max-w-3xl mx-auto text-center"
          >
            <div className="mb-4">
              <FiGrid className="w-12 h-12 mx-auto text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No QR Codes Yet</h3>
            <p className="mb-4">You haven't generated any QR codes yet. Start creating beautiful QR codes now!</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-[#8edaff] to-[#59c3ff] text-[#0e2233] px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Create Your First QR Code
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[#8edaff] font-semibold text-lg">Your QR Codes</h3>
              <div className="text-[#eafaff]/60 text-sm">{qrHistory.length} codes</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrHistory.map((qr, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_0_rgba(0,0,0,0.15)] overflow-hidden border border-[#2226] hover:border-[#8edaff33] transition-all duration-300"
                  style={{
                    boxShadow: "0 8px 40px 0 rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="p-6 flex flex-col items-center bg-black/20">
                    {/* Use img tag for dynamic src, as next/image requires static src or loader */}
                    <img 
                      src={`/api/qr/generate-preview?link=${encodeURIComponent(qr.link)}&design=${encodeURIComponent(qr.design)}`} 
                      alt="QR Code" 
                      className="h-40 w-40 object-contain rounded-lg shadow-[0_4px_32px_0_rgba(94,210,255,0.10)] border border-[#8edaff22] bg-white"
                    />
                    <div className="text-xs text-[#eafaff]/70 mt-2 text-center">
                      Preview only. Generate to download.
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="truncate text-sm font-medium text-[#8edaff] mb-3">
                      {qr.link}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-[#eafaff]/60">
                        Style: {qr.design}
                      </span>
                      <span className="text-xs text-[#eafaff]/60">
                        Scans: {qr.scans || 0}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {/* Download button removed for preview QR codes */}
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={qr.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600/30 hover:bg-blue-500/50 rounded-full text-blue-400 transition-colors"
                        title="Open Link"
                      >
                        <FiExternalLink size={16} />
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteQR(qr._id)}
                        disabled={deleteLoading}
                        className="p-2 bg-red-600/30 hover:bg-red-500/50 rounded-full text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete QR"
                        type="button"
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      {/* Optionally render Footer */}
      <Footer />
    </div>
  );
}