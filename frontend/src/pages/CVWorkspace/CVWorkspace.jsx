import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Eye, Settings, Clock, FilePlus, ExternalLink } from "lucide-react";
import dayjs from "dayjs";
import {
  fetchMyCVDetail,
  saveCVStatus,
  selectMyCVDetail,
  selectCVLoading,
  selectCVSaving,
  selectCVSavingSection,
  selectCVLastSaved,
  selectCVError,
} from "@/store/slices/cvProfileSlice";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { createCVProfile } from "@/services/cvProfileService";
import Loading from "@/components/Loading/Loading";
import useT from "@/hooks/useT";

import GeneralInfoTab  from "./tabs/GeneralInfoTab";
import SkillsTab       from "./tabs/SkillsTab";
import ProjectsTab     from "./tabs/ProjectsTab";
import EducationsTab   from "./tabs/EducationsTab";
import CertificationsTab from "./tabs/CertificationsTab";
import InterestsTab    from "./tabs/InterestsTab";
import ActivitiesTab   from "./tabs/ActivitiesTab";

// ============================================================
// CV WORKSPACE PAGE
// ============================================================
const CVWorkspace = () => {
  const dispatch = useDispatch();
  const cv       = useSelector(selectMyCVDetail);
  const isLoading  = useSelector(selectCVLoading);
  const isSaving   = useSelector(selectCVSaving);
  const savingSection = useSelector(selectCVSavingSection);
  const lastSaved  = useSelector(selectCVLastSaved);
  const user       = useSelector(selectCurrentUser);
  const error      = useSelector(selectCVError);
  const t = useT();

  const TABS = [
    { key: "general",        label: t.workspace.tabGeneral },
    { key: "skills",         label: t.workspace.tabSkills },
    { key: "projects",       label: t.workspace.tabProjects },
    { key: "educations",     label: t.workspace.tabEducations },
    { key: "certifications", label: t.workspace.tabCertifications },
    { key: "interests",      label: t.workspace.tabInterests },
    { key: "activities",     label: t.workspace.tabActivities },
  ];

  const STATUS_OPTIONS = [
    { value: "DRAFT",     label: t.workspace.statusDraft },
    { value: "PUBLISHED", label: t.workspace.statusPublished },
    { value: "HIDDEN",    label: t.workspace.statusHidden },
  ];

  const [activeTab, setActiveTab] = useState("general");
  const [createForm, setCreateForm] = useState({ fullName: "", title: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!cv) dispatch(fetchMyCVDetail());
  }, [dispatch, cv]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.fullName.trim()) {
      toast.error(t.workspace.fullNameRequired);
      return;
    }
    setIsCreating(true);
    try {
      await createCVProfile(createForm);
      toast.success(t.workspace.createSuccess);
      dispatch(fetchMyCVDetail());
    } catch {
      toast.error(t.workspace.createFail);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const result = await dispatch(saveCVStatus({ status: newStatus }));
    if (saveCVStatus.fulfilled.match(result)) {
      toast.success(`${t.workspace.statusChanged} "${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}"`);
    } else {
      toast.error(result.payload ?? t.workspace.statusChangeFail);
    }
  };

  if (isLoading && !cv) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!cv && error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-50">
              <FilePlus size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.workspace.noCV}</h2>
              <p className="text-xs text-gray-400">{t.workspace.noCVSub}</p>
            </div>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{t.workspace.fullNameLabel} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={createForm.fullName}
                onChange={(e) => setCreateForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder={t.workspace.fullNamePlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{t.workspace.titleLabel}</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm(f => ({ ...f, title: e.target.value }))}
                placeholder={t.workspace.titlePlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isCreating ? t.workspace.creating : t.workspace.createCV}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabProps = { cv, isSaving: isSaving && savingSection };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-semibold text-gray-900 text-sm">CV Workspace</h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            {lastSaved ? (
              <><Clock size={11} /> {t.workspace.lastSaved}: {dayjs(lastSaved).format("HH:mm DD/MM")}</>
            ) : (
              <><Settings size={11} /> {t.workspace.editing}</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status dropdown */}
          <select
            value={cv?.status ?? "DRAFT"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {isSaving && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600">
              <Loading size="sm" color="blue" />
              {t.common.saving}
            </span>
          )}

          {/* Preview & Online links */}
          <Link
            to="/cv-preview"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={13} />
            {t.cvPreview.title}
          </Link>

          {cv?.status === "PUBLISHED" && user?.username && (
            <a
              href={`/cv/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={13} />
              {t.workspace.viewOnline}
            </a>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
              {activeTab === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "general"        && <GeneralInfoTab    {...tabProps} />}
          {activeTab === "skills"         && <SkillsTab         {...tabProps} />}
          {activeTab === "projects"       && <ProjectsTab       {...tabProps} />}
          {activeTab === "educations"     && <EducationsTab     {...tabProps} />}
          {activeTab === "certifications" && <CertificationsTab {...tabProps} />}
          {activeTab === "interests"      && <InterestsTab      {...tabProps} />}
          {activeTab === "activities"     && <ActivitiesTab     {...tabProps} />}
        </motion.div>
      </div>
    </div>
  );
};

export default CVWorkspace;
