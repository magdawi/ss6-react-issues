import React from "react";
import SessionButton from "./sessionButton";
import { observer, inject } from "mobx-react";
import { Button } from "@blueprintjs/core";

export default inject("viewStore")(
  observer(function({ viewStore }) {
    return (
      <div className="header">
        <nav className="pt-navbar pt-dark">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">GITHUB/API</div>
          </div>
          <div className="pt-navbar-group pt-align-right">

            <Button
              className="pt-button pt-minimal pt-icon-home"
              onClick={() => viewStore.push(viewStore.routes.home())}
              text="home"
            />
            <Button
              className="pt-button pt-minimal pt-icon-th-list"
              onClick={() => viewStore.push(viewStore.routes.repos())}
              text="repos"
            />
            <Button
              className="pt-button pt-minimal pt-icon-edit"
              onClick={() => viewStore.push(viewStore.routes.issue({repo: "issuetest"}))}
              text="issue"
            />
            <Button
              className="pt-button pt-minimal pt-icon-document"
              onClick={() => viewStore.push(viewStore.routes.about())}
              text="about"
            />
            <span className="pt-navbar-divider" />
            <SessionButton />
          </div>
        </nav>
      </div>
    );
  })
);
