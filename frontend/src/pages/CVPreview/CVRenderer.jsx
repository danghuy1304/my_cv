import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { selectLang } from "@/store/slices/languageSlice";
import dayjs from "dayjs";

// ── Brand Icons ──────────────────────────────────────────────
const GithubIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ── Animation Variants ───────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// ── SectionTitle ─────────────────────────────────────────────
const SectionTitle = ({ title, icon: Icon, isDark }) => (
  <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800/80 pb-2 mb-4">
    {Icon && (
      <span className={isDark ? "text-blue-400" : "text-blue-600"}>
        <Icon size={16} />
      </span>
    )}
    <h2
      className={`text-xs font-black uppercase tracking-widest ${
        isDark ? "text-slate-200" : "text-slate-800"
      }`}
    >
      {title}
    </h2>
  </div>
);

// ── SkillBar ─────────────────────────────────────────────────
const SkillBar = ({ skillName, skillLevel, isDark, t }) => {
  const percentMap = { Expert: 100, Advanced: 80, Intermediate: 60, Beginner: 40 };
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
            isDark
              ? "from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
              : "from-blue-600 to-indigo-600"
          }`}
        />
      </div>
    </div>
  );
};

// ── renderTags ───────────────────────────────────────────────
const renderTags = (tagsStr, categoryName, isDark) => {
  if (!tagsStr) return null;
  const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
          isDark
            ? "bg-slate-800/80 text-blue-400 border border-slate-700/50"
            : "bg-blue-50 text-blue-600 border border-blue-100"
        }`}
      >
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

