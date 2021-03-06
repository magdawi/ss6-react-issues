export default class GithubAPI {
  constructor({ userToken }) {
    this.userToken = userToken;
    this.defaultHeaders = {
      Authorization: `token ${this.userToken}`
    };
  }

  currentUser = () => {
    return fetch("https://api.github.com/user", {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  userRepositories = ({ login }) => {
    return fetch(`https://api.github.com/users/${login}/repos`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  getIssues = ({ login, repo }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues?utf8=✓&q=is%3Aissue`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  postIssue = ({ login, repo, title, text }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  patchIssue = ({ login, repo, id, title, text }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues/${id}`, {
      method: "PATCH",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  closeIssue = ({ login, repo, id}) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues/${id}`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        state: "closed"
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };
}
