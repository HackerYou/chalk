import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'LessonDetails',
	render() {
		return (
			<li className="lessonRow">
				<Link to={`/lesson/${this.props.details._id}`} className="lessonInfo">
					<p className="lessonTitle">{this.props.details.title}</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}`}>view</Link> |
						<Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}/edit`}>edit</Link>
					</span>
				</div>
			</li>
		)
	}
});
