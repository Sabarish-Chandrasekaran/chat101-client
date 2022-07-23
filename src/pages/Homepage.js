import React, { useEffect } from "react";
import { Box, Typography, Container, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Login from "../components/Login";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box
        bgcolor="white"
        sx={{
          display: "flex",
          justifyContent: "center",
          p: "3px",

          width: "100%",
          m: "40px 0 15px 0",
          borderRadius: "10px",
          border: "4px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Work sans", fontWeight: "bold" }}
        >
          Chat 1-on-1
        </Typography>
      </Box>

      <Box bgcolor="white" sx={{ width: "100%", fontWeight: "bold" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} variant="fullWidth">
              <Tab
                label="Login"
                value="1"
                sx={{ fontSize: "16px", fontWeight: "550" }}
              />
              <Tab
                label="Register"
                value="2"
                sx={{ fontSize: "16px", fontWeight: "550" }}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Login />
          </TabPanel>
          <TabPanel value="2">
            <Register />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Homepage;
