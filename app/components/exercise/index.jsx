import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Exercise',
	render() {
		return (
			<p className="red"><i className="chalk-download"></i>Download {this.props.details.title}</p>
		)
	}
});