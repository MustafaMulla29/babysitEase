import { useState } from "react";
import Layout from "../components/Layout";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  //   const handleChange = () => {};
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  // Handler function for tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMarkRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/get-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        window.location.reload();
      } else {
        toast.error(res.data.message, {
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
  const handleDeleteRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/delete-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        window.location.reload();
      } else {
        toast.error(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <Layout>
      <p className="p-3 text-center text-xl">Notifications</p>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Unread" />
            <Tab label="Read" />
            <Tab label="Item Three" />
          </Tabs>
        </Box>
        {selectedTab === 0 && (
          <div>
            <p>Unread notifications</p>
            {user?.notification.map((notif, index) => {
              return (
                <div
                  className="p-3 hover:bg-slate-100 transition-all cursor-pointer"
                  key={index}
                >
                  <p
                    onClick={() => navigate(notif.onClickPath)}
                    className="cursor-pointer"
                  >
                    {notif.message}
                  </p>
                </div>
              );
            })}
            <Button variant="outlined" onClick={handleMarkRead}>
              Mark as read
            </Button>
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <p>Read notifications</p>
            {user?.seenNotification.map((notif, index) => {
              return (
                <div
                  className="p-3 hover:bg-slate-100 transition-all cursor-pointer"
                  key={index}
                >
                  <p
                    onClick={() => navigate(notif.onClickPath)}
                    className="cursor-pointer"
                  >
                    {notif.message}
                  </p>
                </div>
              );
            })}
            <Button variant="outlined" onClick={handleDeleteRead}>
              Delete read
            </Button>
          </div>
        )}
        {selectedTab === 2 && <div>Content for Tab 3</div>}
      </Box>
    </Layout>
  );
};

export default Notification;
