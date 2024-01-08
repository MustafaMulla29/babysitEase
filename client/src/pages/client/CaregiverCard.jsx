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

const CaregiverCard = ({ caregiver }) => {
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
  return (
    <>
      {/* <Card className="max-w-xs bg-white rounded-md overflow-hidden shadow-md transition">
        <Avatar
          alt={name}
          src={`http://localhost:8070/${profilePicture}`}
          sx={{ width: 100, height: 100, margin: "auto" }}
        />

        <CardContent>
          <Typography
            variant="h6"
            component="div"
            className="font-semibold text-xl mb-2 cursor-pointer"
            onClick={() => navigate(`/caregiver/${caregiver?.userId}`)}
          >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            {address}, {city}
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
      </Card> */}

      <Card className="space-y-3 py-2 px-4 w-full">
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
      </Card>
    </>
  );
};

export default CaregiverCard;
