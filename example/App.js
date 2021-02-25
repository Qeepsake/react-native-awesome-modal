import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';

import {AwesomeModal} from 'react-native-awesome-modal'

const App: () => React$Node = () => {
  // Have to use the useRef hook to control the modal 
  // from the parent component
  const modalRef = useRef(null);
  return (
    <>
      <SafeAreaView style={styles.containerStyle}>
        <Text style={styles.textStyle}>HELLO!</Text>
      </SafeAreaView>

      <AwesomeModal
        enableScroll
        onClose={() => console.log('close')}
        onPressOutside={() => console.log('outside')}
        modalBottomMargin={0}
        overflowShow
        modalRef={(ref) => {modalRef.current = ref}}
        modalContainerStyle={{
          width: "99%",
          maxHeight: 600,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
        modalOverlayStyle={{
          backgroundColor: 'grey'
        }}
      > 
      <View style={styles.modalContentContainerStyle}>
        <Text style={styles.modalContentTitleStyle}>HELLO!{'\n'}</Text>

        <Text style={styles.modalContentTextStyle}>
          <Text>You can create a useRef to control the modal (i.e. close the modal/ have ScrollView scroll to the top) or press outside the modal to close it.</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={() => modalRef.current.scrollToTop()} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Scroll to top</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => modalRef.current.close()} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Close Modal</Text>
      </TouchableOpacity>
    </AwesomeModal>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: "600",
    fontSize: 40,
    textAlign: 'center',
  },
  modalContentContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentTitleStyle: {
    fontSize: 40,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 40
  },
  modalContentTextStyle: {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 40
  },
  buttonStyle: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default App;
