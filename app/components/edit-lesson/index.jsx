import React from 'react';
import { Link } from 'react-router';
import Lesson from '../lesson/index.jsx';

export default React.createClass({
	displayName: 'EditLesson',
	render() {
		return (
			<div>
				<Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<button className="success">save content</button>
				<form action="">
					<label htmlFor="lessonName">Lesson Name</label>
					<input type="text" placeholder="enter lesson name here"/>
					<button className="success">Save Lesson</button>
					<button className="error">Cancel</button>
				</form>
				<div>
					<Lesson />
				</div>
			</div>
		)
	}
});