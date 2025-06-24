import type { ReactNode } from "react";


type Props = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ isOpen, title, children, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 relative">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
