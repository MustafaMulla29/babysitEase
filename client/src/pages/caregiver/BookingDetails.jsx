import { Typography, Avatar, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { PropTypes } from "prop-types";
import { BsCalendarDate } from "react-icons/bs";
import { FaHandHoldingMedical, FaRegClock, FaUser } from "react-icons/fa";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";
import Zoom from "@mui/material/Zoom";
import { PiBaby } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const BookingDetails = ({ booking }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      toast.error("Something went wrong");
    }
  };

  const bookedOnDate = moment(booking.bookedOn).format("DD/MM/YYYY");
  const jobDate = moment(booking.date).format("DD/MM/YYYY");
  const jobEndDate = moment(booking.bookingEndDate).format("DD/MM/YYYY");
  return (
    <>
      {/* <Paper
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
      </Paper> */}

      <div className="max-w-sm relative m-4 p-8 rounded-lg shadow-md border border-[#d6cfcf]">
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            alt="Profile Picture"
            src={`http://localhost:8070/${booking?.clientProfilePicture}`}
            sx={{ width: 70, height: 70, borderRadius: "10px" }}
          />
          <div className="flex items-start flex-col gap-1">
            <Typography
              variant="h5"
              className="hover:underline hover:underline-offset-2 cursor-pointer transition-[underline]"
              onClick={() => navigate(`/client/${booking?.clientId}`)}
            >
              {booking.clientName}
            </Typography>
            <Typography className="flex items-center gap-1 text-gray-400">
              <CiLocationOn className="text-lg" />
              {booking.clientAddress}
            </Typography>
          </div>
        </div>
        <div className="my-2">
          <Typography className="flex gap-1 items-center">
            <FaUser /> {bookedOnDate}
          </Typography>
        </div>
        <div className=" flex items-center  gap-2 flex-row flex-wrap my-3">
          <Typography>
            <span className="flex items-center gap-3 ">
              <BsCalendarDate className="text-lg" />
              {jobDate}
            </span>
          </Typography>
          <span>-</span>
          <Typography>
            <span className="flex items-center gap-3">
              <BsCalendarDate className="text-lg" />
              {jobEndDate}
            </span>
          </Typography>
        </div>
        <div>
          <Typography className="flex items-center gap-1">
            {booking.bookedFor === "Child" ? (
              <PiBaby className="text-lg" />
            ) : (
              <FaHandHoldingMedical className="text-lg" />
            )}{" "}
            {booking.bookedFor}
          </Typography>
        </div>
        <Typography
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
              title="Accepted nor rejected by you"
            >
              {booking.status}
            </Tooltip>
          ) : (
            booking.status
          )}
        </Typography>
        {/* {booking.status === "Pending" && (
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
        )} */}

        {booking.status === "Pending" && (
          <div className="flex w-full items-center justify-center gap-10 mt-7">
            <button
              className="bg-[#ebebeb] hover:bg-[#a3e1a3] transition-colors py-2 px-3 flex items-center justify-between gap-1 rounded-full"
              onClick={() => handleBookingStatus("Approved", booking._id)}
            >
              <span>
                <AiFillCheckCircle className="text-3xl text-green-500 cursor-pointer" />
              </span>
              <span>Accept</span>
            </button>
            <button
              className="bg-[#ebebeb] hover:bg-[#f29292] transition-colors py-2 px-3 flex items-center justify-between gap-1 rounded-full"
              onClick={() => handleBookingStatus("Rejected", booking._id)}
            >
              <span>
                <AiFillCloseCircle className="text-3xl text-red-500 cursor-pointer" />
              </span>
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    clientProfilePicture: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    clientAddress: PropTypes.string.isRequired,
    bookingEndDate: PropTypes.string.isRequired,
    bookedOn: PropTypes.string.isRequired,
    bookedFor: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default BookingDetails;
