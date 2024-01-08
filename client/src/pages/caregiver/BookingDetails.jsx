import { Typography, Paper, Avatar, Button } from "@mui/material";

const BookingDetails = ({ booking }) => {
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
            <Typography>{booking.bookedFor}</Typography>
            <Typography>{booking.status}</Typography>
            <Button
              variant="contained"
              color="primary"
              className="bg-[#1976d2] hover:bg-[#1565c0]"
            >
              Accept
            </Button>
            <Button variant="outlined" color="secondary">
              Reject
            </Button>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default BookingDetails;
