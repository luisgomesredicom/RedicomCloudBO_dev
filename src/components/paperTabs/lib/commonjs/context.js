"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabsContext = void 0;
exports.useTabIndex = useTabIndex;
exports.useTabNavigation = useTabNavigation;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const TabsContext = /*#__PURE__*/React.createContext({
  goTo: () => null,
  index: 0
});
exports.TabsContext = TabsContext;
function useTabNavigation() {
  return (0, React.useContext)(TabsContext).goTo;
}
function useTabIndex() {
  return (0, React.useContext)(TabsContext).index;
}
//# sourceMappingURL=context.js.map