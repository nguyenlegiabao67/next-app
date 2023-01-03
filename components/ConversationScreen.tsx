import { Avatar, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { auth, db } from '../config/firebase';
import { useRecipient } from '../hooks/useRecipient';
import { convertFirestoreTimestampToString, generateQueryGetMessages, transformMessage } from '../utils/query';
import { Conversation, IMessage } from '../utils/types';
import Message from './Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface Props {
  conversation: Conversation;
  messages: IMessage[];
}

const StyledRecipientHeader = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 10px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
  margin-left: 15px;
  flex-grow: 1;
  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 14px;
    color: gray;
  }
`;

const StyledMessagesContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 85%;
`;

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 5px 15px;
  margin-left: 15px;
  margin-right: 15px;
`;

const ConversationScreen = ({ conversation, messages }: Props) => {
  const router = useRouter();
  const [loggedInUser, __loading, __error] = useAuthState(auth);
  const conversationUser = conversation.users;
  const { recipient, recipientEmail } = useRecipient(conversationUser);
  const conversationId = router.query.id;
  const queryMessages = generateQueryGetMessages(conversationId as string);
  const [messagesSnapshot, loadingMessage, __errorMessage] = useCollection(queryMessages);
  const [newMessage, setNewMessage] = React.useState('');
  const divRef = React.useRef<HTMLDivElement>(null);

  const showMessages = () => {
    autoScrollToEnd();
    if (loadingMessage) {
      return messages.map((message) => <Message key={message.id} message={message} />);
    }

    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => <Message key={message.id} message={transformMessage(message)} />);
    }
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    await setDoc(
      doc(db, 'users', loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true },
    );
    // add new message

    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    });

    setNewMessage('');
    autoScrollToEnd();
  };

  const sendMessage: React.KeyboardEventHandler<HTMLInputElement> = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      if (!newMessage) return;
      addMessageToDbAndUpdateLastSeen();
    }
  };

  const sendMessageClick = (ev: any) => {
    ev.preventDefault();
    addMessageToDbAndUpdateLastSeen();
  };

  const autoScrollToEnd = () => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-[1]">
      <StyledRecipientHeader>
        <StyledRecipientHeader>{recipient && recipient?.photoURL ? <Avatar src={recipient?.photoURL} /> : <Avatar>{recipientEmail?.[0]?.toUpperCase()}</Avatar>}</StyledRecipientHeader>
        <StyledHeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipient && <span>Last seen: {convertFirestoreTimestampToString(recipient.lastSeen)}</span>}
        </StyledHeaderInfo>
      </StyledRecipientHeader>

      <StyledMessagesContainer>
        {showMessages()}
        <div ref={divRef}></div>
      </StyledMessagesContainer>
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={sendMessage} />
        <IconButton onClick={sendMessageClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </div>
  );
};

export default ConversationScreen;
