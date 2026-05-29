import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileEdit,
  Activity,
  Eye,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess, selectCurrentUser } from "@/store/slices/authSlice";
import { clearProfile } from "@/store/slices/profileSlice";
import { clearCVProfile } from "@/store/slices/cvProfileSlice";
import { setLanguage, selectLang } from "@/store/slices/languageSlice";
import { logout as logoutAPI } from "@/services/authService";
import useT from "@/hooks/useT";

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const t = useT();

  const NAV_ITEMS = [
    { to: "/dashboard",    icon: LayoutDashboard, label: t.nav.dashboard },
    { to: "/cv-workspace", icon: FileEdit,         label: t.nav.cvWorkspace },
    { to: "/access-logs",  icon: Activity,         label: t.nav.accessLogs },
    { to: "/cv-preview",   icon: Eye,              label: t.nav.cvPreview },
    { to: "/profile",      icon: User,             label: t.nav.account },
  ];

  const handleLogout = async () => {
    try { await logoutAPI(); } catch { /* ignore */ }
    dispatch(logoutSuccess());
    dispatch(clearProfile());
    dispatch(clearCVProfile());
    navigate("/login", { replace: true });
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            CV
          </div>
          <span className="font-semibold text-lg tracking-tight">My CV</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md hover:bg-slate-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white transition-colors"} />
                <span>{label}</span>
                {isActive && <ChevronRight size={13} className="ml-auto opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username ?? "User"}</p>
            <p className="text-xs text-slate-400">{t.nav.cvOwner}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          {t.nav.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 lg:h-screen lg:sticky lg:top-0">
        {content}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed left-0 top-0 z-50 w-60 h-full lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
// MAIN LAYOUT
// ============================================================
const MainLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const lang = useSelector(selectLang);

  const toggleLang = () => dispatch(setLanguage(lang === "vi" ? "en" : "vi"));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              title={lang === "vi" ? "Chuyển sang English" : "Switch to Tiếng Việt"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-600"
            >
              <span className="text-base leading-none">{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
              <span>{lang === "vi" ? "VI" : "EN"}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.username ?? "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
