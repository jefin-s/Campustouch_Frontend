import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2,
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

const ManagementTable = ({
  title,
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  pagination = { current: 1, total: 1, pageSize: 10 },
  onPageChange,
  searchPlaceholder,
  searchValue = '',
  onSearchChange
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-[#e0e0e0] rounded-[18px] shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-6 border-b border-[#e0e0e0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-[24px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">{title}</h2>
            <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/40 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]"></span>
              {pagination.total} Total Records
            </p>
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-[#0066cc] hover:bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
            >
              <Plus size={16} />
              Add {title.replace(' Management', '')}
            </button>
          )}
        </div>

        {/* Search */}
        {(searchPlaceholder || onSearchChange) && (
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30 group-focus-within:text-[#0066cc] transition-colors" />
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search records...'}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3 pl-11 pr-5 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30"
            />
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#0066cc]" size={36} />
            <p className="text-[#1d1d1f]/30 text-[12px] font-semibold uppercase tracking-[0.2em]">Fetching records...</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7]/50 border-b border-[#e0e0e0]">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-8 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-8 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {data && data.length > 0 ? (
                data.map((row, rowIdx) => (
                  <motion.tr
                    key={rowIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIdx * 0.03 }}
                    className="group hover:bg-[#f5f5f7]/30 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-8 py-4 text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/70 group-hover:text-[#1d1d1f] transition-colors">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#f5f5f7] text-[#1d1d1f]/30 hover:bg-[#0066cc]/10 hover:text-[#0066cc] transition-all"
                              title="Edit"
                              onClick={() => onEdit(row)}
                            >
                              <Edit size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#f5f5f7] text-[#1d1d1f]/30 hover:bg-red-50 hover:text-red-500 transition-all"
                              title="Delete"
                              onClick={() => onDelete(row)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center text-[#1d1d1f]/20">
                        <Search size={32} />
                      </div>
                      <p className="text-[#1d1d1f]/30 text-[14px] font-['SF Pro Text']">No records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer / Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="px-8 py-5 bg-[#f5f5f7]/30 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[12px] font-['SF Pro Text'] text-[#1d1d1f]/40">
            Showing <span className="text-[#1d1d1f] font-semibold">{((pagination.current - 1) * pagination.pageSize) + 1}</span> to <span className="text-[#1d1d1f] font-semibold">{Math.min(pagination.current * pagination.pageSize, pagination.total)}</span> of <span className="text-[#1d1d1f] font-semibold">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={pagination.current === 1}
              onClick={() => onPageChange(pagination.current - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-[#e0e0e0] text-[#1d1d1f]/30 hover:border-[#0066cc]/30 hover:text-[#0066cc] disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-10 h-10 flex items-center justify-center bg-[#0066cc] text-white rounded-[10px] text-[14px] font-semibold shadow-[rgba(0,102,204,0.3)_0_4px_12px]">
              {pagination.current}
            </div>
            <button
              disabled={pagination.current * pagination.pageSize >= pagination.total}
              onClick={() => onPageChange(pagination.current + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-[#e0e0e0] text-[#1d1d1f]/30 hover:border-[#0066cc]/30 hover:text-[#0066cc] disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementTable;
