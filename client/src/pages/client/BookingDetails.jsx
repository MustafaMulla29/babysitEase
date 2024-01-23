import { Typography, Paper, Avatar } from "@mui/material";
import { FaRegClock } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import PropTypes from "prop-types";

const BookingDetails = ({ booking }) => {
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
      <Paper elevation={3} className="p-6 mb-8 bg-white rounded-md shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${booking?.caregiverProfilePicture}`}
              sx={{ width: 80, height: 80 }}
            />

            <Typography>{booking.caregiverName}</Typography>
            <Typography>
              <span className="flex items-center gap-3">
                <BsCalendarDate className="text-lg" />
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </Typography>
            <Typography>For {booking.bookedFor}</Typography>
            <Typography className="flex items-center gap-3">
              <span>
                {booking.status === "Pending" && (
                  <FaRegClock className="text-lg" />
                )}
              </span>
              <span>{booking.status}</span>
            </Typography>
          </div>
        </div>
      </Paper>

      {/* <Card className="max-w-md mx-auto mt-8 bg-white rounded-md shadow-md overflow-hidden">
        <div className="h-60 overflow-hidden">
          <img
            alt={booking.caregiverName}
            src={`http://localhost:8070/${booking?.caregiverProfilePicture}`}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Typography variant="h5" className="mb-2">
            {booking.caregiverName}
          </Typography>
          <Typography variant="body1" color="textSecondary" className="mb-4">
            Date: {new Date(booking.date).toLocaleDateString()}
          </Typography>
          <div className="flex">
            <Typography variant="body1" className="mr-2">
              Status: {booking.status}
            </Typography>
            <Typography variant="body1">{booking.bookedFor}</Typography>
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    caregiverProfilePicture: PropTypes.string,
    caregiverName: PropTypes.string,
    date: PropTypes.string,
    bookedFor: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};

export default BookingDetails;
