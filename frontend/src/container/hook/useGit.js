import { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import * as AXIOS from "../../middleware";

const GitContext = createContext({
  login: false,
  user: "",
  issue: {},
  repo: [],
  currentPage: 1,
  fetching: false,
  noMoreData: false,
  currentPageSize: 10,
  search: "",
  error: false,
  checkSearch: () => {},
  getIssue: async () => {},
  updateIssue: async () => {},
  createIssue: async () => {},
  generateData: () => {},
});

const GitProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [login, setLogin] = useState(cookies.token ?? false);
  const [user, setUser] = useState("");
  const [issue, setIssue] = useState({});
  const [repo, setRepo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  const checkSearch = (...arg) => {
    for (const a of arg) {
      if (a.toLowerCase().includes(search.toLowerCase())) {
        return "chosen";
      }
    }
    return "not";
  };

  function generateData(target) {
    return {
      title: target.title,
      body: target.body,
      create: target.created_at,
      update: target.updated_at,
      state: target.state,
      number: target.number,
      repo: target?.repository_url?.split("/")?.slice(-1)[0],
      id: target.id,
      label: target.labels[0]?.name ?? "Open",
      chosen: search
        ? checkSearch(
            target.title,
            target.body,
            target.repository_url.split("/").slice(-1)[0]
          )
        : "not",
    };
  }

  useEffect(() => {
    async function func() {
      if (cookies.token) {
        try {
          setFetching(true);
          const userData = await AXIOS.getUserData(cookies.token);
          setUser(userData.login);
          const repoData = await AXIOS.getRepo(cookies.token, userData.login);
          setRepo(repoData.map((m) => m.name));
          setLogin(true);
          const issueData = await AXIOS.getIssue(cookies.token, userData.login);
          if (issueData.items.length < 10) {
            setNoMoreData(true);
          }
          setIssue(issueData.items.map((i) => generateData(i)));
        } catch {
          setError(true);
        }
      }
    }
    func();
  }, [cookies]);

  useEffect(() => {
    setFetching(false);
  }, [issue]);

  const getIssue = async (per_page, page) => {
    try {
      const data = await AXIOS.getIssue(cookies.token, user, per_page, page);
      if (data.items.length < per_page) {
        setNoMoreData(true);
        setFetching(false);
      } else {
        setNoMoreData(false);
      }
      if (data.items.length === 0) {
        return [];
      }
      switch (per_page % 10) {
        case 0:
          setCurrentPage((prev) => prev + 1);
          break;
        case 1:
          if ((data.items.length - 1) % 10 === 0) {
            setCurrentPage((data.items.length - 1) / 10);
          } else {
            setCurrentPage(parseInt((data.items.length - 1) / 10) + 1);
          }
          break;
        case 9:
          if ((data.items.length - 1) % 10 === 0) {
            setCurrentPage(parseInt((data.items.length - 1) / 10));
          } else {
            setCurrentPage(parseInt(data.items.length / 10) + 1);
          }
          break;
        default:
          break;
      }
      return data.items.map((i) => generateData(i));
    } catch {
      setError(true);
    }
  };

  const updateIssue = async (repo, issue_number, updated_data) => {
    try {
      const data = await AXIOS.updateIssue(
        cookies.token,
        user,
        repo,
        issue_number,
        updated_data
      );
      if (updated_data.state !== "closed") {
        setIssue((prev) =>
          prev.map((m) => (m.id === data.id ? generateData(data) : m))
        );
      } else {
        return data;
      }
    } catch {
      setError(true);
    }
  };

  const createIssue = async (repo, new_data) => {
    try {
      const data = await AXIOS.createIssue(cookies.token, user, repo, new_data);
      return data;
    } catch {
      setError(true);
    }
  };

  return (
    <GitContext.Provider
      value={{
        login,
        user,
        cookies,
        setCookie,
        removeCookie,
        issue,
        setIssue,
        repo,
        currentPage,
        setCurrentPage,
        fetching,
        setFetching,
        noMoreData,
        setNoMoreData,
        currentPageSize,
        setCurrentPageSize,
        search,
        setSearch,
        error,
        setError,
        createIssue,
        getIssue,
        updateIssue,
        generateData,
        checkSearch,
      }}
      {...props}
    />
  );
};

const useGit = () => useContext(GitContext);

export { GitProvider, useGit };
