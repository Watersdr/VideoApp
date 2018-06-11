import { Navigation } from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';

import axios from 'axios';
import axiosMiddleWare from 'redux-axios-middleware';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import reducer from './src/reducers/reducer';
import { registerScreens } from './src/screens';

const client = axios.create({
  baseURL: 'https://sample-videos.com',
});

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, reducer);

const store = createStore(pReducer, applyMiddleware(axiosMiddleWare(client)));


Navigation.events().registerAppLaunchedListener(() => {
  persistStore(store, null, () => {
    registerScreens(store);
    Navigation.setRoot({
      root: {
        component: {
          name: 'example.VideoFeed'
        }
      }
    });
  });
});
