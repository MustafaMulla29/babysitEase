import { Paper, Skeleton, Typography } from "@mui/material";

const BookingDetailsSkeleton = () => {
  return (
    <>
      <Paper elevation={3} className="p-6 mb-8 bg-white rounded-md shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <Skeleton
              animation="wave"
              variant="circular"
              sx={{ width: 80, height: 80 }}
            />
            <Typography>
              <Skeleton animation="wave" width={100} />
            </Typography>
            <Typography>
              <Skeleton animation="wave" width={100} />
            </Typography>
            <Typography>
              <Skeleton animation="wave" width={100} />
            </Typography>
            <Typography className="flex items-center gap-3">
              <Skeleton animation="wave" width={100} />
            </Typography>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default BookingDetailsSkeleton;
