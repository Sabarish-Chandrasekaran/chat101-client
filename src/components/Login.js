import React, { useState } from "react";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const validateForm = () => {
    const { email, password } = values;
    if (email === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { email, password } = values;
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "https://chat-1-on-1.herokuapp.com/user/login",
          {
            email,
            password,
          },
          config
        );
        toast.success("Login Successfull", toastOptions);
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

  return (
    <>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <Stack>
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
          <LoadingButton
            sx={{ marginTop: "18px" }}
            variant="contained"
            type="submit"
          >
            Login
          </LoadingButton>
        </Stack>
      </form>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Login;
