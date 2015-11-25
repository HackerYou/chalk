import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Template',
	render() {
		return (
			<li className="card">
				<h3>{this.props.details.title}</h3>
				<Link to="classroom" className="linkBtn">
					<button className="primary">View/Edit</button>
				</Link>
			</li>
		)
	}
});