import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, total }) {
    if (totalPages <= 1) return null;

    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-slate-800">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 order-2 sm:order-1">
                Page <span className="font-semibold text-gray-700 dark:text-gray-200">{page}</span> of{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-200">{totalPages}</span>
                {total !== undefined && (
                    <span className="text-gray-400 dark:text-slate-500 ml-2">({total} total)</span>
                )}
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={15} />
                    <span className="hidden xs:inline">Previous</span>
                </button>

                {/* Page number chips — show up to 5 on mobile */}
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => {
                            if (totalPages <= 5) return true;
                            if (p === 1 || p === totalPages) return true;
                            return Math.abs(p - page) <= 1;
                        })
                        .reduce((acc, p, i, arr) => {
                            if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === '…' ? (
                                <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-gray-400 text-sm">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                        p === page
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                                    style={p === page ? { background: 'linear-gradient(135deg, #55b32b, #41a020)' } : {}}
                                >
                                    {p}
                                </button>
                            )
                        )
                    }
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
}