// ── ProjectCard ──────────────────────────────────────────────
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
              <h3
                className={`text-base font-bold transition-colors ${
                  isDark
                    ? "text-slate-100 group-hover:text-blue-400"
                    : "text-slate-800 group-hover:text-blue-600"
                }`}
              >
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

            <div
              className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mt-1.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {p.companyName && <span className="font-semibold">{p.companyName}</span>}
              {p.companyName && p.teamSize && <span>·</span>}
              {p.teamSize && (
                <span>
                  {p.teamSize} {t.cvPreview.members}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right mt-1 sm:mt-0">
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-100 text-slate-600"
              }`}
            >
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
              <span>
                {isExpanded
                  ? "Hide Responsibilities"
                  : `View Responsibilities (${p.tasks.length})`}
              </span>
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
                      key={ti}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: ti * 0.03 }}
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

// ── EducationCard ─────────────────────────────────────────────
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
      <div
        className={`p-3 rounded-xl shrink-0 h-fit ${
          isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"
        }`}
      >
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
            {edu.degree}
            {edu.major ? ` — ${edu.major}` : ""}
          </p>
        )}

        {edu.gpa && (
          <div className="mt-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-black tracking-wide ${
                isDark
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}
            >
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

// ── ActivityCard ──────────────────────────────────────────────
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
      <div
        className={`p-3 rounded-xl shrink-0 h-fit ${
          isDark ? "bg-slate-800 text-purple-400" : "bg-purple-50 text-purple-600"
        }`}
      >
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
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{act.role}</p>
        )}

        {act.description && (
          <p
            className={`text-xs mt-2.5 leading-relaxed whitespace-pre-wrap ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {act.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ── CertificationCard ─────────────────────────────────────────
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
      <div
        className={`p-3 rounded-xl shrink-0 h-fit ${
          isDark ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-600"
        }`}
      >
        <Award size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
          <h3 className={`text-base font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {cert.certName}
          </h3>
          <div className="text-xs font-semibold text-left sm:text-right">
            {issueDateStr && (
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>{issueDateStr}</span>
            )}
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
// CVRenderer
// ============================================================
const CVRenderer = ({ cv, t, isDark, viewport = "desktop" }) => {
  if (!cv) return null;
  const lang = useSelector(selectLang);
  const isVi = lang === "vi";
  const isMobileView = viewport === "mobile";
  const isTabletView = viewport === "tablet";

  const skillsByCategory = (cv.skills ?? []).reduce((acc, s) => {
    const cat = s.skillCategory || t.cvPreview.other;
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  return (
    <div
      className={`relative min-h-screen font-sans antialiased print:overflow-visible transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-700"
      }`}
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none print:hidden z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/0 blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[45%] aspect-square rounded-full bg-gradient-to-br from-purple-500/8 to-pink-500/0 blur-[120px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-14 relative z-10 print:max-w-full print:w-full print:px-6 print:py-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-8 print:grid print:grid-cols-12 print:gap-4 ${
            isMobileView
              ? "grid-cols-1"
              : isTabletView
              ? "grid-cols-12"
              : "grid-cols-1 md:grid-cols-12"
          }`}
        >
          {/* SIDEBAR */}
          <div
            className={`space-y-6 print:col-span-4 print:space-y-6 ${
              isMobileView ? "col-span-1" : isTabletView ? "col-span-4" : "md:col-span-4"
            }`}
          >
            {/* Header & Bio Card */}
            <motion.div
              variants={itemVariants}
              className={`p-6 rounded-3xl border ${
                isDark
                  ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                  : "bg-white border-slate-200/60 shadow-md"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {cv.avatarUrl && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative w-28 h-28 rounded-full p-1 mb-4 print:w-24 print:h-24 shrink-0"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, #3b82f6, #6366f1, #a855f7)"
                        : "linear-gradient(135deg, #2563eb, #4f46e5, #9333ea)",
                    }}
                  >
                    <img
                      src={cv.avatarUrl}
                      alt={cv.fullName}
                      className="w-full h-full rounded-full object-cover border-4 border-slate-950/20 bg-slate-900"
                    />
                  </motion.div>
                )}

                <div>
                  <h1
                    className={`text-2xl font-black tracking-tight leading-tight ${
                      isDark
                        ? "text-white bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        : "text-slate-800"
                    }`}
                  >
                    {cv.fullName}
                  </h1>
                  {cv.title && (
                    <p className="text-blue-500 dark:text-blue-400 font-extrabold text-xs uppercase tracking-widest mt-2">
                      {cv.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3.5 print:mt-4 print:pt-4">
                {cv.email && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <Mail size={14} />
                    </span>
                    <a href={`mailto:${cv.email}`} className="hover:underline truncate font-medium">
                      {cv.email}
                    </a>
                  </div>
                )}
                {cv.phone && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <Phone size={14} />
                    </span>
                    <a href={`tel:${cv.phone}`} className="hover:underline font-medium">
                      {cv.phone}
                    </a>
                  </div>
                )}
                {cv.birthday && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <Calendar size={14} />
                    </span>
                    <span className="font-medium">{dayjs(cv.birthday).format("DD/MM/YYYY")}</span>
                  </div>
                )}
                {cv.address && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <MapPin size={14} />
                    </span>
                    <span className="font-medium truncate">{cv.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(cv.githubUrl || cv.linkedinUrl || cv.websiteUrl) && (
                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex justify-center gap-3 print:hidden">
                  {cv.githubUrl && (
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={cv.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="GitHub"
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800 text-slate-300"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <GithubIcon size={15} />
                    </motion.a>
                  )}
                  {cv.linkedinUrl && (
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={cv.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="LinkedIn"
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800 text-slate-300"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <LinkedinIcon size={15} />
                    </motion.a>
                  )}
                  {cv.websiteUrl && (
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={cv.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Website"
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800 text-slate-300"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Globe size={15} />
                    </motion.a>
                  )}
                </div>
              )}
            </motion.div>

            {/* Skills Card */}
            {cv.skills?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                } print:border-none print:shadow-none print:bg-transparent print:p-0`}
              >
                <SectionTitle title={t.cvPreview.sectionSkills} icon={Sparkles} isDark={isDark} />
                <div className="space-y-6 mt-4">
                  {Object.entries(skillsByCategory).map(([cat, items]) => (
                    <div key={cat} className="space-y-3.5 print:space-y-2">
                      <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {cat}
                      </h3>
                      <div className="space-y-3 print:space-y-2">
                        {items.map((s, i) => (
                          <SkillBar key={i} skillName={s.skillName} skillLevel={s.skillLevel} isDark={isDark} t={t} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Interests Card */}
            {cv.interests?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle title={t.cvPreview.sectionInterests} icon={Heart} isDark={isDark} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {cv.interests.map((item, i) => {
                    const name = item.interestName ?? item;
                    return (
                      <span
                        key={i}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                          isDark
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                            : "bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                        }`}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* MAIN CONTENT */}
          <div
            className={`space-y-6 print:col-span-8 print:space-y-6 ${
              isMobileView ? "col-span-1" : isTabletView ? "col-span-8" : "md:col-span-8"
            }`}
          >
            {/* Career Objectives */}
            {(cv.summaryShort || cv.summaryLong) && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle
                  title={isVi ? "Mục tiêu nghề nghiệp" : "Career Objectives"}
                  icon={BookOpen}
                  isDark={isDark}
                />
                <div className="space-y-4.5 mt-4">
                  {cv.summaryShort && (
                    <div className="space-y-1">
                      <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                        {isVi ? "Mục tiêu ngắn hạn" : "Short-term Goals"}
                      </h4>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {cv.summaryShort}
                      </p>
                    </div>
                  )}
                  {cv.summaryLong && (
                    <div className="space-y-1">
                      <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                        {isVi ? "Mục tiêu dài hạn" : "Long-term Goals"}
                      </h4>
                      <div
                        className={`p-4 rounded-2xl border-l-4 leading-relaxed text-xs relative ${
                          isDark
                            ? "bg-slate-950/40 border-purple-500 text-slate-400"
                            : "bg-purple-50/20 border-purple-600 text-slate-600"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{cv.summaryLong}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Education */}
            {cv.educations?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle title={t.cvPreview.sectionEducation} icon={GraduationCap} isDark={isDark} />
                <div className="space-y-4 mt-4">
                  {cv.educations.map((e, i) => (
                    <EducationCard key={i} edu={e} t={t} isDark={isDark} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects */}
            {cv.projects?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle title={t.cvPreview.sectionProjects} icon={Briefcase} isDark={isDark} />
                <div className="relative border-l border-slate-200/60 dark:border-slate-800/60 pl-6 ml-2.5 space-y-6 mt-6">
                  {cv.projects.map((p, i) => (
                    <div key={i} className="relative">
                      <span
                        className={`absolute -left-[32.5px] top-6.5 w-4 h-4 rounded-full border-4 flex items-center justify-center ${
                          isDark ? "bg-slate-950 border-blue-500" : "bg-slate-50 border-blue-600"
                        }`}
                      />
                      <ProjectCard p={p} t={t} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Activities */}
            {cv.activities?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle title={t.cvPreview.sectionActivities} icon={BookOpen} isDark={isDark} />
                <div className="space-y-4 mt-4">
                  {cv.activities.map((a, i) => (
                    <ActivityCard key={i} act={a} t={t} isDark={isDark} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {cv.certifications?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-3xl border ${
                  isDark
                    ? "bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl"
                    : "bg-white border-slate-200/60 shadow-md"
                }`}
              >
                <SectionTitle title={t.cvPreview.sectionCertifications} icon={Award} isDark={isDark} />
                <div className="space-y-4 mt-4">
                  {cv.certifications.map((c, i) => (
                    <CertificationCard key={i} cert={c} t={t} isDark={isDark} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body, html {
            background: ${isDark ? "#020617" : "#f8fafc"} !important;
            color: ${isDark ? "#cbd5e1" : "#334155"} !important;
            overflow: visible !important;
            width: 100% !important;
          }
          #root {
            overflow: visible !important;
            width: 100% !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 8mm 10mm 8mm;
          }
          .cv-print-root {
            overflow: visible !important;
            width: 100% !important;
          }
          .print-hidden {
            display: none !important;
          }
          .rounded-3xl {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .rounded-2xl {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default CVRenderer;
