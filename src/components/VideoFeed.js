import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native'
import { connect } from 'react-redux';

import { getVideoFeed, updateScrollPosition } from '../reducers/reducer';
import VideoPlayer from './VideoPlayer';

class VideoFeed extends React.Component {

  flatlistRef = null;

  componentDidMount() {
    this.flatlistRef.scrollToOffset({ offset: Math.floor(this.props.scrollPosition), animated: false });
    if (!this.props.videos || this.props.videos.length === 0) this.props.getVideoFeed();
  }

  handleScroll(e) {
    this.props.updateScrollPosition(e.nativeEvent.contentOffset.y);
  }

  getItemLayout(data, index) {
    return { offset: 420 * index, length: 420, index };
  }

  renderItem({ item }) {
    return (
      <VideoPlayer {...item} />
    )
  }

  render() {
    if (this.props.loading) {
      return <Text>Loading...</Text>
    }
    const scrollPosition = this.props.scrollPosition;
    const currentIndex = Math.floor(this.props.scrollPosition / 210);

    return (
      <View style={{ flex: 1, backgroundColor: '#0f0' }}>
        <Text>Scroll Position: {scrollPosition}</Text>
        <Text>Current Index: {currentIndex}</Text>
        <FlatList
          ref={(flatlistRef) => this.flatlistRef = flatlistRef}
          initialScrollIndex={currentIndex}
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
          styles={{ flex: 1 }}
          data={this.props.videos}
          renderItem={this.renderItem.bind(this)}
          getItemLayout={this.getItemLayout}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  let videosWithKeys = state.videos.map(video => ({ key: video.id, ...video }));

  return {
    videos: videosWithKeys,
    loading: state.loading,
    error: state.error,
    scrollPosition: state.scrollPosition
  };
}

const mapDispatchToProps = {
  getVideoFeed,
  updateScrollPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoFeed);
