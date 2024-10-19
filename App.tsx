import React from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from './src/store'; // Make sure this path is correct
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
