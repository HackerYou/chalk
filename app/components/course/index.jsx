import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Course',
	render() {
		return (
			<Link to="/classroom" className="classCard">
				<article className="card ">
					<h3>{this.props.details.title}</h3>
					<p>Instructor: {this.props.details.instructor}</p>
					<footer className="classCardMeta">
						<p className="red"><strong>{this.props.details.term}</strong></p>
						<button className="primary">View Class</button>
					</footer>
				</article>
			</Link>
		)
	}
});