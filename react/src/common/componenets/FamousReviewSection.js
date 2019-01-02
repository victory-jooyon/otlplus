import React, { Component } from 'react';

import ReviewBlock from "../../dictionary/components/ReviewBlock";


class FamousReviewSection extends Component {
    render() {
        return (
            <div className="section-content section-content--widget">
                <div className="title">
                    사랑받는 전공 후기 - 전산학부
                </div>
                <ReviewBlock/>
                <ReviewBlock/>
                <ReviewBlock/>
                <div className="buttons">
                    <span className="text-button text-button--view-detail">
                        후기 더 보기
                    </span>
                </div>
            </div>
        );
    }
}


export default FamousReviewSection;
