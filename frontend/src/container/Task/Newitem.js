import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
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

const Newitem = ({ setOpen, open }) => {
  const [errors, setErrors] = useState({
    title: false,
    body: false,
    repo: false,
  });

  const [newData, setNewData] = useState({
    title: "",
    body: "",
    state: "open",
    label: "Open",
    repo: "",
  });
  const [submitLoad, setSubmitLoad] = useState(false);
  const {
    repo,
    createIssue,
    getIssue,
    currentPage,
    setIssue,
    generateData,
    setNoMoreData,
  } = useGit();

  const handleClose = () => {
    if (!submitLoad) {
      setNewData({
        title: "",
        body: "",
        state: "open",
        label: "Open",
        repo: "",
      });
      setOpen(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
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
    if (errors.repo && repo) {
      setErrors((prev) => ({ ...prev, repo: false }));
    }
  };

  const handleCreate = async () => {
    const { title, body, label, repo } = newData;
    if (
      title.replaceAll(" ", "").length === 0 ||
      body.replaceAll(" ", "").length === 0 ||
      body.length < 30 ||
      !repo
    ) {
      if (title.replaceAll(" ", "").length === 0)
        setErrors((prev) => ({ ...prev, title: "Title must contains words." }));
      if (body.replaceAll(" ", "").length === 0 || body.length < 30) {
        setErrors((prev) => ({
          ...prev,
          body: "Body must contains 30 words or more.",
        }));
      }
      if (!repo) {
        setErrors((prev) => ({
          ...prev,
          repo: "Please assign a repo.",
        }));
      }
      return;
    }
    setSubmitLoad(true);
    setNoMoreData(false);
    const newdata = await createIssue(repo, { title, body, labels: [label] });
    const data = await getIssue((currentPage - 1) * 10 - 1, 1);
    setIssue([generateData(newdata), ...data]);
    setSubmitLoad(false);
    setNewData({
      title: "",
      body: "",
      state: "open",
      label: "Open",
      repo: "",
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth={"md"}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ position: "absolute", right: 0, top: 0, mr: 1, mt: 1 }}
      >
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="category-select-label">Repo</InputLabel>
          <Select
            name="repo"
            label="Repo"
            value={newData.repo}
            autoWidth
            onChange={handleEditChange}
            error={Boolean(errors?.repo)}
          >
            {repo.map((r, index) => (
              <MenuItem value={r} key={index}>
                {r}
              </MenuItem>
            ))}
          </Select>
          {errors?.repo && <HelperText color="error">{errors.repo}</HelperText>}
        </FormControl>
      </Stack>
      <FormControl sx={{ maxWidth: 100, ml: 1, mt: 2 }}>
        <InputLabel id="category-select-label">Status</InputLabel>
        <Select
          name="label"
          label="Status"
          value={newData.label}
          autoWidth
          onChange={handleEditChange}
        >
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>
      <DialogTitle>
        <FormControl sx={{ minWidth: 200, ml: -1.5 }}>
          <TextField
            label="Title"
            name="title"
            // helperText="Incorrect entry."s
            variant="filled"
            value={newData.title}
            onChange={handleEditChange}
            error={Boolean(errors?.title)}
          />
          {errors?.title && (
            <HelperText color="error">{errors.title}</HelperText>
          )}
        </FormControl>
      </DialogTitle>
      <DialogContent sx={{ width: 600 }}>
        <FormControl sx={{ minWidth: 300, ml: -1.5, mt: 1 }}>
          <TextField
            label="Body"
            name="body"
            // helperText="Incorrect entry."s
            variant="filled"
            value={newData.body}
            onChange={handleEditChange}
            error={Boolean(errors?.body)}
          />
          {errors?.body && <HelperText color="error">{errors.body}</HelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleClose}
          color="error"
          tabIndex={-1}
          disabled={submitLoad}
        >
          Cancel
        </Button>
        {submitLoad ? (
          <LoadingButton loading variant="contained">
            Create
          </LoadingButton>
        ) : (
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        )}
      </DialogActions>
      {/* <Dialog
        open={submitLoad}
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
      >
        <CircularProgress />
      </Dialog> */}
    </Dialog>
  );
};

export default Newitem;
