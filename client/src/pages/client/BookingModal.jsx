import { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDispatch } from "react-redux";
import moment from "moment";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { Typography } from "@mui/material";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PropTypes } from "prop-types";
import { openAlert } from "../../redux/features/messageSlice";

const BookingModal = ({ open, onClose, userBlocked, params, clientId }) => {
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingError, setBookingError] = useState(false);
  const [bookingEndDate, setBookingEndDate] = useState(null);
  const [bookingEndError, setBookingEndError] = useState(false);

  const dispatch = useDispatch();

  const handleEndDateChange = (date) => {
    const currentDate = moment();

    if (
      moment(date).isBefore(currentDate) ||
      moment(date).date() === currentDate.date()
    ) {
      setBookingEndError("Please select a valid end date");
      return;
    }

    // if (bookingDate && moment(date).isBefore(bookingDate)) {
    //   setBookingEndError("End date cannot be before start date");
    //   return;
    // }
    setBookingEndDate(date);
    setBookingEndError("");
  };

  const handleDateChange = (date) => {
    // console.log(date);
    const currentDate = moment();

    if (moment(date).isBefore(currentDate)) {
      setBookingError("Please select a valid date");
      return;
    }

    if (
      moment(date).date() === currentDate.date() &&
      currentDate.hours() >= 9
    ) {
      setBookingError("You cannot book today! Select another date");
      return;
    }

    setBookingDate(date);
    setBookingError("");
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (bookingError || bookingEndError) {
      return;
    } else if (userBlocked) {
      return dispatch(
        openAlert({
          severity: "error",
          content: "Your account has been locked. You cannot book!",
        })
      );
    }

    if (moment(bookingDate).isAfter(bookingEndDate)) {
      setBookingError("Start date cannot be after end date");
      setBookingEndError("End date cannot be before start date");
      return;
    }

    if (moment(bookingEndDate).isBefore(bookingDate)) {
      setBookingError("Start date cannot be before end date");
      setBookingEndError("End date cannot be after start date");
      return;
    }

    try {
      dispatch(showLoading());
      const date = moment(bookingDate).format("YYYY-MM-DD");
      const endDate = moment(bookingEndDate).format("YYYY-MM-DD");
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/bookCaregiver",
        {
          clientId: clientId,
          caregiverId: params.userId,
          date: date,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
      } else {
        // toast.info(res.data.message);
        dispatch(
          openAlert({
            severity: "info",
            content: res.data.message,
          })
        );
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      if (error.response.status === 401) {
        // toast.error(error.response.data.message);
        dispatch(
          openAlert({
            severity: "error",
            content: error.response.data.message,
          })
        );
      } else {
        // toast.error("Something went wrong");
        dispatch(
          openAlert({
            severity: "error",
            content: "Something went wrong!",
          })
        );
      }
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="w-96 p-4 bg-white rounded-md ">
        <Typography variant="h2" className="text-2xl font-bold">
          Select Booking Dates
        </Typography>
        <Typography variant="span" className="mb-4 text-sm  text-gray-600">
          *select the same date to book only for 1 day
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Typography
            variant="label"
            className="flex items-center gap-1 mb-1 mt-4"
          >
            <FaRegCalendarAlt />
            Start date{" "}
          </Typography>
          <DatePicker
            className={`${
              bookingError && "outline outline-1 outline-red-400"
            } w-full`}
            value={bookingDate}
            onChange={handleDateChange}
            name="date"
          />
          <div className="h-4 mb-2">
            <Typography variant="p" className="text-red-500 text-sm mt-1">
              {bookingError}
            </Typography>
          </div>
          <Typography
            variant="label"
            className="flex items-center gap-1 mb-1 mt-2"
          >
            <FaRegCalendarAlt />
            End date{" "}
          </Typography>
          <DatePicker
            className={`${
              bookingEndError && "outline outline-1 outline-red-400 "
            } w-full`}
            value={bookingEndDate}
            onChange={handleEndDateChange}
            name="endDate"
          />
        </LocalizationProvider>
        <div className="h-4 mb-1">
          <Typography variant="p" className="text-red-500 text-sm mt-1">
            {bookingEndError}
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={handleBooking}
          className=" bg-[#1976d2] hover:bg-[#1565c0]"
          fullWidth
        >
          Book now
        </Button>
      </div>
    </Modal>
  );
};

BookingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userBlocked: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
};

export default BookingModal;
