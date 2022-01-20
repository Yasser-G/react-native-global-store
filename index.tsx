import React, { useState, useEffect, useContext, createContext, FunctionComponent, ComponentClass } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { View } from "react-native";

type IndexedObject = { [key: string]: any };

const GlobalStateContext = createContext<
	[globalState: object, setGlobalState: (PartialState: object) => void]
>([{}, () => null]);

/**
 * @example
 *  <GlobalStoreProvider
 * 	initialState={OptionalInitialState} // defaults to {}
 * 	persistedKeys={["optional", "keys", "to", "persist", "its", "values"]}
 * 	storageKey="Optional unique id for Async Storage"
 * >
 * 	// Your App
 * </GlobalStoreProvider>
 */
const GlobalStoreProvider: FunctionComponent<{
	/**
	 * Optional Initial State, defaults to {}
	 */
	initialState?: object;
	/**
	 * Optional keys to persist its values ( white list to persist )
	 */
	persistedKeys?: string[];
	/**
	 * Optional Loading UI, defaults to : < View />
	 */
	loadingUI?: JSX.Element;
	/**
	 * Optionally change Async Storage Key, default key is "GlobalStoreProvider"
	 */
	storageKey?: string;
}> = ({
	children,
	initialState = {},
	persistedKeys = [],
	loadingUI = <View />,
	storageKey = "GlobalStateProvider"
}) => {
	const [globalState, updateState] = useState<IndexedObject>({});
	const [isLoading, setLoading] = useState(true);
	const setGlobalState = (
		PartialState: object,
		callBack?: (UpdatedState: IndexedObject) => void
	) => {
		let UpdatedState = {};
		updateState((prevState) => {
			UpdatedState = { ...prevState, ...PartialState };
			updatePersistedValue(UpdatedState);
			return UpdatedState;
		});
		if (callBack) callBack(UpdatedState);
	};

	useEffect(() => {
		useAsyncStorage(storageKey).getItem((error, result) => {
			if (error) {
				console.log("ReactNativeGlobalStore: Rehydration Failed!", error.message);
			} else {
				if (result) {
					// Second Run
					setGlobalState({ ...initialState, ...JSON.parse(result) });
					console.log("ReactNativeGlobalStore: Rehydrated Successfully!");
				} else {
					// First Run
					setGlobalState(initialState);
					console.log("ReactNativeGlobalStore: Initialized Successfully!");
				}
				setLoading(false);
			}
		});
	}, []);

	const updatePersistedValue = (UpdatedState: IndexedObject) => {
		const dataToPersist: IndexedObject = {};
		for (const key of persistedKeys) {
			dataToPersist[key] = UpdatedState[key];
		}
		useAsyncStorage(storageKey).setItem(JSON.stringify(dataToPersist), (error) => {
			if (error) {
				console.error("ReactNativeGlobalStore: Data Persist Error", error.message);
			}
		});
	};

	if (isLoading) return loadingUI;
	return (
		<GlobalStateContext.Provider value={[globalState, setGlobalState]} children={children} />
	);
};

/**
 * Use Global Store In Function Component
 * @example
 * const [globalState, setGlobalState] = useGlobalStore()
 */
const useGlobalStore = () => useContext(GlobalStateContext);

/**
 * Connect Global Store to Class Components' props
 * @example
 * class MyComponent extends React.Component {
 * 	// this.props contains all globalStoreState and setGlobalState
 * }
 * const ConnectedComponent = connect(MyComponent)
 */
const connect = (Componenet: ComponentClass) =>
  class extends React.PureComponent {
    static contextType = GlobalStateContext;
    render() {
		const [globalState, setGlobalState] = this.context
      return <Componenet {...this.props} {...globalState} setGlobalState={setGlobalState} />;
    }
  };

export { GlobalStoreProvider, useGlobalStore, connect };
