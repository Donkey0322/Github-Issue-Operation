import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
  Typography,
  Stack,
  Box,
  IconButton,
  CircularProgress,
  Popover,
} from "@mui/material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PropTypes from "prop-types";
import { useGit } from "../hook/useGit";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function HelperText({ color, children }) {
  return (
    <Typography color={color} variant="caption">
      {children}
    </Typography>
  );
}

HelperText.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
};

HelperText.defaultProps = {
  color: "default",
};

const Transition = React.forwardRef((props, ref) => (
  <Grow ref={ref} {...props} unmountOnExit />
));

const Modal = ({ rawData, setOpen, open, setRawData }) => {
  const [errors, setErrors] = useState({
    title: false,
    body: false,
  });

  const [editMode, setEditMode] = useState(0);
  const [editData, setEditData] = useState(false);
  const {
    updateIssue,
    getIssue,
    currentPage,
    setIssue,
    generateData,
    fetching,
    setFetching,
    setNoMoreData,
  } = useGit();

  useEffect(() => {
    setEditData({
      ...rawData,
      title: rawData.title ?? "",
      body: rawData.body ?? "",
      label: rawData.label ?? "Open",
    });
  }, [rawData]);

  const handleClose = () => {
    setEditMode(0);
    setEditData({});
    setOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      errors.title &&
      name === "title" &&
      value.replaceAll(" ", "").length !== 0
    ) {
      setErrors((prev) => ({ ...prev, title: false }));
    }
    if (
      errors.body &&
      name === "body" &&
      value.replaceAll(" ", "").length !== 0 &&
      value.length > 30
    ) {
      setErrors((prev) => ({ ...prev, body: false }));
    }
  };

  const handleSave = async () => {
    const { title, body, label, repo, number } = editData;
    if (
      title.replaceAll(" ", "").length === 0 ||
      body.replaceAll(" ", "").length === 0 ||
      body.length < 30
    ) {
      if (title.replaceAll(" ", "").length === 0)
        setErrors((prev) => ({ ...prev, title: "Title must contains words." }));
      if (body.replaceAll(" ", "").length === 0 || body.length < 30) {
        setErrors((prev) => ({
          ...prev,
          body: "Body must contains 30 words or more.",
        }));
      }
      return;
    }
    setFetching(true);
    await updateIssue(repo, number, { title, body, labels: [label] });
    setRawData(editData);
    setFetching(false);
  };

  const handleCancel = () => {
    setEditMode(0);
    setEditData(rawData);
  };

  const handleDelete = async () => {
    const { title, body, label, repo, number } = editData;
    setFetching(true);
    setNoMoreData(false);
    const deleteData = await updateIssue(repo, number, {
      title,
      body,
      labels: [label],
      state: "closed",
    });
    const data = await getIssue(currentPage * 10 + 1, 1);
    setIssue(data.filter((m) => m.id !== generateData(deleteData).id));
    handleClose();
  };

  const Component = editData.state
    ? {
        status: {
          0: (
            <Box
              sx={{
                background: "#E5E7EB",
                width: 120,
                height: 40,
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ml: 1,
                mt: 2,
              }}
            >
              <Typography variant="button">{editData.label}</Typography>
            </Box>
          ),
          1: (
            <FormControl sx={{ maxWidth: 150, ml: 1, mt: 2 }}>
              <InputLabel id="category-select-label">Status</InputLabel>
              <Select
                name="label"
                label="Status"
                value={editData.label}
                autoWidth
                onChange={handleEditChange}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          ),
        },
        body: {
          0: <DialogContentText>{editData.body}</DialogContentText>,
          1: (
            <FormControl sx={{ minWidth: 300, ml: -1.5, mt: 1 }}>
              <TextField
                label="Body"
                name="body"
                // helperText="Incorrect entry."s
                variant="filled"
                value={editData.body}
                onChange={handleEditChange}
                error={Boolean(errors?.body)}
              />
              {errors?.body && (
                <HelperText color="error">{errors.body}</HelperText>
              )}
            </FormControl>
          ),
        },
        title: {
          0: (
            <Typography sx={{ fontWeight: 700, ml: -0.5 }}>
              {editData.title}
            </Typography>
          ),
          1: (
            <FormControl sx={{ minWidth: 100, ml: -1.5 }}>
              <TextField
                label="Title"
                name="title"
                // helperText="Incorrect entry."s
                variant="filled"
                value={editData.title}
                onChange={handleEditChange}
                error={Boolean(errors?.title)}
              />
              {errors?.title && (
                <HelperText color="error">{errors.title}</HelperText>
              )}
            </FormControl>
          ),
        },
      }
    : null;

  return (
    Component && (
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ position: "absolute", right: 0, top: 0, mr: 1, mt: 1 }}
        >
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <IconButton
                  size="large"
                  sx={{ color: "#d32f2f" }}
                  {...bindTrigger(popupState)}
                >
                  <DeleteForeverRoundedIcon />
                </IconButton>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    Are you sure to delete this task?
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    justifyContent={"right"}
                  >
                    {/* <Button sx={{ color: "divider" }}>No</Button> */}
                    <Button onClick={handleDelete}>Yes</Button>
                  </Stack>
                </Popover>
              </div>
            )}
          </PopupState>
          {!Boolean(editMode) && (
            <IconButton
              onClick={() => {
                setEditMode((prev) => Number(!prev));
              }}
              size="large"
            >
              <BorderColorRoundedIcon />
            </IconButton>
          )}
          <Chip label={editData.repo} />
        </Stack>
        {Component.status[editMode]}
        <DialogTitle>{Component.title[editMode]}</DialogTitle>
        <DialogContent sx={{ width: 600 }}>
          {Component.body[editMode]}
        </DialogContent>
        {Boolean(editMode) && (
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="contained"
              onClick={handleCancel}
              color="error"
              tabIndex={-1}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                editData.title === rawData.title &&
                editData.body === rawData.body &&
                editData.label === rawData.label
              }
            >
              Save
            </Button>
          </DialogActions>
        )}
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
      </Dialog>
    )
  );
};

export default Modal;
