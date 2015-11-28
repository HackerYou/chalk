import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'LessonDetails',
	render() {
		return (
			<li className="lessonRow">
				<Link to="lesson" className="lessonInfo">
					<p className="lessonTitle">{this.props.details.title}</p>
					<p className="red lessonExercise">{this.props.details.exercises} Exercises</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to="lesson">view</Link> |
						<Link to="/lesson/edit">edit</Link>
					</span>
				</div>
			</li>
		)
	}
});