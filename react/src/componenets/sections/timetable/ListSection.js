import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../../../presetAxios';
import { BASE_URL } from '../../../constants';
import { openSearch, closeSearch, setCurrentList, setLectureActive, clearLectureActive, addLectureToTimetable, addLectureToCart, deleteLectureFromCart, setListMajorCodes, setListMajorLectures } from '../../../actions/timetable/index';
import Scroller from '../../Scroller';
import SearchSubSection from './SearchSubSection';
import CourseLecturesBlock from '../../blocks/CourseLecturesBlock';
import { NONE, LIST, TABLE, MULTIPLE } from '../../../reducers/timetable/lectureActive';
import userShape from '../../../shapes/userShape';
import lectureShape from '../../../shapes/lectureShape';
import timetableShape from '../../../shapes/timetableShape';


class ListSection extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user && (this.props.user !== prevProps.user)) {
      this.props.setListMajorCodesDispatch(this.props.user.departments);

      axios.post(`${BASE_URL}/api/timetable/list_load_major`, {
        year: this.props.year,
        semester: this.props.semester,
      })
        .then((response) => {
          this.props.major.codes.forEach((code) => {
            this.props.setListMajorLecturesDispatch(code, response.data.filter(lecture => (lecture.major_code === code)));
          });
        })
        .catch((response) => {
        });
    }
  }

  _isClicked = lecture => (
    this.props.lectureActiveFrom === LIST
    && this.props.lectureActiveClicked === true
    && this.props.lectureActiveLecture.id === lecture.id
  )

  _isHover = lecture => (
    this.props.lectureActiveFrom === LIST
    && this.props.lectureActiveClicked === false
    && this.props.lectureActiveLecture.id === lecture.id
  )

  changeTab = (list) => {
    this.props.setCurrentListDispatch(list);

    if (list === 'SEARCH' && this.props.search.courses.length === 0) {
      this.props.openSearchDispatch();
    }
    else {
      this.props.closeSearchDispatch();
    }

    if (this.props.lectureActiveFrom === LIST) {
      this.props.clearLectureActiveDispatch();
    }
  }

  showSearch = () => {
    this.props.openSearchDispatch();
  }

  addToTable = lecture => (event) => {
    event.stopPropagation();
    if (
      lecture.classtimes.some(thisClasstime => (
        this.props.currentTimetable.lectures.some(timetableLecture => (
          timetableLecture.classtimes.some(classtime => (
            (classtime.day === thisClasstime.day) && (classtime.begin < thisClasstime.end) && (classtime.end > thisClasstime.begin)
          ))
        ))
      ))
    ) {
      alert(false ? "You can't add lecture overlapping." : '시간표가 겹치는 과목은 추가할 수 없습니다.');
      return;
    }

    axios.post(`${BASE_URL}/api/timetable/table_update`, {
      table_id: this.props.currentTimetable.id,
      lecture_id: lecture.id,
      delete: false,
    })
      .then((response) => {
        this.props.addLectureToTimetableDispatch(lecture);
      })
      .catch((response) => {
      });
  }

  addToCart = lecture => (event) => {
    event.stopPropagation();
    axios.post(`${BASE_URL}/api/timetable/wishlist_update`, {
      lecture_id: lecture.id,
      delete: false,
    })
      .then((response) => {
        this.props.addLectureToCartDispatch(lecture);
      })
      .catch((response) => {
      });
  }

  deleteFromCart = lecture => (event) => {
    event.stopPropagation();
    axios.post(`${BASE_URL}/api/timetable/wishlist_update`, {
      lecture_id: lecture.id,
      delete: true,
    })
      .then((response) => {
        this.props.deleteLectureFromCartDispatch(lecture);
      })
      .catch((response) => {
      });
  }

  listHover = lecture => () => {
    if (this.props.lectureActiveClicked) {
      return;
    }
    this.props.setLectureActiveDispatch(lecture, LIST, false);
  }

  listOut = () => {
    if (this.props.lectureActiveClicked) {
      return;
    }
    this.props.clearLectureActiveDispatch();
  }

  listClick = lecture => () => {
    if (!this._isClicked(lecture)) {
      this.props.setLectureActiveDispatch(lecture, 'LIST', true);
    }
    else {
      this.props.setLectureActiveDispatch(lecture, 'LIST', false);
    }
  }

  render() {
    const inTimetable = (lecture) => {
      return this.props.currentTimetable.lectures.some(l => (
        l.id === lecture.id
      ));
    };

    const inCart = (lecture) => {
      return this.props.cart.courses.some(course => (
        course.some(cartLecture => (
          cartLecture.id === lecture.id
        ))
      ));
    };

    const mapLecture = fromCart => lecture => (
      <CourseLecturesBlock
        lecture={lecture}
        key={lecture.id}
        isClicked={this._isClicked(lecture)}
        isHover={this._isHover(lecture)}
        inTimetable={inTimetable(lecture)}
        inCart={inCart(lecture)}
        fromCart={fromCart}
        addToCart={this.addToCart}
        addToTable={this.addToTable}
        deleteFromCart={this.deleteFromCart}
        listHover={this.listHover}
        listOut={this.listOut}
        listClick={this.listClick}
      />
    );

    const mapCourse = fromCart => course => (
      <div className={`list-elem${course.some(lecture => this._isClicked(lecture)) ? ' click' : ''}`} key={course[0].course}>
        <div className="list-elem-title">
          <strong>{course[0].common_title}</strong>
          &nbsp;
          {course[0].old_code}
        </div>
        {course.map(mapLecture(fromCart))}
      </div>
    );

    const listBlocks = (courses, fromCart) => {
      if (courses.length === 0) {
        return <div className="list-loading">결과 없음</div>;
      }
      else {
        return courses.map(mapCourse(fromCart));
      }
    };

    return (
      <div id="lecture-lists">
        <div id="list-tab-wrap">
          <button className={`list-tab search${this.props.currentList === 'SEARCH' ? ' active' : ''}`} onClick={() => this.changeTab('SEARCH')}><i className="list-tab-icon" /></button>
          {this.props.major.codes.map(code => (
            <button className={`list-tab major${this.props.currentList === code ? ' active' : ''}`} key={code} onClick={() => this.changeTab(code)}><i className="list-tab-icon" /></button>
          ))}
          <button className={`list-tab humanity${this.props.currentList === 'HUMANITY' ? ' active' : ''}`} onClick={() => this.changeTab('HUMANITY')}><i className="list-tab-icon" /></button>
          <button className={`list-tab cart${this.props.currentList === 'CART' ? ' active' : ''}`} onClick={() => this.changeTab('CART')}><i className="list-tab-icon" /></button>
        </div>
        <div id="list-page-wrap">
          <div className={`list-page search-page${this.props.currentList === 'SEARCH' ? '' : ' none'}`}>
            <SearchSubSection />
            <div className="list-page-title search-page-title" onClick={() => this.showSearch()}>
              <i className="search-page-title-icon" />
              <div className="search-page-title-text">검색</div>
            </div>
            <Scroller>
              {listBlocks(this.props.search.courses, false)}
            </Scroller>
          </div>
          {this.props.major.codes.map(code => (
            <div className={`list-page major-page${this.props.currentList === code ? '' : ' none'}`} key={code}>
              <div className="list-page-title">
                {this.props.major[code].name}
              </div>
              <Scroller>
                {listBlocks(this.props.major[code].courses, false)}
              </Scroller>
            </div>
          ))}
          <div className={`list-page humanity-page${this.props.currentList === 'HUMANITY' ? '' : ' none'}`}>
            <div className="list-page-title">
              인문사회선택
            </div>
            <Scroller>
              {listBlocks(this.props.humanity.courses, false)}
            </Scroller>
          </div>
          <div className={`list-page cart-page${this.props.currentList === 'CART' ? '' : ' none'}`}>
            <div className="list-page-title">
              장바구니
            </div>
            <Scroller>
              {listBlocks(this.props.cart.courses, true)}
            </Scroller>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.user,
  list: state.timetable.list,
  currentList: state.timetable.list.currentList,
  search: state.timetable.list.search,
  major: state.timetable.list.major,
  humanity: state.timetable.list.humanity,
  cart: state.timetable.list.cart,
  currentTimetable: state.timetable.timetable.currentTimetable,
  lectureActiveFrom: state.timetable.lectureActive.from,
  lectureActiveClicked: state.timetable.lectureActive.clicked,
  lectureActiveLecture: state.timetable.lectureActive.lecture,
  year: state.timetable.semester.year,
  semester: state.timetable.semester.semester,
});

