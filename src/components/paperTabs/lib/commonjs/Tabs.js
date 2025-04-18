"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNativePaper = require("react-native-paper");
var _Swiper = _interopRequireDefault(require("./Swiper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function Tabs(_ref) {
  let {
    theme,
    dark,
    style,
    mode = 'fixed',
    uppercase = true,
    iconPosition = 'leading',
    showTextLabel = true,
    showLeadingSpace = true,
    disableSwipe = false,
    tabHeaderStyle,
    tabLabelStyle,
    ...rest
  } = _ref;
  const children = React.Children.toArray(rest.children).filter(Boolean);
  return /*#__PURE__*/React.createElement(_Swiper.default, {
    style: style,
    dark: dark,
    theme: theme,
    uppercase: uppercase,
    iconPosition: iconPosition,
    showTextLabel: showTextLabel,
    showLeadingSpace: showLeadingSpace,
    mode: mode,
    disableSwipe: disableSwipe,
    tabHeaderStyle: tabHeaderStyle,
    tabLabelStyle: tabLabelStyle
  }, children);
}
var _default = (0, _reactNativePaper.withTheme)(Tabs);
exports.default = _default;
//# sourceMappingURL=Tabs.js.map