import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';

import { appBoundClassNames as classNames } from '../../../common/boundClassNames';
import axios from '../../../common/presetAxios';

import { inTimetable, inCart, performAddToTable, performDeleteFromTable, performAddToCart, performDeleteFromCart } from '../../../common/lectureFunctions';
import { BASE_URL } from '../../../common/constants';
import Scroller from '../../Scroller';
import ReviewSimpleBlock from '../../blocks/ReviewSimpleBlock';
import { NONE, LIST, TABLE, MULTIPLE } from '../../../reducers/timetable/lectureActive';
import { clearLectureActive } from '../../../actions/timetable/lectureActive';
import { addLectureToCart, deleteLectureFromCart } from '../../../actions/timetable/list';
import { addLectureToTimetable, removeLectureFromTimetable } from '../../../actions/timetable/timetable';
import lectureShape from '../../../shapes/LectureShape';
import timetableShape from '../../../shapes/TimetableShape';


class LectureDetailSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUnfix: false,
      showCloseDict: false,
      reviewsLecture: null,
      reviews: null,
    };
    // eslint-disable-next-line fp/no-mutation
    this.openDictRef = React.createRef();
    // eslint-disable-next-line fp/no-mutation
    this.attributesRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const showUnfix = (nextProps.from === 'LIST' || nextProps.from === 'TABLE') && nextProps.clicked;
    const reviews = (!nextProps.lecture || !prevState.reviewsLecture || nextProps.lecture.id !== prevState.reviewsLecture.id) ? null : prevState.reviews;
    return { showUnfix: showUnfix, reviews: reviews };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { clicked, lecture } = this.props;
    if (prevProps.clicked && clicked) {
      if (prevProps.lecture.id !== lecture.id) {
        this.openDictPreview();
      }
    }
    else if (prevProps.clicked && !clicked) {
      if (lecture) {
        this.closeDictPreview();
      }
    }
    else if (!prevProps.clicked && clicked) {
      this.openDictPreview();
    }
  }

  openDictPreview = () => {
    const { reviews } = this.state;
    const { lecture } = this.props;

    $(`.${classNames('section-content--lecture-detail')} .nano`).nanoScroller({ scrollTop: $(this.openDictRef.current).position().top - $(this.attributesRef.current).position().top + 1 });

    if (reviews === null) {
      axios.get(`${BASE_URL}/api/lectures/${lecture.id}/related-comments`, {
      })
        .then((response) => {
          const newProps = this.props;
          if (newProps.lecture.id !== lecture.id) {
            return;
          }
          this.setState({ reviewsLecture: lecture, reviews: response.data });
        })
        .catch((response) => {
        });
    }
  };

  closeDictPreview = () => {
    $(`.${classNames('section-content--lecture-detail')} .nano`).nanoScroller({ scrollTop: 0 });
  };

  unfix = () => {
    const { clearLectureActiveDispatch } = this.props;
    clearLectureActiveDispatch();
  };

  addToTable = (event) => {
    const { lecture, currentTimetable, addLectureToTimetableDispatch } = this.props;

    event.stopPropagation();
    performAddToTable(this, lecture, currentTimetable, addLectureToTimetableDispatch);
  }

  deleteFromTable = (event) => {
    const { lecture, currentTimetable, removeLectureFromTimetableDispatch } = this.props;

    event.stopPropagation();
    performDeleteFromTable(this, lecture, currentTimetable, removeLectureFromTimetableDispatch);
  }

  addToCart = (event) => {
    const { lecture, year, semester, addLectureToCartDispatch } = this.props;

    event.stopPropagation();
    performAddToCart(this, lecture, year, semester, addLectureToCartDispatch);
  }

  deleteFromCart = (event) => {
    const { lecture, year, semester, deleteLectureFromCartDispatch } = this.props;

    event.stopPropagation();
    performDeleteFromCart(this, lecture, year, semester, deleteLectureFromCartDispatch);
  }

  render() {
    const { t } = this.props;
    const { showUnfix, showCloseDict } = this.state;
    const { from, lecture, title, multipleDetail, currentTimetable, cart } = this.props;

    if (from === LIST || from === TABLE) {
      const { reviews } = this.state;
      const mapreview = (review, index) => (
        <ReviewSimpleBlock key={`review_${index}`} review={review} />
      );
      const reviewsDom = (reviews == null)
        ? <div className={classNames('section-content--lecture-detail--list-area', 'list-placeholder')}><div>{t('ui.placeholder.loading')}</div></div>
        : (reviews.length
          ? <div className={classNames('section-content--lecture-detail--list-area')}>{reviews.map(mapreview)}</div>
          : <div className={classNames('section-content--lecture-detail--list-area', 'list-placeholder')}><div>{t('ui.placeholder.noResults')}</div></div>);
      return (
        <div className={classNames('section-content', 'section-content--lecture-detail', 'section-content--flex')}>
          <div className={classNames('close-button')} onClick={this.unfix}>닫기</div>
          <div className={classNames('title')}>
            {lecture.title}
          </div>
          <div className={classNames('subtitle')}>
            {lecture.old_code}
            {lecture.class_no.length ? ` (${lecture.class_no})` : ''}
          </div>
          <div className={classNames('buttons')}>
            <span onClick={this.unfix} className={classNames('text-button', (showUnfix ? '' : classNames('text-button--disabled')))}>{t('ui.button.unfix')}</span>
            <a className={classNames('text-button', 'text-button--right')} href={`https://cais.kaist.ac.kr/syllabusInfo?year=${lecture.year}&term=${lecture.semester}&subject_no=${lecture.code}&lecture_class=${lecture.class_no}&dept_id=${lecture.department}`} target="_blank" rel="noopener noreferrer">
              {t('ui.button.syllabus')}
            </a>
            <Link className={classNames('text-button', 'text-button--right')} to={{ pathname: '/dictionary', state: { startCourseId: lecture.course } }}>
              {t('ui.button.dictionary')}
            </Link>
          </div>
          <div className={classNames('fixed__conditional-part', (showCloseDict ? '' : 'fixed__conditional-part--hidden'))}>
            <div className={classNames('small-title')} onClick={this.closeDictPreview}>
              <span>{t('ui.title.reviews')}</span>
              <i className={classNames('icon', 'icon--lecture-uparrow')} />
            </div>
          </div>
          <Scroller
            onScroll={
              () => {
                if ($(this.openDictRef.current).position().top <= 0) {
                  this.setState({ showCloseDict: true });
                }
                else {
                  this.setState({ showCloseDict: false });
                }
              }
            }
          >
            <div ref={this.attributesRef}>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.type')}</span>
                <span>{lecture.type}</span>
              </div>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.department')}</span>
                <span>{lecture.department_name}</span>
              </div>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.professor')}</span>
                <span>{lecture.professor.map(p => p.name).join(', ')}</span>
              </div>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.classroom')}</span>
                <span>{lecture.classroom}</span>
              </div>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.limit')}</span>
                <span>{lecture.limit}</span>
              </div>
              <div className={classNames('attribute')}>
                <span className={classNames(t('jsx.className.fixedByLang'))}>{t('ui.attribute.exam')}</span>
                <span>{lecture.exam}</span>
              </div>
            </div>
            <div className={classNames('scores')}>
              <div>
                {
                  lecture.is_english
                    ? <div>Eng</div>
                    : <div className={(classNames('scores__score-text--korean'))}>한</div>
                }
                <div>{t('ui.score.language')}</div>
              </div>
              <div>
                {
                  lecture.credit > 0
                    ? <div>{lecture.credit}</div>
                    : <div>{lecture.credit_au}</div>
                }
                {
                  lecture.credit > 0
                    ? <div>{t('ui.score.credit')}</div>
                    : <div>AU</div>
                }
              </div>
              <div>
                <div>
                  {
                    lecture.limit === 0
                      ? '0.0:1'
                      : `${(lecture.num_people / lecture.limit).toFixed(1).toString()}:1`
                  }
                </div>
                <div>{t('ui.score.competition')}</div>
              </div>
            </div>
            <div className={classNames('scores')}>
              <div>
                <div>{lecture.grade_letter}</div>
                <div>{t('ui.score.grade')}</div>
              </div>
              <div>
                <div>{lecture.load_letter}</div>
                <div>{t('ui.score.load')}</div>
              </div>
              <div>
                <div>{lecture.speech_letter}</div>
                <div>{t('ui.score.speech')}</div>
              </div>
            </div>
            <div onClick={this.openDictPreview} className={classNames('small-title')} ref={this.openDictRef}>
              <span>{t('ui.title.reviews')}</span>
              <i className={classNames('icon', 'icon--lecture-downarrow')} />
            </div>
            {reviewsDom}
          </Scroller>
          <div className={classNames('divider', 'mobile-unhidden')} />
          <div className={classNames('section-content--lecture-detail__mobile-buttons', 'mobile-unhidden')}>
            {
              !inCart(lecture, cart)
                ? <span onClick={this.addToCart}>장바구니에 추가</span>
                : <span onClick={this.deleteFromCart}>장바구니에서 제거</span>
            }
            {
              !inTimetable(lecture, currentTimetable)
                ? <span onClick={this.addToTable}>시간표에 추가</span>
                : <span onClick={this.deleteFromTable}>시간표에서 제거</span>
            }
          </div>
        </div>
      );
    }
    if (from === MULTIPLE) {
      return (
        <div className={classNames('section-content', 'section-content--lecture-detail', 'section-content--flex')}>
          <div className={classNames('title')}>
            {title}
          </div>
          <div className={classNames('subtitle')}>
            {t('ui.others.multipleDetailCount', { count: multipleDetail.length })}
          </div>
          <div className={classNames('buttons')}>
            <span className={classNames('text-button', 'text-button--disabled')}>{t('ui.button.unfix')}</span>
            <span className={classNames('text-button', 'text-button--right', 'text-button--disabled')}>{t('ui.button.syllabus')}</span>
            <span className={classNames('text-button', 'text-button--right', 'text-button--disabled')}>{t('ui.button.dictionary')}</span>
          </div>
          <div>
            {multipleDetail.map((detail, index) => (
              <div className={classNames('attribute')} key={detail.id}>
                <span>
                  {detail.title}
                </span>
                <span>
                  {detail.info}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className={classNames('section-content', 'section-content--lecture-detail', 'section-content--flex')}>
        <div className={classNames('otlplus-placeholder')}>
          <div>
            OTL PLUS
          </div>
          <div>
            <Link to="/credits/">{t('ui.menu.credit')}</Link>
            &nbsp;|&nbsp;
            <Link to="/licenses/">{t('ui.menu.licences')}</Link>
          </div>
          <div>
            <a href="mailto:otlplus@sparcs.org">otlplus@sparcs.org</a>
          </div>
          <div>
            © 2017,&nbsp;
            <a href="http://sparcs.kaist.ac.kr">SPARCS</a>
            &nbsp;OTL Team
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  from: state.timetable.lectureActive.from,
  lecture: state.timetable.lectureActive.lecture,
  title: state.timetable.lectureActive.title,
  multipleDetail: state.timetable.lectureActive.multipleDetail,
  clicked: state.timetable.lectureActive.clicked,
  currentTimetable: state.timetable.timetable.currentTimetable,
  cart: state.timetable.list.cart,
  year: state.timetable.semester.year,
  semester: state.timetable.semester.semester,
});

const mapDispatchToProps = dispatch => ({
  clearLectureActiveDispatch: () => {
    dispatch(clearLectureActive());
  },
  addLectureToTimetableDispatch: (lecture) => {
    dispatch(addLectureToTimetable(lecture));
  },
  removeLectureFromTimetableDispatch: (lecture) => {
    dispatch(removeLectureFromTimetable(lecture));
  },
  addLectureToCartDispatch: (lecture) => {
    dispatch(addLectureToCart(lecture));
  },
  deleteLectureFromCartDispatch: (lecture) => {
    dispatch(deleteLectureFromCart(lecture));
  },
});

LectureDetailSection.propTypes = {
  from: PropTypes.oneOf([NONE, LIST, TABLE, MULTIPLE]).isRequired,
  lecture: lectureShape,
  title: PropTypes.string.isRequired,
  multipleDetail: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
    }),
  ),
  clicked: PropTypes.bool.isRequired,
  currentTimetable: timetableShape,
  cart: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.arrayOf(lectureShape)),
  }).isRequired,
  year: PropTypes.number,
  semester: PropTypes.number,
  clearLectureActiveDispatch: PropTypes.func.isRequired,
  addLectureToTimetableDispatch: PropTypes.func.isRequired,
  removeLectureFromTimetableDispatch: PropTypes.func.isRequired,
  addLectureToCartDispatch: PropTypes.func.isRequired,
  deleteLectureFromCartDispatch: PropTypes.func.isRequired,
};


export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(LectureDetailSection));
