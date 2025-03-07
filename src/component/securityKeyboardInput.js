/**
 *
 * Keyboard input component base on hook.
 * Using Animated makes cursor flashing.
 * @Author supervons
 */
import React, { useEffect, useState } from "react"
import {
  Animated,
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
  View
} from "react-native"

import styles from "../style/securityKeyboardInput"

function SecurityKeyboardInput(props) {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [valueArr, setValueArr] = useState(props.value || [])

  useEffect(() => {
    const keyboardListener =  DeviceEventEmitter.addListener(
      props.keyName || "keyboardListener",
      data => {
        setValueArr(data)
      }
    )
    // Perform the animation
    animation()
    // Execute before each rendering effect is executed
    return function cleanup() {
      keyboardListener.remove()
    }
  }, [])

  /**
   * Listen for the cursor and reset the animation Hook.
   */
  useEffect(() => {
    if (!props.cursorLock) {
      animation()
    }
  }, [props.cursorLock])

  function animation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true
        })
      ]),
      {
        iterations: 400
      }
    ).start()
  }

  function renderValue() {
    return valueArr.map((item, index) => {
      return (
        <Text key={`${index}-${item}`}>
          {props.secureTextEntry ? "●" : item}
        </Text>
      )
    })
  }

  //显示键盘
  function show() {
    if (props.disabled) {
      return
    }
    props.show()
  }

  /**
   * According props.secureTextEntry to displays user input or displays as a dot ●
   */
  return (
    <View style={[styles.view, props.style]}>
      <TouchableOpacity style={styles.textInputWrap} onPress={show.bind(this)}>
        <Text
          numberOfLines={1}
          ellipsizeMode={"clip"}
          style={[
            styles.value,
            props.secureTextEntry ? props.secureTextStyle : props.valueStyle
          ]}
        >
          {renderValue()}
        </Text>
        {valueArr.length == 0 ? (
          <Text
            style={[
              styles.placeholder,
              props.valueStyle || {},
              { color: props.placeholderTextColor || "#C4C4C4" }
            ]}
          >
            {props.placeholder || "请输入内容"}
          </Text>
        ) : null}
        {!props.cursorLock && !props.caretHidden ? (
          <Animated.View style={[styles.cursorWrap, { opacity: fadeAnim }]}>
            <Text style={[styles.cursor, props.cursorStyle || {}]}>|</Text>
          </Animated.View>
        ) : null}
      </TouchableOpacity>
    </View>
  )
}

export default SecurityKeyboardInput
