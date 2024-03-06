/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineCloudUpload } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { Button, Typography, TextField, Box, Chip } from "@mui/material";
import axios from "axios";
import { openAlert } from "../redux/features/messageSlice";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { format, parse, parseISO } from "date-fns";

const ApplyNurse = () => {
  const [yearsExperience, setExperience] = useState(null);
  const [feesPerDay, setFeesPerDay] = useState("");
  const [ageRange, setAgeRange] = useState({
    lowerLimit: 1,
    upperLimit: 2,
  });
  const [preferredCities, setPreferredCities] = useState([]);
  const [description, setDescription] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [qualification, setQualification] = useState([]);
  const [qualificationInput, setQualificationInput] = useState("");
  const [specialisation, setSpecialisation] = useState([]);
  const [specialisationInput, setSpecialisationInput] = useState("");
  const [addBtnDisabled, setAddBtnDisabled] = useState(true);
  const [qualBtnDisabled, setQualBtnDisabled] = useState(true);
  const [specBtnDisabled, setSpecBtnDisabled] = useState(true);
  const [certifications, setCertificatesArray] = useState([]);
  const [specialisationError, setSpecialisationError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [feesPerDayError, setFeesPerDayError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [lowerLimitError, setLowerLimitError] = useState("");
  const [upperLimitError, setupperLimitError] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [preferredCitiesError, setPreferredCitiesError] = useState("");
  const [qualificationError, setQualificationError] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
    if (e.target.value.length == 0) {
      setExperienceError("");
    } else if (isNaN(e.target.value) || e.target.value > 60) {
      setExperienceError("Enter a valid number of experience");
    } else {
      setExperienceError("");
    }
  };

  const handleFeesPerDayChange = (e) => {
    setFeesPerDay(e.target.value);
    if (e.target.value.length == 0) {
      setFeesPerDayError("");
    } else if (isNaN(e.target.value)) {
      setFeesPerDayError("Enter a valid number");
    } else {
      setFeesPerDayError("");
    }
  };

  const handlePreferredCitiesChange = (e) => {
    setCityInput(e.target.value);
    const citiesRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setPreferredCitiesError("");
      setAddBtnDisabled(true);
    } else if (
      !citiesRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value) ||
      e.target.value.length < 3
    ) {
      setPreferredCitiesError("Enter valid city");
      setAddBtnDisabled(true);
    } else {
      setPreferredCitiesError("");
      setAddBtnDisabled(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    // const descRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    // if (e.target.value.length === 0) {
    //   setDescriptionError("");
    // } else if (
    //   !descRegex.test(e.target.value) ||
    //   !/[aeiouAEIOU]/.test(e.target.value) ||
    //   e.target.value.length < 30
    // ) {
    //   setDescriptionError("Enter a proper description");
    // } else {
    //   setDescriptionError("");
    // }
  };

  const handleQualificationChange = (e) => {
    setQualificationInput(e.target.value);
    const qualificationRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setQualificationError("");
      setQualBtnDisabled(true);
    } else if (
      !qualificationRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value) ||
      e.target.value.length < 3
    ) {
      setQualificationError("Enter valid qualification");
      setQualBtnDisabled(true);
    } else {
      setQualificationError("");
      setQualBtnDisabled(false);
    }
  };

  const handleSpecialisationChange = (e) => {
    setSpecialisationInput(e.target.value);
    const specRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setSpecialisationError("");
      setSpecBtnDisabled(true);
    } else if (
      !specRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value) ||
      e.target.value.length < 3
    ) {
      setSpecialisationError("Enter valid specialisation");
      setSpecBtnDisabled(true);
    } else {
      setSpecialisationError("");
      setSpecBtnDisabled(false);
    }
  };

  // const handleCertificateImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   const fileNames = files.map((file) => file.name);
  //   setCertificatesArray(fileNames);
  // };

  const handleCertificateImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);

    // Update the state with the array of files
    setCertificatesArray(fileList);
  };
  //Adding cities to preferred cities
  const addElement = (elementToAdd) => {
    try {
      if (elementToAdd === "city") {
        if (cityInput === "") setAddBtnDisabled(true);
        for (let i = 0; i < preferredCities.length; i++) {
          if (preferredCities[i] === cityInput) {
            setPreferredCitiesError("City already exists");
            return;
          } else {
            setPreferredCitiesError("");
            setAddBtnDisabled(true);
          }
        }
        setPreferredCities((prevCities) => [...prevCities, cityInput]);
        setCityInput("");
        setAddBtnDisabled(true);
      } else if (elementToAdd === "qualification") {
        if (qualificationInput === "") setQualBtnDisabled(true);
        for (let i = 0; i < qualification.length; i++) {
          if (qualification[i] === qualificationInput) {
            setQualificationError("Qualification already exists");
            return;
          } else {
            setQualificationError("");
            setQualBtnDisabled(true);
          }
        }
        setQualification((prevQual) => [...prevQual, qualificationInput]);
        setQualificationInput("");
        setQualBtnDisabled(true);
      } else if (elementToAdd === "spec") {
        if (specialisationInput === "") setSpecBtnDisabled(true);
        for (let i = 0; i < specialisation.length; i++) {
          if (specialisation[i] === specialisationInput) {
            setSpecialisationError("Qualification already exists");
            return;
          } else {
            setSpecialisationError("");
            setSpecBtnDisabled(true);
          }
        }
        setSpecialisation((prevSpec) => [...prevSpec, specialisationInput]);
        setSpecialisationInput("");
        setSpecBtnDisabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //remove cities from preferredCities
  function removeElement(itemToRemove, operation) {
    try {
      if (operation === "city") {
        const updatedCities = preferredCities.filter(
          (city) => city !== itemToRemove
        );
        setPreferredCities(updatedCities);
      } else if (operation === "qual") {
        const updatedQual = qualification.filter(
          (qual) => qual !== itemToRemove
        );
        setQualification(updatedQual);
      } else if (operation === "spec") {
        const updatedSpec = specialisation.filter(
          (spec) => spec !== itemToRemove
        );
        setSpecialisation(updatedSpec);
      } else if (operation === "certificate") {
        const updatedCertificates = certifications.filter(
          (cert) => cert.name !== itemToRemove
        );
        setCertificatesArray(updatedCertificates);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(preferredCities);
  }

  const handleLowerLimitChange = (e) => {
    const newValue = e.target.value;
    const role = user?.role;

    if (newValue.length === 0) {
      setLowerLimitError("");
    } else if (isNaN(newValue)) {
      setLowerLimitError("Enter a valid number");
    } else if (role === "babysitter" && newValue > 10) {
      setLowerLimitError("Lower limit cannot exceed 10 for babysitters");
    } else if (role === "nurse" && newValue < 10) {
      setLowerLimitError("Lower limit cannot be less than 10 for nurse");
    } else if (parseInt(newValue) > parseInt(ageRange.upperLimit)) {
      setLowerLimitError("Lower limit cannot be greater than upper limit");
    } else {
      setLowerLimitError("");
    }

    setAgeRange((prevAgeRange) => ({
      ...prevAgeRange,
      lowerLimit: newValue,
    }));
  };

  const handleUpperLimitChange = (e) => {
    const newValue = e.target.value;
    const role = user?.role; // Assuming you have the user's role available

    if (newValue.length === 0) {
      setupperLimitError("");
    } else if (isNaN(newValue)) {
      setupperLimitError("Enter a valid number");
    } else if (role === "nurse" && newValue < 10) {
      setupperLimitError("Upper limit cannot be less than 10 for nurses");
    } else if (role === "babysitter" && newValue > 10) {
      setupperLimitError("Upper limit cannot exceed 10 for babysitters");
    } else if (parseInt(newValue) < parseInt(ageRange.lowerLimit)) {
      setupperLimitError("Upper limit cannot be less than lower limit");
    } else {
      setupperLimitError("");
    }

    setAgeRange((prevAgeRange) => ({
      ...prevAgeRange,
      upperLimit: newValue,
    }));
  };

  // const handleStartTimeChange = (newTime) => {
  //   // const parseTime = parseISO(newTime);
  //   // const startTimeTime = moment(parseTime, "HH:mm").format("HH:mm");

  //   if (!newTime) {
  //     setStartTimeError("");
  //     return;
  //   }

  //   const parsedTime = parse(newTime, "HH:mm", new Date());
  //   const startTimeTime = format(parsedTime, "HH:mm");
  //   console.log("parsetime", parsedTime);
  //   console.log("start time", startTimeTime);
  //   if (startTimeTime >= endTime) {
  //     setStartTimeError("Start time must be earlier than end time");
  //   } else if (endTime <= startTimeTime) {
  //     setStartTimeError("Start time must be greater than end time");
  //   } else {
  //     setStartTime(startTimeTime);
  //     setStartTimeError("");
  //   }
  // };

  // const handleStartTimeChange = (newTime) => {
  //   try {
  //     if (!newTime) {
  //       setStartTimeError("");
  //       return;
  //     }

  //     const dateTime = new Date(newTime);

  //     if (isNaN(dateTime.getTime())) {
  //       console.error("Invalid time value after parsing:", newTime);
  //       return;
  //     }

  //     const hours = dateTime.getHours();
  //     const minutes = dateTime.getMinutes();
  //     const parsedTime = parse(`${hours}:${minutes}`, "HH:mm", new Date());

  //     if (isNaN(parsedTime.getTime())) {
  //       console.error("Invalid time value after parsing:", newTime);
  //       return;
  //     }

  //     const startTimeTime = format(parsedTime, "HH:mm");
  //     setStartTime(startTimeTime);
  //     console.log(startTimeTime);

  //     if (startTimeTime >= endTime) {
  //       setStartTimeError("Start time must be earlier than end time");
  //     } else if (endTime <= startTimeTime) {
  //       setStartTimeError("Start time must be greater than end time");
  //     } else {
  //       setStartTime(startTimeTime);
  //       setStartTimeError("");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleStartTimeChange:", error);
  //   }
  // };
  const handleStartTimeChange = (newTime) => {
    try {
      if (!newTime) {
        setStartTimeError("");
        return;
      }

      const dateTime = new Date(newTime);

      if (isNaN(dateTime.getTime())) {
        console.error("Invalid time value after parsing:", newTime);
        return;
      }

      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      const parsedTime = parse(`${hours}:${minutes}`, "HH:mm", new Date());

      if (isNaN(parsedTime.getTime())) {
        console.error("Invalid time value after parsing:", newTime);
        return;
      }

      const startTimeTime = format(parsedTime, "HH:mm");
      setStartTime(startTimeTime);
      console.log(startTimeTime);

      if (endTime && startTimeTime >= endTime) {
        setStartTimeError("Start time must be earlier than end time");
      } else if (endTime && startTimeTime <= endTime) {
        setStartTimeError("Start time must be greater than end time");
      } else {
        setStartTimeError("");
      }
    } catch (error) {
      console.error("Error in handleStartTimeChange:", error);
    }
  };

  const handleEndTimeChange = (newTime) => {
    try {
      if (!newTime) {
        setEndTimeError("");
        return;
      }

      const dateTime = new Date(newTime);

      if (isNaN(dateTime.getTime())) {
        console.error("Invalid time value after parsing:", newTime);
        return;
      }

      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      const endTimeTime = format(
        parse(`${hours}:${minutes}`, "HH:mm", new Date()),
        "HH:mm"
      );
      setEndTime(endTimeTime);
      console.log(endTimeTime);

      if (startTime && endTimeTime <= startTime) {
        setEndTimeError("End time must be later than start time");
      } else if (startTime && endTimeTime >= startTime) {
        setEndTimeError("");
      } else {
        setEndTimeError("End time must be earlier than start time");
      }
    } catch (error) {
      console.error("Error in handleEndTimeChange:", error);
    }
  };

  // const handleEndTimeChange = (newTime) => {
  //   // Extract time part only

  //   const endTimeTime = moment(parseISO(newTime), "HH:mm").format("HH:mm");
  //   console.log(endTimeTime);
  //   if (newTime.length === 0) {
  //     setEndTimeError("");
  //   } else if (endTimeTime <= startTime) {
  //     setEndTimeError("End time must be later than start time");
  //   } else if (startTime >= endTimeTime) {
  //     setEndTimeError("End time must be earlier than start time");
  //   } else {
  //     setEndTime(endTimeTime);
  //     setEndTimeError("");
  //   }
  // };

  // const handleEndTimeChange = (newTime) => {
  //   try {
  //     if (!newTime) {
  //       setEndTimeError("");
  //       return;
  //     }

  //     const dateTime = new Date(newTime);

  //     if (isNaN(dateTime.getTime())) {
  //       console.error("Invalid time value after parsing:", newTime);
  //       return;
  //     }

  //     const hours = dateTime.getHours();
  //     const minutes = dateTime.getMinutes();
  //     const endTimeTime = format(
  //       parse(`${hours}:${minutes}`, "HH:mm", new Date()),
  //       "HH:mm"
  //     );
  //     setEndTime(endTimeTime);
  //     console.log(endTimeTime);

  //     if (endTimeTime <= startTime) {
  //       setEndTimeError("End time must be later than start time");
  //     } else if (startTime >= endTimeTime) {
  //       setEndTimeError("End time must be earlier than start time");
  //     } else {
  //       setEndTimeError("");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleEndTimeChange:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const workingHours = {
      from: startTime,
      to: endTime,
    };
    console.log(workingHours);

    formData.append("yearsExperience", yearsExperience);
    formData.append("feesPerDay", feesPerDay);
    // formData.append("preferredCities", preferredCities);
    formData.append("description", description);
    // formData.append("qualification", qualification);
    // formData.append("specialisation", specialisation);
    formData.append("ageRange", JSON.stringify(ageRange));
    formData.append("workingHours", JSON.stringify(workingHours));
    formData.append("userId", user._id);

    preferredCities.forEach((city) => {
      formData.append(`preferredCities[]`, city);
    });
    qualification.forEach((qual) => {
      formData.append("qualification[]", qual);
    });
    specialisation.forEach((spec) => {
      formData.append("specialisation[]", spec);
    });

    // Append certificates to the form data
    certifications.forEach((file) => {
      formData.append(`certifications`, file);
    });

    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/apply-caregiver",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
        navigate("/");
        localStorage.setItem("caregiverApplied", true);
      } else {
        // toast.error(res.data.message, {
        //   position: toast.POSITION.TOP_CENTER,
        // });
        dispatch(openAlert({ severity: "error", content: res.data.message }));
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      dispatch(
        openAlert({ severity: "error", content: "Something went wrong!" })
      );
      // toast.error("Something went wrong");
    }
  };

  return (
    <>
      <form
        action=""
        method="post"
        className="space-y-2 mt-11 py-3 px-4 w-full max-w-3xl m-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4 items-center mb-5">
          <div className="p-2 rounded-full hover:bg-slate-200">
            <Link to="/">
              <AiOutlineArrowLeft className="text-lg" />
            </Link>
          </div>
          <Typography variant="h4" className="">
            Apply for {user?.role} account
          </Typography>
        </div>
        <div className="mt-9 flex flex-col gap-7">
          <div className="flex items-center justify-center gap-6">
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Experience"
                multiline
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={experienceError ? true : false}
                type="text"
                name="yearsExperience"
                autoComplete="off"
                placeholder="Enter years of experience"
                required
                value={yearsExperience}
                onChange={handleExperienceChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {experienceError}
                </Typography>
              </div>
            </div>
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Fees"
                multiline
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={feesPerDayError ? true : false}
                type="text"
                name="feesPerDay"
                autoComplete="off"
                placeholder="Enter your fees per day"
                required
                value={feesPerDay}
                onChange={handleFeesPerDayChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {feesPerDayError}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-start flex-row gap-3 ">
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Description"
                multiline
                rows={4}
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={descriptionError ? true : false}
                type="text"
                name="description"
                placeholder="Enter about description"
                autoComplete="off"
                required
                value={description}
                onChange={handleDescriptionChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {descriptionError}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-start flex-row gap-3 ">
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Qualification"
                multiline
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={qualificationError ? true : false}
                type="text"
                name="qualification"
                placeholder="Enter your qualification"
                autoComplete="off"
                required={qualification.length == 0 ? true : false}
                value={qualificationInput}
                onChange={handleQualificationChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {qualificationError}
                </Typography>
              </div>
            </div>

            <Button
              type="button"
              className={`bg-[#f3f4f6] py-4 px-5 rounded outline-blue-600`}
              disabled={qualBtnDisabled}
              onClick={() => addElement("qualification")}
            >
              Add
            </Button>
          </div>
          <div className="flex items-center justify-start gap-2 w-full flex-wrap mb-3">
            {qualification &&
              qualification.map((qual, index) => {
                return (
                  <Chip
                    key={index}
                    label={qual}
                    onDelete={() => removeElement(qual, "qual")}
                  />
                );
              })}
          </div>

          <div className="flex items-start flex-row gap-3 ">
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Preferred cities"
                multiline
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={preferredCitiesError ? true : false}
                type="text"
                name="preferredCities"
                placeholder="Enter your preferred cities"
                autoComplete="off"
                required={preferredCities.length == 0 ? true : false}
                value={cityInput}
                onChange={handlePreferredCitiesChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {preferredCitiesError}
                </Typography>
              </div>
            </div>
            <Button
              type="button"
              className={`bg-[#f3f4f6] py-4 px-5 rounded outline-blue-600`}
              disabled={addBtnDisabled}
              onClick={() => addElement("city")}
            >
              Add
            </Button>
          </div>

          <div className="flex items-center justify-start gap-2 w-full flex-wrap mb-3">
            {preferredCities &&
              preferredCities.map((city, index) => {
                return (
                  <Chip
                    key={index}
                    label={city}
                    onDelete={() => removeElement(city, "city")}
                  />
                );
              })}
          </div>

          <div className="flex items-start flex-row gap-3 ">
            <div className="w-full">
              <TextField
                id="outlined-textarea"
                label="Specialisation"
                multiline
                className={` w-full bg-[#f3f4f6]  text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border`}
                error={specialisationError ? true : false}
                type="text"
                name="specialisation"
                placeholder="Enter your specialisation"
                autoComplete="off"
                required={specialisation.length == 0 ? true : false}
                value={specialisationInput}
                onChange={handleSpecialisationChange}
              />
              <div className="h-4">
                <Typography
                  variant="span"
                  className="text-red-500 text-sm mt-1"
                >
                  {specialisationError}
                </Typography>
              </div>
            </div>
            <Button
              type="button"
              className={`bg-[#f3f4f6] py-4 px-5 rounded outline-blue-600`}
              disabled={specBtnDisabled}
              onClick={() => addElement("spec")}
            >
              Add
            </Button>
          </div>
          <div className="flex items-center justify-start gap-2 w-full flex-wrap">
            {specialisation &&
              specialisation.map((spec, index) => {
                return (
                  <Chip
                    key={index}
                    label={spec}
                    onDelete={() => removeElement(spec, "spec")}
                  />
                );
              })}
          </div>
          <div className="flex items-start flex-col gap-3">
            <Typography variant="h6" htmlFor="">
              Working hours
            </Typography>
            <div className="flex items-start flex-row gap-3 w-full">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="w-1/2">
                  <TimePicker
                    label="From"
                    value={startTime}
                    name="workingHours"
                    onChange={handleStartTimeChange}
                    className="mt-1 w-full bg-[#f3f4f6] text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border"
                    error={startTimeError ? true : false}
                  />
                  <div className="h-4">
                    <Typography
                      variant="span"
                      className="text-red-500 text-sm mt-1"
                    >
                      {startTimeError}
                    </Typography>
                  </div>
                </div>
                <div className="w-1/2">
                  <TimePicker
                    label="To"
                    name="workingHours"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="mt-1 w-full bg-[#f3f4f6] text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border"
                    error={endTimeError ? true : false}
                  />
                  <div className="h-4">
                    <Typography
                      variant="span"
                      className="text-red-500 text-sm mt-1"
                    >
                      {endTimeError}
                    </Typography>
                  </div>
                </div>
              </LocalizationProvider>
            </div>
          </div>

          <div className="mb-8">
            <Box className="flex items-start flex-col space-y-4">
              <Typography variant="h6" htmlFor="">
                Preferred age of client
              </Typography>
              <Box className="w-full flex items-center gap-3">
                <Box className="w-1/2">
                  <TextField
                    label="Lower limit"
                    type="number"
                    multiline
                    className="mt-1 w-full bg-[#f3f4f6] text-sm rounded-md  transition-[outline] duration-200 outline-blue-600 border"
                    value={ageRange.lowerLimit}
                    error={lowerLimitError ? true : false}
                    name="ageRange"
                    onChange={handleLowerLimitChange}
                    inputProps={{ minLength: 1, maxLength: 99 }}
                  />
                  <div className="h-4">
                    <Typography
                      variant="span"
                      className="text-red-500 text-sm mt-1"
                    >
                      {lowerLimitError}
                    </Typography>
                  </div>
                </Box>
                <Box className="w-1/2">
                  <TextField
                    label="Upper limit"
                    multiline
                    type="number"
                    className="mt-1 w-full bg-[#f3f4f6] text-sm rounded-md transition-[outline] duration-200 outline-blue-600 border "
                    value={ageRange.upperLimit}
                    error={upperLimitError ? true : false}
                    name="ageRange"
                    onChange={handleUpperLimitChange}
                    inputProps={{ minLength: 2, maxLength: 100 }}
                  />
                  <div className="h-4">
                    <Typography
                      variant="span"
                      className="text-red-500 text-sm mt-1"
                    >
                      {upperLimitError}
                    </Typography>
                  </div>
                </Box>
              </Box>
            </Box>
          </div>

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
                      type="file"
                      accept="image/png,jpg,jpeg"
                      className="sr-only"
                      onChange={handleCertificateImageChange}
                      multiple
                    />
                  </label>
                  <p className="text-xs  text-gray-600">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="h-4">
              <span className="text-red-500 text-sm mt-1"></span>
            </div>
            {/* <div className="flex items-center justify-start gap-2 w-full flex-wrap">
              {certifications &&
                certifications.map((img, index) => {
                  return (
                    <>
                      <Chip
                        key={index}
                        label={img}
                        onDelete={() => removeElement(img, "certificate")}
                      />
                    </>
                  );
                })}
            </div> */}
          </div>
          <Button
            variant="contained"
            type="submit"
            className="bg-[#1976d2] hover:bg-[#1565c0]"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default ApplyNurse;
