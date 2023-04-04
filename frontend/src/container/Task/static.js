import React, { useEffect } from "react";
import { InputBase } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import STYLED from "styled-components";
import { useGit } from "../hook/useGit";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  useGridApiEventHandler,
  useGridApiContext,
} from "@mui/x-data-grid";
import _ from "lodash";

export function CustomToolbar() {
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
      !noMoreData &&
      issue.length - params.renderContext.lastRowIndex < 3
    ) {
      setFetching(true);
      const data = await getIssue(10, currentPage);
      setIssue((prev) => [...prev, ...data]);
      setCurrentPage((prev) => prev + 1);
    }
  };

  var debounce = _.debounce(handleScroll, 100, {
    leading: false,
    trailing: true,
  });

  useGridApiEventHandler(apiRef, "scrollPositionChange", debounce, "once");
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export const Search = styled("div")(({ theme }) => ({
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

export const Container = STYLED.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #E7EBF0;
  height:100vh;
  width:100%;
`;

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
