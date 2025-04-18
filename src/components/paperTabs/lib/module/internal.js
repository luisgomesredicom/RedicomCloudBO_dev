import * as React from 'react';
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
export function useIndicator(_ref2) {
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
export function useOffsetScroller(_) {}
export function useAnimatedText(_ref3) {
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