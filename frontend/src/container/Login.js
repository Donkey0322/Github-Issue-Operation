import React, { useState, useEffect } from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, Typography, Button } from "@mui/joy";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import * as AXIOS from "../middleware";
import { useGit } from "./hook/useGit";
import { Dialog, Grow, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
  );
}

export default function App() {
  const code = new URLSearchParams(useLocation().search).get("code");
  const { cookies, setCookie, login, fetching, setError, error } = useGit();
  const navigate = useNavigate();

  const Transition = React.forwardRef((props, ref) => (
    <Grow ref={ref} {...props} unmountOnExit />
  ));

  useEffect(() => {
    async function func() {
      if (code && !cookies.token) {
        try {
          const token = await AXIOS.getAccessToken(code);
          setCookie("token", token.access_token, { path: "/" });
        } catch {
          setError(true);
        }
      }
    }
    func();
  }, [code]);

  useEffect(() => {
    if (login && !error) navigate("/task");
  }, [login]);

  useEffect(() => {
    if (error) navigate("/error");
  }, [error]);

  const loginClick = async () => {
    try {
      const client_id = "47584cedee8582508ef1";
      window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`
      );
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <CssVarsProvider>
        <main>
          <ModeToggle />
          <Sheet
            sx={{
              width: 300,
              mx: "auto", // margin left & right
              my: 4, // margin top & botom
              py: 3, // padding top & bottom
              px: 2, // padding left & right
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
            }}
            variant="outlined"
          >
            <div>
              <Typography level="h4" component="h1">
                <b>Welcome!</b>
              </Typography>
              <Typography level="body2">Sign in to continue.</Typography>
            </div>

            <Button sx={{ mt: 1 }} variant="outlined" onClick={loginClick}>
              <AcUnitIcon sx={{ position: "absolute", left: "2px" }} />
              Log in by GitHub
            </Button>
          </Sheet>
        </main>
      </CssVarsProvider>
      <Dialog
        open={fetching}
        // onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        // sx={{ background: "black" }}
        PaperComponent={Stack}
        PaperProps={{
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          },
        }}
        sx={{ color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Dialog>
    </>
  );
}
