import React from "react";

interface ShareModalProps {
  shareId: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ shareId, onClose }) => {
  const shareUrl = `${window.location.origin}/pdf/share/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Share PDF</h2>
        <p className="text-gray-700 mb-3">Share this link to give others access:</p>
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-sm"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            📋 Copy Link
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
