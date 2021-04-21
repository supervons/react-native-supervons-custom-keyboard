import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  DeviceEventEmitter
} from "react-native"

import styles from "../style/securityKeyboardInput"

function SecurityKeyboardInput(props) {
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0))
  const [valueArr, setValueArr] = useState(props.value || [])

  useEffect(() => {
    //监听数据
    inputEvent()
    //执行动画
    animation()
    // 在每次渲染产生的 effect 执行之前执行
    return function cleanup() {
      DeviceEventEmitter.removeListener(props.keyName || "keyboardListener")
    }
  }, [])

  useEffect(() => {
    if (!props.cursorLock) {
      animation()
    }
  }, [props.cursorLock])

  //接受数据
  function inputEvent() {
    DeviceEventEmitter.addListener(
      props.keyName || "keyboardListener",
      data => {
        setValueArr(data)
      }
    )
  }

  function animation() {
    let that = this
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          seNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          seNativeDriver: true
        })
      ]),
      {
        iterations: 400
      }
    ).start()
  }

  function renderValue() {
    if (props.secureTextEntry) {
      return valueArr.map((item, index) => {
        return (
          <Text style={[styles.value, props.secureTextStyle]} key={index}>
            ●
          </Text>
        )
      })
    } else {
      return valueArr.map((item, index) => {
        return (
          <Text style={[styles.value, props.valueStyle]} key={index}>
            {item}
          </Text>
        )
      })
    }
  }
  //显示键盘
  function show() {
    if (props.disabled) {
      return
    }
    props.show()
  }

  return (
    <View style={[styles.view, props.style]}>
      <TouchableOpacity style={styles.textInputWrap} onPress={show.bind(this)}>
        {renderValue()}
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
