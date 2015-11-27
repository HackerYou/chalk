import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Template',
	render() {
		return (
			<article className="card classCard">
				<h3>{this.props.details.title}</h3>
				<footer className="classCardMeta">
					<Link to="classroom" className="linkBtn">
						<button className="primary">View/Edit</button>
					</Link>
				</footer>
			</article>
		)
	}
});