"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TabsHeader;
var _reactNative = require("react-native");
var _reactNativePaper = require("react-native-paper");
var _color = _interopRequireDefault(require("color"));
var React = _interopRequireWildcard(require("react"));
var _internal = require("./internal");
var _TabsHeaderItem = _interopRequireDefault(require("./TabsHeaderItem"));
var _context = require("./context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function TabsHeader(_ref) {
  let {
    position,
    offset,
    theme,
    dark,
    style,
    iconPosition,
    showTextLabel,
    showLeadingSpace,
    uppercase,
    mode,
    tabHeaderStyle,
    tabLabelStyle,
    children
  } = _ref;
  const {
    index,
    goTo
  } = React.useContext(_context.TabsContext);
  const {
    colors,
    dark: isDarkTheme,
    mode: themeMode,
    isV3
  } = theme;
  const {
    backgroundColor: customBackground,
    elevation: _elevation,
    ...restStyle
  } = _reactNative.StyleSheet.flatten(style) || {};
  let elevation = theme.isV3 ? _elevation : _elevation || 4;
  let isDark;
  const backgroundColorV2 = isDarkTheme && themeMode === 'adaptive' ? (0, _reactNativePaper.overlay)(elevation || 0, colors.surface) : colors.primary;
  const backgroundColorV3 = theme.colors.surface;
  const backgroundColor = customBackground ? customBackground : isV3 ? backgroundColorV3 : backgroundColorV2;
  let hasPrimaryBackground = colors.primary === backgroundColor;
  if (typeof dark === 'boolean') {
    isDark = dark;
  } else {
    isDark = backgroundColor === 'transparent' ? false :
    // @ts-ignore
    !(0, _color.default)(backgroundColor).isLight();
  }
  const textColorV2 = isDark ? '#fff' : '#000';
  const activeColorV2 = hasPrimaryBackground ? textColorV2 : theme.colors.primary;

  // Color (active)	On surface	md.sys.color.on-surface
  // Color (inactive)	On surface variant	md.sys.color.on-surface-variant
  const textColorV3 = colors.onSurfaceVariant;
  const activeColorV3 = colors.onSurface;
  const textColor = isV3 ? textColorV3 : textColorV2;
  const activeColor = isV3 ? activeColorV3 : activeColorV2;
  const innerScrollSize = React.useRef(null);
  const scrollX = React.useRef(0);
  const scrollRef = React.useRef(null);
  const layouts = React.useRef(null);
  const [tabsLayout, setTabsLayout] = React.useState(null);
  const [indicatorRef, onUpdateTabLayout, indicatorStyle] = (0, _internal.useIndicator)({
    tabsLayout,
    layouts,
    index,
    offset,
    position,
    childrenCount: children.length
  });
  const onTabsLayout = React.useCallback(e => {
    setTabsLayout(e.nativeEvent.layout);
  }, [setTabsLayout]);
  const onTabLayout = React.useCallback((tabIndex, event) => {
    layouts.current = {
      ...layouts.current,
      [tabIndex]: event.nativeEvent.layout
    };
    onUpdateTabLayout();
  }, [layouts, onUpdateTabLayout]);
  const updateScroll = React.useCallback(scrollType => {
    if (!layouts.current || mode !== 'scrollable') {
      return;
    }
    let cl = layouts.current[index];
    if (!cl || !scrollRef.current || !tabsLayout) {
      return;
    }
    const tabsWidth = tabsLayout.width;
    let scrolledX = scrollX.current;
    // console.log({ scrolledX, scrollType });
    if (scrollType === 'next') {
      var _layouts$current;
      const next = (_layouts$current = layouts.current) === null || _layouts$current === void 0 ? void 0 : _layouts$current[index + 1];
      if (next) {
        cl = next;
      }
    } else if (scrollType === 'prev') {
      var _layouts$current2;
      const prev = (_layouts$current2 = layouts.current) === null || _layouts$current2 === void 0 ? void 0 : _layouts$current2[index - 1];
      if (prev) {
        cl = prev;
      }
    }
    const relativeX = cl.x - scrolledX;
    const overflowLeft = relativeX;
    const overflowRight = -tabsWidth + relativeX + cl.width;
    if (overflowRight > -50) {
      scrollRef.current.scrollTo({
        x: scrolledX + overflowRight + 50,
        y: 0,
        animated: true
      });
    } else if (overflowLeft < 50) {
      scrollRef.current.scrollTo({
        x: scrolledX + overflowLeft - 50,
        y: 0,
        animated: true
      });
    }
  }, [mode, layouts, index, scrollRef, scrollX, tabsLayout]);

  // subscribes to offset on native devices to scroll tab bar faster when scrolling (iOS only since Android bugs)
  (0, _internal.useOffsetScroller)({
    updateScroll,
    index,
    offset,
    mode
  });

  // updates scroll when index changes (updateScroll function changes to new reference when index changes)
  React.useEffect(() => {
    updateScroll();
  }, [updateScroll]);
  const SurfaceComponent = theme.isV3 ? _reactNative.View : _reactNativePaper.Surface;
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.relative, tabHeaderStyle]
  }, /*#__PURE__*/React.createElement(SurfaceComponent, {
    style: [{
      backgroundColor,
      elevation
    }, restStyle, styles.tabs, iconPosition === 'top' && styles.tabsTopIcon],
    onLayout: onTabsLayout
  }, /*#__PURE__*/React.createElement(_reactNative.ScrollView, {
    ref: scrollRef,
    contentContainerStyle: mode === 'fixed' ? styles.fixedContentContainerStyle : undefined,
    onContentSizeChange: e => {
      innerScrollSize.current = e;
    },
    onScroll: e => {
      scrollX.current = e.nativeEvent.contentOffset.x;
    },
    scrollEventThrottle: 25,
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    alwaysBounceHorizontal: mode === 'scrollable',
    scrollEnabled: mode === 'scrollable'
  }, mode === 'scrollable' && showLeadingSpace ? /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.scrollablePadding
  }) : null, React.Children.map(children, (tab, tabIndex) => /*#__PURE__*/React.createElement(_TabsHeaderItem.default, {
    theme: theme,
    tabIndex: tabIndex,
    tab: tab,
    active: index === tabIndex,
    onTabLayout: onTabLayout,
    goTo: goTo,
    activeColor: activeColor,
    textColor: textColor,
    position: position,
    offset: offset,
    childrenCount: children.length,
    uppercase: uppercase,
    iconPosition: iconPosition,
    showTextLabel: showTextLabel,
    mode: mode,
    tabLabelStyle: tabLabelStyle
  })), /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    ref: indicatorRef,
    pointerEvents: "none",
    style: [styles.indicator, {
      backgroundColor: theme.colors.primary
    }, indicatorStyle]
  })), elevation && /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.removeTopShadow, {
      height: elevation,
      backgroundColor,
      top: -elevation
    }]
  })));
}
const styles = _reactNative.StyleSheet.create({
  relative: {
    position: 'relative'
  },
  removeTopShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2
  },
  scrollablePadding: {
    width: 52
  },
  tabs: {
    height: 48
  },
  tabsTopIcon: {
    height: 72
  },
  fixedContentContainerStyle: {
    flex: 1
  },
  indicator: {
    position: 'absolute',
    height: 2,
    width: 1,
    left: 0,
    bottom: 0,
    ..._reactNative.Platform.select({
      web: {
        backgroundColor: 'transparent',
        transitionDuration: '150ms',
        transitionProperty: 'all',
        transformOrigin: 'left',
        willChange: 'transform'
      },
      default: {}
    })
  }
});
//# sourceMappingURL=TabsHeader.js.map