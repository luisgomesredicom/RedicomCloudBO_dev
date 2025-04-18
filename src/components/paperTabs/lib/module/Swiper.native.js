import * as React from 'react';
import { View, Animated, Keyboard, StyleSheet } from 'react-native';
import ViewPager from 'react-native-pager-view';
import { TabsContext } from './context';
import TabsHeader from './TabsHeader';
const styles = StyleSheet.create({
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
  } = React.useContext(TabsContext);
  const indexRef = React.useRef(index || 0);
  let children = props.children;
  const offset = React.useRef(new Animated.Value(0));
  const position = React.useRef(new Animated.Value(index || 0));
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
    Keyboard.dismiss();
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TabsHeader, renderProps), /*#__PURE__*/React.createElement(ViewPager, {
    style: styles.viewPager,
    initialPage: index,
    scrollEnabled: !disableSwipe,
    onPageSelected: onPageSelected,
    ref: viewPager,
    onPageScrollStateChanged: onPageScrollStateChanged,
    onPageScroll: Animated.event([{
      nativeEvent: {
        position: position.current,
        offset: offset.current
      }
    }], {
      useNativeDriver: false
    })
  }, React.Children.map(children.filter(Boolean), (tab, tabIndex) => /*#__PURE__*/React.createElement(View, {
    style: styles.viewPager,
    key: tab.props.label || tabIndex
  }, tab))));
}
export default SwiperNative;
//# sourceMappingURL=Swiper.native.js.map