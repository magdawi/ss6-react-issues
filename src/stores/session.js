import localforage from "localforage";
import { extendObservable, action, computed } from "mobx";
import { fromPromise, FULFILLED } from "mobx-utils";

export default class Session {
  constructor({ githubAPI }) {
    extendObservable(this, {
      userDeferred: fromPromise(localforage.getItem("authenticatedUser")),
      authenticated: computed(() => !!(this.userDeferred.state === FULFILLED && this.userDeferred.value && this.userDeferred.value.login)),
      currentUser: computed(() => this.userDeferred.value),
      login: action("login", () => {
        this.userDeferred = fromPromise(
          githubAPI.currentUser().then(user => {
            return localforage
              .setItem("authenticatedUser", user)
              .then(() => user);
          })
        );
      }),
      logout: action("logout", () => {
        this.userDeferred = fromPromise(
          localforage.setItem("authenticatedUser", null).then(user => null)
        );
      })
    });
  }
}
