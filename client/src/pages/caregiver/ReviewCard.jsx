import { Card, CardContent, Typography, Rating, Avatar } from "@mui/material";
import { PropTypes } from "prop-types";
import React from "react";

const ReviewCard = React.memo(({ caregiverReviews }) => {
  const { clientName, clientProfilePicture, feedback, date, rating, comment } =
    caregiverReviews;
  return (
    <>
      <Card className="w-full mb-4 shadow-none bg-white rounded-md overflow-hidden">
        <CardContent>
          <div className="flex items-start">
            <div>
              <Avatar
                alt={clientName}
                sx={{ width: "60px", height: "60px" }}
                src={
                  clientProfilePicture
                    ? `http://localhost:8070/${clientProfilePicture}`
                    : "./../../img/default_avatar.jpg"
                }
                className="mr-3"
              />
            </div>
            <div className="flex items-start flex-col">
              <Typography variant="h6" className="font-semibold">
                {clientName}
              </Typography>
              <div className="flex items-center gap-2">
                <Rating name="read-only" value={rating} readOnly />
                <Typography variant="span" color="text.secondary">
                  {new Date(date).toLocaleDateString()}
                </Typography>
              </div>
              <Typography variant="p" className="mb-3 text-gray-600">
                <i>~{comment}</i>
              </Typography>
              <Typography variant="p" className="text-base">
                {feedback}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
      <hr className="mb-8" />
    </>
  );
});

ReviewCard.displayName = "ReviewCard";

ReviewCard.propTypes = {
  caregiverReviews: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    clientProfilePicture: PropTypes.string,
    feedback: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewCard;
