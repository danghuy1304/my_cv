import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import useT from '@/hooks/useT';

// ============================================================
// NOT FOUND PAGE — 404
// ============================================================
const NotFound = () => {
  const t = useT();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Số 404 lớn */}
        <div className="relative mb-8">
          <p className="text-[150px] font-black text-slate-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          {t.notFound.title}
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {t.notFound.sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium
                       hover:bg-slate-100 transition-colors"
          >
            {t.notFound.back}
          </button>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium
                       hover:bg-blue-700 transition-colors"
          >
            {t.notFound.home}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
