import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sun,
  Moon,
  Printer,
} from "lucide-react";
import CVRenderer from "./CVRenderer";
import {
  fetchPublicCV,
  selectPublicCV,
  selectCVLoading,
  selectMyCVDetail,
} from "@/store/slices/cvProfileSlice";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { setLanguage, selectLang } from "@/store/slices/languageSlice";
import { logCVView } from "@/services/cvProfileService";
import Loading from "@/components/Loading/Loading";
import useT from "@/hooks/useT";

// ============================================================
// VIEWPORT MODES
// ============================================================
const VIEWPORTS = [
  { key: "desktop", label: "Desktop", icon: Monitor, width: "100%"  },
  { key: "tablet",  label: "Tablet",  icon: Tablet,  width: "768px" },
  { key: "mobile",  label: "Mobile",  icon: Smartphone, width: "375px" },
];

// ============================================================
// MAIN PAGE
// ============================================================
const SectionTitle = ({ title, icon: Icon, isDark }) => (
  <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800/80 pb-2 mb-4">
    {Icon && (
      <span className={isDark ? "text-blue-400" : "text-blue-600"}>
        <Icon size={16} />
      </span>
    )}
    <h2 className={`text-xs font-black uppercase tracking-widest ${
      isDark ? "text-slate-200" : "text-slate-800"
    }`}>
      {title}
    </h2>
  </div>
);

