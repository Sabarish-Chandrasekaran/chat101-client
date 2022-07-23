import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bgcolor="#E8E8E8"
      width="100%"
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      color="black"
      sx={{
        "&:hover": {
          backgroundColor: "#02BF99",
          color: "white",
        },
      }}
      borderRadius={2}
    >
      <Avatar mr={4} cursor="pointer" alt={user.username} src={user.pic} />
      <Box>
        <Typography fontSize="18px">
          <b>{user.username}</b>
        </Typography>
        <Typography fontSize="12px">
          <b>Email : </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
