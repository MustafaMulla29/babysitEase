import React from "react";
import { Card, CardContent, Typography, Avatar, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CaregiverCard = ({ caregiver }) => {
  const {
    user: { name, address, city, profilePicture },
    rating,
    ageRange,
    qualification,
  } = caregiver;
  const navigate = useNavigate();
  return (
    <Card className="max-w-xs bg-white rounded-md overflow-hidden shadow-md transition">
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
    </Card>
  );
};

export default CaregiverCard;
