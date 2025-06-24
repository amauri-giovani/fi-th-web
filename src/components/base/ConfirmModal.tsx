import type { ReactNode } from "react";
import Button from "./Button";


type Props = {
  title: string;
  message: string | ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ title, message, isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={() => {onConfirm();}}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}
