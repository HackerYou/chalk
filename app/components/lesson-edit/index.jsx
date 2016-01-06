import React from 'react';
import { Link, History } from 'react-router';
import Lesson from '../lesson/index.jsx';
import Modal from '../modal/index.jsx';
import lessonData from '../../services/lesson.jsx';
import topicsData from '../../services/topic.jsx';
import Markdown from 'react-remarkable';
import coursesData from '../../services/courses.jsx';
import hljs from 'highlight.js';

export default React.createClass({
	displayName: 'EditLesson',
	mixins: [History],
	getInitialState(){
		return {
			isModalOpen: false,
			lesson: [],
			lessonTopics: [],
			topics: [],
			selectedTopics:[],
			selectValue: 'all',
			uniqueTopics: [],
			isTemplate: false
		}
	},
	componentWillMount(){
		lessonData.getLessonById(this.props.params.lessonId).then(res => {
			this.setState({
				lesson: res.lesson,
				lessonTopics: res.lesson.topics
			});
		});

		coursesData.getCourseById(this.props.params.classroomId).then(res=>{
			this.setState({
				isTemplate: res.course.template
			});
		});

		topicsData.getTopics().then(res=>{
			this.setState({
				topics: res.topic
			});
			let topics = (this.state.topics).map((key, index) => {
				return this.state.topics[index].category;
			});
			let uniqueTopics = topics.reduce((a,b) => {
				if (a.indexOf(b) < 0) a.push(b);
				return a;
			}, []);
			this.setState({uniqueTopics: uniqueTopics});
			this.setState({selectedTopics: this.state.topics});
		});
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
	},
	getValue(e){
		this.setState({selectValue: e.target.value});
		let topic = e.target.value;
		let matches = (this.state.topics).filter((obj)=>{
			return obj.category === topic;
		});
		if (e.target.value === 'all'){
			this.setState({selectedTopics: this.state.topics})
		} else {
			this.setState({selectedTopics: matches});
		}

	},
	renderTopics(key, index){
		return <option key={index} value={this.state.selectedTopics[index]._id}>{this.state.selectedTopics[index].title}</option>
	},
	renderTopicCategories(key, index){
		return <option key={index} value={this.state.uniqueTopics[index]}>{this.state.uniqueTopics[index]}</option>
	},
	addTopic(e){
		e.preventDefault();
		let topicId = this.refs.selectedTopic.value;
		let addTopic = lessonData.addTopicToLesson(this.props.params.lessonId, topicId, {
			'topics': topicId
		});

		let getTopic = topicsData.getTopicById(topicId);

		$.when(addTopic, getTopic).then((addRes, getRes)=>{
			this.closeModal();
			let updatedTopics = this.state.lessonTopics.slice();
			updatedTopics.push(getRes[0].topic);
			this.setState({lessonTopics: updatedTopics});
		});
	},
	deleteTopic(index){
		lessonData.deleteTopicFromLesson(this.props.params.lessonId, this.state.lessonTopics[index]._id).then(res=>{
			let updatedLessons = this.state.lessonTopics.slice();
			updatedLessons.splice(index, 1);
			this.setState({lessonTopics: updatedLessons});
		});
	},
	editTopic(index){
		this.history.pushState(null,`/topic/${index}/edit`);
	},
	displayTopics(key, index){
		let hl = function (str, lang) {
	    if (lang && hljs.getLanguage(lang)) {
	      try {
	        return hljs.highlight(lang, str).value;
	      } catch (err) {}
	    }
	    try {
	      return hljs.highlightAuto(str).value;
	    } catch (err) {}
	    return ''; // use external default escaping
	  };
		return <div key={index} className='lessonTopic'>
							<div className="deleteTopicBlock">
								<p data-id={this.state.lessonTopics[index]._id} onClick={this.deleteTopic.bind(this, index)} className="deleteTopic"><i className="chalk-remove "></i>Remove {this.state.lessonTopics[index].title}</p>
								<p data-id={this.state.lessonTopics[index]._id} onClick={this.editTopic.bind(this, this.state.lessonTopics[index]._id)} className="editTopic"><i className="chalk-edit "></i>Edit {this.state.lessonTopics[index].title}</p>
							</div>
							<h2 className="lessonTitle">{this.state.lessonTopics[index].title}</h2>
							<Markdown options={{'html':true, highlight: hl}}>{this.state.lessonTopics[index].body}</Markdown>
						</div>
	},
	handleChange(e){
		let stateObj = this.state.lesson;
		stateObj[e.target.id] = e.target.value;
		this.setState({
			lesson: stateObj
		});
	},
	saveLesson(e){
		e.preventDefault();
		//update title of lesson
		lessonData.updateLesson(this.props.params.lessonId, {
			title: this.state.lesson.title
		});
		// send user back to the classroom they were editing
		let classroomId = this.props.params.classroomId;
		if (this.state.isTemplate) {
			this.history.pushState(null,`course-templates/${classroomId}/edit`);
		} else {
			this.history.pushState(null,`classroom/${classroomId}/edit`);
		}
	},
	deleteLesson(e){
		e.preventDefault();
		lessonData.deleteLesson(this.props.params.lessonId).then(res=>{
			let classroomId = this.props.params.classroomId;
			if (this.state.isTemplate) {
			this.history.pushState(null,`course-templates/${classroomId}/edit`);
		} else {
			this.history.pushState(null,`classroom/${classroomId}/edit`);
		}
		});

	},
	render() {
		return (
			<div className="full">
				<header className="container">
					<Link className="linkBtn" to={this.state.isTemplate? `/course-templates/${this.props.params.classroomId}/edit` : `/classroom/${this.props.params.classroomId}/edit`}><button className="primary"><i className="chalk-home"></i>{this.state.isTemplate ? 'back to template' : 'back to classroom'}</button></Link>
				</header>
				<div className="full card detailsForm">
					<form action="">
						<div className="fieldRow">
							<label htmlFor="lessonName" className="inline largeLabel">Lesson Name</label>
							<input onChange={this.handleChange} type="text" placeholder="enter lesson name here" value={this.state.lesson.title} id="title"/>
							<button className="success" onClick={this.saveLesson}><i className="chalk-save"></i>Save Lesson</button>
						</div>
					</form>
				</div>
				<div className="container">
					<div className="lessonTopic">
						<h2 className="lessonTitle">{this.state.lesson.title}</h2>
					</div>
				</div>
				<div className="lessonEditView card">
						<div>{(this.state.lessonTopics).map(this.displayTopics)}</div>
						<div onClick={this.openModal} className="topicAddBlock"><h3><i className="chalk-add"></i>Add Topic</h3></div>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<div className="modalBody--small card">
							<i className="chalk-close" onClick={this.closeModal}></i>
							<form onSubmit={this.addTopic} action="">
								<h2>Add Topic</h2>
								<h3>Search By Topic Name</h3>
								<input type="text" placeholder='eg. Floats'/>
								<h4>Filter by category</h4>
									<div className="inlineFieldRow">
										<div className="fieldGroup">
											<label htmlFor="">Category</label>
											<select onChange={this.getValue} name="category" id="">
												<option value="all">view all</option>
												{(this.state.uniqueTopics).map(this.renderTopicCategories)}
											</select>
										</div>
										<div className="fieldGroup">
											<label htmlFor="">Topic</label>
											<select ref="selectedTopic" name="topics" id="">
												{(this.state.selectedTopics).map(this.renderTopics)}
											</select>
										</div>
									</div>
								<button className="success">Save Content</button>
								<button onClick={this.closeModal} className="error">Cancel</button>
							</form>
						</div>
						</Modal>
					</div>
				</div>
		)
	}
});
