import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { appBoundClassNames as classNames } from '../../../common/boundClassNames';
import axios from '../../../common/presetAxios';
import { BASE_URL } from '../../../common/constants';
import { setLectures } from '../../../actions/dictionary/courseActive';
import semesterShape from '../../../shapes/SemesterShape';
import CourseShape from '../../../shapes/CourseShape';
import lectureShape from '../../../shapes/LectureShape';
import HistoryLecturesBlock from '../../blocks/HistoryLecturesBlock';


class HistorySubSection extends Component {
  componentDidMount() {
    this._fetchLectures();
    // eslint-disable-next-line fp/no-mutation
    this.scrollRef = React.createRef();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    const { course, lectures } = this.props;

    if (!(prevProps.clicked && (prevProps.course.id === course.id))) {
      this._fetchLectures();
    }

    if ((prevProps.lectures === null) && (lectures !== null)) {
      const scrollTarget = this.scrollRef.current;
      scrollTarget.scrollLeft = scrollTarget.scrollWidth;
    }
  }


  _fetchLectures = () => {
    const { course, setLecturesDispatch } = this.props;

    axios.get(`${BASE_URL}/api/courses/${course.id}/lectures`, {
    })
      .then((response) => {
        const newProps = this.props;
        if (newProps.course.id !== course.id) {
          return;
        }
        setLecturesDispatch(response.data);
      })
      .catch((error) => {
      });
  }


  render() {
    const { t } = this.props;
    const { semesters, lectures } = this.props;

    const semesterYears = (semesters != null)
      ? semesters.map(s => s.year)
      : [];
    const lectureYears = (lectures != null)
      ? lectures.map(l => l.year)
      : [];

    const startYear = Math.min(...semesterYears, ...lectureYears);
    const endYear = Math.max(...semesterYears, ...lectureYears);
    const targetYears = [...Array(endYear - startYear + 1).keys()].map(i => (startYear + i));

    return (
      <>
        <div className={classNames('small-title')}>{t('ui.title.courseHistory')}</div>
        {
          (lectures == null)
            ? (
              <div className={classNames('history')} ref={this.scrollRef}>
                <div className={classNames('list-placeholder')}><div>{t('ui.placeholder.loading')}</div></div>
              </div>
            )
            : (
              <div className={classNames('history')} ref={this.scrollRef}>
                <table>
                  <tbody>
                    <tr>
                      <th>{t('ui.semester.spring')}</th>
                      {targetYears.map((y) => {
                        const filteredLectures = lectures.filter(l => ((l.year === y) && (l.semester === 1)));
                        if (filteredLectures.length === 0) {
                          return <td className={classNames('history__cell--unopen')} key={`${y}-1`}>{t('ui.others.notOffered')}</td>;
                        }
                        return <td key={`${y}-1`}><HistoryLecturesBlock lectures={filteredLectures} /></td>;
                      })}
                    </tr>
                    <tr>
                      <th />
                      {targetYears.map((y) => {
                        return (
                          <td className={classNames('history__cell--year-label')} key={`${y}-l`}>{y}</td>
                        );
                      })}
                    </tr>
                    <tr>
                      <th>{t('ui.semester.fall')}</th>
                      {targetYears.map((y) => {
                        const filteredLectures = lectures.filter(l => ((l.year === y) && (l.semester === 3)));
                        if (filteredLectures.length === 0) {
                          return <td className={classNames('history__cell--unopen')} key={`${y}-3`}>{t('ui.others.notOffered')}</td>;
                        }
                        return <td key={`${y}-3`}><HistoryLecturesBlock lectures={filteredLectures} /></td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  semesters: state.common.semester.semesters,
  clicked: state.dictionary.courseActive.clicked,
  course: state.dictionary.courseActive.course,
  lectures: state.dictionary.courseActive.lectures,
});

const mapDispatchToProps = dispatch => ({
  setLecturesDispatch: (lectures) => {
    dispatch(setLectures(lectures));
  },
});

HistorySubSection.propTypes = {
  semesters: PropTypes.arrayOf(semesterShape),
  clicked: PropTypes.bool.isRequired,
  course: CourseShape,
  lectures: PropTypes.arrayOf(lectureShape),
  setLecturesDispatch: PropTypes.func.isRequired,
};


export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(HistorySubSection));