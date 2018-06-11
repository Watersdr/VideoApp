import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';
import Video from 'react-native-video';

import { setPaused, updateVideoPosition, updateCurrentTime } from '../reducers/reducer';

const AUTOPLAY_THRESHOLD = 400;

class VideoPlayer extends React.Component {

  position = { start: null, end: null };

  handleVideoLayout() {
    const adjustedY = 420 * this.props.id;
    const start = adjustedY - Dimensions.get('window').height + AUTOPLAY_THRESHOLD;
    const end = adjustedY + 420 - AUTOPLAY_THRESHOLD;
    this.props.updateVideoPosition(this.props.id, start, end);
  }

  onLoadStart() {
    // console.log('loading', this.props.id);
  }

  onBuffer() {
    // console.log('buffering', this.props.id);
  }

  onProgress(progress) {
    this.props.updateCurrentTime(this.props.id, progress.currentTime);
  }

  render() {
    return (
      <View
        style={{ paddingTop: 50, paddingBottom: 50, marginTop: 20, backgroundColor: '#ccc' }}
        onLayout={this.handleVideoLayout.bind(this)}>
        {this.props.buffering && <Text>Buffering...</Text>}
        <TouchableOpacity style={styles.pausePlay} onPress={() => this.props.setPaused(!this.props.paused, this.props.id)}>
          <View style={styles.pausePlayContainer}><Text>Press me!</Text></View>
        </TouchableOpacity>
        {/* <Text>Current Time: {this.props.currentTime}</Text> */}
        <Video
          style={styles.video}
          source={{ uri: `https://sample-videos.com/video/mp4/720/${this.props.href}` }}
          paused={this.props.paused}
          resizeMode="cover"
          onBuffer={this.onBuffer.bind(this)}
          onLoadStart={this.onLoadStart.bind(this)}
          onProgress={this.onProgress.bind(this)}
          onError={this.videoError} />
        <View style={styles.pausePlayContainer}>
          {this.props.paused && <Text style={{}}>Paused</Text>}
          {!this.props.paused && <Text style={{}}>Playing</Text>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  pausePlay: {
    width: Dimensions.get('window').width,
  },
  pausePlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const mapStateToProps = state => {
  return {
    scrollPosition: state.scrollPosition,
    videos: state.videos
  };
}

const mapDispatchToProps = {
  setPaused,
  updateVideoPosition,
  updateCurrentTime
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
