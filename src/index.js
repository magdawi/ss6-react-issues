import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import { Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";
import SessionStore from "./stores/session";
import ViewStore from "./stores/view";
import GithubApp from "./ui/githubApp";
import GithubAPI from "./api/github";
import RepoStore from "./stores/repo";
import IssueStore from "./stores/issue";
import "./index.css";

// wire up dependencies
const githubAPI = new GithubAPI({ 
  userToken: "e1ee0744f87186125f468ea4ade77674cb7979cd"
});
const sessionStore = new SessionStore({ githubAPI });
const viewStore = new ViewStore();
const repoStore = new RepoStore({ githubAPI, sessionStore });
const issueStore = new IssueStore({ githubAPI, sessionStore });

// render the whole application
// provider is a kind of dependency injection system
function renderApp() {
  ReactDOM.render(
    <div>
      <DevTools position={{ bottom: 0, right: 10 }} />
      <Provider sessionStore={sessionStore} viewStore={viewStore} repoStore={repoStore} issueStore={issueStore}>
        <GithubApp />
      </Provider>
    </div>,
    document.getElementById("root")
  );
}

// callback for MOBX to indicate a rerender
autorun(renderApp);
