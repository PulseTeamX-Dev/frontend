import { useNavigate } from "react-router-dom";
import checkImg from "../../assets/img/check.png";
import { Title } from "../../shared/Title";

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

      <button
        onClick={handleGoToDashboard}
        className="w-full py-3.5 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors shadow-md shadow-orange-100"
      >
        Перейти до дашборду
      </button>
    </div>
  );
};

export default AuthSuccess;
