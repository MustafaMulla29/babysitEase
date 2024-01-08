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
  const [CaregiverData, setCaregiverData] = useState(null);
  const [ageRange, setAgeRange] = useState({
    lowerLimit: null,
    upperLimit: null,
  });
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(null);
  const [deleteCertificates, setDeleteCertificates] = useState([]);
  const [deleteProfilePicture, setDeleteProfilePicture] = useState(null);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    setCaregiverData(caregiver);
    setAgeRange(() => ({
      lowerLimit: caregiver?.ageRange?.lowerLimit,
      upperLimit: caregiver?.ageRange?.upperLimit,
    }));
  }, [caregiver]);

  // useEffect(() => {
  //   const getNurseInfo = async () => {
  //     try {
  //       const res = await axios.post(
  //         "http://localhost:8070/api/v1/CaregiverData/getCaregiverInfo",
  //         { userId: params.id },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       if (res.data.success) {
  //         setCaregiverData(res.data.data);
  //         setAgeRange(() => ({
  //           lowerLimit: CaregiverData?.ageRange?.lowerLimit,
  //           upperLimit: CaregiverData?.ageRange?.upperLimit,
  //         }));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getNurseInfo();
  // }, [params.id, CaregiverData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for preferredCities to convert the string to an array
    if (name === "preferredCities") {
      // Split the string based on commas and trim each city
      const citiesArray = value.split(",").map((city) => city.trim());

      setCaregiverData((prevData) => ({
        ...prevData,
        preferredCities: citiesArray,
      }));
    } else if (name === "qualification") {
      const qualArray = value.split(",").map((qual) => qual.trim());
      setCaregiverData((prevData) => ({
        ...prevData,
        [name]: qualArray,
      }));
    } else if (name === "specialisation") {
      const specArray = value.split(",").map((spec) => spec.trim());
      setCaregiverData((prevData) => ({
        ...prevData,
        [name]: specArray,
      }));
    } else {
      // For other fields, directly update the state
      setCaregiverData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can perform additional checks or image processing here if needed
      setProfilePictureDisplay(URL.createObjectURL(file));

      // Update state with the selected file
      setCaregiverData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
    }
  };

  const handleCertificateImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    console.log("fileList:", fileList);
    setCaregiverData((prevData) => ({
      ...prevData,
      certifications: [...prevData.certifications, ...fileList],
    }));
  };

  const removeCertificate = (certificate) => {
    setCaregiverData((prevData) => ({
      ...prevData,
      certifications: prevData.certifications.filter(
        (cert) => cert !== certificate
      ),
    }));
    setDeleteCertificates((prevData) => [...prevData, certificate]);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("userId", user._id);
    formdata.append("name", CaregiverData.name);
    formdata.append("address", CaregiverData.address);
    formdata.append("yearsExperience", CaregiverData.yearsExperience);
    formdata.append("feesPerDay", CaregiverData.feesPerDay);
    formdata.append("description", CaregiverData.description);
    formdata.append("availability", CaregiverData.availability);
    formdata.append("ageRange", JSON.stringify(ageRange));
    CaregiverData.preferredCities.forEach((city, index) => {
      formdata.append(`preferredCities[]`, city);
    });
    CaregiverData.qualification.forEach((qual, index) => {
      formdata.append("qualification[]", qual);
    });
    CaregiverData.specialisation.forEach((spec, index) => {
      formdata.append("specialisation[]", spec);
    });
    deleteCertificates.forEach((cert, index) => {
      formdata.append("deleteCertificates[]", cert);
    });

    if (CaregiverData.profilePicture instanceof File) {
      formdata.append("profilePicture", CaregiverData.profilePicture);
    }
    // if (CaregiverData.certifications instanceof File) {
    //   CaregiverData?.certifications?.forEach((certification, index) => {
    //     formdata.append(`certifications[]`, certification);
    //   });
    //   console.log(CaregiverData.certifications);
    // }

    if (Array.isArray(CaregiverData.certifications)) {
      // Iterate and append files to FormData
      CaregiverData.certifications.forEach((certification, index) => {
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
                          src={`http://localhost:8070/${CaregiverData?.profilePicture}`}
                          sx={{ width: 100, height: 100 }}
                        />
                      </Box>
                    </div>

                    <div className=" flex items-start justify-start gap-3">
                      {/* Name */}
                      <TextField
                        label="Name"
                        name="name"
                        value={CaregiverData?.name}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />

                      {/* Address */}
                      <TextField
                        label="Address"
                        name="address"
                        value={CaregiverData?.address}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />
                    </div>

                    <TextField
                      label="Years of experience"
                      name="yearsExperience"
                      value={CaregiverData?.yearsExperience}
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
                      value={CaregiverData?.availability}
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
                        {CaregiverData?.certifications &&
                          CaregiverData?.certifications?.map((img, index) => {
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
                  value={CaregiverData.certifications.join(", ")}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                /> */}

                    {/* <div className=" flex items-start justify-start gap-3"> */}
                    {/* City */}
                    <TextField
                      label="City"
                      name="city"
                      value={CaregiverData?.city}
                      onChange={handleInputChange}
                      fullWidth
                      className="mb-2"
                    />

                    {/* Preferred Cities */}
                    <div className="mb-2">
                      <TextField
                        label="Preferred cities"
                        name="preferredCities"
                        value={CaregiverData?.preferredCities?.join(", ")}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />
                      <TextField
                        label="Qualification"
                        name="qualification"
                        value={CaregiverData?.qualification?.join(", ")}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                      />
                      {/* <div>
                    {CaregiverData.preferredCities.map((city, index) => (
                      <Chip key={index} label={city} className="mr-1 mb-1" />
                    ))}
                  </div> */}
                    </div>
                    {/* </div> */}
                    <TextField
                      label="Specialisation"
                      name="specialisation"
                      value={CaregiverData?.specialisation?.join(", ")}
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
