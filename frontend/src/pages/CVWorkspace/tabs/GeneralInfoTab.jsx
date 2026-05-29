import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { saveCVGeneralInfo } from "@/store/slices/cvProfileSlice";
import { uploadCVAvatar } from "@/services/cvProfileService";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import useT from "@/hooks/useT";
// Schema stays outside — Zod messages are static
const schema = z.object({
  fullName:     z.string().min(1, "Required"),  title:        z.string().optional(),  email:        z.string().email("Invalid email").optional().or(z.literal("")),  phone:        z.string().optional(),  address:      z.string().optional(),  githubUrl:    z.string().url("Invalid URL").optional().or(z.literal("")),  linkedinUrl:  z.string().url("Invalid URL").optional().or(z.literal("")),  websiteUrl:   z.string().url("Invalid URL").optional().or(z.literal("")),  birthday:     z.string().optional(),  summaryShort: z.string().optional(),  summaryLong:  z.string().optional(),});
const GeneralInfoTab = ({ cv, isSaving }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(cv?.avatarUrl ?? null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const t = useT();
  // Build FIELDS inside component so labels are reactive to language
  const FIELDS = [    { name: "fullName",    label: t.tabs.fieldFullName,  type: "text",  half: false },    { name: "title",       label: t.tabs.fieldTitle,     type: "text",  half: true  },    { name: "email",       label: t.tabs.fieldEmail,     type: "email", half: true  },    { name: "phone",       label: t.tabs.fieldPhone,     type: "tel",   half: true  },    { name: "birthday",    label: t.tabs.fieldBirthday,  type: "date",  half: true  },    { name: "address",     label: t.tabs.fieldAddress,   type: "text",  half: true  },    { name: "githubUrl",   label: t.tabs.fieldGithub,    type: "url",   half: true  },    { name: "linkedinUrl", label: t.tabs.fieldLinkedin,  type: "url",   half: true  },    { name: "websiteUrl",  label: t.tabs.fieldWebsite,   type: "url",   half: false },  ];
  const {
    register,    handleSubmit,    formState: { errors, isDirty },  } = useForm({
    resolver: zodResolver(schema),    defaultValues: {
      fullName:     cv?.fullName     ?? "",      title:        cv?.title        ?? "",      email:        cv?.email        ?? "",      phone:        cv?.phone        ?? "",      address:      cv?.address      ?? "",      birthday:     cv?.birthday     ?? "",      githubUrl:    cv?.githubUrl    ?? "",      linkedinUrl:  cv?.linkedinUrl  ?? "",      websiteUrl:   cv?.websiteUrl   ?? "",      summaryShort: cv?.summaryShort ?? "",      summaryLong:  cv?.summaryLong  ?? "",    },  });
  const onSubmit = async (data) => {
    const result = await dispatch(saveCVGeneralInfo(data));
    if (saveCVGeneralInfo.fulfilled.match(result)) {
      toast.success(t.tabs.saveGeneralOk);
    } else {
      toast.error(result.payload ?? t.tabs.saveFail);
    }  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingAvatar(true);
    try {
      const result = await uploadCVAvatar(file);
      setAvatarPreview(result.avatarUrl);
      toast.success(t.tabs.avatarUpdated);
    } catch {
      toast.error(t.tabs.avatarUploadFail);
      setAvatarPreview(cv?.avatarUrl ?? null);
    } finally {
      setIsUploadingAvatar(false);
    }  };
  return (    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">      {/* Avatar upload */}      <div className="flex items-center gap-5">        <div          className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center hover:border-blue-400 transition-colors"          onClick={() => fileInputRef.current?.click()}          title={t.tabs.choosePhoto}        >          {avatarPreview ? (            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />          ) : (            <span className="text-3xl text-gray-400">📷</span>          )}          {isUploadingAvatar && (            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">              <span className="text-white text-xs">{t.tabs.uploading}</span>            </div>          )}        </div>        <div>          <p className="text-sm font-medium text-gray-700">{t.tabs.avatarTitle}</p>          <p className="text-xs text-gray-500 mt-1">{t.tabs.avatarSubtitle}</p>          <button            type="button"            onClick={() => fileInputRef.current?.click()}            className="mt-2 text-xs text-blue-600 hover:underline"          >            {t.tabs.choosePhoto}          </button>        </div>        <input          ref={fileInputRef}          type="file"          accept="image/jpeg,image/png,image/webp,image/gif"          className="hidden"          onChange={handleAvatarChange}        />      </div>      {/* Field grid */}      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">        {FIELDS.map(({ name, label, type, half }) => (          <div key={name} className={half ? "" : "sm:col-span-2"}>            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>            <input              type={type}              {...register(name)}              className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[name]                  ? "border-red-400 bg-red-50"                  : "border-gray-200 bg-white hover:border-gray-300"              }`}            />            {errors[name] && (              <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>            )}          </div>        ))}      </div>      {/* Summary short */}      <div>        <label className="block text-sm font-medium text-gray-700 mb-1">          {t.tabs.summaryShort}          <span className="ml-1 text-xs text-gray-400 font-normal">{t.tabs.summaryShortSub}</span>        </label>        <textarea          {...register("summaryShort")}          rows={4}          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 resize-none"        />      </div>      {/* Summary long */}      <div>        <label className="block text-sm font-medium text-gray-700 mb-1">          {t.tabs.summaryLongLabel}          <span className="ml-1 text-xs text-gray-400 font-normal">{t.tabs.summaryLongSub}</span>        </label>        <textarea          {...register("summaryLong")}          rows={3}          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 resize-none"        />      </div>      <Button        type="submit"        isLoading={isSaving}        disabled={!isDirty || isSaving}        className="px-6"      >        {t.tabs.saveGeneralBtn}      </Button>    </form>  );};
export default GeneralInfoTab;
