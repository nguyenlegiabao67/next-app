import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, query, where } from 'firebase/firestore';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../config/firebase';

interface Props {
  open: boolean;
  onClose: any;
}

const DialogConversation = ({ open, onClose }: Props) => {
  const [user] = useAuthState(auth);
  const [recipientmail, setRecipientEmail] = React.useState('');
  const [errorEmail, setErrorEmail] = React.useState('');

  const isInvitedSelf = recipientmail === user?.email;
  const isRecipientAlready = (recipient: string) => conversationSnapshot?.docs.find((conv) => conv.data()?.users?.includes(recipient));

  const queryRecipientExisted = query(collection(db, 'conversations'), where('users', 'array-contains', user?.email));

  const [conversationSnapshot] = useCollection(queryRecipientExisted);

  const handleAddNewEmail = async () => {
    setErrorEmail('');
    if (isRecipientAlready(recipientmail)) {
      setErrorEmail('Email is exist!!');
      return;
    }
    if (EmailValidator.validate(recipientmail) && !isInvitedSelf) {
      try {
        await addDoc(collection(db, 'conversations'), {
          users: [user?.email, recipientmail],
        });
      } catch (error) {
        console.log('Error Add Conversations: ', error);
      }
      handleClose();
    } else {
      setErrorEmail('Please verify email address or you are invitting yourself!!!');
    }
  };

  const handleClose = () => {
    setRecipientEmail('');
    setErrorEmail('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="font-bold">New Email</DialogTitle>
      <DialogContent>
        <DialogContentText className="text-[18px] font-medium">Please enter your email address here. We will add new email.</DialogContentText>
        <TextField autoFocus label="Email Address" type="email" fullWidth variant="standard" value={recipientmail} onChange={(e) => setRecipientEmail(e.target.value)} />
        {errorEmail ? <DialogContentText className="text-[14px] text-red-500">{errorEmail}</DialogContentText> : null}
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
