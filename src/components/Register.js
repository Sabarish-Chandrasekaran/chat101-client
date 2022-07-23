import React, { useState } from "react";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick2 = () => setShow2(!show2);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "https://chat-1-on-1.herokuapp.com/user/register",
          {
            username,
            email,
            password,
            pic,
          },
          config
        );
        toast.success("Registeration Successfull", toastOptions);
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chats");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          toast.error(error.response.data.msg, toastOptions);
        }
      }
    }
  };
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please Select an Image!", toastOptions);
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/sabarish27k6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please Select an Image!", toastOptions);
      setPicLoading(false);
      return;
    }
  };

  return (
    <>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <Stack>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type={show ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            onChange={(e) => handleChange(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ cursor: "pointer" }}
                  onClick={handleClick}
                >
                  {show ? "Hide" : "Show"}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type={show ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => handleChange(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ cursor: "pointer" }}
                  onClick={handleClick2}
                >
                  {show2 ? "Hide" : "Show"}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            sx={{ marginTop: "18px" }}
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
          <LoadingButton
            sx={{ marginTop: "18px" }}
            variant="contained"
            type="submit"
            loading={picLoading}
          >
            Register
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
};

export default Register;
