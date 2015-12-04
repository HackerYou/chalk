import React from 'react';
import { Link , History } from 'react-router';
import LessonTopic from '../lesson-topic/index.jsx';
import Modal from '../modal/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import lessonData from '../../services/lesson.jsx';



export default React.createClass({
	displayName: 'Lesson',
	mixins: [AuthMixin,History],
	getInitialState(){
		return {
			lesson: {},
			topic: [],
			isModalOpen: false
		}
	},
	componentWillMount(){
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
		return (

			<div className="full">
				<header className="topContent container">
				<div className="headerLinks">
					<Link className="linkBtn" to={`/course-templates/${this.props.params.classroomId}/edit`}><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
					<Link className="linkBtn" to="/lesson/edit"><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link>
				</div>
				<h1>{this.state.lesson.title}</h1>
				</header>
				<section className="lessonView card">
					{(this.state.topic).map(this.renderTopics)}
				</section>
				<div className="container">
					<Link className="linkBtn" to="/classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
					<Link className="linkBtn" to="/lesson/edit"><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link>
				</div>
			</div>

		)
	}
});