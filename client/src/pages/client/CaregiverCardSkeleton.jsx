import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CaregiverCardSkeleton = () => {
  return (
    <Card className="max-w-xs bg-white rounded-md overflow-hidden shadow-md transition">
      <center>
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          animation="wave"
        />
      </center>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          className="font-semibold text-xl mb-2 cursor-pointer"
        >
          <Skeleton animation="wave" width={200} />
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-2">
          <Skeleton animation="wave" width={150} />
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="mb-2 flex items-center gap-2"
        >
          <Skeleton animation="wave" width={100} />
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-2">
          <Skeleton animation="wave" width={100} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CaregiverCardSkeleton;
