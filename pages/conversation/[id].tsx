import * as React from 'react';
import Sidebar from '../../components/Sidebar';
import styled from 'styled-components';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { Conversation, IMessage } from '../../utils/types';
import { getRecipientEmail } from '../../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { generateQueryGetMessages, transformMessage } from '../../utils/query';
import ConversationScreen from '../../components/ConversationScreen';

const StyledContainer = styled.div`
  display: flex;
`;

interface Props {
  conversation: Conversation;
  messages: IMessage[];
}

const Converstation = ({ conversation, messages }: Props) => {
  const [loggedInUser] = useAuthState(auth);
  return (
    <StyledContainer>
      <Head>
        <title>Conversation {getRecipientEmail(conversation.users, loggedInUser)}</title>
      </Head>
      <Sidebar />
      <ConversationScreen conversation={conversation} messages={messages}></ConversationScreen>
    </StyledContainer>
  );
};

export default Converstation;

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async (context) => {
  const conversation_id = context.params?.id;
  const conversationRef = doc(db, 'conversations', conversation_id as string);
  const conversatitonSnapshot = await getDoc(conversationRef);

  const queryMessages = generateQueryGetMessages(conversation_id);
  const messagesSnapshot = await getDocs(queryMessages);

  const messages = messagesSnapshot.docs.map((mess) => transformMessage(mess));

  return {
    props: {
      conversation: conversatitonSnapshot.data() as Conversation,
      messages,
    },
  };
};
