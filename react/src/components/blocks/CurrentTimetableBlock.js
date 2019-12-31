import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { withTranslation } from 'react-i18next';

import { appBoundClassNames as classNames } from '../../common/boundClassNames';

import lectureShape from '../../shapes/LectureShape';
import classtimeShape from '../../shapes/ClasstimeShape';


const CurrentTimetableBlock = ({ t, lecture, classtime, cellWidth, cellHeight }) => {
  const indexOfTime = time => (time / 30 - 16);

  return (
    <div
      className={classNames('block--current-timetable', `background-color--${(lecture.course % 16) + 1}`)}
      style={{
        left: cellWidth * indexOfTime(classtime.begin) + 2 + 2,
        top: 11 + 4 + 3,
        width: cellWidth * (indexOfTime(classtime.end) - indexOfTime(classtime.begin)) - 3,
        height: cellHeight,
      }}
    >
      <div className={classNames('block--current-timetable__content')}>
        <p className={classNames('block--current-timetable__content__title')}>
          {lecture[t('js.property.title')]}
        </p>
        <p className={classNames('block--current-timetable__content__info')}>
          {lecture[t('js.property.professors_str_short')]}
        </p>
        <p className={classNames('block--current-timetable__content__info')}>
          {classtime[t('js.property.classroom')]}
        </p>
      </div>
    </div>
  );
};

CurrentTimetableBlock.propTypes = {
  lecture: lectureShape.isRequired,
  classtime: classtimeShape,
  cellWidth: PropTypes.number.isRequired,
  cellHeight: PropTypes.number.isRequired,
};

export default withTranslation()(pure(CurrentTimetableBlock));
