import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
let Sticky = require('react-sticky');

export default React.createClass({
	displayName: 'EditTemplate',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			course: {},
			sections: [],
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
		coursesData.getTemplateById(this.props.params.templateId).then(res=>{
			this.setState({
				course: res.course,
				sections: res.course.sections
			 });
		});
	},
	renderLessons(key, index){
		return <LessonDetails key={index} index={index} details={key} classroomId={this.props.params.templateId} isTemplate={this.state.course.template} />
	},
	renderTopics(key, index){
		let link = '#' + this.state.sections[index]._id
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
		let classroomId = this.props.params.templateId;
		let sectionId = e.target.id;
		this.history.pushState(null,`lesson/${classroomId}/${sectionId}/new`);
	},
	deleteSection(sectionId,e){
		// console.log(e.target.className);
		coursesData.removeSectionFromCourse(this.props.params.templateId, sectionId).then(res=>{
			let newSections = (this.state.sections).filter((obj)=>{
				return obj._id !== sectionId;
			});
			this.setState({
				sections: newSections
			});

		});
	},
	renderSections(key, index){
		return <li key={index} className="lessonGroup" id={this.state.sections[index]._id}>
				<header className="lessonGroupTop">
					<h3>{this.state.sections[index].title}</h3>
					<p onClick={this.deleteSection.bind(this,this.state.sections[index]._id)} className="deleteSection"><i className="chalk-remove red"></i>Remove Section</p>
				</header>
				<div className="card">
					<ol>
						{(this.state.sections[index].lessons).map(this.renderLessons)}
						<li className="new-lessonRow">
							<p onClick={this.createLesson} id={this.state.sections[index]._id} className="lessonTitle">+ Add new lesson</p>
						</li>
					</ol>
				</div>
				</li>
	},
	deleteTemplate(){
		coursesData.deleteCourse(this.props.params.templateId).then(res=>{
			this.history.pushState(null,`course-templates`);
		});
	},
	render() {
		let lessons = this.state.course.lessons;
		return (
			<div className="container full">
				<Link to='/dashboard' className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<header className="topContent">
					<h1>{this.state.course.title}</h1>
				</header>
				<section className="lessonsWrap">
					<ol className="lessonColumn">
						{(this.state.sections).map(this.renderSections)}
						<li>
							<article className="lessonNew">
								<ul>
									<form className="new-lesson">
										<h3>Add new section</h3>
										<input ref="section" type="text" placeholder="topic section title"/>
										<button onClick={this.createSection}className="success">Create</button>
									</form>
								</ul>
							</article>
						</li>
					</ol>
					<Sticky className="lessonMeta" stickyClass="supersticky" stickyStyle={{}}>
					<aside >
						<section className="sideCard">
							<h3>Course Topics</h3>
							<div className="card topicLegend">
								<ul className="topicList">
									{(this.state.sections).map(this.renderTopics)}
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
						<button className="error" onClick={this.deleteTemplate}><i className="chalk-remove"></i>delete template</button>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<div className="modalBody card">
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
						</div>
						</Modal>
					</aside>
					</Sticky>
				</section>
			</div>
		)
	}
});
