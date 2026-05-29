import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import {
  Eye,
  FileEdit,
  Globe,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import {
  fetchMyCVDetail,
  selectMyCVDetail,
  selectCVLoading,
  selectCVError,
} from "@/store/slices/cvProfileSlice";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { getMyCVStats } from "@/services/cvProfileService";
import Loading from "@/components/Loading/Loading";
import useT from "@/hooks/useT";

const buildViewsTrend = (totalViews = 0) => {
  const base = Math.max(1, Math.floor(totalViews / 7));
  return Array.from({ length: 7 }, (_, i) => ({
    date: dayjs().subtract(6 - i, "day").format("DD/MM"),
    views: Math.round(base * (0.5 + Math.random() * 1.2)),
  }));
};

const DEVICE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const StatCard = ({ icon: Icon, label, value, sub, color = "blue" }) => {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600"   },
    green:  { bg: "bg-green-50",  text: "text-green-600"  },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600"  },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };
  const c = colorMap[color] ?? colorMap.blue;
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${c.bg}`}>
        <Icon size={20} className={c.text} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const t        = useT();
  const dispatch = useDispatch();
  const cv = useSelector(selectMyCVDetail);
  const isLoading = useSelector(selectCVLoading);
  const error = useSelector(selectCVError);
  const user = useSelector(selectCurrentUser);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!cv) dispatch(fetchMyCVDetail());
  }, [dispatch, cv]);

  useEffect(() => {
    if (cv) {
      getMyCVStats().then(setStats).catch(() => {});
    }
  }, [cv?.id]);

  if (isLoading && !cv) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!cv && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">{t.dashboard.noCV}</p>
        <Link
          to="/cv-workspace"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {t.dashboard.createCV}
        </Link>
      </div>
    );
  }

  const viewsTrend = buildViewsTrend(stats?.totalViews ?? cv?.viewCount ?? 0);
  const publishedDate = cv?.publishedDate ? dayjs(cv.publishedDate).format("DD/MM/YYYY") : "—";
  const deviceData = stats?.deviceBreakdown
    ? Object.entries(stats.deviceBreakdown).map(([name, value]) => ({ name, value }))
    : [];
  const totalDeviceViews = deviceData.reduce((s, d) => s + d.value, 0) || 1;

  const STATUS_LABEL = { DRAFT: t.status.DRAFT, PUBLISHED: t.status.PUBLISHED, HIDDEN: t.status.HIDDEN };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.greeting}, {user?.username ?? "bạn"} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">{t.dashboard.cvLabel}: {cv?.fullName || "—"}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye}         label={t.dashboard.totalViews}    value={stats?.totalViews ?? cv?.viewCount ?? 0} sub={t.dashboard.allTime}    color="blue"   />
        <StatCard icon={Globe}       label={t.dashboard.cvStatus}      value={STATUS_LABEL[cv?.status] ?? "—"}         sub={cv?.isPublic ? t.dashboard.public : t.dashboard.private} color="green" />
        <StatCard icon={TrendingUp}  label={t.dashboard.skills}        value={cv?.skills?.length ?? 0}                 sub={t.dashboard.listed}    color="purple" />
        <StatCard icon={CalendarDays} label={t.dashboard.publishedDate} value={publishedDate}                          sub={cv?.status === "PUBLISHED" ? "Active" : "—"} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{t.dashboard.viewsTrend}</h2>
            <span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={12} /> {t.dashboard.estimate}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={viewsTrend}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} cursor={{ stroke: "#3b82f6", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{t.dashboard.deviceAccess}</h2>
          {deviceData.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">{t.dashboard.noData}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {deviceData.map((_, i) => (<Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {deviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      {d.name}
                    </span>
                    <span className="font-medium text-gray-700">{Math.round((d.value / totalDeviceViews) * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">{t.dashboard.quickActions}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: "/cv-workspace", icon: FileEdit, label: t.dashboard.editCV,     sub: t.dashboard.editCVSub,     color: "blue"   },
            { to: "/cv-preview",   icon: Eye,      label: t.dashboard.previewCV,  sub: t.dashboard.previewCVSub, color: "green"  },
            { to: "/access-logs",  icon: Activity, label: t.dashboard.accessLogs, sub: t.dashboard.accessLogsSub, color: "purple" },
          ].map(({ to, icon: Icon, label, sub, color }) => (
            <Link key={to} to={to} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
              <div className={`p-2 rounded-lg ${color === "blue" ? "bg-blue-100" : color === "green" ? "bg-green-100" : "bg-purple-100"}`}>
                <Icon size={16} className={color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : "text-purple-600"} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">{label}</p>
                <p className="text-xs text-gray-400 truncate">{sub}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

