"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwesomeModal = void 0;
/* NPM - Modules imported via NPM */
const get_1 = __importDefault(require("lodash/get"));
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_1 = __importDefault(require("react-native-safe-area"));
class AwesomeModal extends React.Component {
    constructor(props) {
        super(props);
        const deviceHeight = react_native_1.Dimensions.get('window').height;
        /** State */
        this.state = {
            modalHeight: 0,
            opacityAnimation: new react_native_1.Animated.Value(0),
            translateYAnimation: new react_native_1.Animated.Value(deviceHeight * -1.5),
            modalYPosition: 0,
            deviceHeight: deviceHeight,
            overlayIsVisible: true,
        };
        this.scrollViewRef = React.createRef();
        this.onTouchOutside = this.onTouchOutside.bind(this);
        this.close = this.close.bind(this);
        this.onModalHeightChange = this.onModalHeightChange.bind(this);
        this.onSafeAreaInsetsForRootViewChange = this.onSafeAreaInsetsForRootViewChange.bind(this);
    }
    async componentDidMount() {
        // Assign the parent's ref to modalRef so that we can control
        // the modal from the parent component
        if (this.props.modalRef) {
            this.props.modalRef(this);
        }
        // Add listener for safe area insets
        react_native_safe_area_1.default.addEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange);
        this.onSafeAreaInsetsForRootViewChange(await react_native_safe_area_1.default.getSafeAreaInsetsForRootView());
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.modalHeight !== this.state.modalHeight ||
            prevProps !== this.props) {
            react_native_safe_area_1.default.getSafeAreaInsetsForRootView().then((insets) => {
                this.onSafeAreaInsetsForRootViewChange(insets);
            });
            this.onModalHeightChange();
        }
        // if (prevProps !== this.props) {
        //   SafeArea.getSafeAreaInsetsForRootView().then((insets) => {
        //     this.onSafeAreaInsetsForRootViewChange(insets)
        //   })
        //   this.onModalHeightChange()
        // }
    }
    componentWillUnmount() {
        // Remove ref from modalRef
        if (this.props.modalRef) {
            this.props.modalRef(undefined);
        }
        // Remove event listener
        react_native_safe_area_1.default.removeEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange);
    }
    /**
     * Function to handle when the user touches
     * outside the modal
     */
    onTouchOutside() {
        const { onPressOutside } = this.props;
        const { close } = this;
        if (onPressOutside) {
            onPressOutside();
            close();
        }
        else {
            close();
        }
    }
    /**
     * Closes the screen with animation
     */
    close() {
        const { onClose } = this.props;
        const { opacityAnimation, translateYAnimation } = this.state;
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(translateYAnimation, {
                toValue: this.state.deviceHeight * -1.5,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start(() => {
            this.setState(() => {
                return { overlayIsVisible: false };
            });
            if (onClose) {
                onClose();
            }
        });
    }
    /**
     * The modal height is set when the onLayout
     * is fired from the mounting of this screen,
     * we want to animate components into the screen
     * so we wait until the effect is executed (when
     * the modal height changes) and when it is not 0
     * (meaning is has been set successfully), we run
     * the application.
     */
    onModalHeightChange() {
        const { modalHeight, opacityAnimation, translateYAnimation, modalYPosition, } = this.state;
        if (modalHeight !== 0) {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(opacityAnimation, {
                    toValue: 0.35,
                    duration: 500,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.spring(translateYAnimation, {
                    toValue: modalYPosition,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }
    /**
     * Runs every time safe area insets changes to update the
     * modalYPosition and the current screen height.
     */
    onSafeAreaInsetsForRootViewChange(insets) {
        const { modalBottomMargin, hasTabBar } = this.props;
        this.setState(() => {
            const insetBottom = insets?.safeAreaInsets?.bottom ?? 0;
            /*
             * We add a bottom padding to determine the Y position of the modal,
             * this will be an extra 25px on Android because of the bottom bar.
             */
            const newBottomPadding = insetBottom + react_native_1.Platform.OS === 'android' ? (hasTabBar ? 67 : 25) : 0;
            return {
                modalYPosition: newBottomPadding + modalBottomMargin,
                deviceHeight: react_native_1.Dimensions.get('window').height,
            };
        });
    }
    /**
     * Scrolls to the top of the ScrollView component.
     */
    scrollToTop() {
        if (this?.scrollViewRef?.current?.scrollTo) {
            this.scrollViewRef.current.scrollTo({
                x: 0,
                y: 0,
                animated: false,
            });
        }
    }
    render() {
        /** Props */
        const { children, enableScroll, overflowShow, modalContainerStyle, modalOverlayStyle, modalInnerContainerStyle, } = this.props;
        // We allow the use to enable scroll, so we need to dynamically change the container
        const ContainerView = enableScroll ? react_native_1.ScrollView : react_native_1.View;
        const topContainerStyle = {
            height: this.state.deviceHeight,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        const defaultModalOverlayStyle = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'black',
            zIndex: 999,
            opacity: this.state.opacityAnimation,
            display: this.state.overlayIsVisible ? 'flex' : 'none',
        };
        const defaultModalContainerStyle = {
            backgroundColor: 'white',
            paddingVertical: 50,
            paddingHorizontal: 30,
            alignSelf: 'center',
            height: 'auto',
            width: '90%',
            zIndex: 1000,
            position: 'absolute',
            borderRadius: 20,
            overflow: overflowShow ? 'visible' : 'hidden',
            maxHeight: this.state.deviceHeight,
        };
        const defaultModalInnerContainerStyle = {
            backgroundColor: 'white',
        };
        const viewProps = {
            style: {
                ...defaultModalInnerContainerStyle,
                ...modalInnerContainerStyle,
            },
        };
        const scrollViewProps = {
            contentContainerStyle: {
                ...viewProps.style,
            },
            showsVerticalScrollIndicator: true,
            ref: this.scrollViewRef,
        };
        const containerProps = enableScroll ? scrollViewProps : viewProps;
        return (<react_native_1.View style={topContainerStyle}>
        <react_native_1.TouchableWithoutFeedback onPress={this.onTouchOutside}>
          <react_native_1.Animated.View style={[defaultModalOverlayStyle, modalOverlayStyle]}/>
        </react_native_1.TouchableWithoutFeedback>

        <react_native_1.Animated.View onLayout={(event) => {
            /*
             * We just default to 350 (this is usually the height of the modal),
             * incase something weird happens and the height is falsy.
             */
            const layoutHeight = get_1.default(event, 'nativeEvent.layout.height', null) || 350;
            this.setState(() => {
                return { modalHeight: layoutHeight };
            });
        }} style={[
            { bottom: this.state.translateYAnimation },
            defaultModalContainerStyle,
            modalContainerStyle,
        ]}>
          <ContainerView {...containerProps}>{children}</ContainerView>
        </react_native_1.Animated.View>
      </react_native_1.View>);
    }
}
exports.AwesomeModal = AwesomeModal;
AwesomeModal.defaultProps = {
    enableScroll: false,
    hasTabBar: false,
    overflowShow: false,
    modalBottomMargin: 45,
};
//# sourceMappingURL=awesome-modal.js.map