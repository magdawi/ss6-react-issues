import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise } from "mobx-utils";
import { Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Issue Title",
    rules: "required|string|between:5,10"
  },
  {
    name: "text",
    label: "Text",
    placeholder: "Issue Description",
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
    const { title, text } = form.values();
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

export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();
        this.state = {
          form: new IssueForm({ fields }, { plugins }, issueStore, route.params.repo)
        };
      }
      render() {
        const { form } = this.state;
        const {route} = this.props;

        return (
          <Provider form={form}>
            <div>
            <h3>issue for {route.params.repo}</h3>
            <FormComponent />
            </div>
          </Provider>
        );
      }
    }
  )
);
