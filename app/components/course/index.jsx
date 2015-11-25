import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Course',
	render() {
		return (
			<article className="card classCard">
				<h3>{this.props.details.title}</h3>
				<p>Instructor: {this.props.details.instructor}</p>
				<footer className="classCardMeta">
					<p className="red"><strong>{this.props.details.term}</strong></p>
					<Link className="linkBtn" to="classroom"><button className="primary">View Class</button></Link>
				</footer>
			</article>
		)
	}
});