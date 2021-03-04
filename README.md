# react-native-awesome-modal
A flexible and reusable modal.

## Install

```sh
 npm install react-native-awesome-modal --save
```

or

```sh
 yarn add react-native-awesome-modal
```

## Usage

````js
import {AwesomeModal} from 'react-native-awesome-modal'

const App: () => React$Node = () => {
  // Have to use the useRef hook to control the modal 
  // from the parent component
  const modalRef = useRef(null);
  return (
    <AwesomeModal
        enableScroll
        onClose={() => console.log('close')}
        onPressOutside={() => console.log('outside')}
        modalBottomMargin={0}
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
        // Place modal's content here as the component's child
        <Text>HELLO!</Text> 
        <TouchableOpacity onPress={() => modalRef.current.scrollToTop()} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Scroll to top</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => modalRef.current.close()} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Close Modal</Text>
        </TouchableOpacity>
    </AwesomeModal>
  )
};
.....
````

#### Props
The props below are used to configure and style the modal.

| Prop                | Type          | Optional  | Default | Description                                                                             |
| ------------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| enableScroll        | boolean       | Yes       | false   | Container of the modal's content will be a ScrollView instead of a View if set to true.|
| hasTabBar           | boolean       | Yes       | false   | Whether the app has a tab bar (i.e. requires bottom padding for the modal)           |
| overflowShow        | boolean       | Yes       | false   | Whether to show overflown elements.                                                  |
| closeOnPressOutside | boolean       | Yes       | true   | Whether to close the modal on press outside of it                                                  |
| modalBottomMargin   | number        | Yes       | 45      | The bottom margin of modal.                                                          |
| onClose             | () => void    | Yes       |         | Function to call when the modal closes.                                              |
| onPressOutside      | () => void    | Yes       |         | Function to call when the user presses outside of the modal.                         |
| modalContainerStyle | StyleProp<ViewStyle> | Yes | See awesome-modal.tsx      | The modal's container style.                                     |   
| modalInnerContainerStyle | StyleProp<ViewStyle> | Yes | See awesome-modal.tsx      | The modal's content container style.                        |   
| modalOverlayStyle | StyleProp<ViewStyle>        | Yes       | See awesome-modal.tsx      | The modal's overlay style (i.e the translucent overlay behind the modal).  |   
| modalRef            | (ref: AwesomeModal | undefined) => void | Yes |  | The modal's ref to control the modal from the parent component.|   



## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Denise-Ng"><img src="https://avatars.githubusercontent.com/u/50568634?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Denise-Ng</b></sub></a><br /><a href="https://github.com/Aspect Apps/react-native-subset-navigator/commits?author=Denise-Ng" title="Code">💻</a> <a href="https://github.com/Aspect Apps/react-native-subset-navigator/commits?author=Denise-Ng" title="Documentation">📖</a> <a href="#example-Denise-Ng" title="Examples">💡</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
