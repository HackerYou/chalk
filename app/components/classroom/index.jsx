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
	displayName: 'Classroom',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			user: {},
			course: {},
			sections: [],
			isModalOpen: false, 
<<<<<<< HEAD
			topics: [],
			members: [],
			originalCourse: {}
=======
			topics: [], 
			members: []
>>>>>>> 677cf0c24579bf1a0ff6246991ae044af55f9fd7
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
		//Loop favorites
		let userFavs = this.state.user.favorites;
		let courseId = this.props.params.courseId;
		let star = false;
		if(userFavs[courseId]) {
			star = userFavs[courseId].lessons.filter((lesson) => {
				return lesson._id === key._id
			}).length > 0 ? true : false; 
			console.log(star);
		}
		return <LessonDetails key={index} index={index} details={key} classroomId={this.props.params.courseId} star={star} canEdit={this.state.user.admin || this.state.user.instructor} />
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
		return (<li key={index} className="lessonGroup">
				<h3>{this.state.sections[index].title}</h3>
				<div className="card">
					<ol>
						{(this.state.sections[index].lessons).map(this.renderLessons)}
					</ol>
				</div>
			</li>);
	},
	editCourse(e){
		e.preventDefault();
		this.history.pushState(null, `/classroom/${this.props.params.courseId}/edit`);
	},
	renderMembers(obj, index){
		return <li key={index}>{this.state.members[index].firstName +" "+ this.state.members[index].lastName +" - "+ this.state.members[index].email} <i className="chalk-remove"></i></li>
	},
	addUser(e){
		e.preventDefault();
		let users = this.refs.students.value;
		coursesData.addUserToCourse(this.props.params.courseId, users).then(res=>{
			console.log(res);
			let students = res.course.students
			this.setState({
				members: students
			});
		});
	},
	renderMembers(obj, index){
		return <li key={index}>{this.state.members[index]} Lastname email@email.com goes here <i className="chalk-remove"></i></li>
	},
	showFavs() {

		let orgCourse = this.state.course;
		let favs = this.state.user.favorites[orgCourse._id].lessons;

		let fav = this.state.course.sections.filter((section) => {
			section.lessons = section.lessons.filter((lesson) => {
				let newLesson = favs.filter((favLesson) => {
					return lesson._id === favLesson._id
				});
				if(newLesson.length > 0) {
					return newLesson;
				}
			});
			return section;
		});
		this.setState({
			course: fav,
			originalCourse: this.state.course
		});

	},
	render() {
		// let lessons = this.state.course.lessons;
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;
		let editButton = <button className="success" onClick={this.editCourse}><i className="chalk-remove"></i>edit course</button>;
		
		let members = (<section className="sideCard">
						<div className="card">
							<h3>Members</h3>
							<p><i className="chalk-users"></i>{this.state.members.length} members of the classroom</p>
							<button onClick={this.openModal} className="success">Manage classroom members</button>
						</div>
					</section>);
		return (
			<div className="container full">
				<Link to='/dashboard' className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				{isAdmin ? editButton : null}
				<header className="topContent">
					<h1>{this.state.course.title}</h1>
					<p className="title">Drag and drop to reorganize lessons</p>
				</header>
				<section className="lessonsWrap">
					<ol className="lessonColumn">
						{(this.state.sections).map(this.renderSections)}
					</ol>
					<aside className="lessonMeta">
						<section className="sideCard">
							<h3>Course Topics</h3>
							<div className="card topicLegend">
								<ul className="topicList">
									{(this.state.sections).map(this.renderTopics)}
								</ul>
								<button className="primary" onClick={this.showFavs}>Show Starred Lessons</button>
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
								<button onClick={this.closeModal} className="primary">Save Members</button>
								<button onClick={this.closeModal}>Cancel</button>
							</div>
						</Modal>
					</aside>
				</section>
			</div>
		)
	}
});