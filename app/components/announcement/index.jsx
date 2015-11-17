import React from 'react';
import Announcements from '../announcements/index.jsx';
import helpers from '../utility.js';

export default React.createClass({
	displayName: 'Announcement',
	getInitialState() {
		return {
			date: helpers.formatDate(this.props.details.created_at)
		}
	},
	render() {
		return (
			<li>
				<p className="red">{this.props.details.title}</p>
				<small>{this.state.date}</small>
				<p>{this.props.details.body}</p>			
			</li>
		)
	}
});