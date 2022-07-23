import { Chip } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Chip label={user.username} onDelete={handleFunction} color="secondary" />
  );
};

export default UserBadgeItem;
