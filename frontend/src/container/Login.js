import React, { useState, useEffect } from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import * as AXIOS from "../middleware";
import { useGit } from "./hook/useGit";

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
  console.log("code:", code);
  const { cookies, setCookie, login } = useGit();
  const navigate = useNavigate();

  useEffect(() => {
    async function func() {
      if (code && !cookies.token) {
        try {
          const token = await AXIOS.getAccessToken(code);
          // console.log(token);
          setCookie("token", token.access_token, { path: "/" });
        } catch (e) {
          console.log(e);
        }
      }
    }
    func();
  }, [code]);

  useEffect(() => {
    if (login) navigate("/task");
  }, [login]);

  const loginClick = async () => {
    const client_id = "47584cedee8582508ef1";
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`
    );
  };

  return (
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
  );
}
