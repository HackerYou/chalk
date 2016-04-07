import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';
import Sticky from '../../services/sticky.js';
import Loading from '../loading/index.jsx';

export default React.createClass({
	displayName: 'Classroom',
	mixins: [AuthMixin,History],
	originalMembers: [],
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
			pageHeight: 0,
			loading: true
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
			this.originalMembers = res.course.students;

			this.setState({
				course: res.course,
				sections: res.course.sections,
				members: res.course.students,
				loading: false
			});
			let body = document.body,
				html = document.documentElement;
			let docheight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) - 738;
			this.setState({
				pageHeight: docheight
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
		let link = '#' + this.state.sections[index].title.replace(/ /g, "_").toLowerCase();
		return <li key={index}><a href={link}>{this.state.sections[index].title}</a></li>;
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
		this.history.pushState(null,`/lesson/${classroomId}/${sectionId}/new`);
	},
	renderSections(key, index){
		let title = this.state.sections[index].title.replace(/ /g, "_").toLowerCase();
		return (<li key={index} className="lessonGroup" id={title}>
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
			document.body.classList.add('show-favs');
			let els = document.querySelectorAll('.lessonGroup .fav');

			for(let i = 0; i < els.length; i++) {
				els[i].parentElement.parentElement.parentElement.classList.add('favsGroup');
			}
			this.setState({
				showFavs: true
			});
		}
		else {
			document.body.classList.remove('show-favs');
			this.setState({
				showFavs: false
			});
		}

	},
	searchUsers(e){
		e.preventDefault();
		let searchQuery = this.refs.searchQuery.value;
		let allMembers = this.originalMembers;

		if (searchQuery === ''){
			this.setState({
				members: allMembers
			});
		} else {
			searchQuery = new RegExp(this.refs.searchQuery.value,'ig');
			let matchedMembers = allMembers.filter((members) => {
				if (members.firstName !== undefined){
					return members.firstName.match(searchQuery)
				}
			});	
			this.setState({
				members: matchedMembers
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
		let favList = document.querySelectorAll('.lessonGroup .fav');
		let displayFavButton= <button className="primary" onClick={this.showFavs}>{this.state.showFavs ? 'show all lessons' : 'show starred lessons'}</button>
		if (this.state.members.length <= 0) {
			displayMembers = <p className="emptyState">No members yet!</p>
		} else {
			displayMembers = (
				<ul className="membersModalList">
					{(this.state.members).map(this.renderMembers)}
				</ul>
			)
		}
		let members = (
						<div className="card">
							<h3>Members</h3>
							<p><i className="chalk-users"></i>{this.state.members.length} members of the classroom</p>
							<button onClick={this.openModal} className="success">Manage classroom members</button>
						</div>
					);
		return (
			<div className="container full">
				<Link to='/dashboard' className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				{isAdmin ? editButton : null}
				<header className="topContent">
					<h1>{this.state.course.title}</h1>
					{isAdmin ? dragAndDrop : null}
				{/* This needs redux baddddd - https://github.com/HackerYou/chalk/issues/129 */}
					{favList.length > 0 ? displayFavButton : null}
				</header>
				<Loading loading={this.state.loading} />
				<section className="lessonsWrap clearfix">
					<ol className="lessonColumn">
						{(this.state.sections).map(this.renderSections)}
					</ol>
					<Sticky className="lessonMeta" stickyClass="supersticky" stickyStyle={{}} topOffset={100} bottomOffset={this.state.pageHeight}>
					<aside>
						<section className="sideCard">
							<div className="card topicLegend">
								<h3>Course Topics</h3>
								<ul className="topicList">
									{(this.state.sections).map(this.renderTopics)}
								</ul>
							</div>
							{isAdmin || isInstructor ? members : null}
						</section>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<div className="modalBody card">
								<i className="chalk-close" onClick={this.closeModal}></i>
								<h2>Add Members</h2>
								<div className="membersModalWrap">

									<div className="memberModalColumn memberModalForm">
										<form onSubmit={this.searchUsers}>
											<label htmlFor="search">Search By First Name</label>
											<input type="text" placeholder="Name" id="search" ref="searchQuery"/>
										</form>
										<form onSubmit={this.addUser} action="">
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
									<button onClick={this.closeModal} className="error">Done</button>
								</div>
							</div>
						</Modal>
					</aside>
					</Sticky>
				</section>
			</div>
		)
	}
});
