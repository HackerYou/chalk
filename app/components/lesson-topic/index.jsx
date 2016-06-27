import React from 'react';
import Exercise from '../exercise/index.jsx';
import Markdown from 'react-remarkable';
import hljs from 'highlight.js';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';
import {History} from 'react-router';


export default React.createClass({
	displayName: 'LessonTopic',
	mixins: [History],
	getInitialState() {
		return {
			user: {
				admin: false
			}
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
	editLesson() {
		this.history.pushState(null,`/topic/${this.props.details._id}/edit`);
	},
	render(){
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
		let showEdit = '';
		if(this.state.user.admin) {
			showEdit = <i className="fa fa-pencil topic-edit" onClick={this.editLesson}></i>;
		}
		return (
			<div className="lessonTopic">
				<h2 className="lessonTitle">{this.props.details.title} {showEdit}</h2>
				<Markdown options={{'html':true, highlight: hl}}>{(this.props.details.body)}</Markdown>
			</div>
		)
	}
});
