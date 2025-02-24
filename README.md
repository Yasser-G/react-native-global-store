# React Native Global Store
![npmDownloads] ![PRsBadge] ![npmLicense] ![npmVersion]

## Overview
React Native Global Store is a lightweight and efficient global state management solution for React Native with built-in AsyncStorage persistence. It provides an easy-to-use API for managing state globally without the complexities of Redux or Context APIs.

### Features
- No store configuration required.
- No reducers or actions needed.
- Pure JavaScript (TypeScript supported).
- No middleware or dispatch complications.
- Simple API similar to React's `useState`.
- Easy connection with components using `connect`.
- Functional component support with `useGlobalStore`.
- Inspired by Redux but optimized for simplicity and performance.

## Installation

1. Install [React Native Async Storage][asyncstorage] (**required**) if not already installed.
2. Install React Native Global Store:

```sh
npm install react-native-global-store
```
**- OR -**  
```sh
yarn add react-native-global-store
```

> No linking or Pods required. Ready to use!

## Usage

### **GlobalStoreProvider**
Wrap your app with `GlobalStoreProvider` to provide global state management.

#### Props
| Prop            | Type         | Default               | Description |
|----------------|-------------|-----------------------|-------------|
| `initialState`  | `object`     | `{}`                   | Initial state for the store. |
| `persistedKeys` | `string[]`   | `[]`                   | Keys to persist in AsyncStorage. |
| `loadingUI`    | `JSX.Element` | `<View />`             | UI to display while loading persisted state. |
| `storageKey`   | `string`     | `"GlobalStoreProvider"` | Unique key for AsyncStorage. |

#### Example
```tsx
import React from "react";
import { GlobalStoreProvider } from "react-native-global-store";
import App from "./App";

const myInitialState = { theme: "light" };

const Root = () => (
  <GlobalStoreProvider 
    initialState={myInitialState} 
    loadingUI={<LoadingComponent />} 
    persistedKeys={["theme"]}
  >
    <App />
  </GlobalStoreProvider>
);

export default Root;
```

### **useGlobalStore**
A hook for accessing and updating the global state in functional components.

#### Example
```tsx
import React from "react";
import { useGlobalStore } from "react-native-global-store";

const MyComponent = () => {
  const [globalState, setGlobalState] = useGlobalStore();

  return (
    <>
      <Text>Current Theme: {globalState.theme}</Text>
      <Button title="Toggle Theme" onPress={() => 
        setGlobalState({ theme: globalState.theme === "light" ? "dark" : "light" })
      } />
    </>
  );
};

export default MyComponent;
```

### **connect**
A higher-order component (HOC) for connecting class components to the global store.

#### Example
```tsx
import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-native-global-store";

class SettingsScreen extends Component {
  render() {
    const { theme, setGlobalState } = this.props;
    return (
      <View>
        <Text>Current Theme: {theme}</Text>
        <Button title="Toggle Theme" onPress={() => 
          setGlobalState({ theme: theme === "light" ? "dark" : "light" })
        } />
      </View>
    );
  }
}

export default connect(SettingsScreen);
```

## License
MIT

[asyncstorage]: https://github.com/react-native-async-storage/async-storage#getting-started
[npmDownloads]: <https://img.shields.io/npm/dt/react-native-global-store?label=Installs&logo=npm&style=plastic>
[npmLicense]: <https://img.shields.io/npm/l/react-native-global-store?label=License&style=plastic>
[npmVersion]: <https://img.shields.io/npm/v/react-native-global-store?label=Latest%20Version&style=plastic>
[PRsBadge]: <https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic>