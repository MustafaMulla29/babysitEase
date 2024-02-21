import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Chip, Rating, Skeleton, Typography } from "@mui/material";
import UpdateProfileModal from "./UpdateProfileModal";
import { useSelector } from "react-redux";
import { FaExclamationCircle } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import ReviewCard from "./ReviewCard";
import { FaRegImage } from "react-icons/fa6";
import { IoFlashOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";

const Profile = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [caregiverReviews, setCaregiverReviews] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  useEffect(() => {
    const getNurseInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/getCaregiverInfo/${user?._id}`,
          // { userId: user?._id },
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
    getNurseInfo();
  }, [user?._id]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/getReviews/${user?._id}`,
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
  }, [user?._id]);
  return (
    <>
      <div className="container mx-auto p-4">
        {caregiver?.isBlocked && (
          <div className="py-5 px-8 rounded-lg bg-[#FCE8E6]">
            <div className="h-full w-ful flex items-start gap-10">
              <img
                src="./../../../img/blocked.png"
                alt="account_blocked"
                className="w-24"
              />
              <div className="max-w-lg">
                <Typography className="text-lg font-semibold">
                  Your caregiver account has been blocked by the admin. Reasons
                  could be:{" "}
                </Typography>
                <ol className="list-disc pl-5">
                  <li>Violation of Community Guidelines</li>
                  <li>Inappropriate Behavior</li>
                  <li>Spam or Misuse</li>
                </ol>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            {caregiver ? (
              <Avatar
                alt="Profile Picture"
                // src={`http://localhost:8070/${caregiver?.profilePicture}`}
                src={
                  caregiver?.profilePicture
                    ? `http://localhost:8070/${caregiver?.profilePicture}`
                    : "./../../img/default_avatar.jpg"
                }
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
                  <span className="flex items-center gap-4">
                    {caregiver.name}
                    <FaRegEdit
                      className="text-base cursor-pointer"
                      onClick={handleEditClick}
                    />
                  </span>
                ) : (
                  <Skeleton width={200} animation="wave" />
                )}
              </Typography>
              <Typography className="mb-2">
                {caregiver ? (
                  <span className="flex items-center gap-1 text-gray-500">
                    <CiLocationOn className="text-lg" />
                    {caregiver.address}
                  </span>
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              {caregiver ? (
                <div
                  className={`${
                    caregiver?.availability === "Available"
                      ? "bg-green-800"
                      : "bg-red-800"
                  } flex gap-1 items-center py-2 px-3 rounded-full text-white text-[12px] w-fit`}
                >
                  {caregiver?.availability === "Available" ? (
                    <IoFlashOutline />
                  ) : (
                    <FaExclamationCircle className="" />
                  )}
                  {caregiver?.availability}
                </div>
              ) : (
                <Skeleton
                  animation="wave"
                  width={90}
                  height={70}
                  className="rounded-full"
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
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Certifications"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-4 mt-4">
              {caregiver ? (
                caregiver?.certifications?.length > 0 ? (
                  caregiver?.certifications?.map((certificate, index) => (
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
                  <div className="w-full">
                    <center>
                      <img
                        src="./../../../img/no_certificates.png"
                        className="w-24"
                        alt=""
                      />
                      <Typography className="mt-4" variant="h6">
                        No certificates
                      </Typography>
                    </center>
                  </div>
                )
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

          {/* Reviews Section */}
          {caregiverReviews?.length > 0 && (
            <div>
              <Typography variant="h6">
                {caregiverReviews ? (
                  "Reviews"
                ) : (
                  <Skeleton animation="wave" width={100} />
                )}
              </Typography>
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
      {/* <Modal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        className="flex items-center justify-center h-screen"
      >
        <Box className="w-full max-w-md p-4">
          <Paper elevation={3} className="p-6">
            <div className="bg-white p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded shadow-md  w-full">
                  <div className="mt-1 bg-[#f3f4f6] flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:border-indigo-300"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <AiOutlineCloudUpload /> Upload a profile picture
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/png,jpg,jpeg"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {caregiver?.profilePicture && (
                  <Box>
                    <Avatar
                      alt="Profile Picture"
                      src={editedData.profilePicture}
                      sx={{ width: 100, height: 100 }}
                    />
                  </Box>
                )}
              </div>
              <TextField
                label="Name"
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />
              <TextField
                label="Address"
                name="address"
                value={editedData.address}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />
              <TextField
                label="Address"
                name="address"
                value={editedData.availability}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />
              <Button
                variant="contained"
                className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </div>
          </Paper>
        </Box>
      </Modal> */}
      <UpdateProfileModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        caregiver={caregiver}
      />
    </>
  );
};

export default Profile;
