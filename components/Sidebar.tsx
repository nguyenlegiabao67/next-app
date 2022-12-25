import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import DialogConversation from "./DialogConversation";

const SidebarContainer = styled.div`
  height: 100vh;
  width: 320px;
  display: flex;
  flex-direction: column;
  background: #ddd;
  overflow-y: auto;
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
  const [openDialog, setOpenDialog] = React.useState(false);
  return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <Tooltip title={"email@email.com"} placement={"right"}>
            <SidebarAvatar>BN</SidebarAvatar>
          </Tooltip>
          <div className="mr-2 flex gap-2">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <Tooltip title={"Logout"} placement="bottom">
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
        <div className="flex items-center m-2 bg-white rounded-3xl shadow">
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Email" />
        </div>
        <div className="m-2">
          <Button
            className="w-full bg-[#1976D2]"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Email
          </Button>
        </div>

        <DialogConversation
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
