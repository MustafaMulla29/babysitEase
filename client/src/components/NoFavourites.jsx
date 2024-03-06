import noFavourites from "./../lotties/no_favourites.json";
import Lottie from "react-lottie";

const NoFavourites = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noFavourites,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        width={400}
        height={400}
      />
    </>
  );
};

export default NoFavourites;
