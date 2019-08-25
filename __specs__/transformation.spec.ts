import * as path from "path";
import { transformFileSync } from "@babel/core";

test("Transformations", () => {
  expect(transformFileSync(path.join(__dirname, "__fixtures__/index.ts"))!.code)
    .toMatchInlineSnapshot(`
    "\\"use strict\\";

    Object.defineProperty(exports, \\"__esModule\\", {
      value: true
    });
    exports.default = exports.C2 = exports.C1 = void 0;

    var _react = _interopRequireDefault(require(\\"react\\"));

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    try {
      C1.displayName = \\"C1\\";
    } catch (e) {}

    const C0 = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      C0.displayName = \\"C0\\";
    } catch (e) {}

    const C1 = () => {
      return _react.default.createElement(\\"div\\");
    };

    exports.C1 = C1;

    const Fn = () => {
      return _react.default.createElement(\\"div\\");
    };

    const C2 = Fn;
    exports.C2 = C2;

    let C3 = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      C3.displayName = \\"C3\\";
    } catch (e) {}

    var C4 = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      C4.displayName = \\"C4\\";
    } catch (e) {}

    const _index = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      _index.displayName = \\"_index\\";
    } catch (e) {}

    var _default = _index;
    exports.default = _default;"
  `);
});
