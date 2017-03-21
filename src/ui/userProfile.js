import React from "react";
import { observer, inject } from "mobx-react";

function Authenticated(Component) {
  return inject("sessionStore") (
    observer(
      function({sessionStore}) {
        if (sessionStore.authenticated) {
          return <Component/>
        }
        else {
          return <h2>NOT AUTHENTICATED </h2>;
        }

      }
    )
  )
}

export default Authenticated(
  inject("sessionStore")(
    observer(
      function({sessionStore}) {
          const currentUser = (window.currentUser = sessionStore.currentUser)
          return (
            <div>
              <h4><a href={currentUser.html_url}>{currentUser.name}</a></h4>
              <h6>{currentUser.login}</h6>
              <p>Follower: <a href={currentUser.followers_url}>{currentUser.followers}</a></p>
              <p>Following: <a href={currentUser.following_url}>{currentUser.following}</a></p>
            </div>
          )
      }
    )
  )
);
