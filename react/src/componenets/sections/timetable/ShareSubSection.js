import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { mToggleLectureList, modaltimetableList } from '../../../actions/timetable/index';

class ShareSubSection extends Component {
  render() {
    return (
      <div id="share-buttons" className="authenticated">
        <div className="left-btn-group">
          <a className="share-button" id="image" download />
          <a className="share-button" id="calendar" target="_blank" />
          <Link className="share-button" id="image" to={{ pathname: '/timetable/syllabus', state: { lectures: this.props.currentTimetable.lectures } }} />

        </div>
        <div className="right-btn-group">
          <a className="share-button" id="show-timetable-list" onClick={this.props.mtimetableListDispatch} />
          <a className="share-button" id="show-lecture-list" onClick={this.props.mToggleLectureListDispatch} />
        </div>
        <div className="height-placeholder" />
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

ShareSubSection = connect(mapStateToProps, mapDispatchToProps)(ShareSubSection);

export default ShareSubSection;