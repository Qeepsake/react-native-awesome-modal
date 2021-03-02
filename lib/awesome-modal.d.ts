import * as React from 'react';
import { RefObject } from 'react';
import { Animated, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaInsets } from 'react-native-safe-area';
declare type EdgeInsets = {
    safeAreaInsets: SafeAreaInsets;
};
interface IState {
    opacityAnimation: Animated.Value;
    translateYAnimation: Animated.Value;
    modalYPosition: number;
    modalHeight: number;
    deviceHeight: number;
    overlayIsVisible: boolean;
}
export interface IProps {
    enableScroll?: boolean;
    hasTabBar?: boolean;
    overflowShow?: boolean;
    closeOnPressOutside?: boolean;
    modalBottomMargin?: number;
    onClose?: () => void;
    onPressOutside?: () => void;
    modalContainerStyle?: StyleProp<ViewStyle>;
    modalInnerContainerStyle?: StyleProp<ViewStyle>;
    modalOverlayStyle?: StyleProp<ViewStyle>;
    modalRef?: (ReactElement: React.Component | undefined) => void;
}
export declare class AwesomeModal extends React.Component<IProps, IState> {
    scrollViewRef: RefObject<ScrollView>;
    static defaultProps: {
        enableScroll: boolean;
        hasTabBar: boolean;
        overflowShow: boolean;
        closeOnPressOutside: boolean;
        modalBottomMargin: number;
    };
    constructor(props: IProps);
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: IProps, prevState: IState): void;
    componentWillUnmount(): void;
    /**
     * Function to handle when the user touches
     * outside the modal
     */
    onTouchOutside(): void;
    /**
     * Closes the screen with animation
     */
    close(): void;
    /**
     * The modal height is set when the onLayout
     * is fired from the mounting of this screen,
     * we want to animate components into the screen
     * so we wait until the effect is executed (when
     * the modal height changes) and when it is not 0
     * (meaning is has been set successfully), we run
     * the application.
     */
    onModalHeightChange(): void;
    /**
     * Runs every time safe area insets changes to update the
     * modalYPosition and the current screen height.
     */
    onSafeAreaInsetsForRootViewChange(insets: EdgeInsets): void;
    /**
     * Scrolls to the top of the ScrollView component.
     */
    scrollToTop(): void;
    render(): JSX.Element;
}
export {};
