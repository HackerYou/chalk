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
		document.body.className = 'noScroll';
	},
	closeModal(){
		this.setState({isModalOpen: false});
		document.body.className = '';
	},
	render() {
		let links, edit; 
		if (location.pathname == '/lesson'){
			links = <div className="headerLinks"><Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<Link className="linkBtn" to="lesson/edit"><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link></div>;
				
		} else{
			links = null;
		}

		if (location.pathname =='/lesson/edit'){
			edit = <div>
							<div onClick={this.openModal} className="lessonEditContainer"><h3><i className="chalk-add"></i>Add Topic</h3></div>
							<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
									<i className="chalk-close" onClick={this.closeModal}></i>
									<h2>Add Topic</h2>
									<div className="lessonModalWrap">
										<div className="lessonModalColumn">
											<form action="">
												<h3>Search By Topic Name</h3>
												<input type="text" placeholder='eg. Floats'/>
											</form>
										</div>
										<div className="lessonModalColumn lessonAddContent">
											<h3>Add your own content</h3>
											<form action="">
												<textarea name="content" id="" ></textarea>
												<h3>Media</h3>
												<input type="file" placeholder="drag and drop files here"/>
											</form>
										</div>
									</div>
									<div className="modalBtns">
										<button className="success">Save Content</button>
										<button className="error">Cancel</button>
									</div>
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