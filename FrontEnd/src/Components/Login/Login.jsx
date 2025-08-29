import { useState, useContext } from "react";
import { CurrentUserContext } from "../../App";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import 'react-toastify/dist/ReactToastify.css';
import { Button, FormControl, InputLabel, OutlinedInput, TextField, InputAdornment, Box, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from "react-router-dom";
import { setCookie } from "../Cookie/Cookie.jsx";
import {Back_Origin} from '../../../Front_ENV.jsx';
import './Login.css';
import Loader from "../Loader/Loader.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { setCurrentUser, setIsAuthenticated, showMessage } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  if (loader) {
    return <Loader />;
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle keypress for Enter key navigation
  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.target.value) {
        showMessage(' Please enter your ' + field, true);
        return;
      }
      if (field === 'username') {
        // Move focus to the password field
        e.target.parentElement.parentElement.nextElementSibling.children[1].children[0].focus()
      } else if (field === 'password') {
        // Submit the form when pressing Enter on the password field
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const response = await fetch(`${Back_Origin}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoader(false);
      if (!data.error) {
        showMessage(data.message, false);
        setCookie('token', data.data);
        setIsAuthenticated(true);
        setCurrentUser(jwtDecode(data.data));
        navigate('/courses');
      } else {
        // Show error message
        showMessage(data.error, true);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setLoader(false);
      showMessage('An error occurred. Please try again later.', true);
      setIsAuthenticated(false);
    }
  };

  return (
    <>
      <Box className="login-container">
        <h4 className="mb-3">Login to your account</h4>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <TextField
            label="Username"
            name="username"
            fullWidth
            type="text"
            value={formData.username}
            onKeyDown={(e) => handleKeyPress(e, "username")}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              toast.dismiss();
            }}
            required
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#274546",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#274546",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#274546 !important",
                },
              },
            }}
          />

          {/* Password Field */}
          <FormControl
            variant="outlined"
            fullWidth
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#274546",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#274546",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#274546 !important",
                },
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => handleKeyPress(e, "password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="contained"
            className="extraBold-text pascalCase-text"
            style={{ backgroundColor: "#fb8928", color: "black" }}
            fullWidth
            sx={{ my: 2 }}
          >
            Sign In
          </Button>

          {/* Forgot Password Link */}
          <NavLink
            to="/ForgetPassword"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Forgot password?
          </NavLink>

          {/* Sign Up Link */}
          <NavLink
            to="/signup"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Don't have an account? Sign up
          </NavLink>
        </form>
      </Box>
    </>
  );
};

export default Login;

