import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../shared/Input";
import { Button } from "../../shared/Button";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { email: string }) => void;
  isSubmitting: boolean;
}

export const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
}: AddTeamMemberModalProps) => {
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit((data) => {
          onAdd(data);
          reset();
        })}
        className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Додати учасника
        </h3>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-500">
            Email учасника
          </label>
          <Input
            type="email"
            placeholder="email@gmail.com"
            className="h-12 text-base mt-2"
            {...register("email", { required: true })}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="secondary"
            className="h-12 px-6"
            onClick={onClose}
          >
            Відмінити
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="h-12 px-6"
            disabled={isSubmitting}
          >
            Додати
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
};
