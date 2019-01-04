export const SET_SEMESTER = "SET_SEMESTER";
export const OPEN_SEARCH = "OPEN_SEARCH";
export const CLOSE_SEARCH = "CLOSE_SEARCH";
export const SET_CURRENT_LIST = "SER_CURRENT_LIST";
export const SET_LIST_LECTURES = "SET_LIST_LECTURES";
export const ADD_LECTURE_TO_CART = "ADD_LECTURE_TO_CART";
export const DELETE_LECTURE_FROM_CART = "DELETE_LECTURE_FROM_CART";
export const SET_TIMETABLES = "SET_TIMETABLES";
export const SET_CURRENT_TIMETABLE = "SET_CURRENT_TIMETABLE";
export const CREATE_TIMETABLE = "CREATE_TIMETABLE";
export const DELETE_TIMETABLE = "DELETE_TIMETABLE";
export const DUPLICATE_TIMETABLE = "DUPLICATE_TIMETABLE";
export const ADD_LECTURE_TO_TIMETABLE = "ADD_LECTURE_TO_TIMETABLE";
export const REMOVE_LECTURE_FROM_TIMETABLE = "REMOVE_LECTURE_FROM_TIMETABLE";
export const UPDATE_CELL_SIZE = "UPDATE_CELL_SIZE";
export const SET_LECTURE_ACTIVE = "SET_LECTURE_ACTIVE";
export const CLEAR_LECTURE_ACTIVE = "CLEAR_LECTURE_ACTIVE";
export const SET_MULTIPLE_DETAIL = "SET_MULTIPLE_DETAIL";
export const CLEAR_MULTIPLE_DETAIL = "CLEAR_MULTIPLE_DETAIL";
export const DRAG_SEARCH = "DRAG_SEARCH";
export const SET_IS_DRAGGING = "SET_IS_DRAGGING";
export const TOGGLE_LECTURE_LIST = "TOGGLE_LECTURE_LIST";
export const MODAL_TIMETABLE_LIST = "MODAL_TIMETABLE_LIST";
export const LECTURE_INFO = "LECTURE_INFO";

export function setSemester(year, semester) {
    return {
        type : SET_SEMESTER,
        year : year,
        semester : semester,
    }
}

export function openSearch() {
    return {
        type : OPEN_SEARCH,
    }
}

export function closeSearch() {
    return {
        type : CLOSE_SEARCH,
    }
}

export function setCurrentList(list) {
    return {
        type : SET_CURRENT_LIST,
        list : list,
    }
}

export function setListLectures(code, lectures) {
    return {
        type : SET_LIST_LECTURES,
        code : code,
        lectures : lectures,
    }
}

export function addLectureToCart(lecture) {
    return {
        type : ADD_LECTURE_TO_CART,
        lecture : lecture,
    }
}

export function deleteLectureFromCart(lecture) {
    return {
        type : DELETE_LECTURE_FROM_CART,
        lecture : lecture,
    }
}

export function addLectureToTimetable(lecture) {
    return {
        type : ADD_LECTURE_TO_TIMETABLE,
        lecture : lecture,
    }
}

export function removeLectureFromTimetable(lecture) {
    return {
        type : REMOVE_LECTURE_FROM_TIMETABLE,
        lecture : lecture,
    }
}

export function setTimetables(timetables) {
    return {
        type : SET_TIMETABLES,
        timetables : timetables,
    }
}

export function setCurrentTimetable(timetable) {
    return {
        type : SET_CURRENT_TIMETABLE,
        timetable : timetable,
    }
}

export function createTimetable(id) {
    return {
        type : CREATE_TIMETABLE,
        id : id,
    }
}

export function deleteTimetable(timetable) {
    return {
        type : DELETE_TIMETABLE,
        timetable : timetable,
    }
}

export function duplicateTimetable(id, timetable) {
    return {
        type : DUPLICATE_TIMETABLE,
        id : id,
        timetable : timetable,
    }
}

export function updateCellSize(width, height) {
    return {
        type : UPDATE_CELL_SIZE,
        width : width,
        height : height,
    }

}

export function setLectureActive(lecture, from, clicked) {
    return {
        type : SET_LECTURE_ACTIVE,
        lecture : lecture,
        from : from,
        clicked : clicked,
    }
}

export function clearLectureActive() {
    return {
        type : CLEAR_LECTURE_ACTIVE,
    }
}

export function setMultipleDetail(title, lectures) {
    return {
        type : SET_MULTIPLE_DETAIL,
        title : title,
        lectures : lectures,
    }
}

export function clearMultipleDetail() {
    return {
        type : CLEAR_MULTIPLE_DETAIL,
    }
}

export function dragSearch(day,start,end){
    return {
        type : DRAG_SEARCH,
        day : day,
        start : start,
        end : end,
    }
}

export function setIsDragging(isDragging) {
    return {
        type : SET_IS_DRAGGING,
        isDragging : isDragging,
    }
}
  
export function mToggleLectureList() {
    return {
        type: TOGGLE_LECTURE_LIST,
    };
}

export function modaltimetableList() {
    return {
        type: MODAL_TIMETABLE_LIST,
    }

}
export function lectureinfo() {
    return {
        type: LECTURE_INFO,
    }
}