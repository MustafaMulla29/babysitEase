import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Button, TextField, Typography } from "@mui/material";
import { setUser } from "../redux/features/userSlice";
import animationData from "./../lotties/babysitter.json";
import Lottie from "react-lottie";
import { openAlert } from "../redux/features/messageSlice";

const Login = () => {
  //input values state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // input error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // const { user } = useSelector((state) => state.user);
  // const isSubscribed = useSelector(selectIsSubscribed);
  //navigate
  const navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();

  //onchange functions
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value.length == 0) {
      setEmailError("");
    } else if (e.target.value.includes("@") && e.target.value.includes(".")) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email");
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length == 0) {
      setPasswordError("");
    } else if (e.target.value.length < 5) {
      setPasswordError("Enter a valid password");
    } else {
      setPasswordError("");
    }
  };

  //from useSubscription custom hook
  //form handler
  const submitHandler = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/login",
        { email, password },
        config
      );

      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        // toast.success(res.data.message, {
        //   position: toast.POSITION.TOP_CENTER,
        // });
        dispatch(openAlert({ severity: "success", content: res.data.message }));
        // window.location.reload();
        dispatch(setUser(res.data.user));
        //changes made here 04-08-2023
        // if (isSubscribed === "Active" && user?.role !== "client") {
        //   setTimeout(() => {
        navigate("/");
        //   }, 0);
        // } else {
        // navigate("/subscribe");
        // }

        //to here
      } else {
        dispatch(openAlert({ severity: "error", content: res.data.message }));
        // message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      dispatch(
        openAlert({ severity: "error", content: "Something went wrong!" })
      );
      // toast.error("Something went wrong!");
      // message.error("Something went wrong!");
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4 w-full h-[100vh] bg-[url('./../../img/login_bg_3.svg')] bg-center bg-no-repeat bg-cover">
        <div className="w-1/2">
          {/* <img
            src="./../../img/babysitter_graphic.svg"
            className="w-full h-full"
            alt=""
          /> */}
          <Lottie options={defaultOptions} width={400} height={400} />
        </div>

        <form
          action=""
          method="post"
          className="w-full max-w-md py-3 px-4 space-y-4 "
          onSubmit={submitHandler}
        >
          <h2 className="text-center text-4xl mb-9 font-bold">Welcome back!</h2>
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
          <div className="h-4">
            <Typography variant="span" className="text-red-500 text-sm mt-1">
              {emailError}
            </Typography>
          </div>

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
          <div className="h-4">
            {/* <span className="text-red-500 text-sm mt-1"></span> */}
            <Typography variant="span" className="text-red-500 text-sm mt-1">
              {passwordError}
            </Typography>
          </div>

          <div className="">
            <Typography variant="p" className="text-[14px] mt-5 mb-4">
              Already have an account?{" "}
              <Link
                to="/register"
                className=" transition-[underline] hover:underline hover:underline-offset-4"
              >
                Register here
              </Link>
            </Typography>
          </div>
          <div>
            {/* <button
              type="submit"
              className="py-3 px-5 w-full cursor-pointer rounded-md focus:outline-[#CCCCCC] focus:outline-2 transition-colors bg-blue-600 text-white mt-2 hover:bg-blue-500"
            >
              Submit
            </button> */}
            <Button
              type="submit"
              variant="contained"
              // style={{ padding: "10px 15px", width: "100%" }}
              className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
