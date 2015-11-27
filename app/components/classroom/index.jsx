import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';

export default React.createClass({
	displayName: 'Classroom',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			course: {},
			lessons: [],
			isModalOpen: false, 
			topics: []
		}
	},
	openModal(){
		this.setState({isModalOpen: true});
		document.body.className = 'noScroll';
	},
	closeModal(){
		this.setState({isModalOpen: false});
		document.body.className = '';
	},
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			course: data.course,
			lessons: data.course.lessons
		});
	},
	componentDidMount(){
		let topics = Object.keys(this.state.lessons).map((key) => {
			return this.state.lessons[key].category;
		});
		let uniqueTopics = topics.reduce((a,b) => {
			if (a.indexOf(b) < 0) a.push(b);
			return a;
		}, []);

		this.setState({topics: uniqueTopics});
	},
	renderLessons(key, index){
		return <LessonDetails key={index} index={index} details={this.state.course.lessons[index]} />
	},
	renderTopics(key, index){
		return <li key={index}>{this.state.topics[index]}</li>;
	},
	render() {
		let links;
		if (location.pathname == '/classroom'){
			links = <div className="headerLinks"><Link className="linkBtn" to='classroom/edit'><button className="success"><i className="chalk-edit"></i>edit classroom</button></Link>
				<Link className="linkBtn" to='dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link></div>;
		} else {
			links = null;
		}
		let lessons = this.state.course.lessons;
		return (
			<div className="container full">
				<header className="topContent">
					{links}
					<h1>{this.state.course.title}</h1>
					<p className="title">Drag and drop to reorganize lessons</p>
				</header>
				<section className="lessonsWrap">
					<ol className="lessonColumn">
						<li className="lessonGroup">
							<h3>Topic Section Title</h3>
							<div className="card">	
								<ol>
									{(this.state.lessons).map(this.renderLessons)}
									<li className="new-lessonRow">
										<Link to="lesson/create" className="linkBtn"><button className="success">Create</button></Link>
										<p className="lessonTitle">Create new lesson</p>
									</li>
								</ol>
							</div>
						</li>
						<li>
							<article className="lessonNew">
								<ul>
									<li className="new-lesson">
										<h3>Create new lesson</h3>
										<p>Plan lesson and choose new topics</p>
										<Link to="lesson/create" className="linkBtn"><button className="success">Create</button></Link>
									</li>
								</ul>
							</article>
						</li>
					</ol>
					<aside className="lessonMeta">
						<section className="sideCard">
							<h3>Course Topics</h3>
							<div className="card topicLegend">
								<ul className="topicList">
									{this.state.topics.map(this.renderTopics)}
								</ul>
								<button className="primary">Show Starred Lessons</button>
							</div>
						</section>
						<section className="sideCard">
							<div className="card">
								<h3>Members</h3>
								<p><i className="chalk-users"></i>{this.state.course.students} members of the classroom</p>
								<button onClick={this.openModal} className="success">Manage classroom members</button>
							</div>
						</section>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<i className="chalk-close" onClick={this.closeModal}></i>
							<h2>Add Members</h2>
							<div className="membersModalWrap">
								<div className="memberModalColumn memberModalForm">
									<form action="">
										<label htmlFor="search">Search By Name</label>
										<input type="text" placeholder="Name" id="search"/>
										<label htmlFor="email">Add by email<br /> <small>Separate emails by comma</small></label>
										
										<input type="text" id="email" placeholder="enter emails"/>
										<button className="success">Send Email</button>
									</form>
								</div>
								<div className="memberModalColumn memberModalManage">
									<h3>Classroom Members</h3>
									<ul className="membersModalList">
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
										<li>Firstname Lastname email@email.com goes here <i className="chalk-remove"></i></li>
									</ul>
								</div>
							</div>
							<div className="modalBtns">
								<button className="primary">Save Members</button>
								<button onClick={this.closeModal}>Cancel</button>
							</div>
						</Modal>
					</aside>
				</section>
			</div>
		)
	}
});