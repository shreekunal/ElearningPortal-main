import React, { useState, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextField, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { getCookie } from "../Cookie/Cookie.jsx";
import { jwtDecode } from "jwt-decode";
import Front_ENV from "../../../Front_ENV.jsx";
import { CurrentUserContext } from "../../App";

const AddAnnouncement = ({ courses }) => {
  const { showMessage } = useContext(CurrentUserContext);
  const myToken = getCookie("token");
  const userId = jwtDecode(myToken).id;
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    announcement: "",
    creatorId: userId,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title !== "" && formData.announcement !== "") {
      const response = await fetch(
        `${Front_ENV.Back_Origin}/createPost/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token"),
          },

          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.message) {
        showMessage(data.message, false);
        navigate(`/AddMaterial/${id}`);
      } else {
        showMessage(data.error, true);
      }
    }
  };
  const currentCourse = courses.find((course) => course.id === id);
  return (
    <div>
      <Box sx={{ width: "80%", margin: "80px auto" }}>
        <button
          className="goBackBtn"
          style={{ top: "10px", left: "85px" }}
          onClick={() => navigate(`/AddMaterial/${id}`)}
        >
          <svg
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Back</span>
        </button>
        <h4 className="mb-3">Add Announcement</h4>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="announcementTitle"
            fullWidth
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            multiline
            rows={1}
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
          <TextField
            label="content"
            name="announcementContent"
            fullWidth
            type="text"
            value={formData.announcement}
            onChange={(e) =>
              setFormData({ ...formData, announcement: e.target.value })
            }
            multiline
            rows={2}
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
          <TextField
            label="Course Title"
            name="courseTitle"
            readOnly
            fullWidth
            type="text"
            value={currentCourse.title || "Course Not Available"}
            InputProps={{
              readOnly: true,
            }}
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
            className="green-bg pascalCase-text"
            fullWidth
            sx={{ my: 2 }}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default AddAnnouncement;
