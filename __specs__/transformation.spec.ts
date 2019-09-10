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

    const C0 = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      C0.displayName = \\"C0\\";
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"C0\\");
    }

    const C1 = () => {
      return _react.default.createElement(\\"div\\");
    };

    exports.C1 = C1;

    try {
      C1.displayName = \\"C1\\";
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"C1\\");
    }

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
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"C3\\");
    }

    var C4 = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      C4.displayName = \\"C4\\";
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"C4\\");
    }

    const _index = () => {
      return _react.default.createElement(\\"div\\");
    };

    try {
      _index.displayName = \\"_index\\";
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"_index\\");
    }

    var _default = _index;
    exports.default = _default;

    const C5 = () => _react.default.createElement(\\"div\\");

    try {
      C5.displayName = \\"C5\\";
    } catch (e) {
      console.error(e);
      console.error(\\"injectDN failed to assign displayName:\\", \\"C5\\");
    }"
  `);
});
