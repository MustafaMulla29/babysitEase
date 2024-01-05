import { Typography, Paper } from "@mui/material";
import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";

const BookingDetails = ({ booking }) => {
  return (
    <Paper elevation={3} className="p-6 mb-8 bg-white rounded-md shadow-md">
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
        {/* Add more details as needed */}
      </div>
    </Paper>
  );
};

export default BookingDetails;
