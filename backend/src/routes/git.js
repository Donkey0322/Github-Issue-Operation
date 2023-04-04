import express from "express";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.get("/getAccessToken", async (req, res) => {
  const { code, client_id, client_secret } = req.query;
  await fetch(
    `http://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    {
      mothod: "POST",
      headers: { Accept: "application/vnd.github+json" },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    });
});

router.get("/getUserData", async (req, res) => {
  req.get("Authorization");
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      res.json(data);
    });
});

router.get("/getIssue", async (req, res) => {
  const { q, page, per_page } = req.query;
  req.get("Authorization");
  await fetch(
    `https://api.github.com/search/issues?q=${q}&per_page=${per_page}&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: req.get("Authorization"),
        Accept: "application/vnd.github+json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("HI", data.length > 0 ? data[0].title : "No data");
      res.json(data);
    });
});

router.get("/getRepo", async (req, res) => {
  const { username } = req.query;
  req.get("Authorization");
  await fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
      Accept: "application/vnd.github+json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      res.json(data);
    });
});

router.get("/updateIssue", async (req, res) => {
  const { user, repo, issue_number, updated_data } = req.query;
  req.get("Authorization");
  // console.log("Hi", user, repo, issue_number);
  await fetch(
    `https://api.github.com/repos/${user}/${repo}/issues/${issue_number}`,
    {
      method: "PATCH",
      headers: {
        Authorization: req.get("Authorization"),
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify(updated_data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.labels.map((m) => m.name));
      res.json(data);
    });
});

router.get("/createIssue", async (req, res) => {
  const { user, repo, new_data } = req.query;
  req.get("Authorization");
  // console.log("Hi", user, repo, issue_number);
  await fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: req.get("Authorization"),
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify(new_data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.labels.map((m) => m.name));
      res.json(data);
    });
});

export default router;
