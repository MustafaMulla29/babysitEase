// Subscription.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setSubscribed,
  resetSubscription,
} from "../redux/features/subscriptionSlice";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { AiOutlineArrowLeft, AiOutlineCheck } from "react-icons/ai";
import { IoIosPricetags } from "react-icons/io";
import { GiDuration } from "react-icons/gi";
import { MdDateRange } from "react-icons/md";
import { GrPlan } from "react-icons/gr";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import moment from "moment";

const Subscription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isSubscribed = useSelector(selectIsSubscribed);
  const [step, setStep] = useState(1);
  // const [popoverOpen, setPopoverOpen] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user);

  const plans = [
    {
      title: "1 Month",
      price: "599",
      duration: "Monthly",
      features: ["Access to all content", "Cancel anytime"],
    },
    {
      title: "3 Months",
      price: "1,440",
      duration: "Quarterly",
      features: ["Save 20% compared to monthly", "Exclusive perks"],
    },
    {
      title: "1 Year",
      price: "6,188",
      duration: "Annually",
      features: ["Best value", "Priority support"],
    },
  ];

  const handleSubscription = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const data = {
        user_id: user?._id,
        expiryDate,
        plan: selectedPlan[0].duration,
        price: selectedPlan[0].price,
        status: "Active",
      };
      const res = await axios.post(
        "http://localhost:8070/api/v1/caregiver/subscribe",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setSubscribed());
        localStorage.setItem("subscriptionStatus", "Active");
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");
      } else {
        dispatch(hideLoading());
        toast.error("Something went wrong", {
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Function to set the selected plan
  const handleSelectPlan = (plan) => {
    setSelectedPlan([plan]);
    handleNext();
    setLoading(true);
  };

  useEffect(() => {
    if (step === 2 && selectedPlan) {
      const currentDate = new Date();
      setPurchaseDate(currentDate.toDateString());

      // Calculate expiry date based on the selected plan's duration
      const expDate = new Date(currentDate);

      switch (selectedPlan[0].duration) {
        case "Monthly":
          expDate.setMonth(expDate.getMonth() + 1);
          break;
        case "Quarterly":
          expDate.setMonth(expDate.getMonth() + 3);
          break;
        case "Annually":
          expDate.setFullYear(expDate.getFullYear() + 1);
          break;
        default:
          break;
      }
      const date = moment(expDate).format("YYYY-MM-DD");
      setExpiryDate(date);
    }
  }, [step, selectedPlan, expiryDate]);

  useEffect(() => {
    const storedStatus = localStorage.getItem("subscriptionStatus");

    if (storedStatus === "Active") {
      dispatch(setSubscribed());
    } else {
      dispatch(resetSubscription());
    }
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      <Container>
        {step === 1 && (
          <Container
            className={`h-screen space-y-7 my-20 mt-8 opacity-0 transition-[opacity] duration-500 ease-in-out ${
              step === 1 ? "opacity-100" : ""
            }`}
          >
            <div className="space-y-3">
              <Typography className="text-2xl text-center font-bold w-1/2 m-auto">
                {loading ? (
                  <Skeleton animation="wave" />
                ) : (
                  "Get most out of BabysitEase with right subscription"
                )}
              </Typography>
              <Typography className="text-center w-1/2 m-auto">
                {loading ? (
                  <Skeleton animation="wave" />
                ) : (
                  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto corrupti repudiandae, obcaecati ratione quos excepturi ad at sequi soluta earum."
                )}
              </Typography>
            </div>
            <Grid container spacing={4} className="mt-8">
              {loading ? (
                <div className="flex items-center justify-center flex-wrap gap-6 pt-[32px] pl-[32px]">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={346}
                    height={276}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={346}
                    height={276}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={346}
                    height={276}
                  />
                </div>
              ) : (
                <>
                  {plans.map((plan, index) => (
                    <Grid
                      item
                      className="justify-center"
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                    >
                      <Card className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg min-w-xs">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <Typography
                            variant="h5"
                            component="div"
                            className="text-lg font-bold mb-2"
                          >
                            {plan.title}
                          </Typography>
                          <Typography
                            variant="h4"
                            component="div"
                            className="text-3xl font-bold mb-4"
                          >
                            RS {plan.price}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-4"
                          >
                            {plan.duration} Plan
                          </Typography>
                          <ul className="mb-6 text-sm">
                            {plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <span className="text-green-500">&#10003;</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant="contained"
                            className="bg-[#f4f5fa] text-black rounded-full hover:bg-[#c9ccdd]"
                            onClick={() => handleSelectPlan(plan)}
                          >
                            Subscribe
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Container>
        )}

        {step === 2 && (
          <div>
            <div className="mt-10">
              <Button onClick={() => setStep((prev) => prev - 1)}>
                <AiOutlineArrowLeft className="text-lg" />
              </Button>
            </div>
            <Container
              className={`mt-32 opacity-0 transition-[opacity] duration-500 ease-in-out ${
                step === 2 ? "opacity-100" : ""
              }`}
            >
              <Grid container spacing={3} className="shadow-none">
                <Grid item xs={12} md={6} className="shadow-none pl-0 sm:pl-6">
                  <Paper elevation={3} className="p-4 shadow-none">
                    <Typography variant="h5" gutterBottom>
                      {loading ? (
                        <Skeleton width={350} animation="wave" />
                      ) : (
                        " Selected Plan Details"
                      )}
                    </Typography>
                    {selectedPlan?.map((plan, index) => (
                      <div key={index}>
                        <Typography
                          variant="h5"
                          component="div"
                          className="text-lg font-bold mb-2"
                        >
                          {loading ? (
                            <Skeleton width={200} animation="wave" />
                          ) : (
                            plan.title
                          )}
                        </Typography>
                        <Typography
                          variant="h4"
                          component="div"
                          className="text-3xl font-bold mb-4"
                        >
                          {loading ? (
                            <Skeleton width={100} animation="wave" />
                          ) : (
                            `RS ${plan.price}`
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mb-4"
                        >
                          {loading ? (
                            <Skeleton width={85} animation="wave" />
                          ) : (
                            ` ${plan.price} plan`
                          )}
                        </Typography>
                        <ul className="mb-6 text-sm">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-green-500">
                                {loading ? (
                                  <Skeleton width={20} animation="wave" />
                                ) : (
                                  <AiOutlineCheck />
                                )}
                              </span>
                              <span>
                                {" "}
                                {loading ? (
                                  <Skeleton width={200} animation="wave" />
                                ) : (
                                  feature
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="">
                      <Typography className=" my-4 text-[13px] sm:text-base font-bold">
                        {loading ? (
                          <Skeleton width={150} animation="wave" />
                        ) : (
                          "Your plan details"
                        )}
                      </Typography>
                      <div className="p-2 flex items-start justify-between flex-row sm:w-[80%] w-full">
                        <div className="space-y-2">
                          <Typography>
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              <span className="text-[13px] sm:text-base flex items-center justify-start gap-1">
                                <GrPlan />
                                Plan
                              </span>
                            )}
                          </Typography>
                          <Typography>
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              <span className="text-[13px] sm:text-base flex items-center justify-start gap-1">
                                <IoIosPricetags />
                                Price
                              </span>
                            )}
                          </Typography>
                          <Typography>
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              <span className="text-[13px] sm:text-base flex items-center justify-start gap-1">
                                <GiDuration />
                                Duration
                              </span>
                            )}
                          </Typography>
                          <Typography>
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              <span className="text-[13px] sm:text-base flex items-center justify-start gap-1">
                                <MdDateRange />
                                Purchase Date
                              </span>
                            )}
                          </Typography>
                          <Typography>
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              <span className="text-[13px] sm:text-base flex items-center justify-start gap-1">
                                <MdDateRange />
                                Expiry date
                              </span>
                            )}
                          </Typography>
                        </div>
                        <div className="space-y-2">
                          <Typography className="text-[13px] sm:text-base">
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              selectedPlan[0].title
                            )}
                          </Typography>
                          <Typography className="text-[13px] sm:text-base">
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              selectedPlan[0].price
                            )}
                          </Typography>
                          <Typography className="text-[13px] sm:text-base">
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              selectedPlan[0].duration
                            )}
                          </Typography>
                          <Typography className="text-[13px] sm:text-base">
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              purchaseDate
                            )}
                          </Typography>
                          <Typography className="text-[13px] sm:text-base">
                            {loading ? (
                              <Skeleton width={100} animation="wave" />
                            ) : (
                              expiryDate
                            )}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6} className="shadow-none">
                  <Paper elevation={3} className="p-4 shadow-none">
                    <Typography variant="h5" className="mb-4" gutterBottom>
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        "Subscribe Now"
                      )}
                    </Typography>
                    <form action="" method="post" onSubmit={handleSubscription}>
                      {loading ? (
                        <Skeleton animation="wave" height={80} />
                      ) : (
                        <TextField
                          id="outlined-textarea"
                          label="Name"
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          multiline
                          autoComplete="off"
                          className={`w-full rounded-md mb-6 border  outline-blue-600 `}
                          // minLength={3}
                          inputProps={{ minLength: 3, type: "text" }}
                          value={name}
                          onChange={handleNameChange}
                          required
                        />
                      )}
                      {loading ? (
                        <Skeleton animation="wave" height={80} />
                      ) : (
                        <TextField
                          id="outlined-textarea"
                          label="email"
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          multiline
                          autoComplete="off"
                          className={`w-full rounded-md mb-6 border  outline-blue-600 `}
                          // minLength={3}
                          // inputProps={{ type: "email" }}
                          value={email}
                          onChange={handleEmailChange}
                          required
                        />
                      )}
                      {loading ? (
                        <Skeleton animation="wave" height={60} />
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className="bg-[#1976d2] hover:bg-[#1565c0] w-full"
                        >
                          Subscribe
                        </Button>
                      )}
                    </form>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </div>
        )}
      </Container>
    </>
  );
};

export default Subscription;
