import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  LinearProgress,
  Button,
  IconButton,
  Fab,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useGit } from "../hook/useGit";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "./Modal";
import NewItem from "./Newitem";
import FetchAlert from "./FetchAlert";
import {
  Search,
  Container,
  SearchIconWrapper,
  StyledInputBase,
  CustomToolbar,
  CustomNoRowsOverlay,
} from "./static";

const Task = () => {
  const { issue, fetching, lessThanPageSize, login } = useGit();
  const [open, setOpen] = useState(false); //編輯頁面開關
  const [create, setCreate] = useState(false); //新增頁面開關
  const [editData, setEditData] = useState({}); //編輯模式開關
  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      navigate("/");
    }
  }, [login]);

  const columns = [
    { field: "title", headerName: "Title", minWidth: 120, flex: 1 },
    {
      field: "body",
      headerName: "Body",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "label",
      headerName: "Status",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "create",
      headerName: "Create Time",
      minWidth: 120,
      flex: 1,
      type: "dateTime",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "update",
      headerName: "Update Time",
      minWidth: 120,
      flex: 1,
      type: "dateTime",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "repo",
      headerName: "Repo Name",
      minWidth: 120,
      flex: 1,
    },
  ];

  const handleRowClick = (e) => {
    const { row } = e;
    setEditData(row);
    setOpen(true);
  };

  const handleCreateClick = () => {
    setCreate(true);
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100vw", position: "fixed" }}>
      <AppBar position="static" sx={{ background: "#24292F" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { sm: "block" } }}
          >
            Github Issues
          </Typography>
          <Tooltip title="Click to random generate issues for testing">
            <Fab size="small" color="success" sx={{ mr: 1 }}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<AddBoxOutlinedIcon />}
            sx={{ backgroundColor: "#FFFFFF", mr: 1 }}
            onClick={handleCreateClick}
          >
            Create Tasks
          </Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for content"
              inputProps={{ "aria-label": "search" }}
              // onKeyDown={handleSearch}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Container>
        <div style={{ height: "min(80%, 400px)", width: "100%" }}>
          <DataGrid
            rows={issue?.length > 0 ? issue : []}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: LinearProgress,
              noResultsOverlay: CustomNoRowsOverlay,
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            loading={fetching}
            getRowId={(row) => row.id}
            sx={{ background: "#FFFFFF" }}
            onRowClick={handleRowClick}
            hideFooterSelectedRowCount={true}
            disableRowSelectionOnClick={true}
          />
        </div>
      </Container>
      <Modal
        open={open}
        setOpen={setOpen}
        rawData={editData}
        setRawData={setEditData}
      />
      <NewItem open={create} setOpen={setCreate} />
      <FetchAlert open={lessThanPageSize} />
    </Box>
  );
};

export default Task;
