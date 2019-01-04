import React, { Component } from 'react';

class Review extends Component {

    render() {
        const { review } = this.props;
        return (
            <a href={`/review/result/comment/${review.id}`} target="_blank" style={{"display":"block"}}>
                <div className="review-elem">
                    <div className="review-body">
                        {review.body}
                    </div>
                    <div className="review-score-wrap">
                        <span className="review-score">추천 <strong>{review.recommend}</strong></span><span
                        className="review-score">성적 <strong>{review.score}</strong></span><span
                        className="review-score">널널 <strong>{review.load}</strong></span><span
                        className="review-score">강의 <strong>{review.speech}</strong></span>
                    </div>
                </div>
            </a>
        );
    }
}

export default Review;