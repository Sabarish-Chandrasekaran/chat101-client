import React from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../../ChatProvider";
import { Button, IconButton, TextField, Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "../ChatLoading";

const GroupChatModal = ({ children }) => {
  const toastOptions = {
    position: "top-left",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warn("User already added", toastOptions);
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warn("Please fill all the feilds", toastOptions);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      toast.success("New Group Chat Created!", toastOptions);
    } catch (error) {
      toast.error(
        "Failed to Create the Chat!,Select atleast two users",
        toastOptions
      );
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleClickOpen}>{children}</span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle onClose={handleClose} fontSize="22px">
          Create Group Chat
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            id="name"
            label="Chat Name"
            size="small"
            fullWidth
            variant="outlined"
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="name"
            label="Add Users"
            size="small"
            fullWidth
            variant="outlined"
            placeholder="Add Users eg: Test, John, Pallav"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Box width="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          <Box width="100%" d="flex" flexWrap="wrap" boxSizing="border-box">
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
