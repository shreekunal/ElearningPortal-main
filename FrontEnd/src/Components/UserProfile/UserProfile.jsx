import { useState, useContext, useEffect, useRef } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import {Back_Origin} from '../../../Front_ENV.jsx';
import { TextField } from '@mui/material' ;
import { CurrentUserContext } from "../../App";
import { getCookie, updateCookie } from "../Cookie/Cookie.jsx";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import './UserProfile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();
  const { showMessage, currentUser, setLoading, setCurrentUser } =
      useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const submitEditHandler = async () => {
    if (currentUser === profileData) {
      showMessage("No changes made", null);
      setIsEditing(false);
      return;
    }
    setTimeout(async () => {
      setLoading(true);
      await fetch(`${Back_Origin}/updateUser/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${getCookie("token")}`,
        },
        body: JSON.stringify({ ...profileData }),
      })
          .then((res) => res.json())
          .then(async (data) => {
            setTimeout(() => {
              setLoading(false);
              if (!data.error) {
                showMessage("Profile updated successfully", false);
                updateCookie("token", data.data);
                setCurrentUser(jwtDecode(data.data));
                setIsEditing(false);
              } else {
                showMessage(data.error, true);
              }
            }, 1400);
          })
          .catch((err) => {
            console.clear();
            setTimeout(() => {
              showMessage(err.message, true);
              setLoading(false);
            }, 1400);
          });
    }, 500);
  };

  const changePassword = async () => {
    setLoading(true);
    await fetch(`${Back_Origin}/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profileData.email,
        isedit: true,
      }),
    })
        .then((res) => res.json())
        .then(async (data) => {
          setTimeout(() => {
            setLoading(false);
            if (!data.error) {
              const token = data.data.resetToken;
              navigate(`/resetPassword?token=${token}`, {
                state: { edit: true },
              });
            } else {
              showMessage(data.error, true);
            }
          }, 1400);
        });
  };
  return (
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 my-3 profile-container">

          <MDBRow className="profile-row">
            <MDBCol lg="4" className="d-flex justify-content-center align-items-center">
              <MDBCard style={{height: "320px", width: "80%"}}>
                <MDBCardBody className="text-center gap-3 justify-content-evenly align-items-center">
                  <MDBCardImage
                      src={`https://ui-avatars.com/api/?background=2d3480&color=`+
                           `fb8928&rounded=true&name=${currentUser.name}`}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ height: "160px", margin: "0 auto" }}
                      fluid
                  />
                  <p className="text-muted mb-1">{currentUser.role}</p>

                  <div className="d-flex justify-content-center align-items-center">
                    {
                      isEditing ?
                        <button className="btn ProfileSaveButton"
                                onClick={submitEditHandler}
                                type="submit">
                          Save
                        </button>
                      :
                        <button className="btn ProfileEditButton"
                                onClick={toggleEditMode}
                                type="submit">
                          Edit
                        </button>
                    }
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8" className="position-relative overflow-hidden">
              <MDBCard style={{gap: "30px", width: "100%", height: "100%"}}>
                <MDBCardBody className="justify-content-evenly" style={{transition: "all 0.3s ease-in-out"}}>
                  <MDBRow className="gap-2">
                    <MDBCol sm="3" className="d-flex align-items-center">
                      <div className="profile-left-labels">Name:</div>
                    </MDBCol>
                    <MDBCol sm="8" className="flex-grow-1">
                      {
                        isEditing ?
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                type="text"
                                value={profileData.name || ""}
                                onChange={handleChange}
                                required
                                sx={{
                                  my: 1,
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
                            :
                            <div className="Profile-Text-View">
                              {profileData.name || ""}
                            </div>
                      }
                    </MDBCol>
                  </MDBRow>
                  <hr/>
                  <MDBRow className="gap-2">
                    <MDBCol sm="3" className="d-flex align-items-center">
                      <div className="profile-left-labels">Username:</div>
                    </MDBCol>
                    <MDBCol sm="8" className="flex-grow-1">
                      {
                        isEditing ?
                            <TextField
                                label="Username"
                                name="username"
                                fullWidth
                                type="text"
                                value={profileData.username || ""}
                                onChange={handleChange}
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
                            :
                            <div className="Profile-Text-View">
                              {profileData.username || ""}
                            </div>
                      }
                    </MDBCol>
                  </MDBRow>
                  <hr/>
                  <MDBRow className="gap-2">
                    <MDBCol sm="3" className="d-flex align-items-center">
                      <div className="profile-left-labels">Email:</div>
                    </MDBCol>
                    <MDBCol sm="8" className="flex-grow-1">
                      {
                        isEditing ?
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                type="email"
                                value={profileData.email || ""}
                                onChange={handleChange}
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
                            :
                            <div className="Profile-Text-View">
                              {profileData.email || ""}
                            </div>
                      }
                    </MDBCol>
                  </MDBRow>
                  <hr/>
                  <MDBRow className="gap-2">
                    <MDBCol sm="3" className="d-flex align-items-center">
                      <div className="profile-left-labels">Password:</div>
                    </MDBCol>
                    <MDBCol sm="8" className="flex-grow-1">
                      <button className="btn ProfileSaveButton"
                              disabled={!isEditing}
                              style={{margin: "8px 0"}}
                              onClick={changePassword}>
                        Change Password
                      </button>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
  );
};

export default UserProfile;