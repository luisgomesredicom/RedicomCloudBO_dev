"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedText = useAnimatedText;
exports.useIndicator = useIndicator;
exports.useOffsetScroller = useOffsetScroller;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function useAnimatedText(_ref) {
  let {
    childrenCount,
    tabIndex,
    position,
    offset,
    textColor,
    activeColor
  } = _ref;
  const childrenA = Array(childrenCount).fill(undefined);
  const positionWithOffset = _reactNative.Animated.add(position, offset);
  const inputRange = childrenA.map((_, i) => i);
  return {
    color: childrenA.length <= 1 ? activeColor : positionWithOffset.interpolate({
      inputRange: inputRange,
      outputRange: childrenA.map((_, i) => i === tabIndex ? activeColor : textColor)
    }),
    opacity: childrenA.length <= 1 ? 1 : positionWithOffset.interpolate({
      inputRange: inputRange,
      outputRange: childrenA.map((_, i) => i === tabIndex ? 1 : 0.6)
    })
  };
}
function useIndicator(_ref2) {
  let {
    childrenCount,
    position,
    offset,
    layouts,
    tabsLayout
  } = _ref2;
  const [renderIndex, setRenderIndex] = React.useState(0);
  const style = React.useMemo(() => {
    /* eslint-disable @typescript-eslint/no-unused-vars  */
    // @ts-ignore
    let _ = renderIndex;
    const childrenA = Array(childrenCount).fill(undefined);
    const inputRange = childrenA.map((__, i) => i);
    const positionWithOffset = _reactNative.Animated.add(position, offset);
    const getTranslateX = i => {
      var _layouts$current;
      const cl = (_layouts$current = layouts.current) === null || _layouts$current === void 0 ? void 0 : _layouts$current[i];
      if (!cl) {
        return 0;
      }
      return (cl.x + cl.width / 2) / cl.width;
    };
    const getScaleX = i => {
      var _layouts$current2;
      return ((_layouts$current2 = layouts.current) === null || _layouts$current2 === void 0 || (_layouts$current2 = _layouts$current2[i]) === null || _layouts$current2 === void 0 ? void 0 : _layouts$current2.width) || 0;
    };
    return position && tabsLayout && layouts.current ? {
      transform: [{
        scaleX: childrenA.length <= 1 ? getScaleX(0) : positionWithOffset.interpolate({
          inputRange,
          outputRange: childrenA.map((__, i) => getScaleX(i))
        })
      }, {
        translateX: childrenA.length <= 1 ? getTranslateX(0) : positionWithOffset.interpolate({
          inputRange,
          outputRange: childrenA.map((__, i) => getTranslateX(i))
        })
      }]
    } : null;
  }, [position, offset, tabsLayout, layouts, renderIndex, childrenCount]);
  const onUpdateTabLayout = React.useCallback(() => {
    setRenderIndex(prev => prev + 1);
  }, [setRenderIndex]);
  return [undefined, onUpdateTabLayout, style];
}
function useOffsetScroller(_ref3) {
  let {
    index,
    offset,
    updateScroll,
    mode
  } = _ref3;
  // we want native to scroll before the index changes
  const direction = React.useRef(undefined);
  React.useEffect(() => {
    // android does not work unfortunately
    if (offset && _reactNative.Platform.OS !== 'android' && mode === 'scrollable') {
      const id = offset.addListener(nOffset => {
        const newOffset = nOffset.value;
        const oldDirection = direction.current;
        if (newOffset > 0.1) {
          direction.current = 'next';
        } else if (newOffset < -0.1) {
          direction.current = 'prev';
        }
        if (direction.current) {
          if (oldDirection !== direction.current) {
            updateScroll(direction.current);
          }
        }
      });
      return () => {
        offset.removeListener(id);
      };
    }
    return undefined;
  }, [offset, updateScroll, direction, mode]);
  React.useEffect(() => {
    direction.current = undefined;
  }, [index]);
}
//# sourceMappingURL=internal.native.js.map