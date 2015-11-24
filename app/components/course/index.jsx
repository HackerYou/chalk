import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Course',
	render() {
		return (
			<li className="card">
				<h3>{this.props.details.title}</h3>
				<h4>{this.props.details.instructor}</h4>
				<p className="red">{this.props.details.term}</p>
				<Link className="linkBtn" to="classroom"><button className="primary">View Class</button></Link>			
			</li>
		)
	}
});