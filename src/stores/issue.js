import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      issueDeferred: null,
      postIssue: action("postIssue", (repo, title, text) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text
        });
      }),
      patchIssue: action("patchIssue", (repo, id, title, text) => {
        return githubAPI.patchIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          id,
          title,
          text
        });
      }),
      closeIssue: action("closeIssue", (repo, id) => {
        return githubAPI.closeIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          id
        });
      }),
      getIssues: action("getIssues", (repo) => {
        when(
          // condition
          () =>
            sessionStore.authenticated &&
            (this.issueDeferred === null ||
              this.issueDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issueDeferred = fromPromise(
              githubAPI.getIssues({
                login: userDeferred.value.login,
                repo
              })
            );
          }
        );
      }),
    });
  }
}
