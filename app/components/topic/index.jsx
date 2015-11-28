import React from 'react';
import AuthMixin from '../../services/authMixin.jsx';
import { Link, History } from 'react-router';

export default React.createClass({
	displayName: 'Topic',
	mixins:[AuthMixin,History],
	editTopic(){
		this.history.pushState(null,`/topic/${this.props.details._id}/edit`);
	},
	render(){
		return (
			<article className="card topicCard" onClick={this.editTopic}>
				<h3>{this.props.details.title}</h3>
				<p className="red">{this.props.details.category}</p>
				<footer className="classCardMeta">
					<button className="primary">View/Edit</button>
				</footer>
			</article>
		)
	}
});