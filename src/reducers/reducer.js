import { REHYDRATE } from 'redux-persist';
const cheerio = require('react-native-cheerio');

const GET_FEED = 'GET_FEED';
const GET_FEED_SUCCESS = 'GET_FEED_SUCCESS';
const GET_FEED_FAIL = 'GET_FEED_FAIL';
const UPDATE_SCROLL_POSITION = 'UPDATE_SCROLL_POSITION';
const SET_PAUSED = 'SET_PAUSED';
const UPDATE_VIDEO_POSITION = 'UPDATE_VIDEO_POSITION';
const UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME';

const INITIAL_STATE = {
  videos: [],
  loading: false,
  error: null,
  scrollPosition: 0,
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REHYDRATE: return { ...state };
    case GET_FEED:
      return { ...state, loading: true };
    case GET_FEED_SUCCESS:
      const $ = cheerio.load(action.payload.data);
      const hrefs = $('a').toArray().slice(1)
        .map((element, index) => ({
          id: `${index}`,
          href: $(element).attr('href'),
          paused: true,
          start: null,
          end: null,
          buffering: false,
          currentTime: 0.0,
        }));
      return { ...state, loading: false, videos: hrefs };
    case GET_FEED_FAIL:
      return { ...state, loading: false, error: 'Failed to retrieve feed' };
    case UPDATE_SCROLL_POSITION:
      const scrollPosition = action.data;
      return {
        ...state,
        scrollPosition,
        videos: state.videos.map(video => {
          const { start, end, paused } = video;
          if (scrollPosition > start && scrollPosition < end && paused) {
            return { ...video, paused: false };
          } else if ((scrollPosition > end || scrollPosition < start) && !paused) {
            return { ...video, paused: true };
          }
          return video;
        })
      };
    case SET_PAUSED:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id !== action.videoId) {
            return video;
          }
          return {
            ...video,
            paused: action.paused
          };
        })
      }
    case UPDATE_VIDEO_POSITION:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id !== action.videoId) {
            return video;
          }
          return {
            ...video,
            start: action.start,
            end: action.end,
          }
        })
      }
    case UPDATE_CURRENT_TIME:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id !== action.videoId) {
            return video;
          }
          return {
            ...video,
            currentTime: action.currentTime
          }
        })
      }
    default:
      return state;
  }
}

export function getVideoFeed() {
  return {
    type: GET_FEED,
    payload: {
      request: {
        url: '/video/mp4/720/'
      }
    }
  }
}

export function updateScrollPosition(position) {
  return {
    type: UPDATE_SCROLL_POSITION,
    data: position
  }
}

export function setPaused(paused, videoId) {
  return {
    type: SET_PAUSED,
    videoId,
    paused,
  }
}

export function updateVideoPosition(videoId, start, end) {
  return {
    type: UPDATE_VIDEO_POSITION,
    videoId,
    start,
    end
  }
}

export function updateCurrentTime(videoId, currentTime) {
  return {
    type: UPDATE_CURRENT_TIME,
    videoId,
    currentTime
  }
}
