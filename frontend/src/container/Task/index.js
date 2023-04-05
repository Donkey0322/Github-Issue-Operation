import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  LinearProgress,
  Button,
  Fab,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useGit } from "../hook/useGit";
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
  StyledDataGrid,
} from "./static";
import { message } from "antd";

function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const Task = () => {
  const {
    issue,
    fetching,
    login,
    createIssue,
    getIssue,
    currentPage,
    setIssue,
    generateData,
    setFetching,
    setNoMoreData,
    setSearch,
    checkSearch,
    noMoreData,
    repo,
    setError,
    error,
  } = useGit();
  const [open, setOpen] = useState(false); //編輯頁面開關
  const [create, setCreate] = useState(false); //新增頁面開關
  const [editData, setEditData] = useState({}); //編輯模式開關
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info("No more issues!");
  };

  useEffect(() => {
    if (!login && !error) {
      navigate("/");
    }
  }, [login, navigate]);

  useEffect(() => {
    if (error) navigate("/error");
  }, [error]);

  useEffect(() => {
    if (noMoreData) {
      info();
    }
  }, [noMoreData]);

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

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      setIssue((prev) =>
        prev.map((p) => ({
          ...p,
          chosen: checkSearch(p.title, p.body, p.repo),
        }))
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setIssue((prev) =>
        prev.map((p) => ({
          ...p,
          chosen: "not",
        }))
      );
    }
  };

  const RandomAddClick = async () => {
    try {
      setFetching(true);
      if (!noMoreData) {
        setNoMoreData(false);
      }
      const newdata = await createIssue(
        repo[Math.floor(Math.random() * repo.length)],
        {
          title: randomString(5),
          body: randomString(5),
          labels: ["Open"],
        }
      );
      const data = await getIssue(currentPage * 10 - 1, 1);
      setIssue([generateData(newdata), ...data]);
    } catch {
      setError(true);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100vw", position: "fixed" }}>
      {contextHolder}
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
            <Fab
              size="small"
              color="success"
              sx={{ mr: 1 }}
              onClick={RandomAddClick}
              disabled={repo?.length === 0}
            >
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
          <Tooltip title={'Click "Enter" to search'}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for content"
                onKeyDown={handleSearchEnter}
                onChange={handleSearchChange}
              />
            </Search>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container>
        <div style={{ height: "min(80%, 400px)", width: "100%" }}>
          <StyledDataGrid
            rows={issue?.length > 0 ? issue : []}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: LinearProgress,
              noResultsOverlay: CustomNoRowsOverlay,
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            loading={fetching}
            getRowId={(row) => row.id}
            sx={{ background: "#FFFFFF" }}
            onRowClick={handleRowClick}
            hideFooterSelectedRowCount={true}
            disableRowSelectionOnClick={true}
            getRowClassName={(params) =>
              `super-app-theme--${params.row.chosen}`
            }
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
      <FetchAlert />
    </Box>
  );
};

export default Task;
