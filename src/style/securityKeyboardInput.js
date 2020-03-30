import { StyleSheet, Platform, Dimensions } from 'react-native';

let basePx = Platform.OS === 'ios' ? 750 : 720;
let { width } = Dimensions.get('window');
function px2dp(px) {
  return (px / basePx) * width;
}

const styles = StyleSheet.create({
  view: {
    width: '100%'
  },
  textInputWrap: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cursorWrap: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cursor: {
    fontSize: 25,
    color: '#4970EA',
    left: px2dp(-2)
  },
  placeholder: {
    color: '#C4C4C4',
    fontSize: 20,
    position: 'absolute',
    left: 13
  },
  value: {
    fontSize: 16
  }
});

export default styles;
