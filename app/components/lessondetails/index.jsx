import React from 'react';
import { Link } from 'react-router';
import userData from  '../../services/user.jsx';

export default React.createClass({
	displayName: 'LessonDetails',
	getInitialState() {
		return {
			star: ''
		}
	},
	starLesson() {
		if(!this.state.star) {	
			userData.favoriteLesson(this.props.classroomId,this.props.details._id).then((res) => {
				this.setState({
					star: !this.state.star
				});
			});
		}
		else {
			userData.unFavoriteLesson(this.props.classroomId,this.props.details._id).then((res) => {
				this.setState({
					star: !this.state.star
				});
			});
		}	
	},
	render() {
		let editLink = <Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}/edit`}>edit</Link>;
		return (
			<li className={this.state.star || this.props.star ? 'lessonRow fav' : 'lessonRow'}>
				<Link to={`/lesson/${this.props.details._id}`} className="lessonInfo">
					<p className="lessonTitle">{this.props.details.title}</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to={`/lesson/${this.props.details._id}/${this.props.classroomId}`}>view</Link>|
						{this.props.canEdit || this.props.isTemplate ? editLink : null}
					</span>
					<i className={this.state.star || this.props.star ? 'chalk-star redLight' : 'chalk-star'} onClick={this.starLesson}></i>
				</div>
			</li>
		)
	}
});
