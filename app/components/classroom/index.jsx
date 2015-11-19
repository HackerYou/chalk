import React from 'react';
import { Link } from 'react-router';
import Announcements from '../announcements/index.jsx';
import LessonDetails from '../lessondetails/index.jsx';

export default React.createClass({
	displayName: 'Classroom',
	getInitialState(){
		return{
			course: {},
			lessons: []
		}
	},
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			course: data.course,
			lessons: data.course.lessons
		});
	},
	renderLessons(key, index){
		return <LessonDetails key={index} index={index} details={this.state.course.lessons[index]} />
	},
	render() {
		let lessons = this.state.course.lessons;
		return (
			<div>
				<h1>{this.state.course.title}</h1>
				<p className="title">Drag and drop to reorganize lessons</p>
				<Link to='edit-classroom'><button className="success"><i className="chalk-edit"></i>edit classroom</button></Link>
				<Link to='dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<ul className="lessons">
					{(this.state.lessons).map(this.renderLessons)}
					<li className="new-lesson">
						<h3>Create new lesson</h3>
						<p>Plan lesson and choose new topics</p>
						<button className="success">Create</button>
					</li>
				</ul>
				<div className="sidebar">
					<aside>
						<h3>Members</h3>
						<p><i className="chalk-users"></i>{this.state.course.students} members of the classroom</p>
						<button className="success">Manage classroom members</button>
					</aside>
					<Announcements />
				</div>
			</div>
		)
	}
});