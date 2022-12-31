import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import DialogConversation from './DialogConversation';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import ConversationSelect from './ConversationSelect';

const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 320px;
  display: flex;
  flex-direction: column;
  background: #ddd;
  overflow-y: auto;
  box-shadow: 0 0px 0px -10px rgb(115 115 115 / 75%), 4px 0 17px -2px rgb(115 115 115 / 75%);
`;

const SidebarHeader = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 10px;
  border-bottom: 1px solid whitesmoke;
`;

const SidebarAvatar = styled(Avatar)`
  &:hover {
    opacity: 0.8;
  }
`;

const Sidebar = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const [user] = useAuthState(auth);
  const [openDialog, setOpenDialog] = React.useState(false);

  const queryRecipientExisted = query(collection(db, 'conversations'), where('users', 'array-contains', user?.email));

  const [conversationSnapshot] = useCollection(queryRecipientExisted);
  return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <Tooltip title={`${user?.email}`} placement={'right'}>
            {user?.photoURL ? <SidebarAvatar src={user.photoURL} /> : <SidebarAvatar>{user?.email?.[0] ? user?.email?.[0].toUpperCase() : ''}</SidebarAvatar>}
          </Tooltip>
          <div className="mr-2 flex gap-2">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <Tooltip title={'Logout'} placement="bottom">
              <IconButton
                onClick={async () => {
                  await signOut();
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </div>
        </SidebarHeader>
        <div className="my-2 flex flex-col gap-1">
          <div className="flex items-center m-2 bg-white rounded-3xl shadow">
            <IconButton sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Email" />
          </div>
          <div className="m-2">
            <Button className="w-full bg-[#1976D2]" variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Add New Email
            </Button>
          </div>
        </div>

        <div className=" border-[whitesmoke] border-t-[1px] border-solid">
          {conversationSnapshot?.docs.map((conversation) => (
            <ConversationSelect key={conversation.id} id={conversation.id} conversationUsers={conversation?.data()?.users} />
          ))}
        </div>

        <DialogConversation open={openDialog} onClose={() => setOpenDialog(false)} />
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
