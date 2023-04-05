import express from "express";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.get("/getAccessToken", async (req, res) => {
  try {
    const { code, client_id, client_secret } = req.query;
    const response = await fetch(
      `http://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
      {
        mothod: "POST",
        headers: { Accept: "application/vnd.github+json" },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

router.get("/getUserData", async (req, res) => {
  try {
    req.get("Authorization");
    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: req.get("Authorization"),
        Accept: "application/vnd.github+json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

router.get("/getRepo", async (req, res) => {
  try {
    const { username } = req.query;
    req.get("Authorization");
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        method: "GET",
        headers: {
          Authorization: req.get("Authorization"),
          Accept: "application/vnd.github+json",
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

router.get("/getIssue", async (req, res) => {
  try {
    const { q, page, per_page } = req.query;
    req.get("Authorization");
    const response = await fetch(
      `https://api.github.com/search/issues?q=${q}&per_page=${per_page}&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: req.get("Authorization"),
          Accept: "application/vnd.github+json",
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

router.get("/updateIssue", async (req, res) => {
  try {
    const { user, repo, issue_number, updated_data } = req.query;
    req.get("Authorization");
    const response = await fetch(
      `https://api.github.com/repos/${user}/${repo}/issues/${issue_number}`,
      {
        method: "PATCH",
        headers: {
          Authorization: req.get("Authorization"),
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify(updated_data),
      }
    );
    const data = await response.json({ message: "Something Wrong" });
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

router.get("/createIssue", async (req, res) => {
  try {
    const { user, repo, new_data } = req.query;
    req.get("Authorization");
    const response = await fetch(
      `https://api.github.com/repos/${user}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: req.get("Authorization"),
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify(new_data),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(422).json({ message: "Something Wrong" });
  }
});

export default router;
