
# react-native-supervons-custom-keyboard

## Thanks
```
基于 react-native-security-keyboard 开发，增加了大小写字母、字符、按键响应以及切换键盘类型；

感谢 yanzhandong 的开源分享

Developed based on react-native-security-keyboard, adding uppercase and lowercase letters, characters, key responses, and switching keyboard types;

Thanks to yanzhandong for open source sharing
```
## Preview
```
![demo展示](preview/demo.gif)
```
## Getting started

`$ npm install react-native-supervons-custom-keyboard --save`


## Usage
```js
import React, { Component } from 'react';
import { View, Button } from 'react-native';
import RNSVCustomKeyboard from 'react-native-supervons-custom-keyboard';
```
```jsx
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ height: 150 }}>
          <RNSVCustomKeyboard
            keyboardType={'string'}
            placeholder={'请输入'}
            placeholderTextColor={'#E0E0E0'}
            onChangeText={text => this.setState({ inputValue: text })}
            ref={$moneyInput => {
              this.$moneyInput = $moneyInput;
            }}
          />
          <Button title={'outPut'} onPress={() => alert(this.state.inputValue)} />
        </View>
      </View>
    );
  }
}
```
  