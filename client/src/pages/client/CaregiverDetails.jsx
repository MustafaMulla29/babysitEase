import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Chip,
  Rating,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
// import { DateFnsUtils } from "@date-io/date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { showLoading, hideLoading } from "./../../redux/features/alertSlice";
import moment from "moment";

const CaregiverDetails = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingError, setBookingError] = useState(false);
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/user/getCaregiverDetails/${params.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCaregiver(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, [params.userId]);

  //TODO: NEED TO FORMAT THE DATE USING MOMENT JS
  // const handleDateChange = (date) => {
  //   console.log(date);
  //   const currentDate = moment();

  //   if (date < currentDate) {
  //     setBookingError("Please select a valid date");
  //     return;
  //   }

  //   if (date.date() === currentDate.date() && currentDate.hours() >= 9) {
  //     setBookingError("You cannot book today! Select another date");
  //     return;
  //   }

  //   setBookingDate(date);
  //   setBookingError("");
  // };

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
    if (bookingError) {
      return;
    }
    try {
      dispatch(showLoading());
      const date = moment(bookingDate).format("YYYY-MM-DD");
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/bookCaregiver",
        {
          clientId: user?._id,
          caregiverId: params.userId,
          date: date,
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
      } else {
        toast.info(res.data.message, {
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
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            {caregiver ? (
              <Avatar
                alt="Profile Picture"
                src={`http://localhost:8070/${caregiver?.profilePicture}`}
                sx={{ width: 80, height: 80 }}
              />
            ) : (
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                animation="wave"
              />
            )}
            <div className="">
              <Typography variant="h4" className="mb-2 font-bold">
                {caregiver ? (
                  caregiver.name
                ) : (
                  <Skeleton width={200} animation="wave" />
                )}
              </Typography>
              <Typography className="mb-2">
                {caregiver ? (
                  caregiver.address
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              {caregiver ? (
                <div className="flex items-start gap-3">
                  <Chip
                    className="mb-2"
                    label={
                      caregiver?.availability ? "Available" : "Unavailable"
                    }
                    color={caregiver?.availability ? "success" : "error"}
                  />
                  {user?.role === "client" && (
                    <a href="#booking">
                      <Button
                        variant="outlined"
                        color="primary"
                        className="rounded-3xl text-sm"
                      >
                        Book Me
                      </Button>
                    </a>
                  )}
                </div>
              ) : (
                <Skeleton
                  animation="wave"
                  width={70}
                  height={50}
                  className="rounded-3xl"
                />
              )}
              <Typography>
                {caregiver ? (
                  <Rating
                    name="read-only"
                    value={caregiver?.rating}
                    readOnly
                    precision={0.5}
                  />
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
            </div>
          </div>
          {/* Divider */}
          <hr className="mb-8" />

          {/* Description Section */}
          <div className="mb-8">
            {/* <Typography variant="h6">
              {caregiver ? (
                "Description"
              ) : (
                <Skeleton animation="wave" width={100} />
              )}
            </Typography> */}
            <Typography>
              {caregiver ? (
                caregiver.description
              ) : (
                <Skeleton animation="wave" width={250} />
              )}
            </Typography>
          </div>
          <hr className="mb-8" />

          {/* Other Details Section */}
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Other details"
              ) : (
                <Skeleton animation="wave" width={100} />
              )}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Typography>
                {caregiver ? (
                  `Lower limit of client: ${caregiver?.ageRange?.lowerLimit}`
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Upper limit of client: ${caregiver?.ageRange?.upperLimit}`
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Fees per day: ${caregiver?.feesPerDay}`
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Gender: ${caregiver?.gender}`
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Experience: ${caregiver?.yearsExperience} years`
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
            </div>
          </div>
          <hr className="mb-8" />

          {/* Preferred Cities Section */}
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Preferred cities"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.preferredCities?.map((city, index) => (
                  <Chip
                    key={index}
                    label={city}
                    className="text-base bg-[#f2f7f2]"
                  />
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Qualification Section */}
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Qualification"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.qualification?.map((qual, index) => (
                  <Chip
                    key={index}
                    label={qual}
                    className="text-base bg-[#f2f7f2]"
                  />
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Specialisation Section */}
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Specialisation"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.specialisation?.map((spec, index) => (
                  <Chip
                    key={index}
                    label={spec}
                    className="text-base bg-[#f2f7f2]"
                  />
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>
          <hr className="mb-8" />
          {caregiver?.certifications.length > 0 && (
            <div>
              <div className="mb-8">
                <Typography variant="h6">
                  {caregiver?.certifications ? (
                    "Certifications"
                  ) : (
                    <Skeleton animation="wave" width={150} />
                  )}
                </Typography>
                <div className="flex flex-wrap gap-4">
                  {caregiver ? (
                    caregiver.certifications?.map((certificate, index) => (
                      <Avatar
                        key={index}
                        alt="certificate"
                        src={`http://localhost:8070/${certificate}`}
                        sx={{ width: 80, height: 80 }}
                      />
                    ))
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Skeleton
                        animation="wave"
                        width={300}
                        height={300}
                        className="rounded"
                      />
                      <Skeleton
                        animation="wave"
                        width={300}
                        height={300}
                        className="rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <hr className="mb-8" />
            </div>
          )}

          {/* Reviews Section */}
          {caregiver?.review?.length > 0 && (
            <div>
              <Typography variant="h6">
                {caregiver?.review ? (
                  "Reviews"
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
              <div className="mt-4 space-y-2">
                {caregiver?.review?.map((review, index) => {
                  return (
                    <div key={index}>
                      <Typography>{review}</Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {user?.role === "client" && (
            <div id="booking">
              <Typography variant="h6">
                {caregiver ? (
                  "Booking"
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              <div className="p-2 flex items-start gap-5 flex-col ">
                <Typography>
                  Nothing much to do! Just select the date.
                </Typography>
                {/* <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      className={`${
                        bookingError && "outline outline-1 outline-red-400"
                      }`}
                      value={bookingDate}
                      onChange={handleDateChange}
                      name="date"
                    />
                  </LocalizationProvider>
                  <div className="h-4">
                    <Typography className="text-red-500 text-sm mt-1">
                      {bookingError}
                    </Typography>
                  </div>
                </div> */}
                <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      className={`${
                        bookingError && "outline outline-1 outline-red-400"
                      }`}
                      value={bookingDate}
                      onChange={handleDateChange}
                      name="date"
                    />
                  </LocalizationProvider>
                  <div className="h-4">
                    <Typography className="text-red-500 text-sm mt-1">
                      {bookingError}
                    </Typography>
                  </div>
                  {bookingDate && (
                    <Typography>
                      Selected Date: {moment(bookingDate).format("YYYY-MM-DD")}
                    </Typography>
                  )}
                </div>

                <Button
                  onClick={handleBooking}
                  variant="outlined"
                  color="primary"
                  // sx={{ color: "#4CAF50", border: "1px solid #4CAF50" }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CaregiverDetails;
