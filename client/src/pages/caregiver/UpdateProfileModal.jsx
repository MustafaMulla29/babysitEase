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
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// ... existing imports

const UpdateProfileModal = ({ isOpen, onClose, caregiver }) => {
  const [editedData, setEditedData] = useState(null);
  const [ageRange, setAgeRange] = useState({
    lowerLimit: caregiver?.ageRange?.lowerLimit,
    upperLimit: caregiver?.ageRange?.upperLimit,
  });
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(null);
  const [deleteCertificates, setDeleteCertificates] = useState([]);
  const [deleteProfilePicture, setDeleteProfilePicture] = useState(null);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();

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
          setEditedData(res.data.data);
          setAgeRange(() => ({
            lowerLimit: caregiver?.ageRange?.lowerLimit,
            upperLimit: caregiver?.ageRange?.upperLimit,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNurseInfo();
  }, [params.id, caregiver]);

  // useEffect(() => {
  //   // Update editedData when caregiver prop changes
  //   setEditedData({
  //     name: caregiver?.name,
  //     address: caregiver?.address,
  //     ageRange: {
  //       lowerLimit: caregiver?.ageRange?.lowerLimit,
  //       upperLimit: caregiver?.ageRange?.upperLimit,
  //     },
  //     availability: caregiver?.availability,
  //     certifications: caregiver?.certifications || [],
  //     city: caregiver?.city,
  //     dependents: caregiver?.dependents || [],
  //     description: caregiver?.description,
  //     feesPerDay: caregiver?.feesPerDay,
  //     gender: caregiver?.gender,
  //     preferredCities: caregiver?.preferredCities || [],
  //     qualification: caregiver?.qualification || [],
  //     rating: caregiver?.rating,
  //     role: caregiver?.role,
  //     specialisation: caregiver?.specialisation || [],
  //     yearsExperience: caregiver?.yearsExperience,
  //     profilePicture: caregiver?.profilePicture,
  //   });
  // }, [caregiver]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for preferredCities to convert the string to an array
    if (name === "preferredCities") {
      // Split the string based on commas and trim each city
      const citiesArray = value.split(",").map((city) => city.trim());

      setEditedData((prevData) => ({
        ...prevData,
        preferredCities: citiesArray,
      }));
      console.log(editedData?.preferredCities);
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
    if (file) {
      // You can perform additional checks or image processing here if needed
      setProfilePictureDisplay(URL.createObjectURL(file));

      // Update state with the selected file
      setEditedData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
    }
  };

  const handleCertificateImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    console.log("fileList:", fileList);
    setEditedData((prevData) => ({
      ...prevData,
      certifications: [...prevData.certifications, ...fileList],
    }));
  };

  const removeCertificate = (certificate) => {
    setEditedData((prevData) => ({
      ...prevData,
      certifications: prevData.certifications.filter(
        (cert) => cert !== certificate
      ),
    }));
    setDeleteCertificates((prevData) => [...prevData, certificate]);
  };

  // const handleSumbit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   formData.append("user[profilePicture]", editedData.profilePicture);
  //   formData.append("userId", user._id);

  //   formData.append("caregiver[yearsExperience]", editedData.yearsExperience);
  //   formData.append("caregiver[feesPerDay]", editedData.feesPerDay);
  //   formData.append("caregiver[preferredCities]", editedData.preferredCities);
  //   formData.append("caregiver[description]", editedData.description);
  //   formData.append("caregiver[qualification]", editedData.qualification);
  //   formData.append("caregiver[specialisation]", editedData.specialisation);
  //   formData.append("caregiver[ageRange]", JSON.stringify(editedData.ageRange));
  //   formData.append("caregiver[availability]", editedData.availability);

  //   // Append certifications as an array
  //   editedData.certifications.forEach((file, index) => {
  //     formData.append(`caregiver[certifications][${index}]`, file);
  //   });
  //   console.log(Object.fromEntries(formData));
  //   try {
  //     console.log(formData);
  //     dispatch(showLoading());
  //     const res = await axios.patch(
  //       "http://localhost:8070/api/v1/caregiver/updateCaregiver",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
  //         },
  //       }
  //     );
  //     dispatch(hideLoading());
  //     if (res.data.success) {
  //       toast.success(res.data.message, {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //       onClose();
  //     } else {
  //       toast.error(res.data.message, {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     console.log(error);
  //     toast.error("Something went wrong", {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  // };

  const handleSumbit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("userId", user._id);
    formdata.append("name", editedData.name);
    formdata.append("address", editedData.address);
    formdata.append("yearsExperience", editedData.yearsExperience);
    formdata.append("feesPerDay", editedData.feesPerDay);
    formdata.append("description", editedData.description);
    formdata.append("availability", editedData.availability);
    formdata.append("ageRange", JSON.stringify(ageRange));
    editedData.preferredCities.forEach((city, index) => {
      formdata.append(`preferredCities[]`, city);
    });
    editedData.qualification.forEach((qual, index) => {
      formdata.append("qualification[]", qual);
    });
    editedData.specialisation.forEach((spec, index) => {
      formdata.append("specialisation[]", spec);
    });
    deleteCertificates.forEach((cert, index) => {
      formdata.append("deleteCertificates[]", cert);
    });

    if (editedData.profilePicture instanceof File) {
      formdata.append("profilePicture", editedData.profilePicture);
    }
    // if (editedData.certifications instanceof File) {
    //   editedData?.certifications?.forEach((certification, index) => {
    //     formdata.append(`certifications[]`, certification);
    //   });
    //   console.log(editedData.certifications);
    // }

    if (Array.isArray(editedData.certifications)) {
      // Iterate and append files to FormData
      editedData.certifications.forEach((certification, index) => {
        formdata.append(`certifications[]`, certification);
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      dispatch(showLoading());
      const res = await axios.patch(
        "http://localhost:8070/api/v1/caregiver/updateCaregiver",
        formdata,
        config
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        onClose();
      } else {
        toast.error(res.data.message, {
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
    <>
      <div className="">
        <Modal
          open={isOpen}
          onClose={onClose}
          className="flex items-center justify-center pt-44  overflow-y-scroll"
        >
          <div className="">
            <form
              action=""
              method="patch"
              encType="multipart/form-data"
              className="max-w-4xl"
              onSubmit={handleSumbit}
            >
              <Box className="mt-14">
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
                                <AiOutlineCloudUpload /> Upload a profile
                                picture
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
                            <p className="text-xs text-gray-500">
                              PNG, JPG, JPEG up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Avatar
                          alt="Profile Picture"
                          name="profilePicture"
                          src={`http://localhost:8070/${editedData?.profilePicture}`}
                          sx={{ width: 100, height: 100 }}
                        />
                      </Box>
                    </div>

                    <div className=" flex items-start justify-start gap-3">
                      {/* Name */}
                      <TextField
                        label="Name"
                        name="name"
                        value={editedData?.name}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />

                      {/* Address */}
                      <TextField
                        label="Address"
                        name="address"
                        value={editedData?.address}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />
                    </div>

                    <TextField
                      label="Years of experience"
                      name="yearsExperience"
                      value={editedData?.yearsExperience}
                      onChange={handleInputChange}
                      fullWidth
                      className="mb-2"
                    />
                    <div className=" flex items-start justify-start gap-3">
                      {/* Age Range */}
                      <TextField
                        label="Age Range Lower Limit"
                        // id="lowerLimit"
                        value={ageRange?.lowerLimit}
                        name="ageRange"
                        onChange={(e) =>
                          setAgeRange((prevAgeRange) => ({
                            ...prevAgeRange,
                            lowerLimit: e.target.value,
                          }))
                        }
                        fullWidth
                        className="mb-2"
                      />
                      <TextField
                        label="Age Range Upper Limit"
                        // id="upperLimit"
                        value={ageRange?.upperLimit}
                        name="ageRange"
                        onChange={(e) =>
                          setAgeRange((prevAgeRange) => ({
                            ...prevAgeRange,
                            upperLimit: e.target.value,
                          }))
                        }
                        fullWidth
                        className="mb-2"
                      />
                    </div>

                    {/* Availability */}
                    <TextField
                      label="Availability"
                      name="availability"
                      value={editedData?.availability}
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
                              htmlFor="certifications"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:border-indigo-300"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <AiOutlineCloudUpload />
                                Upload a file (certificates if any)
                              </span>
                              <input
                                id="certifications"
                                name="certifications"
                                multiple
                                type="file"
                                accept="image/png,image/jpg,image/jpeg"
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
                      {/* <div className="flex items-center justify-start gap-2 w-full flex-wrap">
                        {editedData?.certifications &&
                          editedData?.certifications?.map((img, index) => {
                            return (
                              <>
                                <div>
                                  <Chip
                                    key={index}
                                    label={img}
                                    onDelete={() => removeCertificate(img)}
                                  />
                                  <a
                                    href={`http://localhost:8070/${img}`}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    Veiw
                                  </a>
                                </div>
                              </>
                            );
                          })}
                      </div> */}
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
                      value={editedData?.city}
                      onChange={handleInputChange}
                      fullWidth
                      className="mb-2"
                    />

                    {/* Preferred Cities */}
                    <div className="mb-2">
                      <TextField
                        label="Preferred cities"
                        name="preferredCities"
                        value={editedData?.preferredCities?.join(", ")}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />
                      <TextField
                        label="Qualification"
                        name="qualification"
                        value={editedData?.qualification?.join(", ")}
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
                      value={editedData?.specialisation?.join(", ")}
                      onChange={handleInputChange}
                      fullWidth
                      className="mb-2"
                    />

                    <Button
                      variant="contained"
                      type="submit"
                      className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Paper>
              </Box>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default UpdateProfileModal;
