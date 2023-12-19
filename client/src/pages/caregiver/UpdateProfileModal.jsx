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
import { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

// ... existing imports

const UpdateProfileModal = ({ isOpen, onClose, caregiver }) => {
  const [editedData, setEditedData] = useState({
    name: caregiver?.name,
    address: caregiver?.address,
    ageRange: {
      lowerLimit: caregiver?.ageRange?.lowerLimit,
      upperLimit: caregiver?.ageRange?.upperLimit,
    },
    availability: caregiver?.availability,
    certifications: caregiver?.certifications || [],
    city: caregiver?.city,
    dependents: caregiver?.dependents || [],
    description: caregiver?.description,
    feesPerDay: caregiver?.feesPerDay,
    gender: caregiver?.gender,
    preferredCities: caregiver?.preferredCities || [],
    qualification: caregiver?.qualification || [],
    rating: caregiver?.rating,
    role: caregiver?.role,
    specialisation: caregiver?.specialisation || [],
    yearsExperience: caregiver?.yearsExperience,
    profilePicture: caregiver?.profilePicture,
  });

  const [profilePictureDisplay, setProfilePictureDisplay] = useState(null);

  useEffect(() => {
    // Update editedData when caregiver prop changes
    setEditedData({
      name: caregiver?.name,
      address: caregiver?.address,
      ageRange: {
        lowerLimit: caregiver?.ageRange?.lowerLimit,
        upperLimit: caregiver?.ageRange?.upperLimit,
      },
      availability: caregiver?.availability,
      certifications: caregiver?.certifications || [],
      city: caregiver?.city,
      dependents: caregiver?.dependents || [],
      description: caregiver?.description,
      feesPerDay: caregiver?.feesPerDay,
      gender: caregiver?.gender,
      preferredCities: caregiver?.preferredCities || [],
      qualification: caregiver?.qualification || [],
      rating: caregiver?.rating,
      role: caregiver?.role,
      specialisation: caregiver?.specialisation || [],
      yearsExperience: caregiver?.yearsExperience,
      profilePicture: caregiver?.profilePicture,
    });
  }, [caregiver]);
  useEffect(() => {
    console.log("Caregiver Data:", caregiver);
    console.log("Certifications in State:", editedData.certifications);
  }, [caregiver, editedData.certifications]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for preferredCities to convert the string to an array
    if (name === "preferredCities") {
      const citiesArray = value.split(",").map((city) => city.trim());
      setEditedData((prevData) => ({
        ...prevData,
        [name]: citiesArray,
      }));
    } else if (name === "qualification") {
      const qualArray = value.split(",").map((qual) => qual.trim());
      setEditedData((prevData) => ({
        ...prevData,
        [name]: qualArray,
      }));
    } else if (name === "specialisation") {
      const specArray = value.split(",").map((spec) => spec.trim());
      setEditedData((prevData) => ({
        ...prevData,
        [name]: specArray,
      }));
    } else {
      // For other fields, directly update the state
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = () => {
    // Add logic to save the changes to the backend
    // You can use axios or your preferred method for API calls
    // After saving changes, close the modal
    onClose();
    // console.log(editedData);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // You can perform additional checks or image processing here if needed
    setProfilePictureDisplay(URL.createObjectURL(file));
    setEditedData((prevData) => ({
      ...prevData,
      profilePicture: file.name,
    }));
  };

  const handleCertificateImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);

    setEditedData((prevData) => ({
      ...prevData,
      certifications: [...prevData.certifications, ...fileNames],
    }));
    console.log("Selected Files:", files);
    console.log("File Names:", fileNames);
  };
  console.log(editedData.certifications);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex items-center justify-center "
      >
        <Box className="w-full max-w-4xl p-4 h-[80%] overflow-y-scroll">
          <Paper elevation={3} className="p-6">
            <div className="bg-white p-4">
              {/* Profile Picture and Avatar */}
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded shadow-md w-full">
                  <div className="mt-1 bg-[#f3f4f6] flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
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
                <Box>
                  <Avatar
                    alt="Profile Picture"
                    src={`http://localhost:5173/nurse/profile/${encodeURIComponent(
                      editedData.profilePicture
                    )}`}
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
              </div>

              <div className=" flex items-start justify-start gap-3">
                {/* Name */}
                <TextField
                  label="Name"
                  name="name"
                  value={editedData.name}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />

                {/* Address */}
                <TextField
                  label="Address"
                  name="address"
                  value={editedData.address}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />
              </div>

              <TextField
                label="Years of experience"
                name="yearsExperience"
                value={editedData.yearsExperience}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />
              <div className=" flex items-start justify-start gap-3">
                {/* Age Range */}
                <TextField
                  label="Age Range Lower Limit"
                  name="ageRange.lowerLimit"
                  value={editedData.ageRange.lowerLimit}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />
                <TextField
                  label="Age Range Upper Limit"
                  name="ageRange.upperLimit"
                  value={editedData.ageRange.upperLimit}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />
              </div>

              {/* Availability */}
              <TextField
                label="Availability"
                name="availability"
                value={editedData.availability}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />

              {/* Certifications */}
              <div className="flex items-start justify-center flex-col space-y-2 ">
                <div className="bg-white p-3 rounded shadow-md  w-full">
                  <div className="mt-1 bg-[#f3f4f6] flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:border-indigo-300"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <AiOutlineCloudUpload />
                          Upload a file (certificates if any)
                        </span>
                        <input
                          id="file-upload"
                          name="certifications"
                          multiple
                          type="file"
                          accept="image/png,jpg,jpeg"
                          className="sr-only"
                          onChange={handleCertificateImageChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-4">
                  <span className="text-red-500 text-sm mt-1"></span>
                </div>
                <div className="flex items-center justify-start gap-2 w-full flex-wrap">
                  {editedData.certifications &&
                    editedData.certifications.map((img, index) => {
                      return (
                        <>
                          <Chip
                            key={index}
                            label={img}
                            src={`http://localhost:5173/nurse/profile/${encodeURIComponent(
                              img
                            )}`}
                            // onDelete={() => removeElement(img, "certificate")}
                          />
                        </>
                      );
                    })}
                </div>
              </div>
              {/* <TextField
                  label="Certifications"
                  name="certifications"
                  value={editedData.certifications.join(", ")}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                /> */}

              {/* <div className=" flex items-start justify-start gap-3"> */}
              {/* City */}
              <TextField
                label="City"
                name="city"
                value={editedData.city}
                onChange={handleInputChange}
                fullWidth
                className="mb-2"
              />

              {/* Preferred Cities */}
              <div className="mb-2">
                <TextField
                  label="Preferred cities"
                  name="preferredCities"
                  value={editedData.preferredCities.join(", ")}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />
                <TextField
                  label="Qualification"
                  name="qualification"
                  value={editedData.qualification.join(", ")}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                />
                {/* <div>
                    {editedData.preferredCities.map((city, index) => (
                      <Chip key={index} label={city} className="mr-1 mb-1" />
                    ))}
                  </div> */}
              </div>
              {/* </div> */}
              <TextField
                label="Specialisation"
                name="specialisation"
                value={editedData.specialisation.join(", ")}
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
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
