import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  Button,
  Icon,
  TouchableHighlight,
  DeviceEventEmitter,
  Image
} from 'react-native';
import styles from '../style/securityKeyboard';
import SecurityKeyboardInput from './securityKeyboardInput';
import PropTypes from 'prop-types';

class SecurityKeyboard extends Component {
  static propTypes = {
    keyboardHeader: PropTypes.element, //配置键盘头部
    value: PropTypes.any, //内容
    placeholder: PropTypes.string, //提示文字
    placeholderTextColor: PropTypes.string, //提示文字颜色
    disabled: PropTypes.bool, //是否可以输入
    caretHidden: PropTypes.bool, //是否隐藏光标
    secureTextEntry: PropTypes.bool, //是否开启密码模式
    style: PropTypes.any, //外壳样式
    valueStyle: PropTypes.any, //内容样式
    regs: PropTypes.func, //校验函数
    onChangeText: PropTypes.func, //内容更改后的回调
    onFocus: PropTypes.func, //得到焦点后的回调
    onBlur: PropTypes.func //失去焦点后的回调
  };
  constructor(props) {
    super(props);
    this.modalVisible = false;
    this.upCase = false;
    this.state = {
      // modalVisible: false, //弹窗锁
      caretHidden: false, //隐藏光标
      secureTextEntry: false, //密码模式
      keyboardType: this.props.keyboardType,
      valueArr: [], //文字,
      currentArr: [],
      numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], //键盘数组
      symbolArr: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '='], //键盘数组
      stringArr: [
        'q',
        'w',
        'e',
        'r',
        't',
        'y',
        'u',
        'i',
        'o',
        'p',
        'a',
        's',
        'd',
        'f',
        'g',
        'h',
        'j',
        'k',
        'l',
        'z',
        'x',
        'c',
        'v',
        'b',
        'n',
        'm'
      ], //键盘数组
      cursorLock: true //光标锁
    };
  }
  componentDidMount() {
    let that = this;
    //设置密码模式
    this.props.secureTextEntry &&
      this.setState({
        secureTextEntry: true
      });
    this.props.caretHidden &&
      this.setState({
        caretHidden: true
      });
    this.changeKey();
  }
  changeKey() {
    const currentNumArr = this.shuffle(this.state.numArr);
    currentNumArr.push(...['.', 'del', 'ABC', '!?#']);
    const currentStringArr = this.shuffle(this.state.stringArr);
    currentStringArr.push(...['change', '123', '!?#', 'del']);
    const currentSymbolArr = this.shuffle(this.state.symbolArr);
    currentSymbolArr.push(...['.', 'ABC', '123', 'del']);
    this.setState({
      stringArr: currentStringArr,
      symbolArr: currentSymbolArr,
      numArr: currentNumArr
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    //去除不必要的渲染
    if (
      this.modalVisible != nextState.modalVisible ||
      this.state.cursorLock != nextState.cursorLock ||
      this.props.disabled != nextProps.disabled
    ) {
      return true;
    }
    return false;
  }
  //显示键盘
  show() {
    this.modalVisible = true;
    this.setState({
      cursorLock: false
    });
    this.onFocus();
  }
  //隐藏键盘
  hide() {
    this.modalVisible = false;
    this.setState({
      cursorLock: true
    });
    this.onBlur();
  }
  //发送事件 附带input内容
  inputEvent(value) {
    DeviceEventEmitter.emit('securityKeyboardInput', value);
    this.onChangeText(value);
  }
  //回调onChangeText
  onChangeText(value) {
    if (value == undefined || value == null) {
      return false;
    }
    this.props.onChangeText && this.props.onChangeText(value.join(''));
  }
  //得到焦点
  onFocus() {
    this.props.onFocus && this.props.onFocus();
  }
  //失去焦点
  onBlur() {
    this.props.onBlur && this.props.onBlur();
  }
  //校验文字
  regs(valueArr) {
    if (!this.props.regs) {
      return valueArr;
    }
    valueArr = this.props.regs(valueArr.join(''));
    valueArr = valueArr.split('');
    return valueArr;
  }
  //增加文字
  add(value) {
    let valueArr = this.state.valueArr;
    valueArr.push(value);
    if (valueArr == '' || valueArr == undefined || valueArr == null) {
      return;
    }
    valueArr = this.regs(valueArr);
    this.setState({
      valueArr: valueArr
    });
    this.inputEvent(valueArr);
  }

  //删除文字
  remove() {
    let valueArr = this.state.valueArr;
    if (valueArr.length == 0) {
      return;
    }
    valueArr.pop();
    this.setState({
      valueArr: valueArr
    });
    this.inputEvent(valueArr);
  }
  //长按删除
  removeAll() {
    let valueArr = this.state.valueArr;
    if (valueArr.length == 0) {
      return;
    }
    valueArr = [];
    this.setState({
      valueArr: valueArr
    });
    this.inputEvent(valueArr);
  }

  // 乱序
  shuffle(a) {
    let len = a.length;
    for (let i = 0; i < len - 1; i++) {
      let index = parseInt(Math.random() * (len - i));
      let temp = a[index];
      a[index] = a[len - i - 1];
      a[len - i - 1] = temp;
    }
    return a;
  }

  //渲染文字
  renderNumText(flag, numArr) {
    let numAss = numArr;
    let addNum = 0;
    if (this.state.keyboardType === 'number') {
      addNum = 4;
    } else if (this.state.keyboardType === 'symbol') {
      addNum = 5;
    } else {
      addNum = 9;
    }
    return numAss.slice(flag, flag + addNum).map((item, index) => {
      let styleLine =
        item == 'DEL' || item == 'del' || item == '.' || item == 'Δ' || item == '123' || item == '!?#' || item == 'ABC'
          ? styles.toolLine
          : styles.line;
      let styleNumText =
        item == 'DEL' || item == 'del' || item == '.' || item == 'Δ' || item == '123' || item == '!?#' || item == 'ABC'
          ? styles.specialNumText
          : styles.numText;
      if (item == 'DEL' || item == 'del') {
        return (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#cccccc"
            style={styleLine}
            valueStyle={this.props.valueStyle}
            key={index}
            onPress={this.remove.bind(this)}
            onLongPress={this.removeAll.bind(this)}
          >
            <Image style={styles.removeIcon} source={require('../images/icon-delete.png')} />
          </TouchableHighlight>
        );
      } else if (item == '123') {
        return (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#cccccc"
            style={styleLine}
            valueStyle={this.props.valueStyle}
            key={index}
            onPress={() => {
              this.setState({ keyboardType: 'number' });
            }}
          >
            <Text style={styleNumText}>{item}</Text>
          </TouchableHighlight>
        );
      } else if (item == 'ABC') {
        return (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#cccccc"
            style={styleLine}
            valueStyle={this.props.valueStyle}
            key={index}
            onPress={() => {
              this.upCase = false;
              this.setState({ keyboardType: 'string' });
            }}
          >
            <Text style={styleNumText}>{item}</Text>
          </TouchableHighlight>
        );
      } else if (item == '!?#') {
        return (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#cccccc"
            style={styleLine}
            valueStyle={this.props.valueStyle}
            key={index}
            onPress={() => {
              this.setState({ keyboardType: 'symbol' });
            }}
          >
            <Text style={styleNumText}>{item}</Text>
          </TouchableHighlight>
        );
      } else if (item == 'change' || item == 'CHANGE') {
        return (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#cccccc"
            style={[styleLine]}
            valueStyle={this.props.valueStyle}
            key={index}
            onPress={() => {
              if (this.upCase) {
                this.upCase = false;
              } else {
                this.upCase = true;
              }
              this.setState({ keyboardType: 'upString' });
            }}
          >
            <Image
              style={styles.removeIcon}
              source={this.upCase ? require('../images/icon-low.png') : require('../images/icon-up.png')}
            />
          </TouchableHighlight>
        );
      }
      return (
        <TouchableHighlight
          style={styleLine}
          underlayColor="#cccccc"
          activeOpacity={0.7}
          key={index}
          onPress={this.add.bind(this, item)}
        >
          <Text style={styleNumText}>{item}</Text>
        </TouchableHighlight>
      );
    });
  }
  renderNum() {
    let numArr = [];
    let addNum = 0;
    if (this.state.keyboardType === 'number') {
      addNum = 4;
      numArr = this.state.numArr;
    } else if (this.state.keyboardType === 'string') {
      addNum = 9;
      numArr = this.state.stringArr;
    } else if (this.state.keyboardType === 'symbol') {
      addNum = 5;
      numArr = this.state.symbolArr;
    } else if (this.state.keyboardType === 'upString') {
      addNum = 9;
      numArr = this.state.stringArr.map(res => {
        return this.upCase ? res.toLocaleUpperCase() : res.toLocaleLowerCase();
      });
    }
    return numArr.map((item, index) => {
      if (index % addNum == 0) {
        return (
          <View style={styles.numWrap} key={index}>
            {this.renderNumText(index, numArr)}
          </View>
        );
      }
    });
  }
  render() {
    return (
      <View>
        <SecurityKeyboardInput
          disabled={this.props.disabled}
          caretHidden={this.state.caretHidden}
          secureTextEntry={this.state.secureTextEntry}
          value={this.props.value}
          cursorLock={this.state.cursorLock}
          style={this.props.style}
          valueStyle={this.props.valueStyle}
          show={this.show.bind(this)}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
        />
        <Modal
          animationType={'slide'}
          presentationStyle={'overFullScreen'}
          transparent={true}
          visible={this.modalVisible}
        >
          <View style={styles.root}>
            <Text
              style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0)' }}
              onPress={this.hide.bind(this)}
            />
            <View style={styles.keyboardWrap}>
              <View style={styles.headerWrap}>
                {this.props.keyboardHeader ? (
                  this.props.keyboardHeader
                ) : (
                  <Image style={styles.headerImage} source={require('../images/text.png')} />
                )}
                <TouchableOpacity onPress={this.hide.bind(this)} style={styles.closeIconWrap}>
                  <Image style={styles.closeIcon} source={require('../images/icon-down.png')} />
                </TouchableOpacity>
              </View>
              {this.renderNum()}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default SecurityKeyboard;
