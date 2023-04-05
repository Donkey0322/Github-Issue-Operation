import { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import * as AXIOS from "../../middleware";
import dayjs from "../util/day";

const GitContext = createContext({
  login: false,
  user: "",
  issue: {},
  repo: [],
  currentPage: 1,
  fetching: false,
  noMoreData: false,
  lessThanPageSize: false,
  currentPageSize: 10,
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
  const [lessThanPageSize, setLessThanPageSize] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  function generateData(target) {
    return {
      title: target.title,
      body: target.body,
      create: target.created_at,
      update: target.updated_at,
      state: target.state,
      number: target.number,
      repo: target.repository_url.split("/").slice(-1),
      id: target.id,
      label: target.labels[0]?.name ?? "Open",
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
          } else {
            setCurrentPage(2);
          }
          setIssue(issueData.items.map((i) => generateData(i)));
          setFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    func();
  }, [cookies]);

  useEffect(() => {
    setFetching(false);
  }, [issue]);

  const getIssue = async (per_page, page) => {
    const data = await AXIOS.getIssue(cookies.token, user, per_page, page);
    console.log(data);
    if (data.items.length < per_page) {
      setNoMoreData(true);
      setLessThanPageSize(false);
    } else {
      switch (per_page % 10) {
        case 9: //新增
          if (data.items.length === per_page)
            setCurrentPage((prev) => prev + 1);

          break;

        default:
          break;
      }
      if (per_page) {
        setCurrentPage((prev) => prev + 1);
      }
    }
    return data.items.map((i) => generateData(i));
  };

  const updateIssue = async (repo, issue_number, updated_data) => {
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
  };

  const createIssue = async (repo, new_data) => {
    const data = await AXIOS.createIssue(cookies.token, user, repo, new_data);
    console.log(data);
    return data;
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
        lessThanPageSize,
        setLessThanPageSize,
        currentPageSize,
        setCurrentPageSize,
        createIssue,
        getIssue,
        updateIssue,
        generateData,
      }}
      {...props}
    />
  );
};

const useGit = () => useContext(GitContext);

export { GitProvider, useGit };
