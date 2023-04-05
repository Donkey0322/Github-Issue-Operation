import axios from "axios";
const instance = axios.create({ baseURL: "http://localhost:4000/git" });

export async function getAccessToken(code) {
  try {
    const client_id = "47584cedee8582508ef1";
    const client_secret = "679d53fcc7318f72531264951c7532bc16479809";
    const { data } = await instance.get("/getAccessToken", {
      params: { client_id, client_secret, code },
    });
    return data;
  } catch {
    throw new Error();
  }
}
export async function getIssue(token, user, per_page = 10, page = 1) {
  try {
    const { data } = await instance.get("/getIssue", {
      params: {
        q: encodeURIComponent(`state:open user:${user}`),
        per_page,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
}

export const getUserData = async (token) => {
  try {
    const { data } = await instance.get("/getUserData", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
};

export const getRepo = async (token, username) => {
  try {
    const { data } = await instance.get("/getRepo", {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
};

export const updateIssue = async (
  token,
  user,
  repo,
  issue_number,
  updated_data
) => {
  try {
    const { data } = await instance.get("/updateIssue", {
      params: { user, repo, issue_number, updated_data },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
};

export const createIssue = async (token, user, repo, new_data) => {
  try {
    const { data } = await instance.get("/createIssue", {
      params: { user, repo, new_data },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
};

export const searchIssue = async (
  token,
  q = encodeURIComponent("user:Donkey0322")
) => {
  try {
    const { data } = await instance.get("/searchIssue", {
      params: { q },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    throw new Error();
  }
};
