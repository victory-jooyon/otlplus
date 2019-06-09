import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimetableBlock from '../../blocks/TimetableBlock';
import { dragSearch, setIsDragging, updateCellSize } from '../../../actions/timetable/index';
import { NONE, LIST } from '../../../reducers/timetable/lectureActive';


class TimetableSubSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstBlock: null,
      secondBlock: null,
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lectureActive.from === LIST && !nextProps.lectureActive.clicked) {
      console.log('list');
    }
    else if (nextProps.lectureActive.from === NONE) {
      console.log('none');
    }
    return null;
  }

  componentDidMount() {
    this.resize();
    this.boundResize = this.resize.bind(this);
    window.addEventListener('resize', this.boundResize);
  }

  componentDidUpdate() {
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.boundResize);
  }

  resize = () => {
    const cell = document.getElementsByClassName('cell1')[0].getBoundingClientRect();
    this.props.updateCellSizeDispatch(cell.width, cell.height);
  }

  indexOfDay = (day) => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days.indexOf(day);
  }

  // '800':0, '830':1, ..., '2330':31
  indexOfTime = (timeStr) => {
    const time = parseInt(timeStr, 10);
    const divide = time < 800 ? 60 : 100;
    const hour = Math.floor(time / divide) - 8;
    const min = time % divide;
    return hour * 2 + min / 30;
  }

  dragStart(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ firstBlock: e.target });
    this.props.setIsDraggingDispatch(true);
    document.getElementById('drag-cell').classList.remove('none');
  }

  // check is drag contain class time
  _isOccupied(dragEnd) {
    const dragDay = this.indexOfDay(this.state.firstBlock.getAttribute('data-day'));
    const dragStart = this.indexOfTime(this.state.firstBlock.getAttribute('data-time'));

    for (let i = 0, lecture; (lecture = this.props.currentTimetable.lectures[i]); i++) {
      for (let j = 0, classtime; (classtime = lecture.classtimes[j]); j++) {
        if (classtime.day !== dragDay) continue;
        const classStart = this.indexOfTime(classtime.begin);
        const classEnd = this.indexOfTime(classtime.end);
        if ((dragStart <= classStart && classStart <= dragEnd) || (dragStart >= classEnd && classEnd > dragEnd)) {
          return true;
        }
      }
    }
    return false;
  }

  _highlight(e) {
    const second = e.target;
    const left = this.state.firstBlock.offsetLeft - document.getElementById('timetable-wrap').offsetLeft - 1;
    const width = this.state.firstBlock.offsetWidth + 2;
    const top = Math.min(this.state.firstBlock.offsetTop, second.offsetTop) - document.getElementById('timetable-wrap').offsetTop + 2;
    const height = Math.abs(this.state.firstBlock.offsetTop - second.offsetTop) + this.state.firstBlock.offsetHeight - 2;
    this.setState({
      secondBlock: second,
      height: height,
      width: width,
      left: left,
      top: top,
    });
  }

  dragMove(e) {
    if (!this.props.isDragging) return;
    const startIndex = this.indexOfTime(this.state.firstBlock.getAttribute('data-time'));
    const endIndex = this.indexOfTime(e.target.getAttribute('data-time'));
    const incr = startIndex < endIndex ? 1 : -1;
    for (let i = startIndex + incr; i !== endIndex + incr; i += incr) {
      if (this._isOccupied(i)) {
        this.props.setIsDraggingDispatch(false);
        return;
      }
    }
    this._highlight(e);
  }

  dragEnd(e) {
    if (this.props.isDragging) this.props.setIsDraggingDispatch(false);
    document.getElementById('drag-cell').classList.add('none');

    const startDay = this.indexOfDay(this.state.firstBlock.getAttribute('data-day'));
    const startIndex = this.indexOfTime(this.state.firstBlock.getAttribute('data-time'));
    const endIndex = this.indexOfTime(e.target.getAttribute('data-time'));
    if (startIndex === endIndex) return;
    this.props.dragSearchDispatch(startDay, startIndex, endIndex);
    this.setState({ firstBlock: null, secondBlock: null, height: 0 });
  }

  render() {
    const lectureBlocks = [];
    for (let i = 0, lecture; (lecture = this.props.currentTimetable.lectures[i]); i++) {
      for (let j = 0, classtime; (classtime = lecture.classtimes[j]); j++) {
        lectureBlocks.push(
          <TimetableBlock
            key={`${lecture.id}:${j}`}
            lecture={lecture}
            classtime={classtime}
          />,
        );
      }
    }

    const dragDiv = (day, ko) => {
      const timeblock = [];
      timeblock.push(<div className="chead">{ko}</div>);
      for (let i = 800; i <= 2350; i += 50) {
        if (i === 1200) {
          timeblock.push(
            <div
              className="cell-bold cell1 half table-drag"
              data-day={day}
              data-time="1200"
              onMouseDown={e => this.dragStart(e)}
              onMouseMove={e => this.dragMove(e)}
              onMouseUp={e => this.dragEnd(e)}
            />,
          );
        }
        else if (i === 1800) {
          timeblock.push(
            <div
              className="cell-bold cell1 half table-drag"
              data-day={day}
              data-time="1800"
              onMouseDown={e => this.dragStart(e)}
              onMouseMove={e => this.dragMove(e)}
              onMouseUp={e => this.dragEnd(e)}
            />,
          );
        }
        else if (i === 2350) {
          timeblock.push(
            <div
              className="cell2 half cell-last table-drag"
              data-day={day}
              data-time="2330"
              onMouseDown={e => this.dragStart(e)}
              onMouseMove={e => this.dragMove(e)}
              onMouseUp={e => this.dragEnd(e)}
            />,
          );
        }
        else if (i % 100 === 0) {
          timeblock.push(
            <div
              className="cell1 half table-drag"
              data-day={day}
              data-time={i.toString()}
              onMouseDown={e => this.dragStart(e)}
              onMouseMove={e => this.dragMove(e)}
              onMouseUp={e => this.dragEnd(e)}
            />,
          );
        }
        else {
          timeblock.push(
            <div
              className="cell2 half table-drag"
              data-day={day}
              data-time={(i - 20).toString()}
              onMouseDown={e => this.dragStart(e)}
              onMouseMove={e => this.dragMove(e)}
              onMouseUp={e => this.dragEnd(e)}
            />,
          );
        }
      }
      return timeblock;
    };

    return (
      <div id="timetable-wrap">
        <div id="timetable-contents">
          <div id="rowheaders">
            <div className="rhead rhead-chead"><span className="rheadtext">8</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">9</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">10</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">11</span></div>
            <div className="rhead" />
            <div className="rhead rhead-bold"><span className="rheadtext">12</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">1</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">2</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">3</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">4</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">5</span></div>
            <div className="rhead" />
            <div className="rhead rhead-bold"><span className="rheadtext">6</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">7</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">8</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">9</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">10</span></div>
            <div className="rhead" />
            <div className="rhead"><span className="rheadtext">11</span></div>
            <div className="rhead" />
            <div className="rhead rhead-bold rhead-last"><span className="rheadtext">12</span></div>
          </div>
          <div className="day">
            {dragDiv('mon', '월요일')}
          </div>
          <div className="day">
            {dragDiv('tue', '화요일')}
          </div>
          <div className="day">
            {dragDiv('wed', '수요일')}
          </div>
          <div className="day">
            {dragDiv('thu', '목요일')}
          </div>
          <div className="day">
            {dragDiv('fri', '금요일')}
          </div>
        </div>
        <div id="drag-cell" className="none" style={{ left: this.state.left, width: this.state.width, top: this.state.top, height: this.state.height }} />
        {lectureBlocks}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTimetable: state.timetable.timetable.currentTimetable,
  lectureActive: state.timetable.lectureActive,
  isDragging: state.timetable.timetable.isDragging,
});

const mapDispatchToProps = dispatch => ({
  updateCellSizeDispatch: (width, height) => {
    dispatch(updateCellSize(width, height));
  },
  dragSearchDispatch: (day, start, end) => {
    dispatch(dragSearch(day, start, end));
  },
  setIsDraggingDispatch: (isDragging) => {
    dispatch(setIsDragging(isDragging));
  },
});

TimetableSubSection = connect(mapStateToProps, mapDispatchToProps)(TimetableSubSection);

export default TimetableSubSection;