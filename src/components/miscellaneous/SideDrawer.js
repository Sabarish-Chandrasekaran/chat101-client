import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  ListItem,
  List,
  CircularProgress,
  MenuList,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Logout from "@mui/icons-material/Logout";
import { ChatState } from "../../ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";

function SideDrawer() {
  const toastOptions = {
    position: "top-left",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warn("Please Enter something in search", toastOptions);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured!", toastOptions);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat", toastOptions);
    }
  };
  //notification handler
  const [anchor, setAnchor] = useState(null);
  const openNotification = Boolean(anchor);
  const handleClickNotification = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchor(null);
  };
  // menu handler
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // drawer handler
  const [openD, setOpen] = useState(false);
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="white"
        width="97.7vw"
        p="5px 10px 5px 10px"
        border="5px"
      >
        <Tooltip title="Search Users to chat" arrow placement="bottom-end">
          <Button
            sx={{ color: "black", border: "1px", bgcolor: "#E8E8E8" }}
            onClick={() => setOpen(true)}
          >
            <Typography
              sx={{ display: { xs: "none", md: "none", lg: "block" } }}
              pr={0.5}
            >
              Search User
            </Typography>
            <SearchIcon />
          </Button>
        </Tooltip>

        <Typography fontSize="30px">Chat 1-on-1</Typography>

        <div>
          <Tooltip title="Notification" arrow placement="bottom-end">
            <Button
              onClick={handleClickNotification}
              sx={{ ml: 2, color: "black", border: "1px " }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <NotificationsActiveIcon />
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchor}
            id="account-menu"
            open={openNotification}
            onClose={handleCloseNotification}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuList p={2} fontFamily="Work sans">
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Tooltip title="Profile and Logout" arrow placement="bottom-end">
            <Button
              onClick={handleClick}
              sx={{
                ml: 2,
                color: "black",
                border: "1px ",
                bgcolor: "#E8E8E8",
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt={user.name}
                src={user.pic}
              />
              <ArrowDropDownIcon />
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <ProfileModal user={user}>
              <MenuItem>
                <Avatar alt={user.name} src={user.pic} /> Profile
              </MenuItem>
            </ProfileModal>
            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Box>

      <Drawer open={openD} anchor={"left"} onClose={() => setOpen(false)}>
        <Box display="flex" m={2}>
          <TextField
            placeholder="Search by name or email"
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            color="warning"
          />
          <Button variant="contained" color="secondary" onClick={handleSearch}>
            Go
          </Button>
        </Box>
        {loading ? (
          <ChatLoading />
        ) : (
          <List>
            {searchResult?.map((user) => (
              <ListItem key={user._id}>
                <ListItemButton>
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {loadingChat && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}
      </Drawer>
    </>
  );
}

export default SideDrawer;
