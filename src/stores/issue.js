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
      fetchIssues: action("fetchIssues", (repo) => {
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
                login: userDeferred.value,
                repo
              })
            );
          }
        );
      }),
    });
  }
}
