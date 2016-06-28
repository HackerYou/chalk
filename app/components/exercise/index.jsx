import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	displayName: 'Exercise',
	render() {
		return (
			<p><a href={this.props.link} download><i className="chalk-download"></i>Download Exercise Files</a></p>
		)
	}
});