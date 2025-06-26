import type { ReactNode } from "react";
import Button from "./Button";

type Props = {
  isOpen: boolean;
  title?: string;
  message?: ReactNode;
  onClose: () => void;
};

export default function Modal({ isOpen, title, message, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 relative">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {message && <p className="text-sm text-gray-700 mb-6">{message}</p>}
        <div className="flex justify-end">
          <Button onClick={onClose} rounded>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
