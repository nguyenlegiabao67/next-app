import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { collection, query, Timestamp, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const ConversationContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;
  :hover {
    background-color: #fff;
  }
  transition: all 0.5s;
`;

interface AppUser {
  email: string;
  lastSeen: Timestamp;
  photoURL: string;
}

const ConversationSelect = ({
  id,
  conversationUsers,
}: {
  id: string;
  conversationUsers: any;
}) => {
  const [userLoggedIn] = useAuthState(auth);
  const getRecipient = (users: string[]) =>
    users.find((user) => user !== (userLoggedIn?.email as string));

  const queryRecipientInfo = query(
    collection(db, "users"),
    where("email", "==", getRecipient(conversationUsers))
  );

  const [recipientInfoSnapshot] = useCollection(queryRecipientInfo);
  const getRecipientInfo = recipientInfoSnapshot?.docs?.[0]?.data() as
    | AppUser
    | undefined;

  return (
    <ConversationContainer>
      {getRecipientInfo && getRecipientInfo?.photoURL ? (
        <Avatar src={getRecipientInfo?.photoURL} />
      ) : (
        <Avatar>{getRecipient(conversationUsers)?.[0].toUpperCase()}</Avatar>
      )}
      <span>{getRecipient(conversationUsers)}</span>
    </ConversationContainer>
  );
};

export default ConversationSelect;
