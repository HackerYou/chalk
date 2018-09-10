import React from 'react';
import { Link , History } from 'react-router';
import LessonTopic from '../lesson-topic/index.jsx';
import Modal from '../modal/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import lessonData from '../../services/lesson.jsx';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';
import coursesData from '../../services/courses.jsx';
import Loading from '../loading/index.jsx';
import Dropzone from 'react-dropzone';
import Media from '../../services/media.jsx';


export default React.createClass({
	displayName: 'Lesson',
	mixins: [AuthMixin,History],
	getInitialState(){
		return {
			user: {},
			lesson: {},
			topic: [],
			isModalOpen: false,
			isTemplate: false,
			loading: true
		}
	},
	componentWillMount(){
		userData.getUser(config.getUserId()).then(res=>{
			this.setState({
				user: res.user
			});
		});

		coursesData.getCourseById(this.props.params.classroomId).then(res=>{
			this.setState({
				isTemplate: res.course.template
			});
		});

		let lessonId = this.props.params.lessonId;
		lessonData.getLessonById(lessonId).then(res=>{
			this.setState({
				lesson: res.lesson,
				topic: res.lesson.topics,
				loading: false
			});
		});
	},
	renderTopics(key, index){
		return <LessonTopic key={index} index={index} topics={this.state.topic} details={this.state.topic[index]} />
	},
	openModal(){
		this.setState({isModalOpen: true});
		document.body.className = 'noScroll';
	},
	closeModal(){
		this.setState({isModalOpen: false});
		document.body.className = '';
	},
	onDrop(file) {
		this.setState({
			loading: true
		});
		Media.uploadFile(file[0])
			.then((data) => {
				const fileName = data.media.path;
				const newLesson = Object.assign(this.state.lesson,{
					exercise_link: fileName
				});
				lessonData.updateLesson(this.state.lesson._id, newLesson)
					.then((data) => {
						this.setState({
							lesson: data.lesson,
							loading: false
						});
						this.closeModal();
					});
			});
	},
	render() {
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;

		let templateLink = `/course-templates/${this.props.params.classroomId}/edit`;
		let classroomLink = `/classroom/${this.props.params.classroomId}`
		return (
		<div className="full">
				<header className="topContent container">
					<div className="headerLinks">
						<Link className="linkBtn" to={this.state.isTemplate ? templateLink : classroomLink}><button className="primary"><i className="chalk-home"></i>{this.state.isTemplate ? 'back to template' : 'back to classroom'}</button></Link>
					</div>
					<div className="lessonHeader">
						<h1>{this.state.lesson.title}</h1>
					</div>
				</header>
				<section className="lessonView card">
					<Loading loading={this.state.loading} />
					{(this.state.topic).map(this.renderTopics)}
				</section>
				<div className="container">
						<Link className="linkBtn" to={this.state.isTemplate ? templateLink : classroomLink}><button className="primary"><i className="chalk-home"></i>{this.state.isTemplate ? 'back to template' : 'back to classroom'}</button></Link>
				</div>
			</div>

		)
	}
});