const SkillBar = ({ skillName, skillLevel, isDark, t }) => {
  const percentMap = {
    Expert: 100,
    Advanced: 80,
    Intermediate: 60,
    Beginner: 40,
  };
  const percent = percentMap[skillLevel] ?? 40;
  
  const levelLabelMap = {
    Expert: t.tabs?.levelExpert || "Expert",
    Advanced: t.tabs?.levelAdvanced || "Advanced",
    Intermediate: t.tabs?.levelIntermediate || "Intermediate",
    Beginner: t.tabs?.levelBeginner || "Beginner",
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className={isDark ? "text-slate-300" : "text-slate-800"}>{skillName}</span>
        <span className={isDark ? "text-slate-500" : "text-slate-500"}>{levelLabelMap[skillLevel]}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${
            isDark ? "from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "from-blue-600 to-indigo-600"
          }`}
        />
      </div>
    </div>
  );
};

const renderTags = (tagsStr, categoryName, isDark) => {
  if (!tagsStr) return null;
  const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
        isDark ? "bg-slate-800/80 text-blue-400 border border-slate-700/50" : "bg-blue-50 text-blue-600 border border-blue-100"
      }`}>
        {categoryName}
      </span>
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-all ${
            isDark
              ? "bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:border-blue-500/30 hover:text-blue-400 hover:bg-slate-900"
              : "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const ProjectCard = ({ p, t, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedDates = () => {
    if (!p.startDate && !p.endDate) return null;
    const start = p.startDate ? dayjs(p.startDate).format("MM/YYYY") : "";
    const end = p.endDate ? dayjs(p.endDate).format("MM/YYYY") : t.cvPreview.present;
    return `${start} — ${end}`;
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
        isDark
          ? "bg-slate-900/40 border-slate-800/60 hover:border-blue-500/30 hover:bg-slate-900/60 shadow-lg text-slate-300"
          : "bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-300 text-slate-700"
      }`}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className={`text-base font-bold transition-colors ${
                isDark ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-600"
              }`}>
                {p.projectName}
              </h3>
              {p.urlDemo && (
                <a
                  href={p.urlDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-[10px] font-bold flex items-center gap-0.5 bg-blue-500/5 hover:bg-blue-500/10 px-2 py-0.5 rounded-full transition-all"
                >
                  <span>Demo</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            
            {p.roleInProject && (
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {p.roleInProject}
              </p>
            )}
            
            <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mt-1.5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              {p.companyName && <span className="font-semibold">{p.companyName}</span>}
              {p.companyName && p.teamSize && <span>·</span>}
              {p.teamSize && <span>{p.teamSize} {t.cvPreview.members}</span>}
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right mt-1 sm:mt-0">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
              isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-100 text-slate-600"
            }`}>
              {formattedDates()}
            </span>
          </div>
        </div>

        {/* Tech stacks */}
        {(p.techFrontend || p.techBackend || p.techDevopsTools) && (
          <div className="mt-4 pt-3.5 border-t border-dashed border-slate-200 dark:border-slate-800/80 space-y-2">
            {p.techFrontend && renderTags(p.techFrontend, "Frontend", isDark)}
            {p.techBackend && renderTags(p.techBackend, "Backend", isDark)}
            {p.techDevopsTools && renderTags(p.techDevopsTools, "DevOps/Tools", isDark)}
          </div>
        )}

        {/* Accordion tasks */}
        {p.tasks?.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-1.5 text-xs font-bold hover:underline cursor-pointer transition-colors ${
                isDark ? "text-slate-400 hover:text-blue-400" : "text-slate-500 hover:text-blue-600"
              }`}
            >
              <span>{isExpanded ? "Hide Responsibilities" : `View Responsibilities (${p.tasks.length})`}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="list-none mt-2.5 space-y-1.5 pl-1 overflow-hidden"
                >
                  {p.tasks.map((task, ti) => (
                    <motion.li
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: ti * 0.03 }}
                      key={ti}
                      className={`text-xs leading-relaxed flex items-start gap-2.5 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <span className="text-blue-500 dark:text-blue-400 shrink-0 mt-1">✦</span>
                      <span>{task.taskDescription}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EducationCard = ({ edu, t, isDark }) => {
  const formattedDates = () => {
    if (!edu.startDate && !edu.endDate) return null;
    const start = edu.startDate ? dayjs(edu.startDate).format("MM/YYYY") : "";
    const end = edu.endDate ? dayjs(edu.endDate).format("MM/YYYY") : t.cvPreview.present;
    return `${start} — ${end}`;
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`p-5 rounded-2xl border transition-all duration-300 flex gap-4 ${
        isDark
          ? "bg-slate-900/40 border-slate-800/60 hover:border-blue-500/30 text-slate-300"
          : "bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-300 text-slate-700"
      }`}
    >
      <div className={`p-3 rounded-xl shrink-0 h-fit ${
        isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"
      }`}>
        <GraduationCap size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
          <h3 className={`text-base font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {edu.schoolName}
          </h3>
          <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {formattedDates()}
          </span>
        </div>

        {edu.degree && (
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {edu.degree}{edu.major ? ` — ${edu.major}` : ""}
          </p>
        )}

        {edu.gpa && (
          <div className="mt-2">
            <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-wide ${
              isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-100"
            }`}>
              GPA: {edu.gpa}
            </span>
          </div>
        )}

        {edu.description && (
          <p className={`text-xs mt-2.5 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {edu.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const ActivityCard = ({ act, t, isDark }) => {
  const formattedDates = () => {
    if (!act.startDate && !act.endDate) return null;
    const start = act.startDate ? dayjs(act.startDate).format("MM/YYYY") : "";
    const end = act.endDate ? dayjs(act.endDate).format("MM/YYYY") : t.cvPreview.present;
    return `${start} — ${end}`;
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`p-5 rounded-2xl border transition-all duration-300 flex gap-4 ${
        isDark
          ? "bg-slate-900/40 border-slate-800/60 hover:border-blue-500/30 text-slate-300"
          : "bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-300 text-slate-700"
      }`}
    >
      <div className={`p-3 rounded-xl shrink-0 h-fit ${
        isDark ? "bg-slate-800 text-purple-400" : "bg-purple-50 text-purple-600"
      }`}>
        <BookOpen size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
          <h3 className={`text-base font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {act.organization}
          </h3>
          <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {formattedDates()}
          </span>
        </div>

        {act.role && (
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {act.role}
          </p>
        )}

        {act.description && (
          <p className={`text-xs mt-2.5 leading-relaxed whitespace-pre-wrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {act.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const CertificationCard = ({ cert, t, isDark }) => {
  const issueDateStr = cert.issueDate ? dayjs(cert.issueDate).format("MM/YYYY") : "";
  const expiryDateStr = cert.expirationDate ? dayjs(cert.expirationDate).format("MM/YYYY") : "";

  return (
    <motion.div
      variants={itemVariants}
      className={`p-5 rounded-2xl border transition-all duration-300 flex gap-4 ${
        isDark
          ? "bg-slate-900/40 border-slate-800/60 hover:border-blue-500/30 text-slate-300"
          : "bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-300 text-slate-700"
      }`}
    >
      <div className={`p-3 rounded-xl shrink-0 h-fit ${
        isDark ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-600"
      }`}>
        <Award size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
          <h3 className={`text-base font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {cert.certName}
          </h3>
          <div className="text-xs font-semibold text-left sm:text-right">
            {issueDateStr && <span className={isDark ? "text-slate-400" : "text-slate-500"}>{issueDateStr}</span>}
            {expiryDateStr && (
              <span className="text-red-500 dark:text-red-400 ml-2 font-bold">
                ({t.cvPreview.expiry}: {expiryDateStr})
              </span>
            )}
          </div>
        </div>

        {cert.issuingOrganization && (
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {cert.issuingOrganization}
          </p>
        )}

        {cert.credentialId && (
          <p className={`text-[10px] font-mono mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            ID: {cert.credentialId}
          </p>
        )}

        {cert.credentialUrl && (
          <div className="mt-3">
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isDark
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span>{t.cvPreview.viewCert}</span>
              <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================
const CVPreview = ({ publicMode = false }) => {
  const t         = useT();
  const dispatch  = useDispatch();
  const params    = useParams();
  const user      = useSelector(selectCurrentUser);
  const cv        = useSelector(selectPublicCV);
  const myCV      = useSelector(selectMyCVDetail);
  const isLoading = useSelector(selectCVLoading);
  const lang      = useSelector(selectLang);
  const [viewport, setViewport] = useState("desktop");
  const [theme, setTheme] = useState(() => localStorage.getItem("cv-theme") || "dark");
  const hasLoggedRef = useRef(false);

  const targetUsername = publicMode ? params.username : user?.username;

  useEffect(() => {
    if (targetUsername) {
      dispatch(fetchPublicCV(targetUsername));
    }
  }, [dispatch, targetUsername]);

  useEffect(() => {
    if (publicMode && targetUsername && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logCVView(targetUsername).catch(() => {});
    }
  }, [publicMode, targetUsername]);

  const handleRefresh = () => {
    if (targetUsername) dispatch(fetchPublicCV(targetUsername));
  };

  const toggleLang = () => {
    dispatch(setLanguage(lang === "vi" ? "en" : "vi"));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("cv-theme", newTheme);
  };

  const displayCV = cv ?? (publicMode ? null : myCV);
  const isDark = theme === "dark";

  // ── Public View Route Mode ──
  if (publicMode) {
    return (
      <div className={`min-h-screen transition-colors duration-300 relative ${
        isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}>
        {/* Floating Controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-lg print:hidden">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
            title={lang === "vi" ? "Chuyển sang English" : "Switch to Tiếng Việt"}
          >
            <span className="text-base leading-none">{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
            <span>{lang === "vi" ? "VI" : "EN"}</span>
          </button>
          
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />

          {/* Theme Selector */}
          <button
            onClick={() => handleThemeChange(isDark ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />

          {/* Print CV */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Print / Save PDF"
          >
            <Printer size={15} />
          </button>
        </div>

        {isLoading && !displayCV ? (
          <div className="flex items-center justify-center min-h-[100vh]">
            <Loading size="lg" />
          </div>
        ) : !displayCV ? (
          <div className="flex flex-col items-center justify-center min-h-[100vh] gap-3 text-slate-400">
            <AlertCircle size={36} />
            <p className="text-sm font-semibold">{t.cvPreview.noCVPublic}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[794px]">
              <CVRenderer cv={displayCV} t={t} isDark={isDark} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Internal Workspace Preview Mode ──
  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-500" />
          <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{t.cvPreview.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Viewport size switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
            {VIEWPORTS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewport(key)}
                title={label}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewport === key
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

          {/* Theme switcher */}
          <button
            onClick={() => handleThemeChange(isDark ? "light" : "dark")}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

          {/* Print / Save PDF */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export to PDF"
          >
            <Printer size={13} />
            <span className="font-semibold">PDF</span>
          </button>

          {/* Refresh Profile data */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span className="font-semibold">{t.cvPreview.refresh}</span>
          </button>
        </div>
      </div>

      {/* Frame Viewport wrapper */}
      <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-6">
        {isLoading && !displayCV ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loading size="lg" />
          </div>
        ) : !displayCV ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-slate-400 dark:text-slate-600">
            <AlertCircle size={36} />
            <p className="text-sm font-semibold">{t.cvPreview.noCV}</p>
            <p className="text-xs">{t.cvPreview.noCVSub}</p>
          </div>
        ) : (
          <motion.div
            key={`${viewport}-${theme}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="mx-auto transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl"
            style={{ maxWidth: VIEWPORTS.find((v) => v.key === viewport)?.width }}
          >
            <CVRenderer cv={displayCV} t={t} isDark={isDark} viewport={viewport} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CVPreview;
