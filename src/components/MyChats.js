import axios from "axios";
import { useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../ChatProvider";
import { toast } from "react-toastify";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MyChats = ({ fetchAgain }) => {
  const toastOptions = {
    position: "top-left",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "https://chat-1-on-1.herokuapp.com/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast.error("Error Occured! Failed to Load the chats", toastOptions);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <>
      <Box
        sx={{
          display: { xs: selectedChat ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          width: { xs: "100%", md: "31%" },
          height: "93%",
          borderRadius: "10px",
          border: "1px ",
          boxShadow: 10,
        }}
      >
        <Box
          sx={{
            pb: 3,
            px: 3,
            fontSize: { xs: "28px", md: "30px" },

            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>My Chats</b>
          <GroupChatModal>
            <Button
              sx={{
                diplay: "flex",
                fontSize: { xs: "17px", md: "10px", lg: "17px" },
              }}
              variant="contained"
              color="secondary"
            >
              New Group Chat <AddIcon />
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 3,
            bgcolor: "#F8F8F8",
            width: "100%",
            borderRadius: "10px",
            overflowY: "hidden",
          }}
        >
          {chats ? (
            <Stack sx={{ overflowY: "scroll" }}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bgcolor={selectedChat === chat ? "#02BF99" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  mb={2}
                  borderRadius="10px"
                  key={chat._id}
                >
                  <Typography fontSize="20px">
                    <b>
                      {!chat.isGroupChat
                        ? getSender(user, chat.users)
                        : chat.chatName}
                    </b>
                  </Typography>
                  {chat.latestMessage && (
                    <Typography>
                      <b>{chat.latestMessage.sender.username} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
