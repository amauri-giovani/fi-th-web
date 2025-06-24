import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";


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
      setInputValue(""); // reset after confirm
    }
  };

  const handleClose = () => {
    setInputValue("");
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {message && <p className="text-sm text-gray-600 mb-2">{message}</p>}
        <input
          type="text"
          className="w-full border px-3 py-2 mt-2 rounded"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </div>
      </div>
    </Modal>
  );
}
