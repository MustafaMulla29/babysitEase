import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Avatar, Box } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { setUser } from "../redux/features/userSlice";
// import { CloudUpload } from "@mui/icons-material";

const Register = () => {
  //input values states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  //input error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");

  //navigate
  const navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();

  //onchange handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
    const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setNameError("");
    } else if (
      !nameRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value)
    ) {
      setNameError("Invalid name format");
    } else if (e.target.value.length < 3) {
      setNameError("Enter a valid name");
    } else {
      setNameError("");
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    const addressRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setAddressError("");
    } else if (
      !addressRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value)
    ) {
      setAddressError("Enter a valid address");
    } else if (e.target.value.length < 3) {
      setAddressError("Enter a valid name");
    } else {
      setAddressError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (e.target.value.length == 0) {
      setEmailError("");
    } else if (!emailRegex.test(e.target.value)) {
      setEmailError("Enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length == 0) {
      setPasswordError("");
    } else if (e.target.value.length < 5) {
      setPasswordError("Enter atleast 5 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleAadharChange = (e) => {
    setAadharNumber(e.target.value);
    if (e.target.value.length == 0) {
      setAadharError("");
    } else if (isNaN(e.target.value) || e.target.value.length < 6) {
      setAadharError("Enter a valid aadhar number");
    } else {
      setAadharError("");
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    const cityRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
    if (e.target.value.length == 0) {
      setCityError("");
    } else if (
      !cityRegex.test(e.target.value) ||
      !/[aeiouAEIOU]/.test(e.target.value)
    ) {
      setCityError("Enter a valid city name");
    } else if (e.target.value.length < 3) {
      setCityError("Enter a valid city name");
    } else {
      setCityError("");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // You can perform additional checks or image processing here if needed
    setProfilePictureDisplay(URL.createObjectURL(file));
    setProfilePicture(file);
  };
  //form handler
  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   handleNameChange({ target: { value: name } });
  //   handleEmailChange({ target: { value: email } });
  //   handlePasswordChange({ target: { value: password } });
  //   handleAadharChange({ target: { value: aadharNumber } });
  //   handleCityChange({ target: { value: city } });

  //   // Check if there are any errors
  //   if (nameError || emailError || passwordError || aadharError || cityError) {
  //     toast.error("Please fill in the form correctly", {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //     return;
  //   }
  //   try {
  //     const values = {
  //       name,
  //       email,
  //       password,
  //       aadharNumber,
  //       role,
  //       address,
  //       city,
  //       gender,
  //       profilePicture,
  //     };
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     dispatch(showLoading());
  //     const res = await axios.post(
  //       "http://localhost:8070/api/v1/user/register",
  //       values,
  //       config
  //     );

  //     dispatch(hideLoading());
  //     if (res.data.success) {
  //       toast.success("Registered successfully!", {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //       localStorage.removeItem("subscriptionStatus");
  //       dispatch(setUser(values));
  //       // message.success("Registered successfully!");
  //       // localStorage.removeItem("isSubscribed");
  //       navigate("/login");
  //     } else {
  //       toast.error(res.data.message, {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //       // message.error(res.data.message);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     console.log(error);
  //     toast.error("Something went wrong!", {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //     // message.error("Something went wrong!");
  //   }
  // };
  const submitHandler = async (e) => {
    e.preventDefault();
    handleNameChange({ target: { value: name } });
    handleEmailChange({ target: { value: email } });
    handlePasswordChange({ target: { value: password } });
    handleAadharChange({ target: { value: aadharNumber } });
    handleCityChange({ target: { value: city } });

    // Check if there are any errors
    if (nameError || emailError || passwordError || aadharError || cityError) {
      toast.error("Please fill in the form correctly", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("aadharNumber", aadharNumber);
      formData.append("role", role);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("gender", gender);

      // Append the profile picture file if selected
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      dispatch(showLoading());

      const res = await axios.post(
        "http://localhost:8070/api/v1/user/register",
        formData,
        config
      );

      dispatch(hideLoading());

      if (res.data.success) {
        toast.success("Registered successfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
        localStorage.removeItem("subscriptionStatus");
        dispatch(setUser(formData));
        navigate("/login");
      } else {
        toast.error(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <>
      <div className="h-full w-full flex items-center justify-center">
        <form
          action=""
          method="post"
          className="w-full max-w-[700px] space-y-2 mt-11 py-3 px-4 "
          onSubmit={submitHandler}
        >
          <h1 className="text-5xl text-center mb-9 font-bold">
            Register for BabysitEase
          </h1>
          <div className="flex justify-center flex-col sm:flex-row sm:gap-9">
            <div className="flex items-start justify-start flex-col w-full gap-8">
              <div className="w-full space-y-8">
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    multiline
                    autoComplete="off"
                    className={`w-full rounded-md bg-[#f3f4f6] border transition-[outline] duration-200 outline-blue-600 `}
                    error={nameError ? true : false}
                    // minLength={3}
                    inputProps={{ minLength: 3 }}
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {nameError}
                    </Typography>
                  </div>
                </div>
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="Email"
                    name="email"
                    type="email"
                    multiline
                    placeholder="Enter your email"
                    autoComplete="off"
                    className={`w-full bg-[#f3f4f6] rounded-md transition-[outline] duration-200 outline-blue-600 border `}
                    error={emailError ? true : false}
                    value={email}
                    onChange={handleEmailChange}
                    autoFocus
                    required
                  />
                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {emailError}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-8">
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    className={`w-full bg-[#f3f4f6] rounded-md border transition-[outline] duration-200 outline-blue-600 `}
                    error={passwordError ? true : false}
                    // minLength={5}
                    // maxLength={10}
                    inputProps={{ minLength: 6, maxLength: 10 }}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />

                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {passwordError}
                    </Typography>
                  </div>
                </div>

                <div>
                  <TextField
                    id="outlined-textarea"
                    label="Aadhar Number"
                    multiline
                    type="text"
                    name="aadharNumber"
                    placeholder="Enter your aadhar number"
                    autoComplete="off"
                    className={`w-full bg-[#f3f4f6] rounded-md transition-[outline] duration-200 outline-blue-600 border `}
                    error={aadharError ? true : false}
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    // minLength={6}
                    // maxLength={10}
                    inputProps={{ minLength: 6, maxLength: 10 }}
                    required
                  />
                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {aadharError}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-start flex-col w-full gap-8 ">
              <div className="w-full space-y-8">
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="Address"
                    multiline
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    autoComplete="off"
                    className={`w-full bg-[#f3f4f6] rounded-md transition-[outline] duration-200 outline-blue-600 border `}
                    error={addressError ? true : false}
                    value={address}
                    onChange={handleAddressChange}
                    required
                  />
                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {addressError}
                    </Typography>
                  </div>
                </div>

                <div>
                  <TextField
                    id="outlined-textarea"
                    label="City"
                    multiline
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    autoComplete="off"
                    className={`w-full bg-[#f3f4f6] rounded-md transition-[outline] duration-200 outline-blue-600 border `}
                    error={cityError ? true : false}
                    value={city}
                    onChange={handleCityChange}
                    required
                  />
                  <div className="h-4 m-1">
                    <Typography className="text-red-500 text-sm mt-1">
                      {cityError}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-8">
                <div>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Role"
                      name="role"
                      className="w-full rounded-md bg-[#f3f4f6] border transition-[outline] duration-200 outline-blue-600"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      {/* <MenuItem value=""  className="">
                    {" "}
                    Select role
                  </MenuItem> */}
                      <MenuItem value="client" className="px-3 py-2">
                        Client
                      </MenuItem>
                      <MenuItem value="babysitter" className="px-3 py-2">
                        Babysitter
                      </MenuItem>
                      <MenuItem value="nurse" className="px-3 py-2">
                        Nurse
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <div className="h-4">
                    <span className="text-red-500 text-sm mt-1"></span>
                  </div>
                </div>

                <div>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Gender
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        name="gender"
                        // id="gender"
                        className=""
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        name="gender"
                        // id="gender"
                        value="female"
                        className=""
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        control={<Radio />}
                        label="Female"
                      />
                    </RadioGroup>
                  </FormControl>
                  <div className="h-4">
                    <span className="text-red-500 text-sm mt-1"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            {profilePictureDisplay && (
              <Box>
                <Avatar
                  alt="Profile Picture"
                  src={profilePictureDisplay}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            )}
          </div>
          <div className="">
            <Typography className="text-[14px] text-center my-3">
              Already have an account?{" "}
              <Link to="/login" className="hover:underline">
                Login here
              </Link>
            </Typography>
          </div>
          <div className="">
            <Button
              type="submit"
              variant="contained"
              // style={{ padding: "10px 15px", width: "100%" }}
              className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
