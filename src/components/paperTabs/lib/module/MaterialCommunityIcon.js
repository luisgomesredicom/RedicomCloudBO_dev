function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
let MaterialCommunityIcons;
try {
  MaterialCommunityIcons = Animated.createAnimatedComponent(require('react-native-vector-icons/MaterialCommunityIcons').default);
} catch (_e) {
  const e = _e;
  console.log({
    e
  });
  let isErrorLogged = false;

  // Fallback component for icons
  // @ts-ignore
  MaterialCommunityIcons = _ref => {
    let {
      name,
      ...rest
    } = _ref;
    if (!isErrorLogged) {
      if (!/(Cannot find module|Module not found|Cannot resolve module)/.test(e.message)) {
        console.error(e);
      }
      console.warn(`Tried to use the icon '${name}' in a component from 'react-native-paper-tabs', but 'react-native-vector-icons/MaterialCommunityIcons' could not be loaded.`, `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`);
      isErrorLogged = true;
    }
    return /*#__PURE__*/React.createElement(Animated.Text, _extends({}, rest, {
      selectable: false
    }), "\u25A1");
  };
}
const defaultIcon = _ref2 => {
  let {
    name,
    color,
    size,
    style,
    ...rest
  } = _ref2;
  return /*#__PURE__*/React.createElement(MaterialCommunityIcons, _extends({
    selectable: false,
    name: name,
    color: color,
    size: size,
    style: [{
      lineHeight: size
    }, styles.icon, style]
  }, rest));
};
const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent'
  }
});
export default defaultIcon;
//# sourceMappingURL=MaterialCommunityIcon.js.map