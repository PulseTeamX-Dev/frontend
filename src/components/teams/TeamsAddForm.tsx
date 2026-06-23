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
      className="w-full pb-6 border-gray-100"
    >
      <div className="w-full">
        <Input
          id="name"
          type="text"
          label="Назва команди"
          leftIcon="portfolio"
          iconClassName="text-grayscale-600"
          placeholder="Розробники"
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
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      <div className="mt-4 flex sm:justify-end justify-start">
        <Button
          type="submit"
          variant="primary"
          className="w-[166px] h-[48px] py-2.5"
          disabled={isSubmitting}
        >
          Створити команду
        </Button>
      </div>
    </form>
  );
};
