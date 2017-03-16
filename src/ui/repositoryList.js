import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
export default inject("repoStore", "sessionStore", "viewStore")(
  observer(
    class RepositoryList extends React.Component {
      constructor({ repoStore, sessionStore, viewStore }) {
        super();
        repoStore.fetchRepos();
      }
      renderRepoList() {
        const {sessionStore, repoStore, viewStore} = this.props;

        if (sessionStore.authenticated) {
          const repoDeferred = repoStore.repoDeferred;
          const state = repoDeferred.state;
          switch (state) {
            case PENDING: {
              return <Spinner />;
            }
            case REJECTED: {
              return (
                <div className="pt-non-ideal-state">
                  <div
                    className="pt-non-ideal-state-visual pt-non-ideal-state-icon"
                  >
                    <span className="pt-icon pt-icon-error" />
                  </div>
                  <h4 className="pt-non-ideal-state-title">Error occured</h4>
                  <div className="pt-non-ideal-state-description">
                    <Button onClick={repoStore.fetchRepos} text="retry"/>
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const repos = repoDeferred.value;
              //console.log(repos)
              return (
                <div className="repos">
                  <h5>Amount: {repos.length}</h5>
                  {
                  repos.map(
                    (e) =>
                      <div key={e.id} className="repo">
                        <h5><a href={e.svn_url}>{e.name}</a></h5>
                        <button onClick={() => viewStore.push(viewStore.routes.issue({repo: e.name}))}>
                          write Issue
                        </button>
                      </div>
                    )
                  }
                </div>
              );
            }
            default: {
              console.error("deferred state not supported", state);
            }
          }
        } else {
          return <h1>NOT AUTHENTICATED </h1>;
        }
      }
      render() {
        return (
          <div>
            <h3>Repos</h3>
            {this.renderRepoList()}
          </div>
        );
      }
    }
  )
);
