import * as React from 'react';
import { withTheme } from 'react-native-paper';
import Swiper from './Swiper';
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
  return /*#__PURE__*/React.createElement(Swiper, {
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
export default withTheme(Tabs);
//# sourceMappingURL=Tabs.js.map