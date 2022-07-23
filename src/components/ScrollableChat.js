import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
} from "../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Box display="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.username} arrow placement="bottom-start">
                <Avatar
                  mr={1}
                  sx={{ cursor: "pointer", marginRight: 1 }}
                  alt={m.sender.username}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <Typography
              component="span"
              sx={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#06038D" : "#F6BE00"
                }`,
                color: `${m.sender._id === user._id ? "white" : "black"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                borderRadius: "20px",
                padding: "5px 15px",
                mb: "5px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </Typography>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
