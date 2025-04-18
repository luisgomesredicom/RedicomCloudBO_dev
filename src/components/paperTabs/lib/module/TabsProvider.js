import React, { useState } from 'react';
import { TabsContext } from './context';
export function TabsProvider(_ref) {
  let {
    children,
    onChangeIndex,
    defaultIndex
  } = _ref;
  const [index, setIndex] = useState(defaultIndex || 0);
  const goTo = React.useCallback(ind => {
    setIndex(ind);
    onChangeIndex === null || onChangeIndex === void 0 ? void 0 : onChangeIndex(ind);
  }, [setIndex, onChangeIndex]);
  const value = React.useMemo(() => ({
    goTo,
    index
  }), [goTo, index]);
  return /*#__PURE__*/React.createElement(TabsContext.Provider, {
    value: value
  }, children);
}
//# sourceMappingURL=TabsProvider.js.map