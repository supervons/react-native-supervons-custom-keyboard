import React from 'react';

import SecurityKeyboard from './securityKeyboardBase';

class SecurityKeyboardMethods extends SecurityKeyboard {
  constructor(props) {
    super(props);
  }
  //清除内容（删除全部文字别名）
  clear() {
    this.removeAll();
  }
  //是否获得焦点
  isFocused() {
    if (this.state.cursorLock) {
      return false;
    } else {
      return true;
    }
  }
  //失去焦点
  blur() {
    this.hide();
  }
  //获得焦点
  focus() {
    this.show();
  }
}
export default SecurityKeyboardMethods;
