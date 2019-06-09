import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openSearch, closeSearch, setCurrentList, clearLectureActive } from '../../../actions/timetable/index';
import Scroller from '../../Scroller';
import SearchSubSection from './SearchSubSection';
import CourseLecturesBlock from '../../blocks/CourseLecturesBlock';
import { LIST, TABLE } from '../../../reducers/timetable/lectureActive';

class ListSection extends Component {
  changeTab(list) {
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

  showSearch() {
    this.props.openSearchDispatch();
  }

  render() {
    const inTimetable = (lecture) => {
      for (let i = 0; i < this.props.currentTimetable.lectures.length; i++) {
        if (this.props.currentTimetable.lectures[i].id === lecture.id) {
          return true;
        }
      }
      return false;
    };

    const inCart = (lecture) => {
      for (let i = 0, course; (course = this.props.cart.courses[i]); i++) {
        for (let j = 0, cartLecture; (cartLecture = course[j]); j++) {
          if (cartLecture.id === lecture.id) {
            return true;
          }
        }
      }
      return false;
    };

    const isClicked = (course) => {
      if (this.props.lectureActiveFrom !== LIST && this.props.lectureActiveFrom !== TABLE) {
        return false;
      }
      if (!this.props.lectureActiveClicked) {
        return false;
      }

      return (this.props.lectureActiveLecture.course === course[0].course);
    };

    const mapLecture = fromCart => lecture => (
      <CourseLecturesBlock lecture={lecture} key={lecture.id} inTimetable={inTimetable(lecture)} inCart={inCart(lecture)} fromCart={fromCart} />
    );

    const mapCourse = fromCart => course => (
      <div className={`list-elem${isClicked(course) ? ' click' : ''}`} key={course[0].course}>
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
          {['ID', 'CS'].map(code => (
            <button className={`list-tab major${this.props.currentList === code ? ' active' : ''}`} key={code} onClick={() => this.changeTab(code)}><i className="list-tab-icon" /></button>
          ))}
          <button className={`list-tab humanity${this.props.currentList === 'HUMANITY' ? ' active' : ''}`} onClick={() => this.changeTab('HUMANITY')}><i className="list-tab-icon" /></button>
          <button className={`list-tab cart${this.props.currentList === 'CART' ? ' active' : ''}`} onClick={() => this.changeTab('CART')}><i className="list-tab-icon" /></button>
        </div>
        <div id="list-page-wrap">
          <div className={`list-page search-page${this.props.currentList === 'SEARCH' ? '' : ' none'}`}>
            <SearchSubSection />
            {
              this.props.open
                ? null
                : (
                  <>
                    <div className="list-page-title search-page-title" onClick={() => this.showSearch()}>
                      <i className="search-page-title-icon" />
                      <div className="search-page-title-text">검색</div>
                    </div>
                    <Scroller>
                      {listBlocks(this.props.search.courses, false)}
                    </Scroller>
                  </>
                )
            }
          </div>
          {['ID', 'CS'].map(code => (
            <div className={`list-page major-page${this.props.currentList === code ? '' : ' none'}`} key={code}>
              <div className="list-page-title">
                {`${this.props.list[code].name} 전공`}
              </div>
              <Scroller>
                {listBlocks(this.props.list[code].courses, false)}
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
  list: state.timetable.list,
  currentList: state.timetable.list.currentList,
  search: state.timetable.list.search,
  major: state.timetable.list.major,
  humanity: state.timetable.list.humanity,
  cart: state.timetable.list.cart,
  open: state.timetable.search.open,
  currentTimetable: state.timetable.timetable.currentTimetable,
  lectureActiveFrom: state.timetable.lectureActive.from,
  lectureActiveClicked: state.timetable.lectureActive.clicked,
  lectureActiveLecture: state.timetable.lectureActive.lecture,
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
  clearLectureActiveDispatch: () => {
    dispatch(clearLectureActive());
  },
});

ListSection = connect(mapStateToProps, mapDispatchToProps)(ListSection);

export default ListSection;