const mapDispatchToProps = dispatch => ({
  openSearchDispatch: () => {
    dispatch(openSearch());
  },
  closeSearchDispatch: () => {
    dispatch(closeSearch());
  },
  setCurrentListDispatch: (list) => {
    dispatch(setCurrentList(list));
  },
  setLectureActiveDispatch: (lecture, from, clicked) => {
    dispatch(setLectureActive(lecture, from, clicked));
  },
  clearLectureActiveDispatch: () => {
    dispatch(clearLectureActive());
  },
  addLectureToTimetableDispatch: (lecture) => {
    dispatch(addLectureToTimetable(lecture));
  },
  addLectureToCartDispatch: (lecture) => {
    dispatch(addLectureToCart(lecture));
  },
  deleteLectureFromCartDispatch: (lecture) => {
    dispatch(deleteLectureFromCart(lecture));
  },
  setListMajorCodesDispatch: (majors) => {
    dispatch(setListMajorCodes(majors));
  },
  setListMajorLecturesDispatch: (majorCode, lectures) => {
    dispatch(setListMajorLectures(majorCode, lectures));
  },
});

ListSection.propTypes = {
  user: userShape,
  currentList: PropTypes.string.isRequired,
  search: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.arrayOf(lectureShape)).isRequired,
  }).isRequired,
  major: PropTypes.shape({
    codes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  humanity: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.arrayOf(lectureShape)).isRequired,
  }).isRequired,
  cart: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.arrayOf(lectureShape)).isRequired,
  }).isRequired,
  currentTimetable: timetableShape.isRequired,
  lectureActiveFrom: PropTypes.oneOf([NONE, LIST, TABLE, MULTIPLE]).isRequired,
  lectureActiveClicked: PropTypes.bool.isRequired,
  lectureActiveLecture: lectureShape,
  year: PropTypes.number.isRequired,
  semester: PropTypes.number.isRequired,
  openSearchDispatch: PropTypes.func.isRequired,
  closeSearchDispatch: PropTypes.func.isRequired,
  setCurrentListDispatch: PropTypes.func.isRequired,
  setLectureActiveDispatch: PropTypes.func.isRequired,
  clearLectureActiveDispatch: PropTypes.func.isRequired,
  addLectureToTimetableDispatch: PropTypes.func.isRequired,
  addLectureToCartDispatch: PropTypes.func.isRequired,
  deleteLectureFromCartDispatch: PropTypes.func.isRequired,
  setListMajorCodesDispatch: PropTypes.func.isRequired,
  setListMajorLecturesDispatch: PropTypes.func.isRequired,
};

ListSection = connect(mapStateToProps, mapDispatchToProps)(ListSection);

export default ListSection;
