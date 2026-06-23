import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useReduxTypes";
import { createTeam, fetchTeams } from "../../redux/teams/operation";
import { Input } from "../../shared/Input";
import { Button } from "../../shared/Button";

type FormValues = {
  name: string;
};

export const TeamsAddForm = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(createTeam({ name: data.name })).unwrap();

      toast.success("Команду успішно створено!");

      await dispatch(fetchTeams()).unwrap();

      reset();
    } catch (err) {
      // Якщо бекенд повернув помилку унікальності (400) або іншу помилку
      toast.error((err as string) || "Не вдалося створити команду");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full pb-6 border-b border-gray-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex-1">
          <Input
            id="name"
            type="text"
            label="Назва команди"
            leftIcon="portfolio"
            placeholder="Наприклад: Розробники"
            disabled={isSubmitting}
            {...register("name", {
              required: "Назва команди обов'язкова",
              minLength: {
                value: 2,
                message: "Мінімальна довжина назви — 2 символи",
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 rounded-xl transition-colors disabled:bg-gray-300"
        >
          <p className="">
            {isSubmitting ? "Створення..." : "Створити команду"}
          </p>
        </Button>
      </div>
    </form>
  );
};
