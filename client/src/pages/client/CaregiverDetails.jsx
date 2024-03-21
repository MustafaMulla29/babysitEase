import { useCallback, useEffect, useState } from "react";
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
import React from "react";

const CaregiverDetails = React.memo(() => {
  const [caregiver, setCaregiver] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [caregiverReviews, setCaregiverReviews] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const params = useParams();
  const { user } = useSelector((state) => state.user);

  const getUserInfo = useCallback(async () => {
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
  }, [params.userId]);

  const getReviews = useCallback(async () => {
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
  }, [params.userId]);

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    getReviews();
  }, [getReviews]);
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
              {caregiver ? (
                <Typography variant="div" className="mb-2 flex items-end gap-2">
                  <Typography variant="h4" className="font-bold">
                    {caregiver.name?.charAt(0).toUpperCase() +
                      caregiver.name.slice(1, caregiver.name.length)}
                  </Typography>
                  <Typography
                    variant="span"
                    className="text-[13px] text-gray-600 pb-2"
                  >
                    {caregiver.gender === "male" ? "(He)" : "(She)"}
                  </Typography>
                </Typography>
              ) : (
                <Skeleton width={200} animation="wave" />
              )}
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
                <div className="flex items-start gap-3 mb-2 mt-1">
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
                      Book now
                    </Button>
                    // </a>
                  )}
                </div>
              ) : (
                <>
                  <Chip
                    label={<Skeleton animation="wave" width={40} />}
                    className="my-1 mr-2"
                  />

                  <Chip
                    label={
                      <Skeleton animation="wave" width={40} className="my-1" />
                    }
                  />
                </>
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
                {caregiver ? "Fees" : <Skeleton animation="wave" width={150} />}
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
                {caregiver ? (
                  "Experience"
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
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
                onClick={handleOpenDialog}
                className="hover:ring-1 hover:ring-gray-200 bg-slate-300 rounded-lg hover:bg-slate-200 transition-all duration-300 px-2 flex items-center gap-2 text-black"
              >
                <FaPen className="" /> Post a review
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
});

CaregiverDetails.displayName = "CaregiverDetails";

export default CaregiverDetails;
