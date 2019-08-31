# About

[Babel Macro](https://github.com/kentcdodds/babel-plugin-macros) to inject [display name](https://reactjs.org/docs/react-component.html#displayname) into dynamically constructed components

```js
import classToComponent from "@ts-delight/class-to-component";
import {style} from "typestyle";

// Before:
const Container = classToComponent(style({ display: 'block' }));
              //    ^
              //    |_______ Creates a react component

// If we see in react-dev-tools, the name shown for this component will be 
// ClassToComponent(div) which can be confusing if we have many such generated components.
```

We can fix this by either passing a displayName to the component API (if supported):

```js
const Container = classToComponent({
  class: style({ display: 'block' }),
  displayName: 'Container'
})
```

Or assigning the displayName ourselves: 

```js
Container.displayName = 'Container';
```

But both of these options require duplication of code. 
So instead we can use this macro:

```js
import injectDN from "@ts-delight/inject-display-name.macro";

const Container = injectDN(classToComponent(style({ display: 'block' })));
```

Which will automatically inject a statement (at build time) like:

```js
Container.displayName = 'Container';
```

where the display name matches the variable the component is assigned to.

It also works with default exports: 

```js
// CustomContainer.js
import injectDN from "@ts-delight/inject-display-name.macro";
import classToComponent from "class-to-component";
import {style} from "typestyle";

export default injectDN(classToComponent(style({ display: 'block' })));
```

Which will be transformed to: 

```js
import injectDN from "@ts-delight/inject-display-name.macro";
import classToComponent from "@ts-delight/class-to-component";
import {style} from "typestyle";

const CustomContainer = injectDN(classToComponent(style({ display: 'block' })));
CustomContainer.displayName = 'CustomContainer';
export default CustomContainer;
```

Here both the display name and the constant name is derived from the name of the file.

## Installation

This utility is implemented as a [babel-macro](https://github.com/kentcdodds/babel-plugin-macros).

Refer babel's [setup instructions](https://babeljs.io/setup) to learn how to setup your project to use [babel](https://babeljs.io) for compilation.

1. Install `babel-plugin-macros` and `inject-display-name.macro`:

```js
npm install --save-dev babel-plugin-macros @ts-delight/inject-display-name.macro
```

2. Add babel-plugin-macros to .babelrc (if not already preset):

```js
// .babelrc

module.exports = {
  presets: [
    // ... other presets
  ],
  plugins: [
    'babel-plugin-macros'    // <-- REQUIRED
    // ... other plugins
  ],
};
```

## Usage with TypeScript

TypeScript definitions are provided within this package.

## License

MIT
