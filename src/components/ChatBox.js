import { Box } from "@mui/material";
import { ChatState } from "../ChatProvider";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        p: 3,
        ml: 2,
        bgcolor: "rgba(255,255,255,0.8)",
        width: { xs: "100%", md: "68%" },
        borderRadius: "10px",
        border: "1px",
        boxShadow: 10,
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
