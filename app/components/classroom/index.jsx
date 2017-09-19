import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import topicsData from '../../services/topic.jsx';
import config from '../../services/config.jsx';
import Sticky from '../../services/sticky.js';
import Loading from '../loading/index.jsx';
import validator from 'validator';
import TestData from '../../services/tests.jsx';
import TestCards from '../classroom/results-card.jsx';

export default React.createClass({
	displayName: 'Classroom',
	mixins: [AuthMixin,History],
	originalMembers: [],
	getInitialState(){
		document.body.className = '';
		return{
			user: {
				test_results:[],
				tests: [],
				favorites: []
			},
			course: {
				tests: []
			},
			sections: [],
			isModalOpen: false,
			topics: [],
			members: [],
			favorites: {},
			showFavs: false,
			pageHeight: 0,
			loading: true,
			memberError: '',
			testCompletion: false,
			students: [],
			topics: {}
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
	componentDidMount(){
		userData.getUser(config.getUserId()).then(res=>{
			if (res.user.favorites === undefined) {
				res.user.favorites = [];
			}
			this.setState({
				user: res.user
			});
		});
			
		let id = this.props.params.courseId;
		coursesData.getCourseById(id).then(res=>{
			this.originalMembers = res.course.students;

			// if tests don't have a 'hidden' flag, assume they don't need to be hidden
			res.course.tests = res.course.tests.map((test) => {
				if (typeof test.show === "undefined") {
					test.show = true;
				}

				return test;
			});

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

			const members = res.course.students
				.map(student => student._id)
				.map(userData.getUser);

			Promise.all(members)
				.then(student => {
					this.setState({
						students: student
					});
				});

		});
	},
	starLesson(classroomId, lessonId, star) {
		const courseId = this.props.params.courseId;
		if (!star) {
			userData.favoriteLesson(classroomId,lessonId).then((res) => {
				this.setState({
					user: res.user,
				}); 
			});

		} else {
			userData.unFavoriteLesson(classroomId,lessonId).then((res) => {
				this.setState({user: res.user}); 
				
				if (this.state.user.favorites[classroomId].lessons.length === 0 && this.state.showFavs) {
					this.showFavs();
				}

			});


		}
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
	
		return <LessonDetails key={index} starLesson={this.starLesson} index={index} details={key} classroomId={this.props.params.courseId} star={star} />
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
	renderSections(section, index){
		let title = section.title.replace(/ /g, "_").toLowerCase();
		return (<li key={section._id} className="lessonGroup" id={title}>
				<h3>{section.title}</h3>
				<div className="card lessonCard">
					<ol className="lessonSection">
						{(section.lessons).map(this.renderLessons)}
					</ol>
				</div>
			</li>);
	},
	editCourse(e){
		e.preventDefault();
		this.history.pushState(null, `/classroom/${this.props.params.courseId}/edit`);
	},
	addUser(e){
		e.preventDefault();
		let users = this.refs.students.value.split(',');
		//Remove that spaces
		users = users.map(email => email.trim());
		
		this.setState({
			loading: true
		});
		//collection any non emails
		const notEmails = users.filter((email) => {
			return !validator.isEmail(email);
		});
		//Validate emails
		users = users.filter((email) => {
			return validator.isEmail(email);
		});	
		//Send join them back as a string
		users = users.join(',');
		if(notEmails.length > 0) {
			this.setState({
				memberError: `There was an error adding these users: ${notEmails.join(',')}`
			});
		}

		coursesData.addUserToCourse(this.props.params.courseId, users).then(res=>{
			let students = res.course.students;
			this.refs.students.value = '';
			this.setState({
				members: students,
				loading: false
			});
		});
	},
	removeUser(e){
		e.preventDefault();
		let userId = e.target.id;
		let deleteConfirm = confirm('Are you sure you want to delete this user?');
		if(deleteConfirm) {
			coursesData.removeUserFromCourse(this.props.params.courseId, userId).then(res=>{
				let students = res.course.students
				this.setState({
					members: students
				});
			});
		}
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
	removeTest(e,testId) {
		e.preventDefault();
		TestData.removeTest(testId)
			.then((res) => {
				const course = Object.assign({},this.state.course);
				course.tests = course.tests.filter((test) => {
					return test._id !== testId
				});
				this.setState({
					course
				});
			});
	},
	showProgress() {
		//check if test_results length is equal 1
		//if so apply className to first
		if(this.state.course.tests.length > 0) {
			return (
				<div className="card cardAddTest">
					<h3>Test Progress:</h3>
					<TestCards studentInfo={this.state.user} course={this.state.course} key={`tests`}/>
				</div>
				
			)
		}
	},
	removeSectionOnUser(e,section,userId) {
		//Remove section from user,
		userData.removeCourseSection(this.state.course._id,section._id,userId)
			.then((res) => {
				//Get member again.
				const memberState = Array.from(this.state.members);
				const memberIndex = memberState.findIndex(member => member._id === userId);
				memberState[memberIndex] = res.user;
				this.setState({
					members: memberState
				});
			})
			.fail((err) => alert(`An error occured: ${err.error}`));
	},
	addSectionOnUser(e,section,userId) {
		userData.addCourseSection(this.state.course._id,section._id,userId)
			.then((res) => {
				//Get member again.
				const memberState = Array.from(this.state.members);
				const memberIndex = memberState.findIndex(member => member._id === userId);
				memberState[memberIndex] = res.user;
				this.setState({
					members: memberState
				});
			})
			.fail((err) => alert(`An error occured: ${err.error}`));
	},
	displayMembers() {
		if (this.state.members.length <= 0) {
		 	return <p className="emptyState">No members yet!</p>
		} else {
			return (
				<ul className="membersModalList">
					{(this.state.members).map((user, index) => {
						let currentCourse = user.courseSections.find((course) => course.courseId === this.state.course._id);
						if(currentCourse === undefined) {
							currentCourse = {
								sections:[]
							};
						}
						return (
							<li key={user._id}>
								<strong>{user.firstName +" "+ user.lastName +" - "+ user.email}</strong> <i className="chalk-remove"></i>
								<div>
									{this.state.course.sections.map(section => {
										return (
											<span key={`${user._id}-${section._id}`} className="memebersSection">
												{currentCourse.sections.indexOf(section._id) >= 0 ? 
													<input type="checkbox" checked="true" onChange={(e) => this.removeSectionOnUser(e,section,user._id)} id={`${user._id}-${section._id}`}/> : 
													<input type="checkbox" onChange={(e) => this.addSectionOnUser(e,section,user._id)} id={`${user._id}-${section._id}`} />}
												<label htmlFor={`${user._id}-${section._id}`}>{section.title}</label>
											</span>
										)
									})}
								</div>
							</li>
						)
					})}
				</ul>
			)
		}
	},
	render() {
		let tests = this.state.course.tests;
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;
		let dragAndDrop = <p className="title">Drag and drop to reorganize lessons</p>
		let favList = typeof this.state.user.favorites[this.props.params.courseId] !== "undefined" ? this.state.user.favorites[this.props.params.courseId].lessons : [];
		let displayFavButton= <button className="primary" onClick={this.showFavs}>{this.state.showFavs ? 'show all lessons' : 'show starred lessons'}</button>
		let members = (
			<div className="card">
				<h3>Members</h3>
				<p><i className="chalk-users"></i>{this.state.members.length} members of the classroom</p>
				<button onClick={this.openModal} className="success">Manage classroom members</button>
			</div>
		);
		let test = (
			<div className="card testCard">
				<h3>Add Tests</h3>	
				<ul>
				{this.state.course.tests.map((test) => { 
					return (
					<li key={`test-${test._id}`}>
						<Link className="testLink" to={`/classroom/${this.props.params.courseId}/view-test/${test._id}`}>{test.title}</Link>
						<span className="testOptions">
							<Link to={`/edit-test/${test._id}`}><i className="fa fa-edit"></i></Link>
							<a href="#" onClick={(e) => this.removeTest(e,test._id)}><i className="fa fa-times"></i></a>
						</span>
					</li>
					)
				})}
				</ul>
				<Link to={`/classroom/${this.props.params.courseId}/create-test`} className="primary">Add Test</Link>
			</div>
		);
		let testResults = (
			<div className="card">
				<Link to={`/classroom/${this.props.params.courseId}/test-results`}>View Test Results</Link>
			</div>
		)
		let takeTest = (
			<div className="card testCard">
				<h3>Take Test</h3>
				<ul>
				{tests.map((item, i) => {
					return item.show === "true" && (
						<li key={`test-${item._id}`}>
							<Link className="testLink" to={`/classroom/${this.props.params.courseId}/view-test/${item._id}`} className="primary">{item.title}</Link>
						</li>
					)
				})}
				</ul>
			</div>
		);
		return (
			<div className="container full">
				<Link to='/dashboard' className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<header className="topContent">
					<h1>{this.state.course.title}</h1>
					{favList.length > 0 ? displayFavButton : null}
				</header>
				<Loading loading={this.state.loading} />
				<section className="lessonsWrap clearfix">
					<ol className="lessonColumn">
						{(this.state.sections)
							.filter(section => {
								//Filter
								if(this.state.user.admin === true) {
									return true
								}
								const currentCourseForUser = this.state.user.courseSections.find(course => {
									return course.courseId === this.state.course._id;
								});
								return currentCourseForUser.sections.indexOf(section._id) >= 0;
							})
							.map(this.renderSections)}
					</ol>
					<Sticky className="lessonMeta" stickyClass="supersticky" stickyStyle={{}} topOffset={100} bottomOffset={this.state.pageHeight}>
					<aside>
						<section className="sideCard">
							{isAdmin || isInstructor ? testResults : this.showProgress()}
							<div className="card topicLegend">
								<h3>Course Topics</h3>
								<ul className="topicList">
									{(this.state.sections).map(this.renderTopics)}
								</ul>
							</div>

							{(isAdmin || isInstructor) ? members : null}
							{(isAdmin || isInstructor) ? test : null}
							{(() => {
								if(this.state.course.tests.length > 0) {
									return ((isAdmin === false || isAdmin === undefined) && (isInstructor === false || isInstructor === undefined) ? takeTest : null)
								}
							})()}
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
											<label htmlFor="email">Add member<br /> <small>Separate emails by comma</small></label>

											<input ref="students"  type="text" id="email" placeholder="enter emails"/>
											<p>{this.state.memberError}</p>
											<button className="success">Add Member</button>
										</form>
									</div>
									<div className="memberModalColumn memberModalManage">
										<h3>Classroom Members</h3>
										{this.displayMembers()}

									</div>
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
