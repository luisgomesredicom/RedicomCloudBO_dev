"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedText = useAnimatedText;
exports.useIndicator = useIndicator;
exports.useOffsetScroller = useOffsetScroller;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function getIndicatorStyle(_ref) {
  let {
    left,
    width
  } = _ref;
  return {
    transform: [{
      scaleX: width
    }, {
      translateX: roundToTwo(left / width) || 0
    }]
  };
}
function roundToTwo(num) {
  return Math.round(num * 100 + Number.EPSILON) / 100;
}
function useIndicator(_ref2) {
  let {
    index,
    layouts
  } = _ref2;
  const [indicatorStyle, setIndicatorStyle] = React.useState(null);
  const indicatorRef = React.useRef(null);
  const updateIndicator = React.useCallback(() => {
    if (!indicatorRef.current || !layouts.current) {
      return;
    }
    const cl = layouts.current[index];
    if (cl) {
      setIndicatorStyle(getIndicatorStyle({
        left: cl.x,
        width: cl.width
      }));
    }
  }, [index, indicatorRef, layouts]);

  // update indicator when index changes (updateIndicator function changes to new reference when index changes)
  React.useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);
  return [indicatorRef, updateIndicator, indicatorStyle];
}
function useOffsetScroller(_) {}
function useAnimatedText(_ref3) {
  let {
    activeColor,
    active,
    textColor
  } = _ref3;
  return React.useMemo(() => ({
    color: active ? activeColor : textColor,
    opacity: active ? 1 : 0.6
  }), [active, activeColor, textColor]);
}
//# sourceMappingURL=internal.js.map