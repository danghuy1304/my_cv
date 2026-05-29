import { useState, useMemo, useEffect } from "react";
import { getMyCVAccessLogs } from "@/services/cvProfileService";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Activity,
  X,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useT from "@/hooks/useT";

const DEVICE_ICON = {
  Desktop: Monitor,
  Mobile:  Smartphone,
  Tablet:  Tablet,
};

// ============================================================
// DETAIL DRAWER
// ============================================================
const DetailDrawer = ({ log, onClose, title }) => (
  <AnimatePresence>
    {log && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.25 }}
          className="fixed right-0 top-0 z-50 w-80 h-full bg-white shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {Object.entries(log)
              .filter(([k]) => k !== "id")
              .map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs text-gray-400 capitalize mb-0.5">{key}</p>
                  <p className="text-sm text-gray-800 font-medium break-all">
                    {key === "timestamp"
                      ? new Date(val).toLocaleString("vi-VN")
                      : val}
                  </p>
                </div>
              ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ============================================================
// ACCESS LOGS PAGE
// ============================================================
const AccessLogs = () => {
  const t = useT();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting]           = useState([{ id: "accessedTime", desc: true }]);
  const [selectedLog, setSelectedLog]   = useState(null);
  const [logs, setLogs]                 = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    getMyCVAccessLogs(100)
      .then(setLogs)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Build COLUMNS inside component so headers are reactive to language
  const COLUMNS = useMemo(() => [
    {
      accessorKey: "accessedTime",
      header: t.accessLogs.colTime,
      cell: ({ getValue }) => new Date(getValue()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "ipAddress",
      header: t.accessLogs.colIP,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-gray-600">{getValue()}</span>
      ),
    },
    { accessorKey: "browser",         header: t.accessLogs.colBrowser },
    { accessorKey: "operatingSystem", header: t.accessLogs.colOS },
    {
      accessorKey: "deviceType",
      header: t.accessLogs.colDevice,
      cell: ({ getValue }) => {
        const val = getValue();
        const Icon = DEVICE_ICON[val] ?? Monitor;
        return (
          <span className="flex items-center gap-1.5 text-gray-600">
            <Icon size={13} />
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "referer",
      header: t.accessLogs.colReferer,
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-500 max-w-[160px] truncate block">{getValue() ?? "—"}</span>
      ),
    },
    {
      accessorKey: "locationCountry",
      header: t.accessLogs.colCountry,
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1 text-gray-600">
          <Globe size={12} />
          {getValue() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "locationCity",
      header: t.accessLogs.colCity,
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() ?? "—"}</span>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [t.accessLogs.colTime]); // re-memo when language changes

  const data = useMemo(() => logs, [logs]);

  const table = useReactTable({
    data,
    columns: COLUMNS,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity size={22} className="text-blue-600" />
            {t.accessLogs.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t.accessLogs.subtitle}</p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-400 text-sm">{t.accessLogs.loading}</div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t.accessLogs.searchPlaceholder}
            className="flex-1 max-w-sm border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">
            {table.getFilteredRowModel().rows.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-gray-50 border-b border-gray-100">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-gray-700"
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"  && <ChevronUp size={12} />}
                        {header.column.getIsSorted() === "desc" && <ChevronDown size={12} />}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedLog(row.original)}
                  className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-10 text-gray-400 text-sm">
                    {t.accessLogs.noLogs}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            {t.accessLogs.prev && table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <DetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} title={t.accessLogs.detail} />
    </div>
  );
};

export default AccessLogs;
