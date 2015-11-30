import React from 'react';
import { Link } from 'react-router';
import Lesson from '../lesson/index.jsx';
import Modal from '../modal/index.jsx';
import lessonData from '../../services/lesson.jsx';

export default React.createClass({
	displayName: 'EditLesson',
	getInitialState(){
		return {
			isModalOpen: false,
			lesson: [],
			topics: []
		}
	},
	componentWillMount(){
		console.log(this.props);	
		lessonData.getLessonById(this.props.params.lessonId).then(res => {
			this.setState({
				lesson: res.lesson
			});
		});
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
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
				</div>
		)
	}
});