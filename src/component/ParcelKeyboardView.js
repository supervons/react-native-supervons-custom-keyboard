const createReactClass = require("create-react-class")
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  View,
  DeviceEventEmitter
} from "react-native"
import React from "react"
import ViewPropTypes from "deprecated-react-native-prop-types"
const PropTypes = require("prop-types")
/* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses an error
 * found when Flow v0.54 was deployed. To see the error delete this comment and
 * run Flow. */
const TimerMixin = require("react-timer-mixin")

import type EmitterSubscription from "EmitterSubscription"
import type { ViewLayout, ViewLayoutEvent } from "ViewPropTypes"

type ScreenRect = {
  screenX: number,
  screenY: number,
  width: number,
  height: number
}
type KeyboardChangeEvent = {
  startCoordinates?: ScreenRect,
  endCoordinates: ScreenRect,
  duration?: number,
  easing?: string
}

const viewRef = "VIEW"

/**
 * This is a component to solve the common problem of views that need to move out of the way of the virtual keyboard.
 * It can automatically adjust either its height, position or bottom padding based on the position of the keyboard.
 */
const ParcelKeyboardView = createReactClass({
  displayName: "KeyboardAvoidingView",
  mixins: [TimerMixin],

  propTypes: {
    ...ViewPropTypes,
    /**
     * Specify how the `KeyboardAvoidingView` will react to the presence of
     * the keyboard. It can adjust the height, position or bottom padding of the view
     */
    behavior: PropTypes.oneOf(["height", "position", "padding"]),

    /**
     * The style of the content container(View) when behavior is 'position'.
     */
    contentContainerStyle: ViewPropTypes.style,

    /**
     * This is the distance between the top of the user screen and the react native view,
     * may be non-zero in some use cases. The default value is 0.
     */
    keyboardVerticalOffset: PropTypes.number.isRequired,
    /**
     * This is to allow us to manually control which KAV shuld take effect when
     * having more than one KAV at the same screen
     */
    enabled: PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      enabled: true,
      keyboardVerticalOffset: 0
    }
  },

  getInitialState() {
    return {
      bottom: 0
    }
  },

  subscriptions: ([]: Array<EmitterSubscription>),
  frame: (null: ?ViewLayout),

  _relativeKeyboardHeight(keyboardFrame: ScreenRect): number {
    const frame = this.frame
    if (!frame || !keyboardFrame) {
      return 0
    }

    const keyboardY = keyboardFrame.screenY - this.props.keyboardVerticalOffset

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard
    return Math.max(frame.y + frame.height - keyboardY, 0)
  },

  _onKeyboardChange(event: ?KeyboardChangeEvent) {
    if (!event) {
      this.setState({ bottom: 0 })
      return
    }

    const { duration, easing, endCoordinates, isLoadKeyBoard } = event
    const height = this._relativeKeyboardHeight(endCoordinates)
    this.isLoadKeyBoard = isLoadKeyBoard

    if (this.state.bottom === height) {
      return
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration: duration,
        update: {
          duration: duration,
          type: LayoutAnimation.Types[easing] || "keyboard"
        }
      })
    }
    this.setState({ bottom: height })
  },

  _onLayout(event: ViewLayoutEvent) {
    this.frame = event.nativeEvent.layout
  },

  UNSAFE_componentWillUpdate(
    nextProps: Object,
    nextState: Object,
    nextContext?: Object
  ): void {
    if (
      nextState.bottom === this.state.bottom &&
      this.props.behavior === "height" &&
      nextProps.behavior === "height"
    ) {
      // If the component rerenders without an internal state change, e.g.
      // triggered by parent component re-rendering, no need for bottom to change.
      nextState.bottom = 0
    }
  },

  UNSAFE_componentWillMount() {
    if (Platform.OS === "ios") {
      this.subscriptions = [
        Keyboard.addListener("keyboardWillChangeFrame", this._onKeyboardChange)
      ]
    } else {
      this.subscriptions = [
        Keyboard.addListener("keyboardDidHide", this._onKeyboardChange),
        Keyboard.addListener("keyboardDidShow", this._onKeyboardChange)
      ]
    }
    this.subscriptions.push(
      DeviceEventEmitter.addListener("_keyboardDidHide", this._onKeyboardChange)
    )
    this.subscriptions.push(
      DeviceEventEmitter.addListener("_keyboardDidShow", this._onKeyboardChange)
    )
  },

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove())
  },

  render(): React.Element<any> {
    // $FlowFixMe(>=0.41.0)
    const { behavior, children, style, ...props } = this.props
    const bottomHeight = this.props.enabled ? this.state.bottom : 0
    switch (behavior) {
      case "height":
        let heightStyle
        if (this.frame) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = { height: this.frame.height - bottomHeight, flex: 0 }
        }
        return (
          <View
            ref={viewRef}
            style={[style, heightStyle]}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        )

      case "position":
        const positionStyle = { bottom: bottomHeight }
        const { contentContainerStyle } = this.props

        return (
          <View
            ref={viewRef}
            style={style}
            onLayout={this._onLayout}
            {...props}
          >
            <View style={[contentContainerStyle, positionStyle]}>
              {children}
            </View>
          </View>
        )

      case "padding":
        const paddingStyle = { paddingBottom: bottomHeight }
        return (
          <View
            ref={viewRef}
            style={[style, paddingStyle]}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        )

      default:
        return (
          <View
            ref={viewRef}
            onLayout={this._onLayout}
            style={style}
            {...props}
          >
            {children}
          </View>
        )
    }
  }
})

module.exports = ParcelKeyboardView
