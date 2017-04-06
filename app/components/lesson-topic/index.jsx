import React from 'react';
import Exercise from '../exercise/index.jsx';
import Markdown from 'react-remarkable';
import Prism from 'prismjs';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';
import {History} from 'react-router';
import Modal from '../modal/index.jsx';
import IssuesData from '../../services/issues.jsx';


export default React.createClass({
	displayName: 'LessonTopic',
	mixins: [History],
	getInitialState() {
		return {
			user: {
				admin: false
			},
			showModal: false,
			issueNote: ""
		}
	},
	componentDidMount() {
		userData.getUser(config.getUserId())
			.then((data) => {
				this.setState({
					user: data.user
				});
			});
	},
	closeModal() {
		this.setState({
			showModal: false
		})
	},
	editLesson() {
		this.history.pushState(null,`/topic/${this.props.details._id}/edit`);
	},
	flagLesson(e) {
		this.setState({
			showModal: true
		})
	},
	handleChange(e) {
		this.setState({
			issueNote: e.target.value
		})
	},
	submitIssue(e) {
		e.preventDefault();
		IssuesData.createIssue({
			title: this.props.details.title,
			body: this.state.issueNote,
			topic_id: this.props.details._id
		})
		.then((res) => {
			this.setState({
				showModal: false,
				issueNote: ''
			});

		});
	},
	render(){
		let prs = function () {
			try {
				return Prism.highlightAll(false);				
			} catch (err){
				return '';
			}
		}

		let showEdit = '';
		if(this.state.user.instructor && this.state.user.admin) {
			showEdit = (
				<div className="flag-in-topic">
					<i className="fa fa-pencil topic-edit" onClick={this.editLesson}></i>
					<i className="fa fa-flag topic-edit" onClick={this.flagLesson}></i>
				</div>
			);
		}
		else if(this.state.user.admin) {
			showEdit = <i className="fa fa-flag topic-edit" onClick={this.flagLesson}></i>;
		}

		return (
			<div className="lessonTopic">
				<h2 className="lessonTitle">{this.props.details.title} {showEdit}</h2>
				<Markdown options={{'html':true, highlight: prs}}>{(this.props.details.body)}</Markdown>
				<Modal isOpen={this.state.showModal} transitionName="ease">

					<form className="modalBody card flagForm" onSubmit={this.submitIssue}>
						<i className="fa fa-times chalk-close" onClick={this.closeModal}></i>
						<label>What is your issue? Add a description here and we will fix it for you!</label>
						<textarea name="issueNote" onChange={this.handleChange}></textarea>
						<br/>
						<input type="submit" value="Send" />
					</form>
				</Modal>
			</div>
		)
	}
});
