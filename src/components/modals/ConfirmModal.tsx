'use client';

import '@/styles/modal.css'
import '@/styles/order.css'

type ConfirmModalProps = {
  title?: string;
  message: string;
  confirmBtn : string;
  cancelBtn: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ title, message,confirmBtn, cancelBtn, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-40 modal">
        {title && <h2 className="text-xl font-semibold text-[#14446c] mb-4 ">{title}</h2>}
        <p className="text-gray-700 mb-6 mts">{message}</p>
        <div className="flex justify-end gap-4 mts modal-btn-container">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 h-8 w-24 cursor-pointer"
          >
            {cancelBtn}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white w-24 cursor-pointer"
          >
            {confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
