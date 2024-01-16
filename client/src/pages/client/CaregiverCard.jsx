import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";

const CaregiverCard = React.memo(({ caregiver, index }) => {
  const {
    user: { name, address, city, profilePicture },
    rating,
    ageRange,
    feesPerDay,
    qualification,
    preferredCities,
    description,
  } = caregiver;
  const navigate = useNavigate();

  const bgColors = [
    "linear-gradient(180deg, #72ffd5 30%, #72ffd5 33%, white 33%)",
    "linear-gradient(180deg, #9fc1ff 30%, #9fc1ff 33%, white 33%)",
    "linear-gradient(180deg, #adc0ea 30%, #adc0ea 33%, white 33%)",
    "linear-gradient(180deg, #99d9ff 30%, #99d9ff 33%, white 33%)",
    "linear-gradient(180deg, #a5cfe7 30%, #a5cfe7 33%, white 33%)",
    "linear-gradient(180deg, #fec6e3 30%, #fec6e3 33%, white 33%)",
    "linear-gradient(180deg, #fed7ae 30%, #fed7ae 33%, white 33%)",
    "linear-gradient(180deg, #ff97a2 30%, #ff97a2 33%, white 33%)",
  ];

  // Get the background color based on the index
  const bgColor = bgColors[index % bgColors.length];

  return (
    <>
      <Card
        className="w-56 max-w-xs pt-8  rounded-md overflow-hidden shadow-md transition"
        sx={{
          background: `${bgColor}`,
          // background: "-webkit-linear-gradient(180deg,#c446ee 30%,white 33%)",
        }}
      >
        <Avatar
          className="border-4 border-white"
          alt={name}
          src={`http://localhost:8070/${profilePicture}`}
          sx={{ width: 90, height: 90, margin: "auto" }}
        />

        <CardContent>
          <Typography
            variant="h6"
            component="div"
            className="font-semibold text-center text-xl mb-3 cursor-pointer hover:underline hover:underline-offset-4"
            onClick={() => navigate(`/caregiver/${caregiver?.userId}`)}
          >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            {address.substring(0, 20) + "..."}, {city}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="mb-2 flex items-center gap-2"
          >
            Rating:{" "}
            <Rating name="read-only" value={rating} readOnly precision={0.5} />
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Age Range: {ageRange.lowerLimit} - {ageRange.upperLimit} years
          </Typography>
        </CardContent>
      </Card>

      {/* <Card className="space-y-3 py-2 px-4 w-full">
        <div className="flex items-center gap-2">
          <Avatar
            alt={name}
            src={
              profilePicture
                ? `http://localhost:8070/${profilePicture}`
                : "./../../img/default_avatar.jpg"
            }
            sx={{ width: 100, height: 100 }}
          />
          <div>
            <Typography
              variant="h6"
              component="div"
              className="font-semibold text-xl mb-2 cursor-pointer"
              onClick={() => navigate(`/caregiver/${caregiver?.userId}`)}
            >
              {name}
            </Typography>
            <Typography>
              <span className="flex items-center gap-1">
                <CiLocationOn />
                {city}
              </span>
            </Typography>
          </div>
        </div>
        <div>
          <Typography>RS{feesPerDay}/day</Typography>
        </div>
        <div>
          {preferredCities?.map((city, index) => {
            return (
              <Chip
                key={index}
                label={city}
                className="text-base bg-[#f2f7f2]"
              />
            );
          })}
        </div>
        <div>
          <Typography>{description?.substring(0, 150)}...</Typography>
        </div>
      </Card> */}
    </>
  );
});

export default CaregiverCard;
