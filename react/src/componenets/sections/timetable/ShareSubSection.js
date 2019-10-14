import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { appBoundClassNames as classNames } from '../../../common/boundClassNames';

import { mToggleLectureList, modaltimetableList } from '../../../actions/timetable/index';
import timetableShape from '../../../shapes/TimetableShape';


class ShareSubSection extends Component {
  render() {
    const { currentTimetable, mtimetableListDispatch, mToggleLectureListDispatch } = this.props;

    const timetableLectures = currentTimetable
      ? currentTimetable.lectures
      : [];
    return (
      <div className={classNames('section-content--share')}>
        <div>
          <a href={`/api/timetable/share_image?table_id=${currentTimetable ? currentTimetable.id : -1}`} download><i className={classNames('icon', 'icon--share-image')} /></a>
          <a href={`/api/timetable/share_calendar?table_id=${currentTimetable ? currentTimetable.id : -1}`} target="_blank" rel="noopener noreferrer"><i className={classNames('icon', 'icon--share-calendar')} /></a>
          <Link to={{ pathname: '/timetable/syllabus', state: { lectures: timetableLectures } }}><i className={classNames('icon', 'icon--share-calendar')} /></Link>

        </div>
        <div>
          <div onClick={mtimetableListDispatch}><i /></div>
          <div onClick={mToggleLectureListDispatch}><i /></div>
        </div>
        <div />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTimetable: state.timetable.timetable.currentTimetable,
});

const mapDispatchToProps = dispatch => ({
  mToggleLectureListDispatch: () => dispatch(mToggleLectureList()),
  mtimetableListDispatch: () => dispatch(modaltimetableList()),
});

ShareSubSection.propTypes = {
  currentTimetable: timetableShape,
  mToggleLectureListDispatch: PropTypes.func.isRequired,
  mtimetableListDispatch: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(ShareSubSection);
