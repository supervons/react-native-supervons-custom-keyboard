import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    DeviceEventEmitter, Dimensions, findNodeHandle,
    Image,
    Keyboard,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    UIManager,
    View
} from "react-native";
import styles from "../style/securityKeyboard";

const {width, height} = Dimensions.get('window');

export default class KeyboardBottomView extends Component {
    static propTypes = {
        keyboardHeader: PropTypes.element, //配置键盘头部
    }

    constructor() {
        super()
        this.upCase = 'string'; // 当前键盘的样式
        this.state = {
            keyboardType: 'string', //键盘显示内容样式
            hide: true,  //隐藏键盘
        };
        this.numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; //键盘数组
        this.symbolArr = [
            '&',
            '"',
            ';',
            '^',
            ',',
            '|',
            '$',
            '*',
            ':',
            '(',
            ')',
            '{',
            '}',
            '[',
            ']',
            '-',
            '+',
            '=',
            '_',
            '\\',
            '/',
            '!',
            '?',
            '~',
            '#',
            '%',
            '.'
        ]; //键盘数组
        this.stringArr = [
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
        ];

    }


    shouldComponentUpdate(nextProps, nextState) {
        //去除不必要的渲染
        if (this._isKeyboardShow != nextState.hide
        ) {
            return true;
        }
        return false;
    }


    componentDidMount() {
        this._hide = DeviceEventEmitter.addListener('_inputInform_hide', this._keyboardHide)
        this._show = DeviceEventEmitter.addListener('_inputInform_show', this._keyboardShow)
    }

    componentWillUnmount() {
        this._hide.remove();
        this._show.remove();
    }


    componentWillMount(): void {
        this.changeKey();
    }


