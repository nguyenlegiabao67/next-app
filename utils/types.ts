export interface Conversation {
  users: string[];
}

export interface IMessage {
  id: string;
  conversation_id: string;
  text: string;
  sent_at: string;
  user: string;
}
