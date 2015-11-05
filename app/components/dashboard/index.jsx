import React from 'react';

import Announcements from '../announcements/index.jsx';

export default React.createClass({
	render() {
		return (
			<div>
				<h2>Dashboard</h2>
				<Announcements />
			</div>
		)
	}
});