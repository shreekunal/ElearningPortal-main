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
