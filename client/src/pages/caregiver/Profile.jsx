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
  TextField,
  Typography,
} from "@mui/material";
import { AiFillEdit, AiOutlineCloudUpload } from "react-icons/ai";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = () => {
  const [caregiver, setCaregiver] = useState(null);
  const params = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  useEffect(() => {
    const getNurseInfo = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8070/api/v1/caregiver/getCaregiverInfo",
          { userId: params.id },
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
  }, [params.id]);
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${caregiver?.profilePicture}`}
              sx={{ width: 80, height: 80 }}
            />
            <div>
              <Typography variant="h4" className="mb-2 font-bold">
                {caregiver?.name}
              </Typography>
              <Typography>{caregiver?.address}</Typography>
              <Chip
                label={caregiver?.availability ? "Available" : "Unavailable"}
                color={caregiver?.availability ? "success" : "error"}
              />
              <Typography>
                {caregiver?.rating === 0 ? "" : `Rating: ${caregiver?.rating}`}
              </Typography>
            </div>
            <div className="items-start">
              <AiFillEdit
                className="text-base cursor-pointer"
                onClick={handleEditClick}
              />
            </div>
          </div>
          {/* Divider */}
          <hr className="mb-8" />

          {/* Description Section */}
          <div className="mb-8">
            <Typography variant="h6">Description</Typography>
            <Typography>{caregiver?.description}</Typography>
          </div>
          <hr className="mb-8" />

          {/* Other Details Section */}
          <div className="mb-8">
            <Typography variant="h6">Other details</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Typography>
                Lower limit of client: {caregiver?.ageRange?.lowerLimit}
              </Typography>
              <Typography>
                Upper limit of client: {caregiver?.ageRange?.upperLimit}
              </Typography>
              <Typography>Fees per day: {caregiver?.feesPerDay}</Typography>
              <Typography>Gender: {caregiver?.gender}</Typography>
              <Typography>
                Experience: {caregiver?.yearsExperience} years
              </Typography>
            </div>
          </div>
          <hr className="mb-8" />

          {/* Preferred Cities Section */}
          <div className="mb-8">
            <Typography variant="h6">Preferred cities</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.preferredCities?.map((city, index) => (
                <Chip
                  key={index}
                  label={city}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Qualification Section */}
          <div className="mb-8">
            <Typography variant="h6">Qualification</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.qualification?.map((qual, index) => (
                <Chip
                  key={index}
                  label={qual}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Specialisation Section */}
          <div className="mb-8">
            <Typography variant="h6">Specialisation</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.specialisation?.map((spec, index) => (
                <Chip
                  key={index}
                  label={spec}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Reviews Section */}
          <div>
            <Typography variant="h6">Reviews</Typography>
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
    </Layout>
  );
};

export default Profile;
