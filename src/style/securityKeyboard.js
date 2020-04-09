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
    width: 50,
    height: 50,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeIcon: {
    width: px2dp(30),
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

  numText: {
    color: '#000000',
    fontSize: 24
  },
  symbolText: {
    color: '#000000',
    fontSize: 20
  },
  bottomWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  deleteIcon: {
    width: px2dp(46),
    height: px2dp(32)
  },
  transformIcon: {
    width: px2dp(40),
    height: px2dp(45)
  },
  backIcon: {
    width: px2dp(40),
    height: px2dp(35)
  },
  spaceIcon: {
    marginTop: 20,
    width: px2dp(200),
    height: 200
  },
  itemNumParentImage: {
    backgroundColor: '#BDC5D3'
  },

  itemNumParentText: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 4,
    flex: 1
  },
  itemStringParentText: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginHorizontal: 3,
    marginVertical: 6,
    flex: 1
  },
  itemStringParentText2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginLeft: 12,
    marginRight: 3,
    marginVertical: 6,
    flex: 1
  },
  itemStringParentText3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 12,
    marginVertical: 6,
    flex: 1
  },
  itemStringParentText4: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDC5D3',
    borderRadius: 6,
    marginHorizontal: 3,
    marginVertical: 6,
    width: px2dp(120)
  },

  itemStringParentImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDC5D3',
    borderRadius: 6,
    marginHorizontal: 3,
    marginVertical: 6,
    width: px2dp(85)
  },
  itemStringParentSpace: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDC5D3',
    borderRadius: 6,
    marginHorizontal: 3,
    marginVertical: 6,
    flex: 1
  },

  orientation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1
  },

  lengthwaysClass: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
    backgroundColor: '#E3E5EC',
    padding: 2
  }
});

export default Styles;
