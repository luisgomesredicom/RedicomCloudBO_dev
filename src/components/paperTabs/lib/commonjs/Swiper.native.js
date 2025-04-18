"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativePagerView = _interopRequireDefault(require("react-native-pager-view"));
var _context = require("./context");
var _TabsHeader = _interopRequireDefault(require("./TabsHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const styles = _reactNative.StyleSheet.create({
  viewPager: {
    flex: 1
  }
});
function SwiperNative(props) {
  const {
    theme,
    dark,
    style,
    iconPosition,
    showTextLabel,
    uppercase,
    mode,
    showLeadingSpace,
    disableSwipe,
    tabHeaderStyle,
    tabLabelStyle
  } = props;
  const {
    index,
    goTo
  } = React.useContext(_context.TabsContext);
  const indexRef = React.useRef(index || 0);
  let children = props.children;
  const offset = React.useRef(new _reactNative.Animated.Value(0));
  const position = React.useRef(new _reactNative.Animated.Value(index || 0));
  const isScrolling = React.useRef(false);
  const viewPager = React.useRef(undefined);
  React.useEffect(() => {
    if (index !== indexRef.current) {
      isScrolling.current = true;
      requestAnimationFrame(() => viewPager.current && viewPager.current.setPage(index));
    }
    indexRef.current = index;
    return undefined;
  }, [isScrolling, viewPager, index]);
  const onPageScrollStateChanged = React.useCallback(event => {
    _reactNative.Keyboard.dismiss();
    isScrolling.current = event.nativeEvent.pageScrollState !== 'idle';
  }, [isScrolling]);
  const onPageSelected = React.useCallback(e => {
    isScrolling.current = false;
    const i = e.nativeEvent.position;
    goTo(i);
  }, [isScrolling, goTo]);
  const renderProps = {
    children,
    theme,
    dark,
    style,
    position: position.current,
    offset: offset.current,
    iconPosition,
    showTextLabel,
    showLeadingSpace,
    uppercase,
    mode,
    tabHeaderStyle,
    tabLabelStyle
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_TabsHeader.default, renderProps), /*#__PURE__*/React.createElement(_reactNativePagerView.default, {
    style: styles.viewPager,
    initialPage: index,
    scrollEnabled: !disableSwipe,
    onPageSelected: onPageSelected,
    ref: viewPager,
    onPageScrollStateChanged: onPageScrollStateChanged,
    onPageScroll: _reactNative.Animated.event([{
      nativeEvent: {
        position: position.current,
        offset: offset.current
      }
    }], {
      useNativeDriver: false
    })
  }, React.Children.map(children.filter(Boolean), (tab, tabIndex) => /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.viewPager,
    key: tab.props.label || tabIndex
  }, tab))));
}
var _default = SwiperNative;
exports.default = _default;
//# sourceMappingURL=Swiper.native.js.map