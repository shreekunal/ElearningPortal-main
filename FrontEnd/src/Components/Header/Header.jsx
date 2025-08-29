import IconButton from "../IconButton/IconButton";
import MuiIconButton from "@mui/material/IconButton";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../App";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchBar from "../Search-MUI/Search-MUI";
const pages = [
  { name: "Courses", to: "/courses" }, // This is the only page that is not protected (logged in or not)
  {
    auth: true,
    name: "My Courses",
    to: "/MyCourses",
    role: ["student", "instructor"],
  }, // This page is protected (must be
  { auth: true, name: "Instructors ", to: "/InstructorsPage", role: ["admin"] },
  { auth: true, name: "Students ", to: "/StudentsPage", role: ["admin"] },
  // logged in)
  { auth: true, name: "Progress", to: `/ViewProgress`, role: ["student"] }, // This page is protected (must be
  // logged in)
];

const burgerListPages = [
  { name: "Courses", to: "/courses" },
  {
    auth: true,
    name: "My Courses",
    to: "/MyCourses",
    role: ["student", "instructor"],
  },
  { auth: true, name: "Instructors ", to: "/InstructorsPage", role: ["admin"] },
  { auth: true, name: "Students ", to: "/StudentsPage", role: ["admin"] },
  { auth: true, name: "Progress", to: `/ViewProgress`, role: ["student"] }, // This page is protected (must be
  { auth: false, name: "Login", to: "/login" },
  { auth: false, name: "Register", to: "/SignUp" },
  { auth: true, name: "Profile", to: "/profile" },
  { auth: true, name: "Logout", to: "/logout" },
];

