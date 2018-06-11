import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import VideoFeed from './components/VideoFeed';

function reduxWrapper(component, store) {
  return class ReduxComponent extends React.Component {
    render() {
      return <Provider store={store}>{React.createElement(component)}</Provider>
    }
  }
}

// register all screens of the app (including internal ones)
export function registerScreens(store) {
  Navigation.registerComponent('example.VideoFeed', () => reduxWrapper(VideoFeed, store));
}