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
  Typography,
} from "@mui/material";
import { FaPen } from "react-icons/fa";
import ReviewDialog from "./ReviewDialog";
import ReviewCard from "../caregiver/ReviewCard";
import { FaRegImage } from "react-icons/fa6";
import { IoFlashOutline } from "react-icons/io5";
import { FaExclamationCircle } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import BookingModal from "./BookingModal";
import { useSelector } from "react-redux";
import {
  MdOutlineCurrencyRupee,
  MdOutlineWorkspacePremium,
} from "react-icons/md";

const CaregiverDetails = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [caregiverReviews, setCaregiverReviews] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const params = useParams();
  const { user } = useSelector((state) => state.user);

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

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/getReviews/${params.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCaregiverReviews(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getReviews();
  }, [params.userId]);
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
                  caregiver.name?.charAt(0).toUpperCase() +
                  caregiver.name.slice(1, caregiver.name.length)
                ) : (
                  <Skeleton width={200} animation="wave" />
                )}
              </Typography>
              <Typography variant="span" className="mb-2">
                {caregiver ? (
                  <span className="flex items-center gap-1 text-gray-600">
                    <CiLocationOn className="text-lg" />
                    {caregiver.address}
                  </span>
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              {caregiver ? (
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`${
                      caregiver?.availability === "Available"
                        ? "bg-green-800"
                        : "bg-red-800"
                    } flex gap-1 items-center py-2 px-3 rounded-full text-white text-[12px]`}
                  >
                    {caregiver?.availability === "Available" ? (
                      <IoFlashOutline />
                    ) : (
                      <FaExclamationCircle className="" />
                    )}
                    {caregiver?.availability}
                  </div>
                  {user?.role === "client" && (
                    // <a href="#booking">
                    <Button
                      variant="outlined"
                      color="primary"
                      className="rounded-3xl text-sm"
                      onClick={handleOpenModal}
                    >
                      Book Me
                    </Button>
                    // </a>
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
            <Typography variant="h6" className="mb-2 font-semibold">
              {caregiver ? "About" : <Skeleton animation="wave" width={250} />}
            </Typography>
            <Typography variant="p">
              {caregiver ? (
                caregiver.description
              ) : (
                <Skeleton animation="wave" width={250} />
              )}
            </Typography>
          </div>
          <hr className="mb-8" />

          {/* Other Details Section */}
          {/* <div className="mb-8">
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
                  `Lower age limit of client: ${caregiver?.ageRange?.lowerLimit}`
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Upper age limit of client: ${caregiver?.ageRange?.upperLimit}`
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              <Typography>
                {caregiver ? (
                  `Fees per day: ${caregiver?.feesPerDay}/rs`
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
          <hr className="mb-8" /> */}

          {/* Preferred Cities Section */}
          {/* <div className="mb-8">
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
          <hr className="mb-8" /> */}

          {/* Qualification Section */}
          {/* <div className="mb-8">
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
          <hr className="mb-8" /> */}

          {/* Specialisation Section */}
          {/* <div className="mb-8">
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
          </div> */}
          {/* <hr className="mb-8" /> */}

          <div className="mb-8">
            {/* Client Details */}
            <div className="mb-8">
              <Typography variant="h6" className="mb-2 font-semibold">
                {caregiver ? (
                  "Client Details"
                ) : (
                  <Skeleton animation="wave" width={250} />
                )}
              </Typography>
              <div className="flex items-center gap-4">
                <Typography variant="p">
                  {caregiver ? (
                    `Age range : ${
                      caregiver?.ageRange?.lowerLimit
                        ? caregiver?.ageRange.lowerLimit
                        : "N/L"
                    }`
                  ) : (
                    <Skeleton animation="wave" width={150} />
                  )}
                </Typography>
                <span>-</span>
                <Typography variant="span">
                  {caregiver ? (
                    ` ${
                      caregiver?.ageRange?.upperLimit
                        ? caregiver?.ageRange.upperLimit + " years"
                        : "N/L"
                    }`
                  ) : (
                    <Skeleton animation="wave" width={150} />
                  )}
                </Typography>
              </div>
            </div>
            <hr className="mb-8" />

            {/* Fees */}
            <div className="mb-8">
              <Typography variant="h6" className="mb-2 font-semibold">
                Fees
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Typography variant="span">
                  {caregiver ? (
                    <span className="flex items-center gap-1">
                      <MdOutlineCurrencyRupee className="text-xl" />
                      {caregiver?.feesPerDay ? caregiver?.feesPerDay : "N/L"}
                      /day
                    </span>
                  ) : (
                    <Skeleton animation="wave" width={100} />
                  )}
                </Typography>
              </div>
            </div>

            <hr className="mb-8" />

            {/* Experience */}
            <div className="mt-8">
              <Typography variant="h6" className="mb-2 font-semibold">
                Experience
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Typography variant="span">
                  {caregiver ? (
                    <span className="flex items-center gap-1">
                      <MdOutlineWorkspacePremium className="text-xl" />
                      {caregiver?.yearsExperience
                        ? caregiver.yearsExperience
                        : "N/L"}{" "}
                      years
                    </span>
                  ) : (
                    <Skeleton animation="wave" width={100} />
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <hr className="mb-8" />

          {/* Preferred Cities Section */}
          <div className="mb-8">
            <Typography variant="h6" className="mb-2 font-semibold">
              {caregiver ? (
                "Preferred cities"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.preferredCities ? (
                  caregiver?.preferredCities?.map((city, index) => (
                    <Chip
                      key={index}
                      label={city}
                      className="text-base bg-[#f2f7f2]"
                    />
                  ))
                ) : (
                  <Chip label={"N/L"} className="text-base bg-[#f2f7f2]" />
                )
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
            <Typography variant="h6" className="mb-2 font-semibold">
              {caregiver ? (
                "Qualification"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.qualification ? (
                  caregiver?.qualification?.map((qual, index) => (
                    <Chip
                      key={index}
                      label={qual}
                      className="text-base bg-[#f2f7f2]"
                    />
                  ))
                ) : (
                  <Chip label={"N/L"} className="text-base bg-[#f2f7f2]" />
                )
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
            <Typography variant="h6" className="mb-2 font-semibold">
              {caregiver ? (
                "Specialisation"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver ? (
                caregiver?.specialisation ? (
                  caregiver?.specialisation?.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      className="text-base bg-[#f2f7f2]"
                    />
                  ))
                ) : (
                  <Chip label={"N/L"} className="text-base bg-[#f2f7f2]" />
                )
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
                <Typography variant="h6" className="mb-2 font-semibold">
                  {caregiver?.certifications ? (
                    "Certifications"
                  ) : (
                    <Skeleton animation="wave" width={150} />
                  )}
                </Typography>
                <div className="flex flex-wrap gap-4">
                  {caregiver ? (
                    caregiver.certifications?.map((certificate, index) => (
                      <div key={index} className="w-1/3 h-56 ">
                        <a
                          href={`http://localhost:8070/${certificate}`}
                          rel="noreferrer"
                          target="_blank"
                          className="relative group hover:after:content-[''] after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:rounded-md after:bg-black after:bg-opacity-70 after:hover:w-full after:flex after:items-center after:justify-center after:text-white after:transition-width after:duration-300 transition-all"
                        >
                          <img
                            alt="certificate"
                            src={`http://localhost:8070/${certificate}`}
                            className="w-full h-full object-cover rounded-md"
                            // sx={{ width: 80, height: 80 }}
                          />
                          <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white">
                            <FaRegImage size={32} />
                          </div>
                        </a>
                      </div>
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

          <div className="flex items-center justify-between border-b-2 py-2">
            <Typography variant="h6" className="mb-2 font-semibold">
              {caregiverReviews ? (
                "Reviews"
              ) : (
                <Skeleton animation="wave" width={100} />
              )}
            </Typography>
            {user?.role === "client" && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenDialog}
              >
                <FaPen className="mr-2" /> Write a review
              </Button>
            )}
          </div>
          {/* Reviews Section */}
          {caregiverReviews?.length > 0 && (
            <div>
              <div className="mt-4 space-y-2">
                {caregiverReviews?.map((review, index) => {
                  return (
                    <div key={index}>
                      <ReviewCard caregiverReviews={review} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <ReviewDialog open={dialogOpen} onClose={handleCloseDialog} />
      {user?.role === "client" && (
        <BookingModal
          open={modalOpen}
          onClose={handleCloseModal}
          userBlocked={user?.isBlocked}
          clientId={user?._id}
          params={params}
        />
      )}
    </Layout>
  );
};

export default CaregiverDetails;
