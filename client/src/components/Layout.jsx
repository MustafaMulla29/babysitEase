import { useEffect, useState } from "react";
import { adminMenu } from "../data/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { AiFillBell } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import { GiPartyPopper } from "react-icons/gi";
import { FaList } from "react-icons/fa";
import { FcApproval, FcCancel } from "react-icons/fc";
import { PropTypes } from "prop-types";
import Zoom from "@mui/material/Zoom";
// import bgGradient from "./../lotties/bg_gradient.json";
import { openAlert } from "../redux/features/messageSlice";

const Layout = ({ children }) => {
  const [navBg, setNavBg] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //redering menu list

  //logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    // toast.success("Logout success!");
    dispatch(
      openAlert({ severity: "success", content: "Logged out successfully!" })
    );
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
      path: "/caregiver/bookings",
      icon: "fa-solid fa-user-nurse",
    },
    // {
    //   name: "Profile",
    //   path: `/nurse/profile/${user?._id}`,
    //   icon: "fa-solid fa-user",
    // },
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
      path: "/caregiver/bookings",
      icon: "fa-solid fa-user-nurse",
    },
    // {
    //   name: "Profile",
    //   path: `/babysitter/profile/${user?._id}`,
    //   icon: "fa-solid fa-user",
    // },
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
      path: "/client/bookings",
      icon: "fa-solid fa-list",
    },
    {
      name: "Favourites",
      path: `/client/favourites/${user?._id}`,
      icon: "fa-solid fa-user",
    },
    {
      name: "Profile",
      path: `/client/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  //*************USER MENU */

  const sidebarMenu = user?.isAdmin
    ? adminMenu
    : (user?.role == "babysitter" && babysitterMenu) ||
      (user?.role == "nurse" ? newNurseMenu : userMenu);

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 30 ||
        document.documentElement.scrollTop > 30
      ) {
        setNavBg(true);
      } else {
        setNavBg(false);
      }
    };

    // Call handleScroll initially to set the initial state
    handleScroll();

    // Attach the event listener to the scroll event
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setNavBg]);

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: bgGradient,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };
  return (
    <>
      <section className="main relative bg-white">
        {/* <div
          style={{ backgroundSize: "200% 200%" }}
          className="fixed z-0 top-0 left-0 blur-lg opacity-30  pointer-events-none animate-change-bg"
        >
          <Lottie
            options={defaultOptions}
            isClickToPauseDisabled={true}
            className="cursor-default"
          />
        </div> */}
        <header
          className={` sticky top-0 left-0 z-[999] transition-colors duration-200  ${
            navBg
              ? "bg-[#d2f2f7] bg-opacity-30 backdrop-filter backdrop-blur-md"
              : "bg-transparent"
          } border-b border-b-[#d2f2f7]`}
        >
          <nav className={`flex w-[80%] m-auto  items-center justify-between `}>
            <div className="py-2 px-[2px] w-20 cursor-pointer">
              <a href="/">
                <img
                  src="./../../img/babysitEase_logo.png"
                  className=" w-full h-full"
                  alt="logo"
                />
              </a>
            </div>
            <ul className="flex flex-row gap-3 items-start p-4">
              {sidebarMenu.map((menu, index) => {
                const isActive = location.pathname === menu.path;
                return (
                  <li
                    className={`menu-items relative ${
                      isActive ? "bg-gray-200" : "hover:bg-gray-100"
                    }  flex items-center gap-2 rounded-full transition-all  mb-2`}
                    key={index}
                  >
                    <Link
                      to={menu.path}
                      className={`text-base px-4 py-2 ${
                        isActive ? "text-blue-500" : "text-gray-700"
                      }`}
                    >
                      {menu.name}
                    </Link>
                  </li>
                );
              })}
              {user?.role === "nurse" && user?.isCaregiver === false ? (
                <div className="cursor-pointer px-4 flex items-center gap-2 rounded-full transition-all py-2 mb-2">
                  <Link
                    to="/apply-nurse"
                    className={`text-base ${
                      location.pathname === "/apply-nurse"
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    Apply for nurse
                  </Link>
                </div>
              ) : user?.role === "babysitter" && user?.isCaregiver === false ? (
                <div className="cursor-pointer px-4 flex items-center gap-2 rounded-full transition-all py-2 mb-2">
                  <Link
                    to="/apply-babysitter"
                    className={`text-base ${
                      location.pathname === "/apply-babysitter"
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    Apply for babysitter
                  </Link>
                </div>
              ) : (
                ""
              )}
            </ul>
            <div className="">
              <div className="header flex items-center justify-center gap-7">
                <Tooltip title="Notification" TransitionComponent={Zoom} arrow>
                  <IconButton
                    onClick={
                      user?.notification.length > 0
                        ? handleClick
                        : () => navigate("/notification")
                    }
                  >
                    <Badge
                      badgeContent={user?.notification?.length}
                      className=""
                      color="primary"
                    >
                      <AiFillBell />
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
                      user.notification
                        .slice(0, 2)
                        .map((notification, index) => (
                          <ListItem key={index}>
                            <span>
                              {notification.type ===
                                `${user?.role}-account-request-approved` && (
                                <GiPartyPopper className="text-2xl mr-2" />
                              )}
                              {notification.type === "booking-Approved" && (
                                <FcApproval className="text-2xl mr-2" />
                              )}
                              {notification.type === "booking-Rejected" && (
                                <FcCancel className="text-2xl mr-2" />
                              )}
                            </span>
                            <ListItemText primary={notification.message} />
                          </ListItem>
                        ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          onClick={() => navigate("/notification")}
                          className="cursor-pointer"
                          primary="See all"
                        />
                      </ListItem>
                    )}

                    {user?.notification && user.notification.length > 0 && (
                      <ListItem
                        button
                        onClick={() => navigate("/notification")}
                      >
                        <span>
                          <FaList className="mr-2" />
                        </span>
                        <ListItemText primary="See all notifications" />
                      </ListItem>
                    )}
                  </List>
                </Popover>
                <Box>
                  <Avatar
                    alt="Profile Picture"
                    src={
                      user?.profilePicture
                        ? `http://localhost:8070/${user.profilePicture}`
                        : "./../../img/default_avatar.jpg"
                    }
                    sx={{ width: 50, height: 50 }}
                  />
                </Box>

                <Tooltip title="Log out" TransitionComponent={Zoom} arrow>
                  <IconButton onClick={handleClick}>
                    <Link to="/login" onClick={handleLogout} className="p-2">
                      <IoMdLogOut className="text-xl text-black" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </nav>
        </header>
        <div className="body flex items-center justify-center m-auto w-full mt-[20px]">
          <div
            className={`children ${
              user?.role === "admin" ? "w-[95%]" : "w-[78%]"
            } py-4`}
          >
            {children}
          </div>
        </div>
      </section>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
