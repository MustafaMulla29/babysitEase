import noNotification from "./../lotties/no_notification.json";
import Lottie from "react-lottie";
const NoNotifications = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noNotification,
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

export default NoNotifications;
