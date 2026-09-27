import { Oval } from "react-loader-spinner";

export const PageLoader = () => {
  return (
    // Обертка розтягується на всю доступну висоту/ширину і центрує спінер
    <div className="flex-1 flex items-center justify-center min-h-[50vh] w-full py-20">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#fb8500"
        secondaryColor="#ffe6d1"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
