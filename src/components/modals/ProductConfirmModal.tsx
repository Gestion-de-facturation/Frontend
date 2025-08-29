import React from 'react';

import '@/styles/modal.css'
import '@/styles/order.css'

type Props = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-64 overflow-y-auto modal">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3 mts">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 h-8 w-24 cursor-pointer"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#f18c08] text-white w-24 cursor-pointer"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
