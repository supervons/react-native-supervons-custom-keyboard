
# react-native-supervons-custom-keyboard
English  [简体中文](/README_CN.md "中文介绍")
## Thanks
```

Developed based on react-native-security-keyboard, adding uppercase and lowercase letters, characters, key responses, and switching keyboard types;

Thanks to yanzhandong for open source sharing
```
## Preview
![avatar](preview/demo.gif)
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
            random={true}
            keyboardType={'string'}
            placeholder={'请输入'}
            placeholderTextColor={'#E0E0E0'}
            onChangeText={text => this.setState({ inputValue: text })}
          />
          <Button title={'outPut'} onPress={() => alert(this.state.inputValue)} />
        </View>
      </View>
    );
  }
}
```
### Props

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `disabled` | `Boolean` | prohibit input, The default is false. |
| `random` | `Boolean` | random keyboard layout, The default is false. |
| `caretHidden` | `Boolean` | hide cursor, The default is false. |
| `secureTextEntry` | `String` |password modal, The default is false.. |
| `placeholderTextColor` | `String` | The color of the text displayed by the placeholder string. |
| `style` | `Object` | custom TextInput external style Style, does not support font Style. |
| `valueStyle` | `Object` | Text content style.|
| `keyboardHeader` | `element` | Customizing the top of the keyboard.|
| `regs` | `Func(value)` | value check, need to return the check after the value out. |
| `onChangeText` | `Func(value)` | Value modified callback. |
| `onFocus` | `Func` | The callback function of the focus. |
| `onBlur` | `Func` | A callback function that loses focus |

### Methods

| **Method** | **Parameter** | **Description** |
|------------|---------------|-----------------|
| `clear` | none | Clear all the content |
| `isFocused` | none |The return value indicates whether the current input box has got the focus. |
| `blur` | none | Lose focus. |
| `focus` | none | Get the focus. |

  