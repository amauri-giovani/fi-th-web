import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import Input from "./Input";


type Props = {
  title: string;
  message?: string;
  isOpen: boolean;
  placeholder?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

export default function InputModal({
  title,
  message,
  isOpen,
  placeholder = "",
  onConfirm,
  onCancel,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue("");
    }
  };

  const handleCancel = () => {
    setInputValue("");
    onCancel();
  };

  useEffect(() => {
    if (!isOpen) setInputValue("");
  }, [isOpen]);

  return (
    <ConfirmModal
      title={title}
      message={
        <div className="space-y-2">
          {message && <p className="text-sm text-gray-600">{message}</p>}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>
      }
      isOpen={isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
