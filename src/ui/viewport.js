import React from "react";
import { observer, inject } from "mobx-react";
import Transition from "react-motion-ui-pack";
import "./viewport.css";

const Wrapper = ({ children }) => <div className="viewport">{children}</div>;

export default inject("viewStore")(
  observer(function({ viewStore }) {
    return (
      <Transition
        component={Wrapper}
        enter={{
          opacity: 1,
          translateX: 0
        }}
        leave={{
          opacity: 0,
          translateX: 250
        }}
      >
        <div className="route" key={viewStore.currentView.name}>
          <viewStore.currentView.component route={viewStore.currentView} />
        </div>
      </Transition>
    );
  })
);
