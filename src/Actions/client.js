import T                          from "../constants/ActionTypes";
import GeoLocation                from "../GeoLocation";
import mapConst                   from "../constants/Map"

const Actions = {

  setSearchText: (txt) => ({
    type: T.SET_SEARCH_TEXT,
    payload: txt
  }),

  noSearchResults: () => ({
    type: T.NO_SEARCH_RESULTS
  }),

  setCitySearchText: (txt) => ({
    type: T.SET_CITY_SEARCH_TEXT,
    payload: txt
  }),

  finishCitySearch: () => ({
    type: T.FINISH_CITY_SEARCH
  }),

  toggleSearchCategory: (category) => {
    return {
      type: T.TOGGLE_SEARCH_CATEGORY,
      payload: category
    };
  },

  toggleMenu          : () => ({ type: T.TOGGLE_MENU            }),
  showMenu            : () => ({ type: T.SHOW_MENU              }),
  showNewEntry        : () => ({ type: T.SHOW_NEW_ENTRY         }),
  showSearchResults   : () => ({ type: T.SHOW_SEARCH_RESULTS    }),
  toggleLandingPage   : () => ({ type: T.TOGGLE_MENU            }),
  showImprint         : () => ({ type: T.SHOW_IMPRINT           }),
  cancelNew           : () => ({ type: T.CANCEL_NEW             }),
  cancelEdit          : () => ({ type: T.CANCEL_EDIT            }),
  cancelRating        : () => ({ type: T.CANCEL_RATING          }),
  cancelWait          : () => ({ type: T.CANCEL_WAIT_IO         }),
  closeIoErrorMessage : () => ({ type: T.CLOSE_IO_ERROR_MESSAGE }),

  showAllEntries: () =>
    (dispatch, getState) => {
      dispatch({
        type: T.SET_NUM_ENTRIES_TO_FETCH,
        entriesToFetch: {
          all: true,
          num: getState().search.entriesToFetch.num
        }
      });
      const allIDs = [];
      if(Array.isArray(getState().search.result)){
        allIDs.push(allIDs, getState().search.result);
      }
      if(Array.isArray(getState().search.invisible)){
        allIDs.push(allIDs, getState().search.invisible);
      }
      dispatch(Actions.getEntries(allIDs));
    },

  showNewRating: (id) => ({
     type: T.SHOW_NEW_RATING,
     payload: id
  }),

  showInfo: (key) => ({
    type: T.SHOW_INFO,
    payload: key
  }),

  showSubscribeToBbox: () => ({
    type: T.SHOW_SUBSCRIBE_TO_BBOX
  }),

  logout: () => ({
    type: T.LOGOUT
  }),

  setCenter: (center) => {
    return {
      type: T.SET_MAP_CENTER,
      payload: center
    };
  },

  setZoom: (zoom) => {
    return {
      type: T.SET_ZOOM,
      payload: parseFloat(zoom).toFixed(mapConst.NUM_DECIMALS_FOR_ZOOM)
    };
  },

  setBbox: (bbox) => {
    return {
      type: T.SET_BBOX,
      payload: bbox
    };
  },

  setCurrentEntry: (id, showLeft) => {
    return {
      type: T.SET_CURRENT_ENTRY,
      entry: id,
      showLeft: showLeft
    };
  },

  urlSetCurrentEntry: (id) => 
    (dispatch, getState) => {
      dispatch(Actions.highlight(id ? [id] : []));
      dispatch({
        type: T.CHANGE_URL,
        hash: window.location.hash,
        entry: id,
        center: getState().map.center,
        zoom: getState().map.zoom,
        searchText: getState().search.text,
        view: getState().vie
      });
      updateUrl(getState().url.hash);
    },

  urlChangeSidebarVisibility: (show) =>
    (dispatch, getState) => {
      dispatch({
        type: T.CHANGE_URL,
        hash: window.location.hash,
        show: show
      });
      updateUrl(getState().url.hash);
    },

  urlSetCenter: (center, zoom) => 
    (dispatch, getState) => {
      dispatch({
        type: T.CHANGE_URL,
        hash: window.location.hash,
        center: center,
        zoom: zoom,
        searchText: getState().search.text,
        view: getState().view,
      });
      updateUrl(getState().url.hash);
    },

  urlSetZoom: (center, zoom) => 
    (dispatch, getState) => {
      dispatch({
        type: T.CHANGE_URL,
        hash: window.location.hash,
        center: center,
        zoom: zoom,
        searchText: getState().search.text,
        view: getState().view
      });
      updateUrl(getState().url.hash);
    },

  urlSetTags: (tags) =>
    (dispatch, getState) => {
      dispatch({
        type: T.CHANGE_URL,
        hash: window.location.hash,
        center: getState().map.center,
        zoom: getState().map.zoom,
        tags: tags,
        view: getState().view
       }); 
      updateUrl(getState().url.hash);
    },

  updateStateFromURL: (hash) => {
    return {
      type: T.UPDATE_STATE_FROM_URL,
      payload: hash
    }
  },

  toggleSidebarVisibility: () =>
    (dispatch, getState) => {
      dispatch({
        type: T.TOGGLE_SIDEBAR_VISIBILITY
      });
    },

  highlight: (id) => {
    if (id == null) {
      id = [];
    }
    if (!Array.isArray(id)) {
      id = [id];
    }
    return {
      type: T.HIGHLIGHT_ENTRIES,
      payload: id
    };
  },

  editCurrentEntry: () =>
    (dispatch, getState) => {
      dispatch({
        type: T.SHOW_IO_WAIT
      });
      WebAPI.getEntries([getState().search.current], (err, res) => {
        if (!err) {
          dispatch({
            type: T.ENTRIES_RESULT,
            payload: res
          });
          const state = getState();
          dispatch({
            type: T.EDIT_CURRENT_ENTRY,
            payload: state.server.entries[state.search.current]
          });
        } else {
          dispatch({
            type: T.EDIT_CURRENT_ENTRY,
            payload: err,
            error: true
          });
        }
      });
    },

  showOwnPosition: () =>
    (dispatch) => {
      dispatch({
        type: T.SHOW_OWN_POSITION
      });
      GeoLocation.getLocation((position) => {
        dispatch({
          type: T.OWN_POSITION_RESULT,
          payload: position
        });
      });
    },

  showOwnPosition15minutes: () =>
    (dispatch) => {
      dispatch({
        type: T.SHOW_OWN_POSITION
      });
      GeoLocation.getLocation(((position) => {
        dispatch({
          type: T.OWN_POSITION_RESULT,
          payload: position
        });
      }), 900000);
  },

  cancelOwnPosition: () => {
    return {
      type: T.CANCEL_OWN_POSITION
    };
  },

  showFeatureToDonate: (feat) => {
    return {
      type: T.SHOW_FEATURE_TO_DONATE,
      payload: feat
    };
  },

  showMap: () => {
    return {
      type: T.SHOW_MAP
    }
  },

  explainRatingContext: (context) => {
    return {
      type: T.EXPLAIN_RATING_CONTEXT,
      payload: context
    }
  }
};

const updateUrl = (hash) => {
  if(window.location.hash != hash){
    window.location.hash = hash;
  } 
};

module.exports = Actions;