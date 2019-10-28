export const SET_COURSE_ACTIVE = 'SET_COURSE_ACTIVE';
export const CLEAR_COURSE_ACTIVE = 'CLEAR_COURSE_ACTIVE';
export const SET_REVIEWS = 'SET_REVIEWS';
export const SET_LECTURES = 'SET_LECTURES';

export function setCourseActive(course, clicked) {
  return {
    type: SET_COURSE_ACTIVE,
    course: course,
    clicked: clicked,
  };
}

export function clearCourseActive() {
  return {
    type: CLEAR_COURSE_ACTIVE,
  };
}

export function setReviews(reviews) {
  return {
    type: SET_REVIEWS,
    reviews: reviews,
  };
}

export function setLectures(lectures) {
  return {
    type: SET_LECTURES,
    lectures: lectures,
  };
}
