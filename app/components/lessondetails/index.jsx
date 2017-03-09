import React from 'react';
import { Link } from 'react-router';
import userData from  '../../services/user.jsx';

export default React.createClass({
	displayName: 'LessonDetails',
	render() {
		return (
			<li className={this.props.star ? 'lessonRow fav' : 'lessonRow'}>
				<Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}`} className="lessonInfo">
					<p className="lessonTitle">{this.props.details.title}</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}`}>view</Link>
					</span>
					<i className={this.props.star ? 'chalk-star redLight' : 'chalk-star'} onClick={() => this.props.starLesson(this.props.classroomId, this.props.details._id, this.props.star)}></i>
				</div>
			</li>
		)
	}
});
