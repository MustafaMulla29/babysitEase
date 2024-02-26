import LoadingAnimation from "./../lotties/loading_3.json";
import Lottie from "react-lottie";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        width={100}
        height={100}
      />
    </>
  );
};

export default Loading;
