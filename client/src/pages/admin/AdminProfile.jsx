// AdminProfile.js
import { useEffect, useState } from "react";
import { Paper, Avatar, Grid, Typography, Skeleton } from "@mui/material";
import axios from "axios";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  useEffect(() => {
    const getAdminDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/api/v1/admin/getAdminDetails",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.data.success) {
          setAdminData(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAdminDetails();
  }, []);
  return (
    <Paper elevation={3} className="py-3 px-4 rounded-md shadow-md">
      <Grid container spacing={4} alignItems="center" direction="column">
        <Grid item xs={12} md={4}>
          {!adminData?.profilePicture ? (
            <Skeleton
              animation="wave"
              sx={{ width: 100, height: 100 }}
              variant="circular"
            />
          ) : (
            <Avatar
              alt={adminData?.name}
              src={adminData?.profilePicture}
              sx={{ width: 100, height: 100 }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" className="mb-4">
            {!adminData ? (
              <Skeleton animation="wave" width={150} />
            ) : (
              adminData?.name
            )}
          </Typography>
          <Typography variant="body1" className="mb-2">
            {!adminData ? (
              <Skeleton animation="wave" width={100} />
            ) : (
              adminData?.email
            )}
          </Typography>

          <Typography variant="body1" className="mb-2">
            {!adminData ? (
              <Skeleton animation="wave" width={100} />
            ) : (
              `${adminData?.address}, ${adminData?.city}`
            )}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminProfile;
