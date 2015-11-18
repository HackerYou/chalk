import React from 'react';
import { Link } from 'react-router';
import Announcements from '../announcements/index.jsx';


export default React.createClass({
	displayName: 'Lesson',
	render() {
		return (
			<div>
				<h1>Lesson</h1>
				<Announcements />
			</div>

		)
	}
});