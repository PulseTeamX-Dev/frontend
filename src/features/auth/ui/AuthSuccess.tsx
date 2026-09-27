import { useNavigate } from "react-router-dom";
import checkImg from "../../../assets/img/check.png";
import { Title } from "@/shared/ui/Title";
import { Button } from "@/shared/ui/Button";

const AuthSuccess = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full flex flex-col items-center text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <img src={checkImg} alt="Успіх" className="w-[80px] h-[80px]" />
      </div>

      <Title
        tag="h2"
        variant="bold"
        className="text-2xl text-grayscale-900 mb-2"
      >
        Обліковий запис створено!
      </Title>

      <p className="text-[14px] text-light-txt mb-8 max-w-[280px]">
        Ви авторизовані в PulseTeamX.
      </p>

      <Button
        variant="primary"
        onClick={handleGoToDashboard}
        className="w-full py-3.5 transition-colors"
      >
        Перейти до дашборду
      </Button>
    </div>
  );
};

export default AuthSuccess;
