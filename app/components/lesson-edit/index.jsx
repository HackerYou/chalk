import React from 'react';
import { Link } from 'react-router';
import Lesson from '../lesson/index.jsx';
import Modal from '../modal/index.jsx';
import lessonData from '../../services/lesson.jsx';
import topicsData from '../../services/topic.jsx';

//TO DO: Save Lesson, Edit Lesson Title, send Cancel back to classroom, markdown rendering

export default React.createClass({
	displayName: 'EditLesson',
	getInitialState(){
		return {
			isModalOpen: false,
			lesson: [],
			lessonTopics: [],
			topics: []
		}
	},
	componentWillMount(){
		lessonData.getLessonById(this.props.params.lessonId).then(res => {
			this.setState({
				lesson: res.lesson,
				lessonTopics: res.lesson.topics
			});
		});
		topicsData.getTopics().then(res=>{
			this.setState({
				topics: res.topic
			});
		});
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
	},
	renderTopics(key, index){
		return <li key={index}>
						<button onClick={this.addTopic} className="primary" id={this.state.topics[index]._id}>{this.state.topics[index].title}</button>
					</li>
	},
	addTopic(e){
		e.preventDefault();
		let addTopic = lessonData.addTopicToLesson(this.props.params.lessonId, e.target.id, {
			'topics': e.target.id
		});

		let getTopic = topicsData.getTopicById(e.target.id);

		$.when(addTopic, getTopic).then((addRes, getRes)=>{
			console.log(getRes[0].topic);
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
	displayTopics(key, index){
		return <div key={index} className='topic'>
						<h3>{this.state.lessonTopics[index].title}</h3>
						<p>{this.state.lessonTopics[index].body}</p>
						<button data-id={this.state.lessonTopics[index]._id} onClick={this.deleteTopic.bind(this, index)}className="error">Delete Topic</button>					
						</div>
	},
	render() {
		return (
			<div>
				<Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<button className="success"><i className="chalk-save"></i>save lesson</button>
				<form action="" className="card">
					<label htmlFor="lessonName">Lesson Name</label>
					<input type="text" placeholder="enter lesson name here" value={this.state.lesson.title}/>
					<button className="success"><i className="chalk-save"></i>Save Lesson</button>
					<button className="error"><i className="chalk-close"></i>Cancel</button>
				</form>
				<div className="card">
						<h2>{this.state.lesson.title}</h2>
						<div>{(this.state.lessonTopics).map(this.displayTopics)}}</div>
						<div onClick={this.openModal}><h3><i className="chalk-add"></i>Add Topic</h3></div>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<i className="chalk-close" onClick={this.closeModal}></i>
							<form action="">
								<h2>Add Topic</h2>
								<h3>Search By Topic Name</h3>
								<input type="text" placeholder='eg. Floats'/>
								<ul>
									{(this.state.topics).map(this.renderTopics)}
								</ul>
								<h4>or</h4>
								<h3>Add your own content</h3>
								<textarea name="content" id="" cols="30" rows="10"></textarea>
								<h3>Media</h3>
								<input type="file" placeholder="drag and drop files here"/>
								<button className="success">Save Content</button>
								<button className="error">Cancel</button>
							</form>
						</Modal>
					</div>
				</div>
		)
	}
});