    //整理数据
    changeKey() {
        this.numArr = this.props.random ? this.shuffle(this.numArr) : this.numArr;
        this.setChangeDateNum();
        this.stringArr = this.props.random ? this.shuffle(this.stringArr) : this.stringArr;
        // 小写数组转大写69
        const rule = /[a-z]/i;
        const stringArrCaps = this.stringArr.map(item => {
            if (rule.test(item)) {
                return item.toLocaleUpperCase();
            }
        });
        this.setChangeDateString(this.stringArr, false);
        // 符号数据
        this.symbolArr = this.props.random ? this.shuffle(this.symbolArr) : this.symbolArr;
        this.setChangeDateSymbol();
        this.stringArrUp = stringArrCaps;
        this.setChangeDateString(this.stringArrUp, true);
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

    //图片按钮
    addItemImageView(index, itemParent, sty, path, fun, funlong) {
        return (
            <TouchableHighlight style={[itemParent, {overflow:'hidden'}]} underlayColor="#cccccc" key={index} onPress={fun}
                                onLongPress={funlong}>
                <Image style={sty} source={path} resizeMode='contain'/>
            </TouchableHighlight>
        );
    }

    //文字的按钮
    addItemTextView(index, parentSty, sty, content, fun) {
        return (
            <TouchableHighlight style={parentSty} underlayColor="#cccccc" key={index} onPress={fun}>
                <Text style={sty}>{content}</Text>
            </TouchableHighlight>
        );
    }

    //改变数字的数据
    setChangeDateNum() {
        let arr = this.props.imageArr;

        this.numArr.splice(this.numArr.length - 1, 0, arr ? arr.back_image : require('../images/back.png'));
        this.numArr.push(arr ? arr.delete_image : require('../images/icon-delete.png'));
    }

    //改变字母的数据
    setChangeDateString(stringArr, isUp) {
        let arr = this.props.imageArr;
        if (isUp) {
            stringArr.splice(19, 0, arr ? arr.transform2_image : require('../images/transform2.png'));
        } else {
            stringArr.splice(19, 0, arr ? arr.transform_image : require('../images/transform.png'));
        }
        stringArr.push(arr ? arr.delete_image : require('../images/icon-delete.png'));
        stringArr.push('123');
        stringArr.push(arr ? arr.space_image : require('../images/space.png'));
        stringArr.push('符');
    }

    //改变符号的数据
    setChangeDateSymbol() {
        let arr = this.props.imageArr;
        this.symbolArr.push(arr ? arr.back_image : require('../images/back.png'));
        this.symbolArr.push(arr ? arr.space_image : require('../images/space.png'));
        this.symbolArr.push(arr ? arr.delete_image : require('../images/icon-delete.png'));
    }

    renderNum() {
        // Determine the keyboard type
        if (this.state.keyboardType === 'number') {
            return this.addOrientationView(this.numArr, 3, this._addNumView);
        } else if (this.state.keyboardType === 'string') {
            return this.addOrientationView(this.stringArr, 9, this._addStringView);
        } else if (this.state.keyboardType === 'symbol') {
            return this.addOrientationView(this.symbolArr, 9, this._addStringSymbol);
        } else if (this.state.keyboardType === 'upString') {
            return this.addOrientationView(this.stringArrUp, 9, this._addStringView);
        }
    }

    //添加横向视图
    addOrientationView(numArr, addNum, verticalView) {
        return numArr.map((item, index) => {
            if (index % addNum == 0) {
                return (
                    <View style={styles.orientation} key={index}>
                        {verticalView(index, addNum, numArr)}
                    </View>
                );
            }
        });
    }

    //渲染数字键盘
    _addNumView = (flag, addNum, numArr) => {
        return numArr.slice(flag, flag + addNum).map((item, index) => {
            let icon = styles.deleteIcon;
            if (flag + index == 9) {
                icon = styles.backIcon;
            }
            if (flag + index == 9 || flag + index == 11) {
                return this.addItemImageView(
                    index,
                    [styles.itemNumParentText, styles.itemNumParentImage],
                    icon,
                    item,
                    () => {
                        if (index == 0) {
                            this.setState({keyboardType: this.upCase});
                        }
                        if (index == 2) {
                            this.commitKeyboardEvent({event: 0, value: null});
                        }
                    },
                    () => {
                        if (index == 2) {
                            this.commitKeyboardEvent({event: -1, value: null});
                        }
                    }
                );
            }
            return this.addItemTextView(index, styles.itemNumParentText, styles.numText, item, this.commitKeyboardEvent.bind(this, {
                event: 1,
                value: item
            }));
        });
    };

    //渲染字母键盘
    _addStringView = (flag, addNum, numArr) => {
        // 改变列的数量
        if (flag == 0) {
            addNum++;
        }
        if (flag == 9 || flag == 18 || flag == 27) {
            flag++;
        }

        return numArr.slice(flag, flag + addNum).map((item, index) => {
            let icon = styles.deleteIcon;
            if (flag + index == 19) {
                icon = styles.transformIcon;
            }
            if (flag + index == 19 || flag + index == 27) {
                // 设置转换按钮和 删除按钮的样式
                return this.addItemImageView(
                    index,
                    styles.itemStringParentImage,
                    icon,
                    item,
                    () => {
                        if (index == 0) {
                            this.upCase = this.state.keyboardType == 'string' ? 'upString' : 'string';
                            this.setState({keyboardType: this.upCase});
                        }
                        if (index == 8) {
                            this.commitKeyboardEvent({event: 0, value: null});
                        }
                    },
                    () => {
                        if (index == 8) {
                            this.commitKeyboardEvent({event: -1, value: null});
                        }
                    }
                );
            }
            if (flag + index == 29) {
                // 设置空格
                return this.addItemImageView(
                    index,
                    styles.itemStringParentSpace,
                    styles.spaceIcon,
                    item,
                    this.commitKeyboardEvent.bind(this, {event: 1, value: ' '})
                );
            }
            let parent = styles.itemStringParentText;
            let text = styles.numText;
            if (flag + index == 10) {
                parent = styles.itemStringParentText2;
            } // 设置第二行开始左边间距
            if (flag + index == 18) {
                parent = styles.itemStringParentText3;
            } // 设置第二行结束右边间距
            if (flag + index == 28 || flag + index == 30) {
                parent = styles.itemStringParentText4; //设置数字按钮，符号按钮的样式
                text = styles.symbolText;
            }

            return this.addItemTextView(index, parent, text, item, () => {
                if (index + flag == 28) {
                    this.setState({keyboardType: 'number'});
                } else if (index + flag == 30) {
                    this.setState({keyboardType: 'symbol'});
                } else {
                    this.commitKeyboardEvent({event: 1, value: item});
                }
            });
        });
    };

    //渲染符号键盘
    _addStringSymbol = (flag, addNum, numArr) => {
        return numArr.slice(flag, flag + addNum).map((item, index) => {
            let parent = styles.itemStringParentText4;
            let icon = styles.deleteIcon;
            if (flag + index == 28) {
                //设置返回键、空格、删除键的样式
                parent = styles.itemStringParentSpace;
                icon = styles.spaceIcon;
            }
            if (flag + index == 27) {
                icon = styles.backIcon;
            }

            if (flag == 27) {
                return this.addItemImageView(
                    index,
                    parent,
                    icon,
                    item,
                    () => {
                        if (index == 0) {
                            this.setState({keyboardType: this.upCase});
                        }
                        if (index == 1) {
                            this.commitKeyboardEvent({event: 1, value: ' '});
                        }
                        if (index == 2) {
                            this.commitKeyboardEvent({event: 0, value: null});
                        }
                    },
                    () => {
                        if (index == 2) {
                            this.commitKeyboardEvent({event: -1, value: null});
                        }
                    }
                );
            }
            return this.addItemTextView(index, styles.itemStringParentText, styles.numText, item, this.commitKeyboardEvent.bind(this, {
                event: 1,
                value: item
            }));
        });
    };

    //键盘隐藏
    _keyboardHide = () => {
        this._isKeyboardShow = false;
        DeviceEventEmitter.emit('_keyboardDidHide', null);
        this.setState({hide: true})
    }
    //键盘显示
    _keyboardShow = () => {
        this._isKeyboardShow = true;
        this.setState({hide: false})
        let timer = setTimeout(() => {
            UIManager.measure(findNodeHandle(this.refs.keyboardWrap), (x, y, widths, heights) => {
                DeviceEventEmitter.emit('_keyboardDidShow', {
                    "endCoordinates": {
                        "screenX": 0,
                        "height": heights,
                        "width": widths,
                        "screenY": height - heights
                    }, 'isLoadKeyBoard': true
                });
            })
            clearTimeout(timer);
        }, 10);

    }

    //键盘的点击事件处理
    commitKeyboardEvent(obj) {
        DeviceEventEmitter.emit('_keyboard_Event', obj);
    }

    render() {
        return (
            <View>
                {this.state.hide ? null :
                    <View style={styles.keyboardWrap} ref="keyboardWrap">
                        <View style={styles.headerWrap}>
                            {this.props.keyboardHeader ? (
                                this.props.keyboardHeader()
                            ) : (
                                <Image style={styles.headerImage} source={require('../images/text.png')} />
                            )}
                            <TouchableOpacity onPress={this._keyboardHide} style={styles.closeIconWrap}>
                                <Image style={styles.closeIcon} source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAAAXNSR0IArs4c6QAAAppJREFUSA29lt9rUmEYx9+jZ2mh+YtMW41+0hhEdBFFV4XTfiyPP5awlED6s7wIQRBKULEu2nLOURQRFd1GQRfBIGgtXU2nx7fvMzxyFHUq6Xtz3vO+z4/P830edyb4JekJY0xrdzgexGKxv9hPbD2UJOMm54+ZIOxqkHWacx78sbGRi0aj+klR7EEw9pwzdptxbtJM6XSLgiB8xoFra3NzIjCRSOQwlFiGANcExj4JongPT8aWJOlYhfMiYM7hYMVss/ni8XhlHOoQxHa5vAwVrjYhXJlM5uceCCUMhULTtWp1HZRnxgWDHKbdapUgrqghKH8LhF6CweDxRr1eHAeM3+83M1legeqXMZwfNVqtm5SgvLRoWFsrnU5/14jidczMVzh4/tfMhMNhC2s08gSByj8c0Onm1RAE0KaIQtSmjCC8wED7UqnUjnI/zBPtsKIdebTjEgp8f8hgcCeTyV+dMbqCkJEaBlLmUYU0LEwgELDxen0VSlxEondMq/Vks9mtTgh6b2uN2kDdJlQzX6tUnqK6g2qbfnvYHuGyvEYQKOTtlF7v7gVBcXqC0KUCg0BfENA1KAyUsMO2gKG/ACXeGIxGD9T8TTF7rZ6tUTtQm+R6fQ3KnIXDKqrz9mrTfUk6iu9EAbZzmInXVsZuPcrlyup43fZ9FVEcSBmtKN5oKVOtPuvWJpw5djgn4DkAv8KQ3xwEgvIMpIgC1E8Z3DnlWq0A21ko8RIQd6DatuK733MoEArW+WuyWK3eUqlkabbuPAKuG83mhUQi8We/5Or7oUHI2efznRAaDfo2nUYA+ms5g+NZ7IuAuDssBMUcCYQcMQ8zzW/TSXonCLvTuTDq/zQjg1DykNd7qsZYDkP8zWgyLY2iBMWh9Q8m1EZzNShdSQAAAABJRU5ErkJggg=='}} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lengthwaysClass}>{this.renderNum()}</View>
                    </View>
                }
            </View>
        )
    }
}
