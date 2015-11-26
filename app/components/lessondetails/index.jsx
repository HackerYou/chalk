import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'LessonDetails',
	render() {
		return (
			<li className="lessonRow">
				<div className="lessonInfo">
					<p className="lessonTitle">{this.props.details.title}</p>
					<p className="red lessonExercise">{this.props.details.exercises} Exercises</p>
				</div>
				<div className="lessonMeta">
					<Link to="lesson">view</Link> |
					<Link to="/lesson/edit">edit</Link>
				</div>
			</li>
		)
	}
});