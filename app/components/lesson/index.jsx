import React from 'react';
import { Link , History } from 'react-router';
import LessonTopic from '../lesson-topic/index.jsx';
import Modal from '../modal/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';

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
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			lesson: data.lesson,
			topic: data.lesson.topic
		});
	},
	renderTopics(key, index){
		return <LessonTopic key={index} index={index} details={this.state.lesson.topic[index]} />
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
	},
	render() {
		let links, edit; 
		if (location.pathname == '/lesson'){
			links = <div className="headerLinks"><Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<Link className="linkBtn" to="edit-lesson"><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link></div>;
				
		} else{
			links = null;
		}

		if (location.pathname =='/lesson/edit'){
			edit = <div>
							<div onClick={this.openModal}><h3><i className="chalk-add"></i>Add Topic</h3></div>
							<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
								<i className="chalk-close" onClick={this.closeModal}></i>
								<form action="">
									<h2>Add Topic</h2>
									<h3>Search By Topic Name</h3>
									<input type="text" placeholder='eg. Floats'/>
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

		} else{
			edit = null;
		}


		return (
			<div className="full">
				<header className="topContent container">
				{links}
				<h1>{this.state.lesson.title}</h1>
				</header>
				<section className="lessonView card">
					{(this.state.topic).map(this.renderTopics)}
					{edit}
				</section>
				<div className="container">
					{links}
				</div>
			</div>

		)
	}
});