export default function DeleteConfirmationModal({
  msg,
  open,
  loading,
  onClose,
  onDelete,
}: {
  msg: string;
  loading: boolean;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (open)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* Modal Box */}
          <div
            className="bg-black text-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            {/* Title */}
            <h2 className="text-xl font-semibold">Delete</h2>

            {/* Message */}
            <p className="mt-2">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>

            <p className="mt-2">{msg}</p>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer font-bold"
              >
                Cancel
              </button>

              <button
                onClick={onDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer font-bold"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
