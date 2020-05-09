import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, DeviceEventEmitter } from 'react-native';

import styles from '../style/securityKeyboardInput';

class SecurityKeyboardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), //动画
      valueArr: this.props.value || [] //文字
    };
  }
  componentDidMount() {
    //监听数据
    this.inputEvent();
    //执行动画
    this.animation();
  }
  //重置动画
  componentWillReceiveProps(nextProps) {
    if (nextProps.cursorLock == false) {
      this.animation();
    }
  }

  //接受数据
  inputEvent() {
    let that = this;
    that.subscription = DeviceEventEmitter.addListener('securityKeyboardInput', data => {
      that.setState({
        valueArr: data
      });
    });
  }
  animation() {
    let that = this;
    this.animated = Animated.loop(
        Animated.sequence([
          Animated.timing(that.state.fadeAnim, {
            toValue: 1,
            duration: 600,
            seNativeDriver: true
          }),
          Animated.timing(that.state.fadeAnim, {
            toValue: 0,
            duration: 600,
            seNativeDriver: true
          })
        ]),
        {
          iterations: 400
        }
    ).start();
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  renderValue() {
    if (this.props.secureTextEntry) {
      return this.state.valueArr.map((item, index) => {
        return (
            <Text style={[styles.value, this.props.secureTextStyle]} key={index}>
              ●
            </Text>
        );
      });
    } else {
      return this.state.valueArr.map((item, index) => {
        return (
            <Text style={[styles.value, this.props.valueStyle]} key={index}>
              {item}
            </Text>
        );
      });
    }
  }

  render() {
    return (
        <View style={[styles.view,this.props.style]} {...this.props}>
          <View style={styles.textInputWrap} >
            {this.renderValue()}
            {this.state.valueArr.length == 0 ? (
                <Text
                    style={[
                      styles.placeholder,
                      this.props.valueStyle || {},
                      { color: this.props.placeholderTextColor || '#C4C4C4' }
                    ]}
                >
                  {this.props.placeholder || '请输入内容'}
                </Text>
            ) : null}
            {!this.props.cursorLock && !this.props.caretHidden ? (
                <Animated.View style={[styles.cursorWrap, { opacity: this.state.fadeAnim }]}>
                  <Text style={[styles.cursor, this.props.cursorStyle || {}]}>|</Text>
                </Animated.View>
            ) : null}
          </View>
        </View>
    );
  }
}

export default SecurityKeyboardInput;
