import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';

export default React.createClass({
	mixins: [AuthMixin,History],
	render() {
		return (
			<div>
				<h2>Media</h2>
			</div>
		)
	}
});