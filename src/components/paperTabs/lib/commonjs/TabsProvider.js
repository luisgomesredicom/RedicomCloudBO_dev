"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabsProvider = TabsProvider;
var _react = _interopRequireWildcard(require("react"));
var _context = require("./context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function TabsProvider(_ref) {
  let {
    children,
    onChangeIndex,
    defaultIndex
  } = _ref;
  const [index, setIndex] = (0, _react.useState)(defaultIndex || 0);
  const goTo = _react.default.useCallback(ind => {
    setIndex(ind);
    onChangeIndex === null || onChangeIndex === void 0 ? void 0 : onChangeIndex(ind);
  }, [setIndex, onChangeIndex]);
  const value = _react.default.useMemo(() => ({
    goTo,
    index
  }), [goTo, index]);
  return /*#__PURE__*/_react.default.createElement(_context.TabsContext.Provider, {
    value: value
  }, children);
}
//# sourceMappingURL=TabsProvider.js.map