import React from "react";
import Typography from "@mui/material/Typography";
import { CardMedia, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleClickOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleClickOpen} display={{ xs: "flex" }}>
          <VisibilityIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          onClose={handleClose}
          fontSize="28px"
          display="flex"
          justifyContent="center"
        >
          {user.username}
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
        <DialogContent
          dividers

        >
          <CardMedia
            sx={{ width: "150px", borderRadius: 8 }}
            component="img"
            height="194"
            image={user.pic}
            alt={user.username}
          />

          <Typography gutterBottom mt={3} fontSize="24px">
            Email : {user.email}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileModal;
