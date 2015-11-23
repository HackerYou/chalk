import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'LessonDetails',
	render() {
		return (
			<li className="card">
				<h3>{this.props.details.title}</h3>
				<p>{this.props.details.description}</p>
				<p className="red">{this.props.details.exercises} Exercises</p>
				<Link className="linkBtn"to="lesson"><button className="primary">View Lesson</button></Link>
			</li>
		)
	}
});