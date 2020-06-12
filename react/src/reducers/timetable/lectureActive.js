import { RESET, SET_LECTURE_ACTIVE, CLEAR_LECTURE_ACTIVE, SET_MULTIPLE_DETAIL, CLEAR_MULTIPLE_DETAIL } from '../../actions/timetable/lectureActive';

export const NONE = 'NONE';
export const LIST = 'LIST';
export const TABLE = 'TABLE';
export const MULTIPLE = 'MULTIPLE';

const initialState = {
  from: NONE,
  clicked: false,
  lecture: null,
  title: '',
  multipleDetail: [],
};

const lectureActive = (state = initialState, action) => {
  switch (action.type) {
    case RESET: {
      return initialState;
    }
    case SET_LECTURE_ACTIVE: {
      return Object.assign({}, state, {
        from: action.from,
        clicked: action.clicked,
        lecture: action.lecture,
      });
    }
    case CLEAR_LECTURE_ACTIVE: {
      return Object.assign({}, state, {
        from: NONE,
        clicked: false,
        lecture: null,
      });
    }
    case SET_MULTIPLE_DETAIL: {
      return Object.assign({}, state, {
        from: MULTIPLE,
        title: action.title,
        multipleDetail: action.multipleDetail,
      });
    }
    case CLEAR_MULTIPLE_DETAIL: {
      return Object.assign({}, state, {
        from: NONE,
        title: '',
        multipleDetail: [],
      });
    }
    default: {
      return state;
    }
  }
};

export default lectureActive;