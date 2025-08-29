import React, { useEffect, useState, useContext } from "react";
import { CurrentUserContext } from "../../App";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Box,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { Back_Origin } from "../../../Front_ENV.jsx";

const ChangePassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeErrors, setActiveErrors] = useState([]);
  const [formData, setFormData] = useState({
    oldpassword: "",
    password: "",
    confirmpassword: "",
  });
  const state = useLocation().state;

  const { showMessage } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const response = await fetch(`${Back_Origin}/verifyRestToken/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        showMessage(data.error, true);
        navigate("/");
      }
    } catch (error) {
      showMessage("Something went wrong, please try again", true);
      navigate("/");
    }
  };

  // Start auto checker for token validity
  useEffect(() => {
    if (token !== null) {
      const interval = setInterval(() => {
        setUpdate((prevState) => !prevState);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (token !== null) {
      checkToken();
    } else {
      showMessage("Token is required", true);
      navigate(-1);
    }
  }, [update]);

  useEffect(() => {
    if (error && !activeErrors.includes(error)) {
      setActiveErrors([...activeErrors, error]);
      showMessage(error, true);
    }
  }, [error]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleClickShowPassword3 = () => setShowPassword3(!showPassword3);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle keypress for Enter key navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3008/resetPassword/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            state && state.edit
              ? { ...formData, mode: "ChangePassword" }
              : formData
          ),
        }
      );

      const data = await response.json();
      if (!data.error) {
        showMessage(data.message, false);
        if (state && state.edit) {
          navigate("/Profile");
        } else {
          navigate("/login");
        }
      } else {
        if (data.error.toLowerCase().includes("token")) {
          showMessage("Invalid token, please try again", true);
          navigate("/login");
        } else {
          showMessage(data.error, true);
        }
      }
    } catch (error) {
      showMessage("Something went wrong, please try again", true);
      navigate("/login");
    }
  };

  return (
    <>
      <Box
        sx={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "700px",
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {passwordError ? (
          <>
            <h4>Set your new password</h4>
            <Alert severity="error" sx={{ my: 2 }}>
              {passwordError}
            </Alert>
          </>
        ) : (
          <h4 className="mb-3">Set your new password</h4>
        )}
        <form onSubmit={handleSubmit}>
          {/* Old Password Field */}
          {state && state.edit && (
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
              <InputLabel>Old Password</InputLabel>
              <OutlinedInput
                name="oldpassword"
                required
                value={formData.oldpassword}
                onChange={(e) => {
                  setFormData({ ...formData, oldpassword: e.target.value });
                  if (
                    e.target.value === "" &&
                    formData.confirmpassword === ""
                  ) {
                    setPasswordError("");
                  }
                }}
                type={showPassword3 ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword3}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ padding: "12px" }}
                    >
                      {showPassword3 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <Tooltip title="Password must be at least 8 characters long, include a number, a special character (@$!%*?&), an uppercase letter and a lowercase letter.">
                      <IconButton edge="end">
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
                label="Old Password"
              />
            </FormControl>
          )}
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
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (e.target.value === "" && formData.confirmpassword === "") {
                  setPasswordError("");
                }
              }}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ padding: "12px" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <Tooltip title="Password must be at least 8 characters long, include a number, a special character (@$!%*?&), an uppercase letter and a lowercase letter.">
                    <IconButton edge="end">
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {/* Confirm Password Field */}
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
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              name="confirmpassword"
              required
              value={formData.confirmpassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmpassword: e.target.value });
                if (formData.password !== e.target.value) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
              type={showPassword2 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword2}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>

          {/* Sign In Button */}
          {passwordError ? (
            <Button
              type="submit"
              disabled
              variant="contained"
              className="extraBold-text pascalCase-text"
              style={{ cursor: "not-allowed", opacity: 0.7 }}
              fullWidth
              sx={{ my: 2, backgroundColor: "#fb8928", color: "black" }}
            >
              Submit
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              className="extraBold-text pascalCase-text"
              fullWidth
              sx={{ my: 2, backgroundColor: "#fb8928", color: "black" }}
            >
              Submit
            </Button>
          )}
        </form>
      </Box>
    </>
  );
};

export default ChangePassword;
