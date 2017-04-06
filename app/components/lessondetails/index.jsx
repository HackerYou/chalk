import React from 'react';
import { Link } from 'react-router';
import userData from  '../../services/user.jsx';
import topicsData from '../../services/topic.jsx';
import lessonData from '../../services/lesson.jsx';

export default React.createClass({
	displayName: 'LessonDetails',
	getInitialState() {
		return {
			topics: [],
			showList: false
		}
	},
	componentDidMount() {
		const lessonId = this.props.details._id;
		let allTopics = [];

		lessonData.getLessonById(lessonId).then(res=>{
			const results = res.lesson.topics
			allTopics = results.map((item) => {
				return item.title;
			})
			this.setState({
				topics: allTopics
			})
		});
	},
	renderList() {
		this.setState({
			showList: true
		})

	},
	closeList() {
		this.setState({
			showList: false
		})
	},
	render() {
		let showList = (
			this.state.topics.map((item, i) => {
				return <li key={`topic-${i}`}>{item}</li>
			})
		)
		let openList = (
			<i className="fa fa-chevron-down" onClick={this.renderList}></i>
		)
		let closeList = (
			<i className="fa fa-chevron-up" onClick={this.closeList}></i>
		)
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
					{this.state.showList === false ? openList : closeList}
				</div>
				<ul>
					{this.state.showList ? showList : null}
				</ul>
				
			</li>
		)
	}
});
