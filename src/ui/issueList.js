import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise, PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "title",
    label: "Issue Title",
    placeholder: "write in here..",
    rules: "required|string|between:5,10"
  },
  {
    name: "text",
    label: "Issue Description",
    placeholder: "write in here..",
    rules: "required|string|between:5,25"
  }
];

class IssueForm extends MobxReactForm {
  constructor(fields, options, issueStore, repo) {
    super(fields, options);
    this.issueStore = issueStore;
    this.repo = repo;

    extendObservable(this, {
      issuePostDeferred: fromPromise(Promise.resolve())
    });
  }

  onSuccess(form) {
    const { id, title, text } = form.values();
    if (id === '') {
      console.log('post', id)
      const resultPromise = this.issueStore.postIssue(this.repo, title, text);
      resultPromise
        .then(() => Toaster.create({ position: Position.TOP }).show({
          message: "issue posted",
          intent: Intent.SUCCESS
        }))
        .catch(() => Toaster.create({ position: Position.TOP }).show({
          message: "failed posting issue",
          action: { text: "retry", onClick: () => form.submit() },
          intent: Intent.DANGER
        }));
      this.issuePostDeferred = fromPromise(resultPromise);
    }
    else {
      console.log('patch', id)
      const resultPromise = this.issueStore.patchIssue(this.repo, id, title, text);
      resultPromise
        .then(() => Toaster.create({ position: Position.TOP }).show({
          message: "issue updated",
          intent: Intent.SUCCESS
        }))
        .catch(() => Toaster.create({ position: Position.TOP }).show({
          message: "failed updating issue",
          action: { text: "retry", onClick: () => form.submit() },
          intent: Intent.DANGER
        }));
      this.issuePostDeferred = fromPromise(resultPromise);
    }

    this.state.form.update({
      id: '',
      title: '',
      text: ''
    });
  }
}

const FormComponent = inject("form")(
  observer(function({ form }) {
    return (
      <form onSubmit={form.onSubmit}>

        <FormInput form={form} field="title" />
        <FormInput form={form} field="text" />

        {form.issuePostDeferred.case({
          pending: () => <Button type="submit" loading={true} text="submit" />,
          rejected: () => (
            <Button type="submit" className="pt-icon-repeat" text="submit" />
          ),
          fulfilled: () => (
            <Button type="submit" onClick={form.onSubmit} text="submit" />
          )
        })}
        <Button onClick={form.onClear} text="clear" />
        <Button onClick={form.onReset} text="reset" />

        <p>{form.error}</p>
      </form>
    );
  })
);

export default inject("issueStore", "sessionStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, sessionStore, route }) {
        super();
        const values = {
          id: '',
          title: '',
          text: ''
        }
        issueStore.getIssues(route.params.repo)
        this.state = {
          form: new IssueForm({ fields, values }, { plugins }, issueStore, route.params.repo)
        };
      }

      setIssueFormContent(e){
         this.state.form.update({
           id: e.number,
           title: e.title,
           text: e.body
         });
      }

      renderIssueList(repoName) {
        const {issueStore, sessionStore} = this.props;

        if (sessionStore.authenticated) {
          const issueDeferred = issueStore.issueDeferred;
          const state = issueDeferred.state;
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
                    <Button onClick={issueStore.getIssues} text="retry"/>
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const issues = issueDeferred.value;
              return (
                <div className="issues">
                  <h3>Issues from {repoName}</h3>
                  {
                  issues.map(
                    (e) =>
                      <div key={e.id} className="issue">
                        <h5>{e.title}</h5>
                        <p>{e.body}</p>
                        <button onClick={() => this.setIssueFormContent(e)}>
                          edit
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
          return <h2>NOT AUTHENTICATED </h2>;
        }
      }

      render() {
        const { form } = this.state;
        const { route } = this.props;

        return (
          <Provider form={form}>
            <div>
            <h3>New issue for {route.params.repo}</h3>
            <FormComponent />
            {this.renderIssueList(route.params.repo)}
            </div>
          </Provider>
        );
      }
    }
  )
);
