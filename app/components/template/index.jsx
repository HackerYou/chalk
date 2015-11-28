import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Template',
	render() {
		return (
			<Link to="classroom" className="classCard">
				<article className="card">
					<h3>{this.props.details.title}</h3>
					<footer className="classCardMeta">
					<button className="primary">View/Edit</button>
					</footer>
				</article>
			</Link>
		)
	}
});