import * as React from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Badge, Text, TouchableRipple } from 'react-native-paper';
import Color from 'color';
import { useAnimatedText } from './internal';
import MaterialCommunityIcon from './MaterialCommunityIcon';
const AnimatedText = Animated.createAnimatedComponent(Text);
export default function TabsHeaderItem(_ref) {
  let {
    tab,
    tabIndex,
    active,
    goTo,
    onTabLayout,
    activeColor,
    textColor,
    theme,
    position,
    offset,
    childrenCount,
    uppercase,
    mode,
    iconPosition,
    showTextLabel,
    tabLabelStyle
  } = _ref;
  const baseColor = theme.colors.primary;
  const rippleColor = React.useMemo(() => Color(baseColor).alpha(0.32).rgb().string(), [baseColor]);
  const {
    color,
    opacity
  } = useAnimatedText({
    active,
    position,
    offset,
    activeColor,
    textColor,
    tabIndex,
    childrenCount
  });
  const badgeIsFilled = tab.props.badge !== undefined && tab.props.badge !== null;
  const badgeWithoutContent = typeof tab.props.badge === 'boolean';
  return /*#__PURE__*/React.createElement(View, {
    key: tab.props.label,
    style: [styles.tabRoot, mode === 'fixed' && styles.tabRootFixed],
    onLayout: e => onTabLayout(tabIndex, e)
  }, /*#__PURE__*/React.createElement(TouchableRipple, {
    disabled: tab.props.disabled,
    onPress: e => {
      var _tab$props$onPress, _tab$props;
      goTo(tabIndex);
      (_tab$props$onPress = (_tab$props = tab.props).onPress) === null || _tab$props$onPress === void 0 ? void 0 : _tab$props$onPress.call(_tab$props, e);
    },
    onPressIn: tab.props.onPressIn,
    style: [styles.touchableRipple, iconPosition === 'top' && styles.touchableRippleTop, tab.props.disabled && styles.touchableRippleDisabled, {
      borderRadius: theme.roundness
    }],
    rippleColor: rippleColor
    // @ts-ignore
    ,
    accessibilityTraits: 'button',
    accessibilityRole: "button",
    accessibilityComponentType: "button",
    accessibilityLabel: tab.props.label,
    accessibilityState: {
      selected: active
    },
    testID: `tab_${tabIndex}`
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.touchableRippleInner, iconPosition === 'top' && styles.touchableRippleInnerTop]
  }, tab.props.icon ? /*#__PURE__*/React.createElement(View, {
    style: [styles.iconContainer, iconPosition !== 'top' && styles.marginRight]
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    selectable: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: "no",
    name: tab.props.icon || '',
    style: {
      color: color,
      opacity
    },
    size: 24
  })) : null, badgeIsFilled ? /*#__PURE__*/React.createElement(View, {
    style: [styles.badgeContainer, {
      right: (badgeWithoutContent ? String(tab.props.badge).length * -2 : 0) - 2
    }]
  }, badgeWithoutContent ? /*#__PURE__*/React.createElement(Badge, {
    visible: true,
    size: 8
  }) : /*#__PURE__*/React.createElement(Badge, {
    visible: true,
    size: 16
  }, tab.props.badge)) : null, showTextLabel ? /*#__PURE__*/React.createElement(AnimatedText, {
    selectable: false,
    style: [styles.text, iconPosition === 'top' && styles.textTop, {
      ...theme.fonts.titleSmall,
      color,
      opacity
    }, tabLabelStyle]
  }, uppercase && !theme.isV3 ? tab.props.label.toUpperCase() : tab.props.label) : null)));
}
const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    left: 0,
    top: -2
  },
  tabRoot: {
    position: 'relative'
  },
  tabRootFixed: {
    flex: 1
  },
  touchableRipple: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  touchableRippleTop: {
    height: 72
  },
  touchableRippleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    minWidth: 90,
    maxWidth: 360
  },
  touchableRippleInnerTop: {
    flexDirection: 'column'
  },
  touchableRippleDisabled: {
    opacity: 0.4
  },
  iconContainer: {
    width: 24,
    height: 24
  },
  text: {
    textAlign: 'center',
    letterSpacing: 1,
    ...Platform.select({
      web: {
        transitionDuration: '150ms',
        transitionProperty: 'all'
      },
      default: {}
    })
  },
  textTop: {
    marginTop: 6
  },
  marginRight: {
    marginRight: 8
  }
});
//# sourceMappingURL=TabsHeaderItem.js.map