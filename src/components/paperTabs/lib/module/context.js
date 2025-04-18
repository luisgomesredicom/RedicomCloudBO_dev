import * as React from 'react';
import { useContext } from 'react';
export const TabsContext = /*#__PURE__*/React.createContext({
  goTo: () => null,
  index: 0
});
export function useTabNavigation() {
  return useContext(TabsContext).goTo;
}
export function useTabIndex() {
  return useContext(TabsContext).index;
}
//# sourceMappingURL=context.js.map