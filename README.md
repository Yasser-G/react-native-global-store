# React Native Global Store 
![yarn][npmDownloads] ![PRsBadge] ![npm][npmLicense] ![npm][npmVersion]

### Add Global Store to your app in just One Step!

- No Store configuration needed!
- No Reducers or *ACTIONS* required.
- Lightweight and Pure JS (TypeScript).
- No MiddleWares needed, no more dispatch complications.
- Very simple way to change store state, just like Component setState !
- Simply connect your components with simpler `connect` wrapper
- Easily use hooks for your functional component, `useGlobalStore` .
- Inspired By redux, but distinguished from it by being faster and easier to learn and use.
###### Note that this lib was known before as [React-Native-Redux][React-Native-Redux].



## Instalation 


- Install [React Native Async Storage][asyncstorage] (**required**) if not installed.
- Then install React Native Global Store

	```
	npm i react-native-global-store
	```  
	 **- OR -**  
	```
	yarn add react-native-global-store
	```

> No Linking or Pods are needed, you are ready to go! 
 

## Usage

### **GlobalStoreProvider**
###### Props
```ts
initialState?:  object;
// Optional Initial State, defaults to {}

persistedKeys?:  string[];
// Optional keys to persist its values ( white list to persist )

loadingUI?:  JSX.Element;
// Optional Loading UI, defaults to : <View/>

storageKey?:  string;
// Optionally change Async Storage Key, default key is "GlobalStoreProvider"
```
```ts
import { GlobalStoreProvider } from "react-native-global-store"
```
###### Usage Example
```ts
import React from "react"
import { GlobalStoreProvider } from "react-native-global-store"
import AppContainer from "../navigation" // Path to Root Navigation

const myInitialState = { /* your initial state */ }

export default ()=> (
  <GlobalStoreProvider 
   initialState={myInitialState} 
   loadingUI={<MyLoadingUI />}
   persistedKeys=["user", "otherKey"] // Changes to these keys' values will be persisted.
  >
    <AppContainer />
  </GlobalStoreProvider>
)
```


---

### **useGlobalStore** 
```ts
import { useGlobalStore } from "react-native-global-store"
```
```ts
const [globalState, setGlobalState] = useGlobalStore()
```

 
 ##### Usage Example
```ts
import React from "react"
import { useGlobalStore } from "react-native-global-store"

const MyComponent = (props) => {

	const [globalState, setGlobalState] = useGlobalStore()
	// Then access and edit your globalState normally
	// Just like useState from React. 
	return (
		<>
			// Your Component goes here
		</>
	)
}

export default MyComponent

```

---



### **connect**
###### Arguments
```ts
Componenet: ComponentClass
```
###### Usage
 
```ts
import React from "react"
import { connect } from "react-native-global-store"

class UserPage extend React.Component {

	// Your Component goes here
	
	// Access your store using this.props.yourKey
	// Update your store state using this.props.setGlobalState({})
}

// this will connect your global store to UserPage component props
export default connect(UserPage) 


```


---



[React-Native-Redux]: https://github.com/Yasser-G/react-native-redux
[asyncstorage]: https://github.com/react-native-async-storage/async-storage#getting-started
[npmDownloads]: <https://img.shields.io/npm/dt/react-native-global-store?label=Installs&logo=npm&style=plastic>
[npmLicense]: <https://img.shields.io/npm/l/react-native-global-store?label=License&style=plastic>
[npmVersion]: <https://img.shields.io/npm/v/react-native-global-store?label=Latest%20Version&style=plastic>
[PRsBadge]: <https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic>

