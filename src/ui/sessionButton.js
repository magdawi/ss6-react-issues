import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import "./sessionButton.css";

import {
  Button,
  Intent,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position
} from "@blueprintjs/core";

export default inject("sessionStore")(
  observer(function({ sessionStore }) {
    switch (sessionStore.userDeferred.state) {
      case PENDING:
        return <Button loading={true} />;
      case REJECTED:
        return (
          <Button
            intent={Intent.WARNING}
            onClick={sessionStore.login}
            className="pt-minimal pt-icon-repeat"
            text="retry"
          />
        );
      case FULFILLED: {
        const user = sessionStore.userDeferred.value;
        if (user) {
          // logged in
          const menu = (
            <Menu>
              <MenuItem text={`logged in as ${user.login}`} />
              <MenuDivider />
              <MenuItem text="Logout" onClick={sessionStore.logout} />
            </Menu>
          );

          return (
            <Popover
              content={menu}
              position={Position.BOTTOM_RIGHT}
              inheritDarkTheme={false}
            >
              <img className="avatar" src={user.avatar_url} alt="user" />
            </Popover>
          );
        } else {
          return (
            <Button
              text="login"
              onClick={sessionStore.login}
              className="pt-minimal pt-icon-log-in"
            />
          );
        }
      }
      default: {
        console.error(
          "switch should be exhaustive but got ",
          sessionStore.userDeferred.state
        );
      }
    }
  })
);