const Header = ({ setFilter, showSearch = false }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { isAuthenticated, currentUser, loading } =
    useContext(CurrentUserContext);
  const route = useLocation().pathname;
  const navigate = useNavigate();

  // Define routes where back button should be shown
  const routesWithBackButton = [
    "/CourseBlog",
    "/CourseDetails",
    "/AddMaterial",
    "/AddAnnouncement",
    "/ViewProgress",
    "/AssignmentPage",
    "/ExamPage",
    "/CurrentInstructors",
    "/CurrentStudents",
    "/AssignInstructor",
    "/AddInstructor",
    "/AddStudent",
  ];

  const shouldShowBackButton = routesWithBackButton.some((path) =>
    route.includes(path)
  );

  const handleBackClick = () => {
    // Custom navigation logic for specific routes
    if (route.includes("/CurrentInstructors")) {
      navigate("/InstructorsPage");
    } else if (route.includes("/CurrentStudents")) {
      navigate("/StudentsPage");
    } else if (route.includes("/AssignInstructor")) {
      // Extract course ID from the path and navigate back to course details
      const pathParts = route.split("/");
      const courseId = pathParts[pathParts.length - 1];
      navigate(`/CourseDetails/${courseId}`);
    } else if (route.includes("/AddInstructor")) {
      navigate("/InstructorsPage");
    } else if (route.includes("/AddStudent")) {
      navigate("/StudentsPage");
    } else {
      navigate(-1); // Default back navigation for other routes
    }
  };

  const profileOptions = isAuthenticated
    ? [
        { name: "Profile", to: "/profile" },
        { name: "Logout", to: "/logout" },
      ]
    : [
        { name: "Login", to: "/login" },
        { name: "Register", to: "/SignUp" },
      ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenProfileMenu = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  return (
    <header
      className="header"
      style={
        route === "/" ? { position: "absolute", top: 0, zIndex: "100" } : {}
      }
    >
      <nav
        className="navbar"
        style={
          route === "/"
            ? loading
              ? { boxShadow: "0 0 20px 2px #00000052" }
              : { boxShadow: "0 0 20px 2px #00000052", background: "#3d673400" }
            : {}
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Back Button */}
          {shouldShowBackButton && (
            <MuiIconButton
              onClick={handleBackClick}
              sx={{
                color: "#f1f1f1",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                padding: "8px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ArrowBackIcon />
            </MuiIconButton>
          )}

          <NavLink
            to="/"
            style={{ textDecoration: "none" }}
            onDragStart={(e) => e.preventDefault()}
          >
            <div className="logo">Shiksha Samarth</div>
          </NavLink>
        </div>
        <div className="header-icon-group">
          {pages.map((page) =>
            currentUser.role &&
            page.role &&
            page.role.includes(currentUser.role.toLowerCase()) ? (
              page.auth === undefined ? (
                <IconButton
                  key={page.name}
                  label={page.name}
                  to={page.to}
                  className="nav-icon-buttons"
                />
              ) : (
                page.auth === isAuthenticated && (
                  <IconButton
                    key={page.name}
                    label={page.name}
                    to={page.to}
                    className="nav-icon-buttons"
                  />
                )
              )
            ) : !page.role ? (
              page.auth === undefined ? (
                <IconButton
                  key={page.name}
                  label={page.name}
                  to={page.to}
                  className="nav-icon-buttons"
                />
              ) : (
                page.auth === isAuthenticated && (
                  <IconButton
                    key={page.name}
                    label={page.name}
                    to={page.to}
                    className="nav-icon-buttons"
                  />
                )
              )
            ) : null
          )}

          {/* Search Bar */}
          {showSearch && setFilter && (
            <div className="header-search-container">
              <SearchBar setFilter={setFilter} variant="header" />
            </div>
          )}

          {/* Profile Icon with Dropdown */}
          <MuiIconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleOpenProfileMenu}
            color="inherit"
          >
            {currentUser.name ? (
              <img
                src={
                  `https://ui-avatars.com/api/?background=2d3480&color=` +
                  `fff&rounded=true&name=${currentUser.name}`
                }
                className="profile-image"
                alt="user"
              />
            ) : (
              <AccountCircleIcon fontSize="large" sx={{ color: "#f1f1f1" }} />
            )}
          </MuiIconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {profileOptions.map((option) => (
              <NavLink
                key={v4()}
                to={option.to}
                style={{ textDecoration: "none" }}
                onDragStart={(e) => e.preventDefault()}
              >
                <MenuItem onClick={handleCloseProfileMenu}>
                  <Typography>{option.name}</Typography>
                </MenuItem>
              </NavLink>
            ))}
          </Menu>
        </div>
        <Box
          sx={{
            display: {
              xs: "flex",
              sm: "flex",
              md: "none",
              "@media (max-width: 987px)": { display: "flex" },
              "@media (min-width: 987px)": { display: "none" },
            },
          }}
        >
          <MuiIconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon sx={{ color: "white", fontSize: "40px" }} />
          </MuiIconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: {
                xs: "block",
                md: "none",
                "@media (max-width: 987px)": { display: "block" },
                "@media (min-width: 987px)": { display: "none" },
              },
            }}
          >
            {burgerListPages.map((page) =>
              currentUser.role &&
              page.role &&
              page.role.includes(currentUser.role.toLowerCase()) ? (
                page.auth === undefined ? (
                  <NavLink
                    key={v4()}
                    to={page.to}
                    style={{ textDecoration: "none" }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page.name}
                      </Typography>
                    </MenuItem>
                  </NavLink>
                ) : (
                  isAuthenticated === page.auth && (
                    <NavLink
                      key={v4()}
                      to={page.to}
                      style={{ textDecoration: "none" }}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: "center" }}>
                          {page.name}
                        </Typography>
                      </MenuItem>
                    </NavLink>
                  )
                )
              ) : !page.role ? (
                page.auth === undefined ? (
                  <NavLink
                    key={v4()}
                    to={page.to}
                    style={{ textDecoration: "none" }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page.name}
                      </Typography>
                    </MenuItem>
                  </NavLink>
                ) : (
                  isAuthenticated === page.auth && (
                    <NavLink
                      key={v4()}
                      to={page.to}
                      style={{ textDecoration: "none" }}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: "center" }}>
                          {page.name}
                        </Typography>
                      </MenuItem>
                    </NavLink>
                  )
                )
              ) : null
            )}
          </Menu>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
