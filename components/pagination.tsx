// components/pagination
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const prev = () => onPageChange(Math.max(1, currentPage - 1));
    const next = () => onPageChange(Math.min(totalPages, currentPage + 1));

    return (
        <div className="flex items-center gap-4 mt-8">
            <button
                onClick={prev}
                disabled={currentPage <= 1}
                className={`px-4 py-2 rounded-md ${currentPage <= 1 ? "opacity-40 cursor-not-allowed bg-green-800" : "bg-green-500 hover:bg-green-600"}`}
            >
                ◀ Anterior
            </button>

            <div className="px-4 py-2 rounded bg-black/40 text-green-200">
                Página {currentPage} / {totalPages}
            </div>

            <button
                onClick={next}
                disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded-md ${currentPage >= totalPages ? "opacity-40 cursor-not-allowed bg-green-800" : "bg-green-500 hover:bg-green-600"}`}
            >
                Siguiente ▶
            </button>
        </div>
    );
}
