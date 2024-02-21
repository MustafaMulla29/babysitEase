import { Paper, Skeleton, Typography, Chip } from "@mui/material";

const BookingDetailsSkeleton = () => {
  return (
    <Paper
      elevation={3}
      className="p-6 mb-8 bg-white rounded-md shadow-md mr-6"
    >
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Skeleton
            animation="wave"
            variant="circular"
            sx={{
              width: 70,
              height: 70,
              borderRadius: "10px",
              marginRight: "20px",
            }}
          />
          <div className="flex items-start flex-col gap-1">
            <Typography>
              <Skeleton animation="wave" width={120} />
            </Typography>
            <Chip label={<Skeleton animation="wave" width={40} />} />
          </div>
        </div>
      </div>

      <div className="my-2">
        <Typography>
          <Skeleton animation="wave" width={150} />
        </Typography>
      </div>

      <div className="flex items-center gap-2 flex-row flex-wrap my-3">
        <Typography>
          <span className="flex items-center gap-3">
            <Skeleton animation="wave" width={30} height={30} />
            <Skeleton animation="wave" width={80} />
          </span>
        </Typography>
        <span>-</span>
        <Typography>
          <span className="flex items-center gap-3">
            <Skeleton animation="wave" width={30} height={30} />
            <Skeleton animation="wave" width={80} />
          </span>
        </Typography>
      </div>

      <div>
        <Typography className="flex items-center gap-1">
          <Skeleton animation="wave" width={30} height={30} />
          <Skeleton animation="wave" width={80} />
        </Typography>
      </div>

      <Typography className="flex items-center gap-1">
        <Skeleton
          animation="wave"
          width={30}
          height={30}
          variant="circular"
          sx={{ marginRight: 1 }}
        />
        <Skeleton animation="wave" width={80} />
      </Typography>
    </Paper>
  );
};

export default BookingDetailsSkeleton;
