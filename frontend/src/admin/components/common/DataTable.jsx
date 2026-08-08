import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from 'lucide-react';

export default function DataTable({
    data = [],
    columns = [],
    loading = false,
    totalCount = 0,
    page = 1,
    pageSize = 20,
    onPageChange,
    onSearch,
    searchPlaceholder = 'Search…',
    onExport,
    emptyMessage = 'No records found',
    id = 'data-table',
}) {
    const [searchValue, setSearchValue] = useState('');
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const handleSearch = (v) => {
        setSearchValue(v);
        onSearch?.(v);
    };

    const skeleton = useMemo(
        () => Array.from({ length: pageSize }, (_, i) => i),
        [pageSize]
    );

    return (
        <div id={id} className="flex flex-col gap-3">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                {onSearch !== undefined && (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 flex-1 min-w-48 max-w-xs shadow-xs">
                        <Search size={14} className="text-slate-400 shrink-0" />
                        <input
                            id={`${id}-search`}
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none w-full"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 ml-auto">
                    <span>{totalCount} records</span>
                    {onExport && (
                        <button
                            id={`${id}-export-btn`}
                            onClick={onExport}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition shadow-xs"
                        >
                            <Download size={13} className="text-[#55b32b]" />
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3.5 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                        {loading
                            ? skeleton.map((i) => (
                                <tr key={i} className="bg-white">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3">
                                            <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: col.skeletonWidth || '80%' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : data.length === 0
                            ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 font-medium">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )
                            : data.map((row, i) => (
                                <tr
                                    key={row._id || row.id || i}
                                    className="bg-white hover:bg-slate-50/80 transition-colors text-slate-800"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                                            {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Page {page} of {totalPages}</span>
                    <div className="flex items-center gap-1">
                        <PagBtn onClick={() => onPageChange(1)} disabled={page === 1} id={`${id}-first`}><ChevronsLeft size={14} /></PagBtn>
                        <PagBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} id={`${id}-prev`}><ChevronLeft size={14} /></PagBtn>
                        <PagBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} id={`${id}-next`}><ChevronRight size={14} /></PagBtn>
                        <PagBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages} id={`${id}-last`}><ChevronsRight size={14} /></PagBtn>
                    </div>
                </div>
            )}
        </div>
    );
}

function PagBtn({ children, disabled, onClick, id }) {
    return (
        <button
            id={id}
            onClick={onClick}
            disabled={disabled}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white
                       text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-xs"
        >
            {children}
        </button>
    );
}
