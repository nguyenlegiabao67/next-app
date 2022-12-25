import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  onClose: any;
}

const DialogConversation = ({ open, onClose }: Props) => {
  const [email, setEmail] = React.useState("");

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const handleAddNewEmail = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="font-bold">New Email</DialogTitle>
      <DialogContent>
        <DialogContentText className="text-[18px] font-medium">
          Please enter your email address here. We will add new email.
        </DialogContentText>
        <TextField
          autoFocus
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button className="font-bold text-[18px]" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="font-bold text-[18px]" onClick={handleAddNewEmail}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConversation;
