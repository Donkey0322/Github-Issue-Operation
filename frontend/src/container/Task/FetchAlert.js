import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useGit } from "../hook/useGit";

export default function AlertDialog() {
  const {
    setFetching,
    getIssue,
    setIssue,
    currentPage,
    noMoreData,
    currentPageSize,
    setNoMoreData,
    fetching,
  } = useGit();

  const handleYes = async () => {
    setFetching(true);
    setNoMoreData(false);
    const data = await getIssue(10, currentPage + 1);
    setIssue((prev) => [...prev, ...data]);
  };

  return (
    <div>
      <Dialog
        open={
          !noMoreData &&
          currentPageSize < 10 &&
          currentPageSize > 0 &&
          !fetching
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Fetching Data Alert:</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The visible rows is less than ten, and the system detects that you
            still have issue in your own Github. Click Yes to fetch more data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes} variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
