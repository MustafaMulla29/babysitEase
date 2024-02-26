import { Alert, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "../redux/features/messageSlice";

const AlertComponent = ({ severity, content }) => {
  const dispatch = useDispatch();

  const { open } = useSelector((state) => state.message);

  setTimeout(() => {
    dispatch(closeAlert());
  }, 2000);
  return (
    <div className="flex items-center justify-center">
      <Slide
        direction="down"
        in={open}
        className="fixed top-[2%] z-[9999999999999] min-w-[15rem] shadow-lg"
      >
        <Alert
          severity={severity}
          onClose={() => dispatch(closeAlert())}
          // variant="filled"
          className="transition-[display] duration-200   m-auto "
        >
          {content}
        </Alert>
      </Slide>
    </div>
  );
};

export default AlertComponent;
