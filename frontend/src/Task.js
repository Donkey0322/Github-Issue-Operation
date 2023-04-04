import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  LinearProgress,
  Button,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import STYLED from "styled-components";
import { useGit } from "./container/hook/useGit";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  useGridApiEventHandler,
  useGridApiContext,
} from "@mui/x-data-grid";
import Modal from "./container/Modal";

function CustomToolbar() {
  const {
    issue,
    setIssue,
    currentPage,
    setCurrentPage,
    fetching,
    setFetching,
    noMoreData,
    getIssue,
  } = useGit();
  const apiRef = useGridApiContext();

  const handleScroll = async (params) => {
    if (
      !fetching &&
      params.renderContext.lastRowIndex === issue.length &&
      !noMoreData
    ) {
      // console.log(params);
      setFetching(true);
      const data = await getIssue(10, currentPage);
      setIssue((prev) => [...prev, ...data]);
      setCurrentPage((prev) => prev + 1);
      // setFetching(false);
    }
  };

  useEffect(() => {
    console.log(fetching);
  }, [fetching]);

  useGridApiEventHandler(apiRef, "scrollPositionChange", handleScroll);
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const Container = STYLED.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #E7EBF0;
  height:100vh;
  width:100%;
`;

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "28ch",
      },
    },
  },
}));

const Task = () => {
  const { issue, fetching } = useGit();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});

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
    setEditData({
      title: "",
      body: "",
      // create: dayjs(target.created_at).calendar(),
      // create: target.created_at,
      // update: dayjs(target.updated_at).calendar(),
      // update: target.updated_at,
      state: "open",
      // number: target.number,
      // repo: target.repository_url.split("/").slice(-1),
      // id: target.id,
      label: "Open",
    });
    setOpen(true);
  };

  // const handleSearch = async (e) => {
  //   if (e.key === "Enter") {
  //     const data = await AXIOS.searchIssue(cookies.token);
  //     console.log(data);
  //   }
  // };

  return (
    <Box sx={{ flexGrow: 1, width: "100vw", position: "fixed" }}>
      <AppBar position="static" sx={{ background: "#24292F" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Github Issues
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddBoxOutlinedIcon />}
            sx={{ backgroundColor: "#FFFFFF" }}
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
        {issue?.length > 0 && (
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={issue}
              columns={columns}
              slots={{
                toolbar: CustomToolbar,
                loadingOverlay: LinearProgress,
              }}
              loading={fetching}
              getRowId={(row) => row.id}
              sx={{ background: "#FFFFFF" }}
              onRowClick={handleRowClick}
              hideFooterSelectedRowCount={true}
              disableRowSelectionOnClick={true}
            />
          </div>
        )}
      </Container>
      <Modal
        open={open}
        setOpen={setOpen}
        rawData={editData}
        setRawData={setEditData}
      />
    </Box>
  );
};

export default Task;
