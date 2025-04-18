import * as React from 'react';
import { Animated } from 'react-native';
import type { LayoutChangeEvent, TextStyle } from 'react-native';
import type { MD3LightTheme } from 'react-native-paper';
import type { ReactElement } from 'react';
import type { TabScreenProps } from './TabScreen';
import type { IconPosition, Mode } from './utils';
export default function TabsHeaderItem({ tab, tabIndex, active, goTo, onTabLayout, activeColor, textColor, theme, position, offset, childrenCount, uppercase, mode, iconPosition, showTextLabel, tabLabelStyle, }: {
    tab: ReactElement<TabScreenProps>;
    tabIndex: number;
    active: boolean;
    goTo: (index: number) => void;
    onTabLayout: (index: number, e: LayoutChangeEvent) => void;
    activeColor: string;
    textColor: string;
    theme: typeof MD3LightTheme;
    position: Animated.Value | undefined;
    offset: Animated.Value | undefined;
    childrenCount: number;
    uppercase?: boolean;
    iconPosition?: IconPosition;
    showTextLabel?: boolean;
    mode: Mode;
    tabLabelStyle?: TextStyle | undefined;
}): React.JSX.Element;
//# sourceMappingURL=TabsHeaderItem.d.ts.map