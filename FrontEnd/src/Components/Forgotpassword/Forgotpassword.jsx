import {useContext,useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextField, Box } from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {CurrentUserContext} from "../../App.jsx";
import Front_ENV from "../../../Front_ENV.jsx";
const ForgotPassword = () => {
  // const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
  });
  const { setLoading, showMessage } = useContext(CurrentUserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${Front_ENV.Back_Origin}/forgotpassword`,
            JSON.stringify({...formData, isedit: false}),
            {
              headers: { "Content-Type": "application/json" },
            }
        ).then((response) => {
          setLoading(false);
          return response;
        });
        if (!response.data.error) {
          showMessage(response.data.message, false);
        } else {
          showMessage(response.data.error, true);
        }
      } catch (error) {
        setLoading(false);
        showMessage("Something went wrong. Please try again.", true);
      }
    }, 1000);
  };

  return (
    
     <Box sx={{ margin: "0 auto",  width: "100%", maxWidth: "700px",padding: {xs: 2, sm: 3, md: 4, },  }} >
        <h4 className="mb-3">Reset your password</h4>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
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
          />

          <Button
            type="submit"
            variant="contained"
            className="extraBold-text pascalCase-text"
            style={{ backgroundColor: "#fb8928", color: "black" }}
            fullWidth
            sx={{ my: 2 }}
          >
            Reset Password
          </Button>

          {/* Forgot Password Link */}
          <NavLink
            to="/login"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Back to Login
          </NavLink>
        </form>
      </Box>
    
  );
}

export default ForgotPassword
