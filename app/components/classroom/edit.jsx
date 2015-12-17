import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx'; 
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';

export default React.createClass({
	displayName: 'EditClassroom',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			user: {},
			course: {},
			sections: [],
			isModalOpen: false, 
			topics: [],
			members: []
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
		userData.getUser(config.getUserId()).then(res=>{
			this.setState({
				user: res.user
			})
		});
		let id = this.props.params.courseId;
		coursesData.getCourseById(id).then(res=>{
			this.setState({
				course: res.course,
				sections: res.course.sections,
				members: res.course.students
			});
		});
	},
	renderLessons(key, index){
		return <LessonDetails key={index} index={index} details={key} classroomId={this.props.params.templateId} />
	},
	renderTopics(key, index){
		return <li key={index}>{this.state.sections[index].title}</li>;
	},
	createSection(e){
		e.preventDefault();
		coursesData.addSectionToCourse(this.props.params.templateId, {
			title: this.refs.section.value
		}).then(res=>{
			this.setState({
				course: res.course,
				sections: res.course.sections
			});
		});	
	},
	createLesson(e){
		let classroomId = this.props.params.courseId;
		let sectionId = e.target.id;
		this.history.pushState(null,`lesson/${classroomId}/${sectionId}/new`);
	}, 
	renderSections(key, index){
		let isAdmin = this.state.user.admin;
		let newLesson = <li className="new-lessonRow">
							<button id={this.state.sections[index]._id} onClick={this.createLesson}className="success">Create</button>
							<p className="lessonTitle">Create new lesson</p>
						</li>;

		return <li key={index} className="lessonGroup">
				<h3>{this.state.sections[index].title}</h3>
				<div className="card">
					<ol>
						{(this.state.sections[index].lessons).map(this.renderLessons)}
						{isAdmin ? newLesson : null}
					</ol>
				</div>
				</li>
	},
	deleteTemplate(){
		coursesData.deleteCourse(this.props.params.courseId).then(res=>{
			this.history.pushState(null,`/classroom/manage`);
		});
	},
	addUser(e){
		e.preventDefault();
		let courseId = this.props.params.courseId;
		let emails = this.refs.students.value;
		coursesData.addUserToCourse(courseId, emails).then(res=>{
			let updatedCourse = res.course;
			this.setState({
				course: updatedCourse
			});
		});
	},
	renderMembers(obj, index){
		return <li key={index}>{this.state.members[index]} Lastname email@email.com goes here <i className="chalk-remove"></i></li>
	},
	render() {
		// let lessons = this.state.course.lessons;
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;

		let deleteButton = <button className="error" onClick={this.deleteTemplate}><i className="chalk-remove"></i>delete course</button>;
		
		let members = <section className="sideCard">
							<div className="card">
								<h3>Members</h3>
								<p><i className="chalk-users"></i>{this.state.members.length} members of the classroom</p>
								<button onClick={this.openModal} className="success">Manage classroom members</button>
							</div>
						</section>;

		let addSection = <li>
							<article className="lessonNew">
								<ul>
									<form className="new-lesson">
										<h3>Add new section</h3>
										<input ref="section" type="text" placeholder="Title of Topic Group"/>
										<button onClick={this.createSection}className="success">Create</button>
									</form>
								</ul>
							</article>
						</li>;

		return (
			<div className="container full">
				<Link to='/dashboard' className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<Link to={`/classroom/${this.props.params.courseId}`} className="linkBtn"><button className="success"><i className="chalk-save"></i>save changes</button></Link>
				{isAdmin ? deleteButton : null}
				<header className="topContent">
					<h1>{this.state.course.title}</h1>
					<p className="title">Drag and drop to reorganize lessons</p>
				</header>
				<section className="lessonsWrap">
					<ol className="lessonColumn">
						{(this.state.sections).map(this.renderSections)}
						{isAdmin ? addSection : null}
					</ol>
					<aside className="lessonMeta">
						<section className="sideCard">
							<h3>Course Topics</h3>
							<div className="card topicLegend">
								<ul className="topicList">
									{(this.state.sections).map(this.renderTopics)}
								</ul>
								<button className="primary">Show Starred Lessons</button>
							</div>
						</section>
						{isAdmin ||isInstructor ? members : null}
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<i className="chalk-close" onClick={this.closeModal}></i>
							<h2>Add Members</h2>
							<div className="membersModalWrap">
								<div className="memberModalColumn memberModalForm">
									<form onSubmit={this.addUser} action="">
										<label htmlFor="search">Search By Name</label>
										<input type="text" placeholder="Name" id="search"/>
										<label htmlFor="email">Add by email<br /> <small>Separate emails by comma</small></label>
										
										<input ref="students"  type="text" id="email" placeholder="enter emails"/>
										<button className="success">Send Email</button>
									</form>
								</div>
								<div className="memberModalColumn memberModalManage">
									<h3>Classroom Members</h3>
									<ul className="membersModalList">
										{(this.state.members).map(this.renderMembers)}
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