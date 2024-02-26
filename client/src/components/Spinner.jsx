// import HashLoader from "react-spinners/HashLoader";
import LoadingAnimation from "./../lotties/loading_3.json";
import Lottie from "react-lottie";

const Spinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100%] bg-slate-300 relative z-[9999999]">
      {/* <HashLoader loading={true} color="#343998" /> */}
      {/* <video
        src="./../../img/Untitled design (1).mp4"
        autoPlay
        width={300}
        height={300}
        loop
        muted
      ></video> */}
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Spinner;
