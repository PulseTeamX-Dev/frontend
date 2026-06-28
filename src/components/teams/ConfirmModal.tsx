import { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "../../shared/Button";
import type { ConfirmModalProps } from "../../redux/teams/types";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  title,
  confirmText = "Підтвердити",
}: ConfirmModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl w-full  max-w-[538px] shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold mb-8 text-title leading-snug px-2">
          {title}
        </h3>

        <div className="flex justify-center gap-3 mt-8">
          <Button
            type="button"
            variant="secondary"
            className="h-12 px-6 min-w-[120px]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Відмінити
          </Button>

          <Button
            type="button"
            variant="primary"
            className={`h-12 px-6 min-w-[120px]`}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Обробка..." : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
