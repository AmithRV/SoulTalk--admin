type props = {
  open: boolean;
  jsonData: any;
  onClose: () => void;
};

function JsonPreviewModal({ open = false, onClose, jsonData }: props) {
  const formattedJson = JSON.stringify(jsonData, null, 2);

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-black w-11/12 max-w-3xl rounded-2xl shadow-xl max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 ">
            <h2 className="text-lg font-semibold">JSON Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-600 text-xl cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-100  bg-gray-900 text-green-400 text-sm font-mono rounded-b-2xl">
            <pre>{formattedJson}</pre>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default JsonPreviewModal;
