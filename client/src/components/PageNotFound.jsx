import notFound from "./../lotties/page_not_found.json";
import Lottie from "react-lottie";

const PageNotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: notFound,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
    </div>
  );
};

export default PageNotFound;
