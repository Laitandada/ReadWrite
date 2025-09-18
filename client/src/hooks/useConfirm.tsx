import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";



export function useConfirm() {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [options, setOptions] = useState<{ message: string; title?: string } | null>(null);

  const confirm = (message: string, title?: string): Promise<boolean> => {
    setOptions({ message, title });
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    setPromise(null);
    setOptions(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    setPromise(null);
    setOptions(null);
  };

  const ConfirmUI = () =>
    options ? (
      <ConfirmModal
        open={true}
        title={options.title}
        message={options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ) : null;

  return { confirm, ConfirmUI };
}
