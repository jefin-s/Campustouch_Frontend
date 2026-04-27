import React from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
  searchPlaceholder   // when provided, render ONLY a search bar (no filter dropdown / apply btn)
}) => {
  return (
    <div className="mgmt-card">
      <div className="mgmt-header">
        <div className="mgmt-header-top">
          <div className="mgmt-title-group">
            <h2>{title}</h2>
            <span className="count-badge">{pagination.total} {title.toLowerCase()}</span>
          </div>
          <button className="add-btn" onClick={onAdd}>
            <Plus size={18} />
            <span>Add New {title.replace(' Management', '')}</span>
          </button>
        </div>
        
        <div className="mgmt-filters-row">
          {searchPlaceholder ? (
            /* Simple search-only bar */
            <div className="search-input search-input--wide">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder={searchPlaceholder} />
            </div>
          ) : (
            /* Full filter bar */
            <>
              <div className="search-wrapper">
                <div className="search-input">
                  <Search size={18} />
                  <input type="text" placeholder={`Search by name, ID or email...`} />
                </div>
                <div className="filter-dropdown-mock">
                  <span>Filter by Status</span>
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
              <button className="apply-filters-btn">
                <Filter size={18} />
                <span>Apply filters</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="table-loader">
            <Loader2 className="animate-spin" size={40} />
            <p>Loading {title.toLowerCase()}...</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col.header}</th>
                ))}
                <th className="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                    <td className="action-col">
                      <div className="row-actions">
                        <button 
                          className="icon-action edit" 
                          title="Edit"
                          onClick={() => onEdit(row)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="icon-action delete" 
                          title="Delete"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="empty-state">
                    No {title.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.total > pagination.pageSize && (
        <div className="table-footer">
          <div className="pagination-info">
            Showing {((pagination.current - 1) * pagination.pageSize) + 1} to {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} entries
          </div>
          <div className="pagination-controls">
            <button 
              disabled={pagination.current === 1} 
              onClick={() => onPageChange(pagination.current - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-num">{pagination.current}</span>
            <button 
              disabled={pagination.current * pagination.pageSize >= pagination.total} 
              onClick={() => onPageChange(pagination.current + 1)}
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
