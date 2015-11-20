import React from 'react';
import { Link } from 'react-router';
import Announcements from '../announcements/index.jsx';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default React.createClass({
	displayName: 'Classroom',
	getInitialState(){
		return{
			course: {},
			lessons: [],
			isModalOpen: false
		}
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
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
		let links;
		if (location.pathname == '/classroom'){
			links = <div><Link className="linkBtn" to='edit-classroom'><button className="success"><i className="chalk-edit"></i>edit classroom</button></Link>
				<Link className="linkBtn" to='dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link></div>;
		} else {
			links = null;
		}
		let lessons = this.state.course.lessons;
		return (
			<div>
				<h1>{this.state.course.title}</h1>
				<p className="title">Drag and drop to reorganize lessons</p>
				{links}
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
						<button onClick={this.openModal} className="success">Manage classroom members</button>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<i className="chalk-close" onClick={this.closeModal}></i>
							<h2>Add Members</h2>
							<form action="">
								<label htmlFor="search">Search By Name</label>
								<input type="text" placeholder="Name" id="search"/>
								<label htmlFor="email">Add by email</label>
								<small>Separate emails by comma</small>
								<input type="text" id="email" placeholder="enter emails"/>
								<button className="success">Send Email</button>
							</form>
							<h3>Members</h3>
							<ul>
								<li>Firstname Lastname email@email.com goes here</li>
								<li>Firstname Lastname email@email.com goes here</li>
								<li>Firstname Lastname email@email.com goes here</li>
								<li>Firstname Lastname email@email.com goes here</li>
							</ul>
							<button className="primary">Save Members</button>
							<button>Cancel</button>
						</Modal>
					</aside>
					<Announcements />
				</div>
			</div>
		)
	}
});