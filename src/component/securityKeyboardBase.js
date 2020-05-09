import React, {Component} from 'react';
import {
    DeviceEventEmitter,
    UIManager,
    findNodeHandle,
    Keyboard,
    Dimensions, PanResponder
} from 'react-native';
import styles from '../style/securityKeyboard';
import SecurityKeyboardInput from './securityKeyboardInput';
import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');


class SecurityKeyboard extends Component {
    static propTypes = {
        value: PropTypes.any, //内容
        placeholder: PropTypes.string, //提示文字
        placeholderTextColor: PropTypes.string, //提示文字颜色
        disabled: PropTypes.bool, //是否可以输入
        caretHidden: PropTypes.bool, //是否隐藏光标
        secureTextEntry: PropTypes.bool, //是否开启密码模式
        style: PropTypes.any, //外壳样式
        valueStyle: PropTypes.any, //内容样式
        cursorStyle: PropTypes.any, // 闪动光标样式
        secureTextStyle: PropTypes.any, // 密码框圆点光标样式
        regs: PropTypes.func, //校验函数
        onChangeText: PropTypes.func, //内容更改后的回调
        onFocus: PropTypes.func, //得到焦点后的回调
        onBlur: PropTypes.func //失去焦点后的回调
    };

    constructor(props) {
        super(props);
        this.state = {
            caretHidden: false, //隐藏光标
            keyboardType: this.props.keyboardType,
            valueArr: this.props.value || [], //文字,
            currentArr: [],
            //键盘数组
            cursorLock: true //光标锁
        };
        this.listenerArr = [];
    }

    shouldComponentUpdate(nextProps, nextState) {
        //去除不必要的渲染
        if (this.state.cursorLock != nextState.cursorLock ||
            this.props.disabled != nextProps.disabled ||
            this.props.secureTextEntry != nextProps.secureTextEntry
        ) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.props.caretHidden &&
        this.setState({
            caretHidden: true
        });
        this.listenerArr.push(Keyboard.addListener('keyboardDidShow', this._keyboardDidShow));
        this.listenerArr.push(Keyboard.addListener('keyboardDidHide', this._keyboardDidHide));
        this.listenerArr.push(DeviceEventEmitter.addListener('_keyboard_Event', this._keyboardEvent));
        //this.listenerArr.push(DeviceEventEmitter.addListener('_keyboardDidHide', this._onKeyboardChange));
       // this.listenerArr.push(DeviceEventEmitter.addListener('_keyboardDidShow', this._onKeyboardChange));
    }

    componentWillUnmount() {
        this.listenerArr.forEach((sub) => sub.remove());
    }

    componentWillMount(): void {
        this.watcher = PanResponder.create({  //建立监视器
            onStartShouldSetPanResponder:()=>true,  //判断是否要监听，这里直接返回true
            onPanResponderEnd:this._onPanResponderEnd.bind(this),   //结束

        });
    }

    _onPanResponderEnd(e,gestureState){
        this.startY = gestureState.y0;   //按住滑块的时候,记录偏移量
        if (this.props.disabled) {
            return;
        }
        this.show();
    }

    _keyboardDidShow = () => {
        this.systemKeyboard = true;
        this.hide();
    }

    _keyboardDidHide = () => {
        this.systemKeyboard = false;
    }

    _keyboardEvent = (obj) => {
        if (obj.event == -1) {
           this.removeAll();
        } else if (obj.event == 0) {
           this.remove()
        } else if (obj.event == 1) {//输入内容事件
            this.add(obj.value)
        }

    }

    componentWillUnmount() {
        this.listenerArr.forEach((obj) => obj.remove());
    }

    //显示键盘
    show(event) {
        if (this.systemKeyboard) {
            Keyboard.dismiss();
            return
        }
        ;
        this.setState({
            cursorLock: false
        });
        this.onFocus();
        DeviceEventEmitter.emit('_inputInform_show',{y:this.startY})
    }

    //隐藏键盘
    hide() {
        this.setState({
            cursorLock: true,
            keyboardType: this.props.keyboardType
        });
        this.onBlur();
        DeviceEventEmitter.emit('_inputInform_hide')
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

    render() {
        return (
            <SecurityKeyboardInput
                disabled={this.props.disabled}
                caretHidden={this.state.caretHidden}
                secureTextEntry={this.props.secureTextEntry}
                value={this.props.value}
                cursorLock={this.state.cursorLock}
                style={this.props.style}
                valueStyle={this.props.valueStyle}
                cursorStyle={this.props.cursorStyle}
                secureTextStyle={this.props.secureTextStyle}
                placeholder={this.props.placeholder}
                placeholderTextColor={this.props.placeholderTextColor}
                {...this.watcher.panHandlers}
            />
        );
    }
}

export default SecurityKeyboard;
