import { Typography } from "@mui/material";
import Error from "./../lotties/Error404.json";
import Lottie from "react-lottie";
import { PropTypes } from "prop-types";

const Error404 = ({ message }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Error,
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
      <Typography variant="h5" className="text-center font-[karla]">
        {message}
      </Typography>
    </>
  );
};

Error404.propTypes = {
  message: PropTypes.string,
};

export default Error404;
