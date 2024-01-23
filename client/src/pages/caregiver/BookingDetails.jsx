import { Typography, Paper, Avatar, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { PropTypes } from "prop-types";

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
  return (
    <>
      <Paper elevation={3} className="p-6 mb-8 bg-white rounded-md shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${booking?.clientProfilePicture}`}
              sx={{ width: 80, height: 80 }}
            />
            <Typography>{booking.clientName}</Typography>
            <Typography>
              {new Date(booking.date).toLocaleDateString()}
            </Typography>
            <Typography>For {booking.bookedFor}</Typography>
            <Typography>{booking.status}</Typography>

            {booking.status === "Pending" && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-[#1976d2] hover:bg-[#1565c0]"
                  onClick={() => handleBookingStatus("Approved", booking._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleBookingStatus("Rejected", booking._id)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
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
    bookedFor: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default BookingDetails;
