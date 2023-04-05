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

export default function AlertDialog({ open }) {
  const {
    setFetching,
    getIssue,
    setIssue,
    setCurrentPage,
    currentPage,
    noMoreData,
    currentPageSize,
  } = useGit();

  const handleYes = async () => {
    setFetching(true);
    const data = await getIssue(10, currentPage);
    setIssue((prev) => [...prev, ...data]);
  };

  return (
    <div>
      <Dialog
        open={open && !noMoreData && currentPageSize < 10}
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
