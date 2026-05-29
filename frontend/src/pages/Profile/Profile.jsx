import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, CheckCircle, KeyRound, Eye, EyeOff } from "lucide-react";
import {
  fetchProfile,
  selectProfile,
  selectProfileLoading,
} from "@/store/slices/profileSlice";
import { changePassword } from "@/services/authService";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/Button/Button";
import { toast } from "sonner";
import dayjs from "dayjs";
import useT from "@/hooks/useT";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value ?? "—"}</p>
    </div>
  </div>
);

// ── Password field with show/hide toggle ──
const PwdField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const profile  = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileLoading);
  const t = useT();

  // ── Change password state ──
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  const STATUS_INFO = {
    1: { label: t.profile.active, color: "bg-green-100 text-green-700" },
    0: { label: t.profile.locked, color: "bg-red-100 text-red-600"    },
  };

  const statusInfo = STATUS_INFO[profile?.status] ?? { label: t.profile.unknown, color: "bg-gray-100 text-gray-600" };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      return toast.error(t.profile.fillAll);
    }
    if (pwForm.next !== pwForm.confirm) {
      return toast.error(t.profile.passwordMismatch);
    }
    if (pwForm.next.length < 6) {
      return toast.error(t.profile.passwordTooShort);
    }
    try {
      setPwSaving(true);
      await changePassword(pwForm.current, pwForm.next);
      toast.success(t.profile.changePasswordSuccess);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      const msg = err?.response?.data?.errors?.[0] ?? err?.response?.data?.message ?? t.profile.changePasswordFail;
      toast.error(msg);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900">{t.profile.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.profile.subtitle}</p>
      </motion.div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Avatar row */}
        <div className="flex items-center gap-4 pb-4 mb-2 border-b border-gray-50">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {profile?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{profile?.username ?? "—"}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <InfoRow icon={User}        label={t.profile.username}    value={profile?.username} />
        <InfoRow icon={Mail}        label={t.profile.email}       value={profile?.email} />
        <InfoRow icon={Shield}      label={t.profile.role}        value={profile?.role?.roleName} />
        <InfoRow icon={CheckCircle} label={t.profile.status}      value={statusInfo.label} />
        <InfoRow icon={Calendar}    label={t.profile.createdDate} value={profile?.createdDate ? dayjs(profile.createdDate).format("DD/MM/YYYY HH:mm") : null} />
        <InfoRow icon={Calendar}    label={t.profile.updatedDate} value={profile?.updatedDate ? dayjs(profile.updatedDate).format("DD/MM/YYYY HH:mm") : null} />
      </div>

      {/* ── Change password ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <KeyRound size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{t.profile.changePassword}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.profile.changePasswordSub}</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PwdField
            label={t.profile.currentPassword}
            value={pwForm.current}
            onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
            placeholder="••••••••"
          />
          <PwdField
            label={t.profile.newPassword}
            value={pwForm.next}
            onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
            placeholder="••••••••"
          />
          <PwdField
            label={t.profile.confirmPassword}
            value={pwForm.confirm}
            onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
            placeholder="••••••••"
          />
          <Button type="submit" isLoading={pwSaving} className="w-full sm:w-auto px-6">
            {t.profile.changePasswordBtn}
          </Button>
        </form>
      </div>

      <p className="text-xs text-gray-400 text-center">
        {t.profile.contactAdmin}
      </p>
    </div>
  );
};

export default Profile;
