import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTabIndex } from './context';
import TabsHeader from './TabsHeader';
function Swiper(props) {
  const {
    theme,
    dark,
    style,
    iconPosition,
    showTextLabel,
    showLeadingSpace,
    uppercase,
    mode,
    tabHeaderStyle,
    tabLabelStyle
  } = props;
  const index = useTabIndex();
  let children = props.children;
  const currentScreen = children[index];
  if (!currentScreen) {
    return null;
  }
  const renderProps = {
    children,
    theme,
    dark,
    style,
    offset: undefined,
    position: undefined,
    iconPosition,
    showTextLabel,
    showLeadingSpace,
    uppercase,
    mode,
    tabHeaderStyle,
    tabLabelStyle
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.root
  }, /*#__PURE__*/React.createElement(TabsHeader, renderProps), currentScreen);
}
const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
export default Swiper;
//# sourceMappingURL=Swiper.js.map