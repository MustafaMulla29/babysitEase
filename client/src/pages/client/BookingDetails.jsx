import {
  Typography,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { FaRegClock, FaUser } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import PropTypes from "prop-types";
import { CgTrash } from "react-icons/cg";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { PiBaby } from "react-icons/pi";
import { FaHandHoldingMedical } from "react-icons/fa6";
import moment from "moment";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from "react-router-dom";
import { openAlert } from "../../redux/features/messageSlice";
import { CiLocationOn } from "react-icons/ci";

const BookingDetails = ({ booking }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { user } = useSelector((state) => state.user);

  const cancelBooking = async (bookingId) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/cancelBooking",
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
      dispatch(
        openAlert({
          severity: "error",
          content: "Something went wrong",
        })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  const bookedOnDate = moment(booking?.bookedOn).format("DD/MM/YYYY");
  const jobDate = moment(booking?.date).format("DD/MM/YYYY");
  const endDate = moment(booking?.endDate).format("DD/MM/YYYY");

  return (
    <>
      <div className="max-w-sm bg-white relative m-2 px-8 pt-8 py-3 rounded-lg shadow-md border border-[#d6cfcf] min-h-[18rem]">
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            alt="Profile Picture"
            src={`http://localhost:8070/${booking?.caregiverProfilePicture}`}
            sx={{ width: 70, height: 70, borderRadius: "10px" }}
          />
          <Divider orientation="vertical" variant="middle" flexItem />

          <div className="flex items-start flex-col gap-1">
            <Typography
              variant="h5"
              className="hover:underline hover:underline-offset-2 cursor-pointer transition-[underline]"
              onClick={() => navigate(`/caregiver/${booking?.caregiverId}`)}
            >
              {booking.caregiverName}
            </Typography>

            <Chip label={booking.caregiverRole} />
          </div>
        </div>
        <div className="my-2">
          <Typography variant="span" className="flex gap-1 items-center">
            <FaUser /> {bookedOnDate}
          </Typography>
        </div>
        <Divider variant="middle" component="p" />
        <div className=" flex items-center  gap-2 flex-row flex-wrap my-2">
          <Typography variant="span">
            <span className="flex items-center gap-3 ">
              <BsCalendarDate className="text-lg" />
              {jobDate}
            </span>
          </Typography>
          <span>-</span>
          <Typography variant="span">
            <span className="flex items-center gap-3">
              <BsCalendarDate className="text-lg" />
              {endDate}
            </span>
          </Typography>
        </div>
        <Divider variant="middle" component="p" />
        <div className="my-2">
          <Typography variant="span" className="flex items-center gap-1">
            {booking.dependentType === "Child" ? (
              <PiBaby className="text-lg" />
            ) : (
              <FaHandHoldingMedical className="text-lg" />
            )}{" "}
            {booking.bookedFor}
          </Typography>
        </div>
        <Divider variant="middle" component="p" />
        <div className="my-2">
          <Typography
            variant="span"
            className="flex items-center gap-1 truncate"
          >
            <CiLocationOn className="text-lg" />
            {booking.jobAddress ? booking.jobAddress : user?.address}
          </Typography>
        </div>

        <Typography
          variant="span"
          className={`flex items-center gap-1 absolute top-0 right-0 ${
            booking.status === "Pending"
              ? "bg-orange-400"
              : booking.status === "Approved"
              ? "bg-blue-500"
              : booking.status === "Completed"
              ? "bg-green-500"
              : "bg-red-500"
          } text-[12px] px-2 py-1 rounded-bl-lg rounded-tr-lg text-white flex items-center`}
        >
          {booking.status === "Pending" ? (
            <FaRegClock className="text-sm" />
          ) : booking.status === "Approved" ? (
            <AiFillCheckCircle className="text-sm" />
          ) : booking.status === "Completed" ? (
            <AiFillCheckCircle className="text-sm" />
          ) : (
            <AiFillCloseCircle className="text-sm" />
          )}
          {booking.status === "Nullified" ? (
            <Tooltip
              TransitionComponent={Zoom}
              title="Accepted nor rejected by caregiver"
            >
              <Typography variant="span">{booking.status}</Typography>
            </Tooltip>
          ) : (
            booking.status
          )}
        </Typography>

        {booking.status === "Pending" && (
          <div className="text-right">
            <Button
              variant="outlined"
              onClick={handleOpen}
              className="gap-2"
              color="error"
            >
              Cancel <CgTrash className="text-xl text-red-500" />
            </Button>
          </div>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        className="max-w-sm items-center m-auto"
      >
        <div className="p-3">
          <Typography className="flex items-center justify-center ">
            <span className="text-red-700 bg-red-200 p-3 rounded-full">
              <AiOutlineWarning className="text-xl" />
            </span>
          </Typography>
          <DialogTitle variant="h5" className="text-center font-bold">
            Confirm Cancellation
          </DialogTitle>
          <DialogContent className="text-center">
            <Typography variant="p" className="text-center">
              Are you sure you want to cancel this booking? This booking will be
              cancelled and deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <div className="flex items-center justify-center flex-col w-full gap-3">
              <Button
                onClick={() => cancelBooking(booking?._id)}
                variant="contained"
                color="success"
                className=" w-full bg-[#d32f2f] hover:bg-[#c62828]"
              >
                Yes
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                className="w-full text-black border-black hover:border-gray-600"
              >
                No
              </Button>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    caregiverProfilePicture: PropTypes.string,
    caregiverId: PropTypes.string,
    caregiverName: PropTypes.string,
    caregiverRole: PropTypes.string,
    date: PropTypes.string,
    endDate: PropTypes.string,
    bookedOn: PropTypes.string,
    bookedFor: PropTypes.string,
    dependentType: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    _id: PropTypes.string,
    jobAddress: PropTypes.string,
  }).isRequired,
};

export default BookingDetails;
