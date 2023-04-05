import { BrowserRouter, Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Login from "./container/Login";
import Task from "./container/Task";
import Error from "./container/Error";

// import "./index.css";

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/task" element={<Task />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Task />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
