import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Topic',
	render(){
		return (
			<div className="card">
				<h3>{this.props.details.title}</h3>
				<p className="red">{this.props.details.category}</p>
				<Link className="linkBtn" to="/topic/edit"><button className="primary">View/Edit</button></Link>
			</div>
		)
	}
});