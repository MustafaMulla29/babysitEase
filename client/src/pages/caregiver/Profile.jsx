import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Modal,
  Paper,
  Rating,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { AiFillEdit, AiOutlineCloudUpload } from "react-icons/ai";
import UpdateProfileModal from "./UpdateProfileModal";
import { useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";

const Profile = () => {
  const [caregiver, setCaregiver] = useState(null);
  const params = useParams();
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
  return (
    <>
      <div className="container mx-auto p-4">
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
                    <FaPen
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
                  caregiver.address
                ) : (
                  <Skeleton animation="wave" width={150} />
                )}
              </Typography>
              {caregiver ? (
                <Chip
                  className="mb-2"
                  label={caregiver?.availability ? "Available" : "Unavailable"}
                  color={caregiver?.availability ? "success" : "error"}
                />
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
            <Typography variant="h6">
              {caregiver ? (
                "Description"
              ) : (
                <Skeleton animation="wave" width={100} />
              )}
            </Typography>
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
          <div className="mb-8">
            <Typography variant="h6">
              {caregiver ? (
                "Certifications"
              ) : (
                <Skeleton animation="wave" width={150} />
              )}
            </Typography>
            <div className="flex flex-wrap gap-4">
              {caregiver ? (
                caregiver?.certifications?.map((certificate, index) => (
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
