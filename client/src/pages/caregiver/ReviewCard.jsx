import { Card, CardContent, Typography, Rating, Avatar } from "@mui/material";

const ReviewCard = ({ caregiverReviews }) => {
  const { clientName, clientProfilePicture, feedback, date, rating, comment } =
    caregiverReviews;
  return (
    <>
      {/* <Card className="max-w-md mx-auto mb-4 shadow-md bg-white rounded-md overflow-hidden">
        <div className="flex items-center p-4 bg-blue-500 text-white">
          <Avatar
            alt={clientName}
            src={
              clientProfilePicture
                ? `http://localhost:8070/${clientProfilePicture}`
                : "./../../img/default_avatar.jpg"
            }
            className="mr-3"
          />

          <Typography variant="h6">{clientName}</Typography>
        </div>
        <CardContent>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            {new Date(date).toLocaleDateString()} - {feedback}
          </Typography>
          <Rating name="read-only" value={rating} readOnly />
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginTop: "8px" }}
          >
            {comment}
          </Typography>
        </CardContent>
      </Card> */}
      {/* <div className="flex items-start">
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
          <Typography variant="h6">{clientName}</Typography>
          <Typography className="flex items-center gap-2">
            <span>
              <Rating name="read-only" value={rating} readOnly />
            </span>
            <Typography variant="caption" color="text.secondary">
              {new Date(date).toLocaleDateString()}
            </Typography>
          </Typography>
          <Typography className="mb-3">~{comment}</Typography>
          <Typography>{feedback}</Typography>
        </div>
      </div> */}
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
              <Typography variant="h6">{clientName}</Typography>
              <div className="flex items-center gap-2">
                <Rating name="read-only" value={rating} readOnly />
                <Typography variant="caption" color="text.secondary">
                  {new Date(date).toLocaleDateString()}
                </Typography>
              </div>
              <Typography className="mb-3">
                <i>~{comment}</i>
              </Typography>
              <Typography>{feedback}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
      <hr className="mb-8" />
    </>
  );
};

export default ReviewCard;
