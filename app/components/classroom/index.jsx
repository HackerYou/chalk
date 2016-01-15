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
		document.body.className = '';
		return{
			user: {},
			course: {},
			sections: [],
			isModalOpen: false,
			topics: [],
			members: [],
			favorites: {},
			showFavs: false,
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
		if(userFavs && userFavs[courseId]) {
			star = userFavs[courseId].lessons.filter((lesson) => {
				return lesson._id === key._id
			}).length > 0 ? true : false;
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
				<div className="card lessonCard">
					<ol className="lessonSection">
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
			let students = res.course.students
			this.setState({
				members: students
			});
			console.log(this.state.members)
		});

	},
	removeUser(e){
		e.preventDefault();
		let userId = e.target.id;
		coursesData.removeUserFromCourse(this.props.params.courseId, userId).then(res=>{
			let students = res.course.students
			this.setState({
				members: students
			});
		});
	},
	renderMembers(obj, index){
		return <li key={index}>{this.state.members[index].firstName +" "+ this.state.members[index].lastName +" - "+ this.state.members[index].email} <i id={this.state.members[index]._id} onClick={this.removeUser} className="chalk-remove"></i></li>
	},
	showFavs() {
		if(!this.state.showFavs) {
			document.body.className = 'show-favs';
			document.querySelector('.lessonGroup').className ="favsGroup lessonGroup";
			this.setState({
				showFavs: true
			});
		}
		else {
			document.body.className = '';
			document.querySelector('.lessonGroup').className ="lessonGroup";
			this.setState({
				showFavs: false
			});
		}

	},
	render() {
		// let lessons = this.state.course.lessons;
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;
		let editButton = <button className="success" onClick={this.editCourse}><i className="chalk-remove"></i>edit course</button>;
		let dragAndDrop = <p className="title">Drag and drop to reorganize lessons</p>
		let displayMembers;
		if (this.state.members.length <= 0) {
			displayMembers = <p className="emptyState">No members yet!</p>
		} else {
			displayMembers = (
				<ul className="membersModalList">
					{(this.state.members).map(this.renderMembers)}
				</ul>
			)
		}
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
					{isAdmin ? dragAndDrop : null}
				</header>
				<section className="lessonsWrap clearfix">
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
								<button className="primary" onClick={this.showFavs}>{this.state.showFavs ? 'show All Lessons' : 'show Starred Lessons'}</button>
							</div>
						</section>
						{isAdmin || isInstructor ? members : null}
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<div className="modalBody card">
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
										{displayMembers}

									</div>
								</div>
								<div className="modalBtns">
									<button onClick={this.closeModal} className="primary">Save Members</button>
									<button onClick={this.closeModal}>Cancel</button>
								</div>
							</div>
						</Modal>
					</aside>
				</section>
			</div>
		)
	}
});
