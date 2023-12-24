import React, { useState } from "react";
import { adminMenu, babysitterMenu, nurseMenu, userMenu } from "../data/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Tooltip,
} from "@mui/material";
import { AiFillBell, AiFillNotification } from "react-icons/ai";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  //redering menu list

  const role = user?.isAdmin ? "Admin" : user?.role;

  //logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout success!", {
      position: toast.POSITION.TOP_CENTER,
    });
    // message.success("Logout successfully!");
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // *********NURSE MENU******
  const newNurseMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "fa-solid fa-user-nurse",
    },
    {
      name: "Profile",
      path: `/nurse/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  // *********NURSE MENU******

  //*************BABYSITTER MENU */
  const babysitterMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "fa-solid fa-user-nurse",
    },
    {
      name: "Profile",
      path: `/babysitter/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  //*************BABYSITTER MENU */

  //*************USER MENU */
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "My Bookings",
      path: "/mybookings",
      icon: "fa-solid fa-list",
    },
    {
      name: "Book a caregiver",
      path: "/bookcaregiver",
      icon: "fa-solid fa-user-nurse",
    },
    {
      name: "Profile",
      path: `/client/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  //*************USER MENU */

  const sidebarMenu = user?.isAdmin
    ? adminMenu
    : (user?.role == "babysitter" && babysitterMenu) ||
      (user?.role == "nurse" ? newNurseMenu : userMenu);
  return (
    <>
      <section className="main ">
        <nav>
          <ul className="flex items-center justify-between w-[75%] m-auto p-4">
            <li>
              <a href="/">Logo</a>
            </li>
            <div className="">
              <div className="header flex items-center justify-center gap-7">
                <Chip className="uppercase" label={user?.role} />
                <Link to="/profile" className="text-lg uppercase">
                  {user?.name}
                </Link>
                {/* <i className="fa-solid fa-bell text-xl"></i> */}
                <Tooltip title="Notification" arrow>
                  <IconButton onClick={handleClick}>
                    <Badge
                      badgeContent={user?.notification?.length}
                      className=""
                      color="primary"
                    >
                      <AiFillBell
                      // onClick={() => {
                      //   navigate("/notification");
                      // }}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <List>
                    {user?.notification && user.notification.length > 0 ? (
                      user.notification.map((notification, index) => (
                        <div key={index}>
                          <ListItem>
                            <ListItemText primary={notification.message} />
                          </ListItem>
                          <ListItem
                            button
                            onClick={() => navigate("/notification")}
                          ></ListItem>
                        </div>
                      ))
                    ) : (
                      <ListItem>
                        {user?.notification.length > 0 ? (
                          <ListItemText primary="See all notifications" />
                        ) : (
                          <ListItemText primary="No notifications" />
                        )}
                      </ListItem>
                    )}
                  </List>
                </Popover>
                <Box>
                  {user?.profilePicture ? (
                    <Avatar
                      alt="Profile Picture"
                      src={`http://localhost:8070/${user.profilePicture}`}
                      sx={{ width: 50, height: 50 }}
                    />
                  ) : (
                    <Avatar
                      alt="Default Profile Picture"
                      // src="/default-profile-picture.jpg" // Replace with the path to your default profile picture
                      src={user?.profilePicture} // Replace with the path to your default profile picture
                      sx={{ width: 50, height: 50 }}
                    />
                  )}
                </Box>
              </div>
            </div>
          </ul>
        </nav>
        <div className="body flex items-start justify-between mx-auto w-[80%]  mt-[55px]">
          <div className="min-h-[100%] w-[300px] rounded-md shadow-lg shadow-[#989898]  px-2 py-4">
            {sidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <>
                  <div
                    className={`menu-items ${
                      isActive && "bg-slate-200"
                    } px-2 flex items-center gap-2 rounded transition-all py-2 hover:bg-slate-200  `}
                    key={index}
                  >
                    <i className={`${menu.icon}  text-lg`}></i>
                    <Link to={menu.path} className="text-xl">
                      {menu.name}
                    </Link>
                  </div>
                </>
              );
            })}
            {user?.role === "nurse" && user?.isCaregiver === false ? (
              <div className="menu-items px-2 cursor-pointer flex items-center gap-2 transition-all py-2 hover:bg-slate-200">
                <i className="fa-solid fa-user text-lg"></i>
                <Link to="/apply-nurse" className="text-xl">
                  Apply for nurse
                </Link>
              </div>
            ) : user?.role === "babysitter" && user?.isCaregiver === false ? (
              <div className="menu-items px-2 cursor-pointer flex items-center gap-2 transition-all py-2 hover:bg-slate-200">
                <i className="fa-solid fa-user text-lg"></i>
                <Link to="/apply-babysitter" className="text-xl">
                  Apply for babysitter
                </Link>
              </div>
            ) : (
              ""
            )}
            <div
              className="menu-items px-2 cursor-pointer flex items-center gap-2 transition-all py-2 hover:bg-slate-200"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket text-lg"></i>
              <Link to="/login" className="text-xl">
                Logout
              </Link>
            </div>
            {/* <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              // subheader={
              //   <ListSubheader component="div" id="nested-list-subheader">
              //     Nested List Items
              //   </ListSubheader>
              // }
            >
              <ListItemButton>
                <ListItemIcon>
                  <AiFillBell />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AiFillBell />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AiFillBell />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AiFillBell />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List> */}
          </div>
          <div className="children w-[80%] py-4">{children}</div>
          {/* <div className="">
            <div className="header flex items-center justify-center gap-7">
              <span className="uppercase bg-slate-200 px-3 py-2 rounded-md text-[13px]">
                {role}
              </span>
              <Link to="/profile" className="text-lg uppercase">
                {user?.name}
              </Link>
              <Tooltip title="Notification" arrow>
                <IconButton onClick={handleClick}>
                  <Badge
                    badgeContent={user?.notification.length}
                    color="primary"
                  >
                    <AiFillBell
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <List>
                  {user?.notification.map((notification, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={notification.message} />
                    </ListItem>
                  ))}
                </List>
                <ListItem button onClick={() => navigate("/notification")}>
                  <ListItemText primary="See all notifications" />
                </ListItem>
              </Popover>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Layout;
