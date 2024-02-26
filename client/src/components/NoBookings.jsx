import noBooking from "./../lotties/no_bookings.json";
import Lottie from "react-lottie";

const NoBookings = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noBooking,
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

export default NoBookings;
