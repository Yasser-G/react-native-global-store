import React, { useState, useEffect, useContext, createContext, FunctionComponent, ComponentClass, ReactNode, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

type IndexedObject = Record<string, any>;

type GlobalStoreContextType = [
  globalState: IndexedObject, 
  setGlobalState: (partialState: IndexedObject, callback?: (updatedState: IndexedObject) => void) => void
];

const GlobalStateContext = createContext<GlobalStoreContextType>([{}, () => null]);

interface GlobalStoreProviderProps {
  /**
   * Optional Initial State, defaults to empty object
   */
  initialState?: IndexedObject;
  /**
   * Optional keys to persist (whitelist for persistence)
   */
  persistedKeys?: string[];
  /**
   * Optional Loading UI, defaults to empty View
   */
  loadingUI?: JSX.Element;
  /**
   * Optional Async Storage Key, default is "GlobalStateProvider"
   */
  storageKey?: string;
  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * Global Store Provider Component
 * @example
 *  <GlobalStoreProvider
 *    initialState={optionalInitialState} // defaults to {}
 *    persistedKeys={["optional", "keys", "to", "persist"]}
 *    storageKey="Optional unique id for Async Storage"
 *  >
 *    {/* Your App */}
 *  </GlobalStoreProvider>
 */
export const GlobalStoreProvider: FunctionComponent<GlobalStoreProviderProps> = ({
  children,
  initialState = {},
  persistedKeys = [],
  loadingUI = <View />,
  storageKey = "GlobalStateProvider"
}) => {
  const [globalState, updateState] = useState<IndexedObject>({});
  const [isLoading, setLoading] = useState(true);

  // Using useCallback to prevent recreation of this function on every render
  const setGlobalState = useCallback((
    partialState: IndexedObject,
    callback?: (updatedState: IndexedObject) => void
  ) => {
    updateState(prevState => {
      const updatedState = { ...prevState, ...partialState };
      
      // Only persist data if we have keys to persist
      if (persistedKeys.length > 0) {
        persistData(updatedState, persistedKeys, storageKey);
      }
      
      if (callback) callback(updatedState);
      return updatedState;
    });
  }, [persistedKeys, storageKey]);

  // Load persisted data on mount only
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const result = await AsyncStorage.getItem(storageKey);
        
        if (result) {
          // Second run - merge persisted data with initial state
          const parsedData = JSON.parse(result);
          setGlobalState({ ...initialState, ...parsedData });
          console.log("ReactNativeGlobalStore: Rehydrated Successfully!");
        } else {
          // First run - just use initial state
          setGlobalState(initialState);
          console.log("ReactNativeGlobalStore: Initialized Successfully!");
        }
      } catch (error) {
        console.error("ReactNativeGlobalStore: Rehydration Failed!", error);
        // Fall back to initial state on error
        setGlobalState(initialState);
      } finally {
        setLoading(false);
      }
    };

    loadPersistedData();
  }, [initialState, storageKey]);

  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo<GlobalStoreContextType>(
    () => [globalState, setGlobalState],
    [globalState, setGlobalState]
  );

  if (isLoading) return loadingUI;
  
  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

/**
 * Persist relevant data to AsyncStorage
 */
const persistData = async (
  updatedState: IndexedObject, 
  persistedKeys: string[], 
  storageKey: string
) => {
  try {
    const dataToPersist: IndexedObject = {};
    
    // Only extract keys that should be persisted
    for (const key of persistedKeys) {
      if (key in updatedState) {
        dataToPersist[key] = updatedState[key];
      }
    }
    
    // Only write to storage if we have data to persist
    if (Object.keys(dataToPersist).length > 0) {
      await AsyncStorage.setItem(storageKey, JSON.stringify(dataToPersist));
    }
  } catch (error) {
    console.error("ReactNativeGlobalStore: Data Persist Error", error);
  }
};

/**
 * Hook to use Global Store in function components
 * @example
 * const [globalState, setGlobalState] = useGlobalStore();
 * @returns [globalState, setGlobalState]
 */
export const useGlobalStore = (): GlobalStoreContextType => useContext(GlobalStateContext);

/**
 * HOC to connect Global Store to class components via props
 * @example
 * class MyComponent extends React.Component {
 *   // this.props contains all globalState values and setGlobalState
 * }
 * const ConnectedComponent = connect(MyComponent);
 */
export const connect = <P extends object>(Component: ComponentClass<P>) => {
  class ConnectedComponent extends React.PureComponent<P> {
    static contextType = GlobalStateContext;
    
    render() {
      const [globalState, setGlobalState] = this.context as GlobalStoreContextType;
      return (
        <Component 
          {...this.props} 
          {...globalState} 
          setGlobalState={setGlobalState} 
        />
      );
    }
  }
  
  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  ConnectedComponent.displayName = `GlobalStore(${componentName})`;
  
  return ConnectedComponent;
};