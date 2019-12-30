import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { appBoundClassNames as classNames } from '../../../common/boundClassNames';
import { getOngoingSemester } from '../../../common/semesterFunctions';
import CurrentTimetableBlock from '../../blocks/CurrentTimetableBlock';
import userShape from '../../../shapes/UserShape';
import semesterShape from '../../../shapes/SemesterShape';


class MyTimetableSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cellWidth: 0,
      today: new Date(),
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
    this.interval = setInterval(() => this.setState({ today: new Date() }), 100);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    clearInterval(this.interval);
  }

  resize = () => {
    const cell = document.getElementsByClassName(classNames('hcell-left'))[0].getBoundingClientRect();
    this.setState({
      cellWidth: cell.width,
    });
  }

  render() {
    const { t } = this.props;
    const { cellWidth, today } = this.state;
    const { user, semesters } = this.props;

    const ongoingSemester = semesters
      ? getOngoingSemester(semesters)
      : undefined;
    const lectures = (user && ongoingSemester)
      ? user.taken_lectures.filter(l => (l.year === ongoingSemester.year && l.semester === ongoingSemester.semester))
      : [];
    const day = today.getDay();
    const hours = today.getHours();
    const minutes = today.getMinutes();

    return (
      <div className={classNames('section-content', 'section-content--widget', 'section-content--current-timetable')}>
        <div
          style={{
            left: -((hours + (minutes / 60) - 8) * cellWidth * 2 + 2 - 2) + 58,
          }}
        >
          <div className={classNames('section-content--current-timetable__table')}>
            <div>
              {
                [...Array((24 - 8) * 2).keys()].map((i) => {
                  if (i % 2 === 0) {
                    const hour = (i / 2) + 8;
                    const hourValue = ((hour - 1) % 12) + 1;
                    if (hour % 6 === 0) {
                      return <div><strong>{hourValue}</strong></div>;
                    }
                    return <div><span>{hourValue}</span></div>;
                  }
                  if (i === (24 - 8) * 2 - 1) {
                    return <div><strong>12</strong></div>;
                  }
                  return <div />;
                })
              }
            </div>
            <div>
              {
                [...Array((24 - 8) * 2).keys()].map((i) => {
                  if (i % 2 === 0) {
                    const hour = (i / 2) + 8;
                    if (hour % 6 === 0) {
                      return <div className={classNames('hcell-left', 'hcell-bold')} />;
                    }
                    return <div className={classNames('hcell-left')} />;
                  }
                  if (i === (24 - 8) * 2 - 1) {
                    return <div className={classNames('hcell-right', 'hcell-last')} />;
                  }
                  return <div className={classNames('hcell-right')} />;
                })
              }
            </div>
          </div>
          {
            lectures.map(lecture => (
              lecture.classtimes
                .filter(classtime => (classtime.day === day - 1))
                .map(classtime => (
                  <CurrentTimetableBlock
                    key={`${lecture.id}:${classtime.day}:${classtime.begin}`}
                    lecture={lecture}
                    classtime={classtime}
                    cellWidth={cellWidth}
                    cellHeight={51}
                  />
                ))
            ))
          }
          <div
            className={classNames('section-content--current-timetable__bar')}
            style={{
              top: 11 + 4 - 2,
              left: (hours + (minutes / 60) - 8) * cellWidth * 2 + 2 - 2,
            }}
          >
            <div />
            <div />
          </div>
        </div>
        <div className={classNames('buttons')}>
          <Link to="/timetable" className={classNames('text-button')}>
            {t('ui.button.seeDetails')}
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.user.user,
  semesters: state.common.semester.semesters
});

const mapDispatchToProps = dispatch => ({
});

MyTimetableSection.propTypes = {
  user: userShape,
  semesters: PropTypes.arrayOf(semesterShape),
};


export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MyTimetableSection));