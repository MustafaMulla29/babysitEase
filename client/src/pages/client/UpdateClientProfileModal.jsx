import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { openAlert } from "../../redux/features/messageSlice";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { PropTypes } from "prop-types";

const UpdateClientProfileModal = ({ open, onClose, client }) => {
  const [profileData, setProfileData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [profilePictureDisplay, setProfilePictureDisplay] = useState("");
  const [additionalAddresses, setAdditionalAddresses] = useState([]);
  const [additionalAddressesInput, setAdditionalAddressesInput] = useState("");
  const [additionalAddressesError, setAdditionalAddressesError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setProfileData(client);
    if (client?.additionalAddresses.length > 0) {
      setAdditionalAddresses(client?.additionalAddresses);
    } else {
      setAdditionalAddresses([]);
    }
  }, [client]);

  // const handleInputChange = (e) => {
  //   const { value, name } = e.target;
  //   const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
  //   const addressRegex = /^[A-Za-z0-9\s]+$/;
  //   if ((name === "name" || name === "city") && !regex.test(value)) {
  //     return;
  //   } else {
  //     setProfileData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }

  //   if (name === "address" && !addressRegex.test(value)) {
  //     return;
  //   } else {
  //     setProfileData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }

  //   if (name === "additionalAddresses" && !addressRegex.test(value)) {
  //     return;
  //   } else {
  //     setAdditionalAddressesInput(value);
  //   }
  // };
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    const addressRegex = /^[A-Za-z0-9\s]+$/;

    // Check for 'name' and 'city' fields
    if (name === "name" || name === "city") {
      if (value === "" || regex.test(value)) {
        setProfileData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
      return;
    }

    // Check for 'address' and 'additionalAddresses' fields
    if (name === "address" || name === "additionalAddresses") {
      if (value === "" || addressRegex.test(value)) {
        if (name === "additionalAddresses") {
          setAdditionalAddressesInput(value);
        } else {
          setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }
      }
      return;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can perform additional checks or image processing here if needed
      setProfilePictureDisplay(URL.createObjectURL(file));

      // Update state with the selected file
      setProfileData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
    }
  };
  const addElement = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      try {
        if (additionalAddressesInput === "") return;
        if (additionalAddresses.length === 3) {
          setAdditionalAddressesError("Max 3 addresses");
          return;
        }
        for (let i = 0; i < additionalAddresses.length; i++) {
          if (additionalAddresses[i] === additionalAddressesInput) {
            setAdditionalAddressesError("Address already exists");
            return;
          } else {
            setAdditionalAddressesError("");
          }
        }
        setAdditionalAddresses((prevCities) => [
          ...prevCities,
          additionalAddressesInput,
        ]);
        setAdditionalAddressesError("");
        setAdditionalAddressesInput("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeElement = (address) => {
    const updatedCities = additionalAddresses.filter(
      (city) => city !== address
    );
    setAdditionalAddresses(updatedCities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      const formData = new FormData();
      formData.append("_id", client?._id);
      formData.append("name", profileData?.name);
      formData.append("address", profileData?.address);
      formData.append("city", profileData?.city);
      additionalAddresses.forEach((city) => {
        formData.append(`additionalAddresses`, city);
      });
      if (profileData.profilePicture instanceof File) {
        formData.append("profilePicture", profileData.profilePicture);
      }
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const res = await axios.patch(
        "http://localhost:8070/api/v1/user/updateUser",
        formData,
        config
      );
      dispatch(hideLoading());
      if (res.data && res.data.success) {
        dispatch(openAlert({ severity: "success", content: res.data.message }));
        onClose();
        window.location.reload();
      } else {
        dispatch(
          openAlert({
            severity: "warning",
            content: "You can add maximum of 3 secondary addresses",
          })
        );
        onClose();
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      dispatch(
        openAlert({ severity: "error", content: "Something went wrong!" })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="" maxWidth="lg">
      <form
        action=""
        method="patch"
        encType="multipart/form-data"
        className="max-w-2xl"
        onSubmit={handleSubmit}
      >
        {/* <DialogTitle className="py-3">Update profile</DialogTitle> */}
        <DialogContent className="">
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
                      name="profilePicture"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs  text-gray-600">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <Box>
              <Avatar
                alt="Profile Picture"
                name="profilePicture"
                src={`http://localhost:8070/${profileData?.profilePicture}`}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
          </div>
          <div className="space-y-3">
            <TextField
              label="name"
              variant="filled"
              name="name"
              fullWidth
              value={profileData?.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
            <TextField
              label="Address"
              name="address"
              value={profileData?.address}
              onChange={handleInputChange}
              fullWidth
              className="mb-2"
              required
              variant="filled"
              placeholder="Enter your primary address"
            />
            <TextField
              label="City"
              name="city"
              value={profileData?.city}
              onChange={handleInputChange}
              fullWidth
              required
              className="mb-2"
              variant="filled"
              placeholder="Enter your city"
            />
            <TextField
              label="Additional addresses (optional)"
              name="additionalAddresses"
              value={additionalAddressesInput}
              onChange={handleInputChange}
              onKeyDown={addElement}
              error={additionalAddressesError ? true : false}
              helperText={additionalAddressesError}
              fullWidth
              className="mb-2"
              variant="filled"
              placeholder="Press enter after typing..."
            />
            <div className="flex items-center justify-start gap-2 w-full flex-wrap mb-3">
              {additionalAddresses &&
                additionalAddresses.map((city, index) => {
                  return (
                    <Chip
                      key={index}
                      label={city}
                      onDelete={() => removeElement(city)}
                    />
                  );
                })}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="w-full justify-around">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className="bg-[#1976d2] hover:bg-[#1565c0] w-full"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

UpdateClientProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client: PropTypes.object,
};

export default UpdateClientProfileModal;
