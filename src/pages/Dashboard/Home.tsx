/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminGetDashboard } from "../../reduxKit/actions/dashboard";
import toast from "react-hot-toast";

// Stat Card Component
interface StatCardProps {
  icon: string;
  title: string;
  value: number;
  bgGradient: string;
  delay: number;
  subtext: string;
}

const StatCard = ({ icon, title, value, bgGradient, delay, subtext }: StatCardProps) => {
  return (
    <div
      className={`${bgGradient} rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10`}
      style={{
        animation: `slideUp 0.6s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
        <div className="relative z-10">
          <div className="text-5xl mb-4">{icon}</div>
          <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-bold text-white mb-3">{value}</h3>
          <p className="text-white/60 text-xs">{subtext}</p>
        </div>
      </div>
    </div>
  );
};

// Summary Section Component
interface SummaryProps {
  totalRecords: number;
  lastUpdated: string;
}

const SummarySection = ({ totalRecords, lastUpdated }: SummaryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-gradient-to-br from-cyan-600/30 via-teal-500/30 to-cyan-900/20 rounded-2xl shadow-xl p-8 border border-cyan-500/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-900/80 text-sm font-medium mb-2 uppercase tracking-wider">Total Records</p>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-700 to-teal-400 bg-clip-text text-transparent mb-4">{totalRecords}</h2>
          <p className="text-black-800/60 text-sm flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-900 rounded-full animate-pulse"></span>
            Last updated: {formatDate(lastUpdated)}
          </p>
        </div>
        <div className="text-7xl opacity-80">📊</div>
      </div>
    </div>
  );
}; 

// Main Dashboard Component
export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard) as any;

  useEffect(() => {
    dispatch(adminGetDashboard())
      .unwrap()
      .then((result) => {
        console.log("Dashboard data loaded:", result);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
      });
  }, [dispatch]);

  // Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load dashboard data");
    }
  }, [error]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-cyan-900/50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-teal-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-cyan-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6 max-w-md backdrop-blur-sm">
          <p className="text-red-300 font-medium text-lg">Error loading dashboard</p>
          <p className="text-red-200/70 text-sm mt-2">{error?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const { totals, summary } = data?.data || {
    totals: {
      banners: 0,
      events: 0,
      founderProfiles: 0,
      memberships: 0,
      verifiedMemberships: 0
    },
    summary: {
      totalRecords: 0,
      lastUpdated: new Date().toISOString()
    }
  };

  const dashboardCards = [
    {
      icon: "🎪",
      title: "Banners",
      value: totals.banners,
      bgGradient: "bg-gradient-to-br  from-cyan-600/40 to-cyan-700/40",
      delay: 0,
      subtext: "Active campaigns"
    },
    {
      icon: "📅",
      title: "Events",
      value: totals.events,
      bgGradient: "bg-gradient-to-br from-teal-600/40 to-teal-700/40",
      delay: 100,
      subtext: "Upcoming events"
    },
    {
      icon: "👑",
      title: "Founder Profiles",
      value: totals.founderProfiles,
      bgGradient: "bg-gradient-to-br from-cyan-600/40 to-teal-600/40",
      delay: 200,
      subtext: "Verified founders"
    },
    {
      icon: "👥",
      title: "Memberships",
      value: totals.memberships,
      bgGradient: "bg-gradient-to-br from-teal-600/40 to-cyan-600/40",
      delay: 300,
      subtext: "Total members"
    },
    {
      icon: "✅",
      title: "Verified Members",
      value: totals.verifiedMemberships,
      bgGradient: "bg-gradient-to-br from-cyan-600/40 to-teal-700/40",
      delay: 400,
      subtext: `${totals.memberships > 0 ? Math.round((totals.verifiedMemberships / totals.memberships) * 100) : 0}% verified`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-cyan-100/10 to-slate-300 p-6 md:p-8">
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.5) transparent;
        }
        *::-webkit-scrollbar {
          width: 8px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        *::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.5);
          border-radius: 4px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.8);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-00 to-teal-400 rounded-full"></div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-teal-400 bg-clip-text text-transparent">
              Take-Off
            </h1>
          </div>
          <p className="text-black- text-lg ml-4">Welcome back! Here's your performance overview.</p>
        </div>

        {/* Summary Section */}
        <div className="mb-10">
          <SummarySection 
            totalRecords={summary.totalRecords} 
            lastUpdated={summary.lastUpdated}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {dashboardCards.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              bgGradient={card.bgGradient}
              delay={card.delay}
              subtext={card.subtext}
            />
          ))}
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <p className="text-balck-300/70 text-sm mb-3 uppercase tracking-wider">Engagement Rate</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {totals.memberships > 0 ? Math.round((totals.verifiedMemberships / totals.memberships) * 100) : 0}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border border-teal-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-teal-400/50 transition-all">
            <p className="text-teal-black/70 text-sm mb-3 uppercase tracking-wider">Active Events</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-400 bg-clip-text text-transparent">
              {totals.events}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <p className="text-cyan-black/70 text-sm mb-3 uppercase tracking-wider">Growth Status</p>
            <p className="text-2xl font-bold text-teal-800">↑ Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}