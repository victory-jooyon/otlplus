import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroller from '../../Scroller';
import { clearMultipleDetail, setMultipleDetail } from '../../../actions/timetable/index';

class ExamSubSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLectures: [],
    };
  }

  examFocus(day) {
    if (this.props.lectureActiveFrom !== 'NONE') {
      return;
    }

    const lectures = [];
    const activeLectures = [];
    for (let i = 0, lecture; lecture = this.props.currentTimetable.lectures[i]; i++) {
      if (day === lecture.exam.slice(0, 3)) {
        lectures.push({
          title: lecture.title,
          info: lecture.room,
        });
        activeLectures.push(lecture);
      }
    }
    this.props.setMultipleDetailDispatch(`${day} 시험`, lectures);
    this.setState({ activeLectures: activeLectures });
  }

  clearFocus() {
    if (this.props.lectureActiveFrom !== 'MULTIPLE') {
      return;
    }

    this.props.clearMultipleDetailDispatch();
    this.setState({ activeLectures: [] });
  }

  render() {
    const renderLectureExam = (lec) => {
      let act = '';
      if (this.props.lectureActiveLecture !== null && this.props.lectureActiveLecture.id === lec.id) act = 'active';

      for (let i = 0, lecture; lecture = this.state.activeLectures[i]; i++) {
        if (lecture.id === lec.id) act = 'active';
      }
      const li = (
        <li className={`exam-elem ${act}`} data-id={lec.id}>
          <div className="exam-elem-title">
            {lec.title}
          </div>
          <div className="exam-elem-body">
            {lec.time}
          </div>
        </li>
      );
      return li;
    };

    const examTable = [[], [], [], [], []];
    const codeList = [];

    for (let i = 0, lecture; (lecture = this.props.currentTimetable.lectures[i]); i++) {
      if (lecture.examtimes.length === 0) {
        continue;
      }
      const day = lecture.examtimes[0].day;
      const title = lecture.title;
      const time = lecture.exam.slice(4);
      const id = lecture.id;
      examTable[day].push({ title: title, time: time, id: id });
      codeList.push(lecture.code);
    }

    const alec = this.props.lectureActiveLecture;
    if (alec !== null && !codeList.includes(alec.code) && alec.examtimes.length !== 0) {
      examTable[alec.examtimes[0].day].push({ title: alec.title, time: alec.exam.slice(4), id: alec.id });
    }

    return (
      <div id="exam-timetable">
        <div id="examtitle"><span>시험시간표</span></div>
        <div id="examtable">
          <Scroller>
            <div className="exam-day" data-date="mon" onMouseOver={() => this.examFocus('월요일')} onMouseOut={() => this.clearFocus()}>
              <div className="exam-day-title fixed-ko">
                <span>월</span>
              </div>
              <ul className="exam-day-body">
                {examTable[0].map(renderLectureExam)}
              </ul>
            </div>
            <div className="exam-day" data-date="tue" onMouseOver={() => this.examFocus('화요일')} onMouseOut={() => this.clearFocus()}>
              <div className="exam-day-title fixed-ko">
                <span>화</span>
              </div>
              <ul className="exam-day-body">
                {examTable[1].map(renderLectureExam)}
              </ul>
            </div>
            <div className="exam-day" data-date="wed" onMouseOver={() => this.examFocus('수요일')} onMouseOut={() => this.clearFocus()}>
              <div className="exam-day-title fixed-ko">
                <span>수</span>
              </div>
              <ul className="exam-day-body">
                {examTable[2].map(renderLectureExam)}
              </ul>
            </div>
            <div className="exam-day" data-date="thu" onMouseOver={() => this.examFocus('목요일')} onMouseOut={() => this.clearFocus()}>
              <div className="exam-day-title fixed-ko">
                <span>목</span>
              </div>
              <ul className="exam-day-body">
                {examTable[3].map(renderLectureExam)}
              </ul>
            </div>
            <div className="exam-day" data-date="fri" onMouseOver={() => this.examFocus('금요일')} onMouseOut={() => this.clearFocus()}>
              <div className="exam-day-title fixed-ko">
                <span>금</span>
              </div>
              <ul className="exam-day-body">
                {examTable[4].map(renderLectureExam)}
              </ul>
            </div>
          </Scroller>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTimetable: state.timetable.timetable.currentTimetable,
  lectureActiveLecture: state.timetable.lectureActive.lecture,
  lectureActiveFrom: state.timetable.lectureActive.from,
  lectureActiveClicked: state.timetable.lectureActive.clicked,
});

const mapDispatchToProps = dispatch => ({
  setMultipleDetailDispatch: (title, lectures) => {
    dispatch(setMultipleDetail(title, lectures));
  },
  clearMultipleDetailDispatch: () => {
    dispatch(clearMultipleDetail());
  },
});

ExamSubSection = connect(mapStateToProps, mapDispatchToProps)(ExamSubSection);

export default ExamSubSection;