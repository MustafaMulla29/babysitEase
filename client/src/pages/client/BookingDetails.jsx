import {
  Typography,
  Paper,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { FaRegClock } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import PropTypes from "prop-types";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";
import Zoom from "@mui/material/Zoom";

const BookingDetails = ({ booking }) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      dispatch(hideLoading());
    }
  };

  const bookedOnDate = moment(booking?.bookedOn).format("DD/MM/YYYY");
  const jobDate = moment(booking?.date).format("DD/MM/YYYY");

  return (
    <>
      {/* <Paper elevation={3} className="p-6 mb-8 bg-white rounded-md shadow-md">
        <Typography variant="h6" className="mb-4 text-primary">
          Booking Details
        </Typography>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <FaCalendarAlt className="w-6 h-6 mr-2 text-primary" />
            <strong className="mr-4">Status:</strong>
            <span className={`badge ${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center">
            <FaUser className="w-6 h-6 mr-2 text-primary" />
            <strong className="mr-4">Booked For:</strong>
            <span>{booking.bookedFor}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="w-6 h-6 mr-2 text-primary" />
            <strong className="mr-4">Date:</strong>
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="w-6 h-6 mr-2 text-primary" />
            <strong className="mr-4">Created At:</strong>
            <span>{new Date(booking.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </Paper> */}
      {/* <Badge badgeContent={4} color="primary">
</Badge> */}
      <Paper
        elevation={3}
        className="py-7 px-6 mb-8 relative bg-white rounded-md shadow-md"
      >
        <div>
          <div className="flex items-center justify-between">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${booking?.caregiverProfilePicture}`}
              sx={{ width: 80, height: 80 }}
            />

            <Typography>{booking.caregiverName}</Typography>
            <Typography
              className={`flex items-center gap-1 absolute top-0 right-0 ${
                booking.status === "Pending"
                  ? "bg-orange-400"
                  : booking.status === "Approved"
                  ? "bg-blue-500"
                  : booking.status === "Completed"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-[12px] px-2 py-1 rounded-bl-lg text-white flex items-center`}
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
                  {booking.status}
                </Tooltip>
              ) : (
                booking.status
              )}
            </Typography>
            <Typography>Booked on: {bookedOnDate}</Typography>

            <Typography>
              <span className="flex items-center gap-3">
                Job Date:
                <BsCalendarDate className="text-lg" />
                {jobDate}
              </span>
            </Typography>
            <Typography>For {booking.bookedFor}</Typography>

            {booking.status === "Pending" && (
              <Typography>
                <span className=" gap-3 absolute top-0 right-24">
                  <Tooltip
                    title="Cancel Booking"
                    TransitionComponent={Zoom}
                    arrow
                    placement="right-start"
                  >
                    <IconButton onClick={handleOpen}>
                      <CgTrash className="text-xl text-black" />
                    </IconButton>
                  </Tooltip>
                </span>
              </Typography>
            )}
          </div>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this booking?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => cancelBooking(booking?._id)}
              variant="contained"
              color="success"
              className="py-2 px-4 w-full bg-[#2e7d32] hover:bg-[#1b5e20]"
            >
              Yes
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              className="w-full bg-[#d32f2f] hover:bg-[#c62828]"
              color="error"
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    caregiverProfilePicture: PropTypes.string,
    caregiverName: PropTypes.string,
    date: PropTypes.string,
    bookedOn: PropTypes.string,
    bookedFor: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default BookingDetails;
