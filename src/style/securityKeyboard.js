import { StyleSheet, Platform, Dimensions } from 'react-native';

let basePx = Platform.OS === 'ios' ? 750 : 720;
let { height, width } = Dimensions.get('window');
function px2dp(px) {
  return (px / basePx) * width;
}

const Styles = StyleSheet.create({
  textInputWrap: {
    borderWidth: 1,
    height: 40,
    borderColor: '#999999',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: px2dp(10)
  },
  cursorWrap: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cursor: {
    fontSize: 30,
    fontWeight: '300'
  },
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerWrap: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 14,
    color: '#5FBF9F'
  },
  headerImage: {
    width: px2dp(260),
    resizeMode: 'contain'
  },
  closeIconWrap: {
    position: 'absolute',
    right: 10
  },
  closeIcon: {
    width: px2dp(40),
    resizeMode: 'contain'
  },
  removeIcon: {
    width: px2dp(50),
    resizeMode: 'contain'
  },
  keyboardWrap: {
    height: 285,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderTopColor: '#cccccc'
  },
  numWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  toolLine: {
    borderTopColor: '#cccccc',
    borderRightColor: '#cccccc',
    borderTopWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 60,
    backgroundColor: '#F5F8FC'
  },
  line: {
    borderTopColor: '#cccccc',
    borderRightColor: '#cccccc',
    borderTopWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 60
  },
  specialNumText: {
    paddingBottom: px2dp(15),
    color: '#000000',
    fontSize: 26,
    fontWeight: '900'
  },
  numText: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '600'
  },
  bottomWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default Styles;
