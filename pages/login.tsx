import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import styled from "styled-components";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import LogoApp from "../public/assets/chat-app.png";

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  return (
    <StyledContainer>
      <Head>
        <title>Login App</title>
      </Head>
      <Image src={LogoApp} alt={"Logo"} />
      <Button
        variant="outlined"
        onClick={() => {
          signInWithGoogle();
        }}
      >
        <GoogleIcon />{" "}
        <span className="ml-1 text-[18px] font-bold">Sigin with Google</span>
      </Button>
    </StyledContainer>
  );
};

export default Login;
