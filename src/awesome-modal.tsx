/* NPM - Modules imported via NPM */
import _get from 'lodash/get'
import React, { RefObject } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import SafeArea, { SafeAreaInsets } from 'react-native-safe-area'

type EdgeInsets = {
  safeAreaInsets: SafeAreaInsets
}
interface IState {
  opacityAnimation: Animated.Value
  translateYAnimation: Animated.Value
  modalYPosition: number
  modalHeight: number
  deviceHeight: number
  overlayIsVisible: boolean
}

export interface IProps {
  enableScroll?: boolean
  hasTabBar?: boolean
  overflowShow?: boolean
  modalBottomMargin?: number
  onClose?: () => void
  onPressOutside?: () => void
  modalContainerStyle?: StyleProp<ViewStyle>
  modalInnerContainerStyle?: StyleProp<ViewStyle>
  modalOverlayStyle?: StyleProp<ViewStyle>
  modalRef?: (ReactElement: React.Component | undefined) => void
}

// To eliminate TypeScript's "Prop may be undefined error"
// for optional props with default values
interface DefaultProps {
  enableScroll: boolean
  hasTabBar: boolean
  overflowShow: boolean
  modalBottomMargin: number
}

type PropsWithDefaults = IProps & DefaultProps

export class AwesomeModal extends React.Component<IProps, IState> {
  scrollViewRef: RefObject<ScrollView>

  static defaultProps = {
    enableScroll: false,
    hasTabBar: false,
    overflowShow: false,
    modalBottomMargin: 45,
  }

  constructor(props: IProps) {
    super(props)

    const deviceHeight = Dimensions.get('window').height
    /** State */
    this.state = {
      modalHeight: 0,
      opacityAnimation: new Animated.Value(0),
      translateYAnimation: new Animated.Value(deviceHeight * -1.5),
      modalYPosition: 0,
      deviceHeight: deviceHeight,
      overlayIsVisible: true,
    }

    this.scrollViewRef = React.createRef<ScrollView>()

    this.onTouchOutside = this.onTouchOutside.bind(this)
    this.close = this.close.bind(this)
    this.onModalHeightChange = this.onModalHeightChange.bind(this)
    this.onSafeAreaInsetsForRootViewChange = this.onSafeAreaInsetsForRootViewChange.bind(
      this
    )
  }

  async componentDidMount() {
    // Assign the parent's ref to modalRef so that we can control
    // the modal from the parent component
    if (this.props.modalRef) {
      this.props.modalRef(this)
    }

    // Add listener for safe area insets
    SafeArea.addEventListener(
      'safeAreaInsetsForRootViewDidChange',
      this.onSafeAreaInsetsForRootViewChange
    )

    this.onSafeAreaInsetsForRootViewChange(
      await SafeArea.getSafeAreaInsetsForRootView()
    )
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.modalHeight !== this.state.modalHeight) {
      this.onModalHeightChange()
      SafeArea.getSafeAreaInsetsForRootView().then((insets) => {
        this.onSafeAreaInsetsForRootViewChange(insets)
      })
    }
  }

  componentWillUnmount() {
    // Remove ref from modalRef
    if (this.props.modalRef) {
      this.props.modalRef(undefined)
    }

    // Remove event listener
    SafeArea.removeEventListener(
      'safeAreaInsetsForRootViewDidChange',
      this.onSafeAreaInsetsForRootViewChange
    )
  }

  /**
   * Function to handle when the user touches
   * outside the modal
   */
  onTouchOutside() {
    const { onPressOutside } = this.props
    const { close } = this
    if (onPressOutside) {
      onPressOutside()
      close()
    } else {
      close()
    }
  }

  /**
   * Closes the screen with animation
   */
  close() {
    const { onClose } = this.props
    const { opacityAnimation, translateYAnimation } = this.state
    Animated.parallel([
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnimation, {
        toValue: this.state.deviceHeight * -1.5,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.setState(() => {
        return { overlayIsVisible: false }
      })

      if (onClose) {
        onClose()
      }
    })
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
    const {
      modalHeight,
      opacityAnimation,
      translateYAnimation,
      modalYPosition,
    } = this.state

    if (modalHeight !== 0) {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 0.35,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnimation, {
          toValue: modalYPosition,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }

  /**
   * Runs every time safe area insets changes to update the
   * modalYPosition and the current screen height.
   */
  onSafeAreaInsetsForRootViewChange(insets: EdgeInsets) {
    const { modalBottomMargin, hasTabBar } = this.props as PropsWithDefaults

    this.setState(() => {
      const insetBottom = insets?.safeAreaInsets?.bottom ?? 0
      /*
       * We add a bottom padding to determine the Y position of the modal,
       * this will be an extra 25px on Android because of the bottom bar.
       */
      const newBottomPadding =
        insetBottom + Platform.OS === 'android' ? (hasTabBar ? 67 : 25) : 0
      return {
        modalYPosition: newBottomPadding + modalBottomMargin,
        deviceHeight: Dimensions.get('window').height,
      }
    })
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
      })
    }
  }

  render() {
    /** Props */
    const {
      children,
      enableScroll,
      overflowShow,
      modalContainerStyle,
      modalOverlayStyle,
      modalInnerContainerStyle,
    } = this.props

    // We allow the use to enable scroll, so we need to dynamically change the container
    const ContainerView = enableScroll ? ScrollView : View

    const topContainerStyle: StyleProp<ViewStyle> = {
      height: this.state.deviceHeight,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }

    const defaultModalOverlayStyle = {
      position: '',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'black',
      zIndex: 999,
      opacity: this.state.opacityAnimation,
      display: this.state.overlayIsVisible ? 'flex' : 'none',
    }

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
    }

    const defaultModalInnerContainerStyle = {
      backgroundColor: 'white',
    }

    const viewProps: ViewProps = {
      style: {
        ...defaultModalInnerContainerStyle,
        ...(modalInnerContainerStyle as {}),
      },
    }

    const scrollViewProps = {
      contentContainerStyle: {
        ...(viewProps.style as {}),
      },
      showsVerticalScrollIndicator: true,
      ref: this.scrollViewRef,
    }

    const containerProps = enableScroll ? scrollViewProps : viewProps

    return (
      <View style={topContainerStyle}>
        <TouchableWithoutFeedback onPress={this.onTouchOutside}>
          <Animated.View
            style={[defaultModalOverlayStyle, modalOverlayStyle]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          onLayout={(event: LayoutChangeEvent) => {
            /*
             * We just default to 350 (this is usually the height of the modal),
             * incase something weird happens and the height is falsy.
             */
            const layoutHeight =
              _get(event, 'nativeEvent.layout.height', null) || 350

            this.setState(() => {
              return { modalHeight: layoutHeight }
            })
          }}
          style={[
            { bottom: this.state.translateYAnimation as any },
            defaultModalContainerStyle,
            modalContainerStyle,
          ]}
        >
          <ContainerView {...containerProps}>{children}</ContainerView>
        </Animated.View>
      </View>
    )
  }
}
