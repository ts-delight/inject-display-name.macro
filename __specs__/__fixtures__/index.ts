import injectDN from "../../inject-display-name.macro";
import React from "react";

const C0 = injectDN(() => {
  return React.createElement("div");
});

export const C1 = injectDN(() => {
  return React.createElement("div");
});

const Fn = () => {
  return React.createElement("div");
};

export const C2 = Fn;

let C3 = injectDN(() => {
  return React.createElement("div");
});

var C4 = injectDN(() => {
  return React.createElement("div");
});

export default injectDN(() => {
  return React.createElement("div");
});
