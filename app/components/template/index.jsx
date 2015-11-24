import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Template',
	render() {
		return (
			<li className="card">
				<h3>{this.props.details.title}</h3>
				<button className="primary">View/Edit</button>
			</li>
		)
	}
});