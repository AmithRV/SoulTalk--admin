type props = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  handleLogout: () => void;
};
export default function LogoutModal({
  open = false,
  onClose,
  loading = false,
  handleLogout,
}: props) {
  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div className="bg-black/50 text-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold">Confirm Logout</h2>

          {/* Message */}
          <p className="mt-2 text-sm">
            Are you sure you want to log out of your account?
          </p>

          {/* Buttons */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-600 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
            >
              {loading ? 'Loading...' : 'Yes, Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
