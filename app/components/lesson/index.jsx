import React from 'react';
import { Link , History } from 'react-router';
import LessonTopic from '../lesson-topic/index.jsx';
import Modal from '../modal/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import lessonData from '../../services/lesson.jsx';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';



export default React.createClass({
	displayName: 'Lesson',
	mixins: [AuthMixin,History],
	getInitialState(){
		return {
			user: {},
			lesson: {},
			topic: [],
			isModalOpen: false
		}
	},
	componentWillMount(){
		userData.getUser(config.getUserId()).then(res=>{
			this.setState({
				user: res.user
			});
		});
		let lessonId = this.props.params.lessonId;
		lessonData.getLessonById(lessonId).then(res=>{
			this.setState({
				lesson: res.lesson,
				topic: res.lesson.topics
			});
		});
	},
	renderTopics(key, index){
		return <LessonTopic key={index} index={index} details={this.state.topic[index]} />
	},
	openModal(){
		this.setState({isModalOpen: true});
		document.body.className = 'noScroll';
	},
	closeModal(){
		this.setState({isModalOpen: false});
		document.body.className = '';
	},
	render() {
		let isAdmin = this.state.user.admin;
		let isInstructor = this.state.user.instructor;

		let editButton = <Link className="linkBtn" to={`/lesson/${this.props.params.lessonId}/${this.props.params.classroomId}/edit`}><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link>;
		return (
		<div className="full">
				<header className="topContent container">
				<div className="headerLinks">
					<Link className="linkBtn" to={`/classroom/${this.props.params.classroomId}`}><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
					{isAdmin || isInstructor ? editButton : null}
				</div>
				<h1>{this.state.lesson.title}</h1>
				</header>
				<section className="lessonView card">
					{(this.state.topic).map(this.renderTopics)}
				</section>
				<div className="container">
					<Link className="linkBtn" to={`/classroom/${this.props.params.classroomId}`}><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
					{isAdmin || isInstructor ? editButton : null}

				</div>
			</div>

		)
	}
});