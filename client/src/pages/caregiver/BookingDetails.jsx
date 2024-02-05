import { Typography, Paper, Avatar, Tooltip, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { PropTypes } from "prop-types";
import { BsCalendarDate } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";
import Zoom from "@mui/material/Zoom";

const BookingDetails = ({ booking }) => {
  const dispatch = useDispatch();

  const handleBookingStatus = async (status, bookingId) => {
    try {
      dispatch(showLoading());
      const res = await axios.patch(
        "http://localhost:8070/api/v1/caregiver/changeBookingStatus",
        {
          status,
          bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const bookedOnDate = moment(booking.bookedOn).format("DD/MM/YYYY");
  const jobDate = moment(booking.date).format("DD/MM/YYYY");
  return (
    <>
      <Paper
        elevation={3}
        className="p-6 mb-8 relative bg-white rounded-md shadow-md"
      >
        <div>
          <div className="flex items-center justify-between">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${booking?.clientProfilePicture}`}
              sx={{ width: 80, height: 80 }}
            />
            <Typography>{booking.clientName}</Typography>

            <Typography>Booked on: {bookedOnDate}</Typography>
            <Typography>
              <span className="flex items-center gap-3">
                Job Date:
                <BsCalendarDate className="text-lg" />
                {jobDate}
              </span>
            </Typography>
            <Typography>For {booking.bookedFor}</Typography>
            <Typography
              className={`flex items-center gap-1 ${
                booking.status === "Pending"
                  ? "bg-orange-400"
                  : booking.status === "Approved"
                  ? "bg-blue-500"
                  : booking.status === "Completed"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-[12px] px-2 py-1 rounded-full text-white flex items-center`}
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
          </div>
          {booking.status === "Pending" && (
            <div className="flex w-full items-center justify-center gap-10">
              <Tooltip title="Accept Booking" TransitionComponent={Zoom} arrow>
                <IconButton
                  onClick={() => handleBookingStatus("Approved", booking._id)}
                >
                  <AiFillCheckCircle className="text-3xl text-green-500 cursor-pointer" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Booking" TransitionComponent={Zoom} arrow>
                <IconButton
                  onClick={() => handleBookingStatus("Rejected", booking._id)}
                >
                  <AiFillCloseCircle className="text-3xl text-red-500 cursor-pointer" />{" "}
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Paper>
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    clientProfilePicture: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    bookedOn: PropTypes.string.isRequired,
    bookedFor: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default BookingDetails;
