import React from "react";
import { observer } from "mobx-react";

export default observer(function({ form, field }) {
  const classes = ["pt-input"];

  if (form.$(field).error) {
    classes.push("pt-intent-danger");
  }

  return (
    <div>
      <label className="pt-label " htmlFor={form.$(field).id}>
        {form.$(field).label}
      </label>
      <input className={classes.join(" ")} {...form.$(field).bind()} />
      <p>{form.$(field).error}</p>
    </div>
  );
});
