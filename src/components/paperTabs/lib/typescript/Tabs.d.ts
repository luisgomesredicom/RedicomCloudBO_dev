import * as React from 'react';
import type { ViewStyle, TextStyle } from 'react-native';
import type { MD3LightTheme } from 'react-native-paper';
import type { IconPosition, Mode } from './utils';
declare function Tabs({ theme, dark, style, mode, uppercase, iconPosition, showTextLabel, showLeadingSpace, disableSwipe, tabHeaderStyle, tabLabelStyle, ...rest }: {
    children: any;
    theme: typeof MD3LightTheme;
    dark?: boolean;
    style?: ViewStyle;
    iconPosition?: IconPosition;
    showTextLabel?: boolean;
    showLeadingSpace?: boolean;
    uppercase?: boolean;
    mode?: Mode;
    disableSwipe?: boolean;
    tabHeaderStyle?: ViewStyle | undefined;
    tabLabelStyle?: TextStyle | undefined;
}): React.JSX.Element;
declare const _default: React.ComponentType<Pick<{
    children: any;
    theme: import("react-native-paper").MD3Theme;
    dark?: boolean | undefined;
    style?: ViewStyle | undefined;
    iconPosition?: IconPosition | undefined;
    showTextLabel?: boolean | undefined;
    showLeadingSpace?: boolean | undefined;
    uppercase?: boolean | undefined;
    mode?: Mode | undefined;
    disableSwipe?: boolean | undefined;
    tabHeaderStyle?: ViewStyle | undefined;
    tabLabelStyle?: TextStyle | undefined;
}, "style" | "children" | "uppercase" | "mode" | "iconPosition" | "showTextLabel" | "tabLabelStyle" | "dark" | "showLeadingSpace" | "tabHeaderStyle" | "disableSwipe"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<unknown> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<React.ComponentType<{
    children: any;
    theme: import("react-native-paper").MD3Theme;
    dark?: boolean | undefined;
    style?: ViewStyle | undefined;
    iconPosition?: IconPosition | undefined;
    showTextLabel?: boolean | undefined;
    showLeadingSpace?: boolean | undefined;
    uppercase?: boolean | undefined;
    mode?: Mode | undefined;
    disableSwipe?: boolean | undefined;
    tabHeaderStyle?: ViewStyle | undefined;
    tabLabelStyle?: TextStyle | undefined;
}> & typeof Tabs, {}>;
export default _default;
//# sourceMappingURL=Tabs.d.ts.map