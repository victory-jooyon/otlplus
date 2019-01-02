import React, { Component } from 'react';
import ReviewBlock from "./ReviewBlock";
import Scroller from "../../common/Scroller";
import CourseSimpleBlock from "./CourseSimpleBlock";


class CourseDetailSection extends Component {
    render() {
        return (
            <div className="section-content section-content--course-detail">
                <Scroller>
                    <div>
                        <div className="title">
                            데이타구조
                        </div>
                        <div className="subtitle">
                            CS206
                        </div>
                    </div>
                    <div className="attributes">
                        <div>
                            <div>
                                분류
                            </div>
                            <div>
                                전산학부, 전공필수
                            </div>
                        </div>
                        <div>
                            <div>
                                설명
                            </div>
                            <div>
                                추상적 데이타 형의 개념과 배열, 큐, 스텍, 트리, 그래프 등 데이타 구조의 여러 가지 구현방법 및 storage관리기법을 습득한다. 또한 여러 가지 탐색, 정렬 알고리즘을 배운다.
                            </div>
                        </div>
                    </div>
                    <div className="scores">
                        <div>
                            <div>
                                B
                            </div>
                            <div>
                                학점
                            </div>
                        </div>
                        <div>
                            <div>
                                B-
                            </div>
                            <div>
                                널널
                            </div>
                        </div>
                        <div>
                            <div>
                                B-
                            </div>
                            <div>
                                강의
                            </div>
                        </div>
                    </div>
                    <div className="divider"/>
                    <div className="related-courses">
                        <div>
                            <CourseSimpleBlock/>
                            <CourseSimpleBlock/>
                            <CourseSimpleBlock/>
                        </div>
                        <div>
                            >
                        </div>
                        <div>
                            <CourseSimpleBlock/>
                        </div>
                        <div>
                            >
                        </div>
                        <div>
                            <CourseSimpleBlock/>
                            <CourseSimpleBlock/>
                            <CourseSimpleBlock/>
                        </div>
                    </div>
                    <div className="divider"/>
                    <ReviewBlock/>
                    <ReviewBlock/>
                    <ReviewBlock/>
                    <ReviewBlock/>
                </Scroller>
            </div>
        );
    }
}


export default CourseDetailSection;
