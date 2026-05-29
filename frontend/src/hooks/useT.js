import { useSelector } from "react-redux";
import { selectLang } from "@/store/slices/languageSlice";
import translations from "@/i18n/translations";

/**
 * useT — trả về object translation theo ngôn ngữ đang chọn.
 * @example
 *   const t = useT();
 *   <button>{t.common.save}</button>
 */
const useT = () => {
  const lang = useSelector(selectLang);
  return translations[lang] ?? translations.vi;
};

export default useT;
