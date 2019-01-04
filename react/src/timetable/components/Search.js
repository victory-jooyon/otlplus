import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from '../../common/presetAxios';
import { closeSearch, setListLectures } from "../actions";
import SearchFilter from './SearchFilter'
import $ from 'jquery';
import '../../static/css/font-awesome.min.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: "",
            autoComplete:"",
            type: new Set(["ALL"]),
            department: new Set(["ALL"]),
            grade:new Set(["ALL"]),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(!nextProps.open) {
            return {
                inputVal: "",
                type:new Set(["ALL"]),
                department:new Set(["ALL"]),
                grade:new Set(["ALL"]),
            };//When Close the Search, initialize the state
        }
        return null;
    }

    hideSearch() {
        this.props.closeSearchDispatch();
    }

    searchStart() {
        const {type, department, grade, inputVal} = this.state;
        if(type.size === 1 && department.size === 1 && grade.size === 1 && inputVal.length ===0 ){
            if(type.has("ALL") && department.has("ALL") && grade.has("ALL")){
                alert("검색 조건을 선택해 주세요");
                return;
            }
        }
        this.props.closeSearchDispatch();

        axios.post("/api/timetable/search", {
            year: this.props.year,
            semester: this.props.semester,
            // Change below later
            department: ["CS"],
            type: ["ALL"],
            grade: ["ALL"],
        })
        .then((response) => {
            let lectures = response.data.courses;
            this.props.setListLecturesDispatch("search", lectures);
        })
        .catch((response) => {console.log(response);});
    }

    clickCircle(filter_) {
        const filterName = filter_.name;
        const value = filter_.value;
        const isChecked = filter_.isChecked;
        if(isChecked){
            this.setState((prevState)=>{
                let filter = prevState[filterName];
                if(value === "ALL" )
                    filter.clear();
                filter.add(value);
                return prevState;
            });
        }else{
            this.setState((prevState)=>{
                let filter = prevState[filterName];
                filter.delete(value);
                return prevState;
            });
        }
    }

    handleInput(e) {
        this.setState({
            inputVal: e.target.value,
            autoComplete: e.target.value ? "aa" : "",
        });
    }

    autocompleteApply() {
        this.setState((prevState)=>{
            return {
                inputVal:prevState.inputVal + prevState.autoComplete,
                autoComplete:""
            };
        });
    }

    autocompleteCLear(){
        this.setState({
            inputVal:"",
            autoComplete:"",
        })
    }

    keyPress(e){
        if (e.keyCode === 9) {
            this.autocompleteApply();
            e.stopPropagation();//Prevent move focus
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
        }
        else if (e.keyCode === 13)  {
            this.searchStart();
        }
    }

    render() {
        if (! this.props.open) {
            return <div/>;
        }
        else {
            const { inputVal, autoComplete } = this.state;
            return (
                <div className="search-extend">
                    <div className="search-form-wrap" >
                        <form method="post">
                            <div className="search-keyword" >
                                <i className="search-keyword-icon"/>
                                <div className="search-keyword-text-wrap" >
                                    <input className="search-keyword-text" type="text" name="keyword"
                                           autoComplete="off" placeholder="검색" value={inputVal} onKeyDown={(e)=>{this.keyPress(e)}} onChange={(e)=>this.handleInput(e)}/>
                                    <div className="search-keyword-autocomplete">
                                        <span className="search-keyword-autocomplete-space">{inputVal}</span>
                                        <span className="search-keyword-autocomplete-body">{autoComplete}</span>
                                    </div>
                                </div>
                            </div>
                            <SearchFilter
                                clickCircle = {this.clickCircle.bind(this)}
                                inputName = 'type'
                                titleName = '구분'
                            />
                            <SearchFilter
                                clickCircle = {this.clickCircle.bind(this)}
                                inputName = 'department'
                                titleName = '학과'
                            />
                            <SearchFilter
                                clickCircle = {this.clickCircle.bind(this)}
                                inputName = 'grade'
                                titleName = '학년'
                            />
                            <div className="search-filter search-filter-time">
                                <label
                                    className="search-filter-title fixed-ko">시간</label>
                                <div className="search-filter-elem">
                                    <label>
                                        시간표에서 드래그
                                    </label>
                                </div>
                                <input id="search-filter-time-day" name="day" type="text"/>
                                <input id="search-filter-time-begin" name="begin" type="text"/>
                                <input id="search-filter-time-end" name="end" type="text"/>
                            </div>
                            <div id="search-button-group">
                                <span type="button" id="search-button" onClick={()=>this.searchStart()}>검색</span>
                                <span type="button" id="search-cancel" onClick={()=>this.hideSearch()}>취소</span>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

let mapStateToProps = (state) => {
    return {
        open : state.timetable.search.open,
        year : state.timetable.semester.year,
        semester : state.timetable.semester.semester,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        closeSearchDispatch : () => {
            dispatch(closeSearch());
        },
        setListLecturesDispatch : (code, lectures) => {
            dispatch(setListLectures(code, lectures));
        }
    }
};

Search = connect(mapStateToProps, mapDispatchToProps)(Search);

export default Search;