import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { toast } from "react-toastify";
import { ChatState } from "../ChatProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfileModal from "./miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModel";
import "./styles.css";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";

const ENDPOINT = "https://chat-1-on-1.herokuapp.com"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toastOptions = {
    position: "top-left",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://chat-1-on-1.herokuapp.com/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Error Occured!,Failed to Load the Messages");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "https://chat-1-on-1.herokuapp.com/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Error Occured!,Failed to send the Message", toastOptions);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            component="span"
            fontSize={{ xs: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="inline-flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon />
            </IconButton>

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <b>{getSender(user, selectedChat.users)}</b>
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  <b>{selectedChat.chatName.toUpperCase()}</b>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bgcolor="rgba(245, 162, 18, 0.2)"
            width="100%"
            height="86%"
            borderRadius="10px"
            overflowY="hidden"
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {istyping ? (
              <Typography
                component="span"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  maxWidth: "10%",
                  borderRadius: "10px",
                  paddingLeft:"10px"
                }}
              >
                typing...
              </Typography>
            ) : (
              <></>
            )}
            <TextField
              margin="dense"
              id="outlined-basic"
              border="black"
              fullWidth
              color="secondary"
              focused
              placeholder="Enter a message.."
              onChange={typingHandler}
              onKeyDown={sendMessage}
              required
              value={newMessage}
              size="small"
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography fontSize="40px" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
