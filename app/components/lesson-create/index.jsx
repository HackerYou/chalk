import React from 'react';
import { Link } from 'react-router';
import Lesson from '../lesson/index.jsx';

export default React.createClass({
	displayName: 'CreateLesson',
	render() {
		return (
			<div>
				<Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<button className="success"><i className="chalk-save"></i>save content</button>
				<form action="" className="card">
					<label htmlFor="lessonName">Lesson Name</label>
					<input type="text" placeholder="enter lesson name here"/>
					<button className="success"><i className="chalk-save"></i>Save Lesson</button>
					<button className="error"><i className="chalk-close"></i>Cancel</button>
				</form>
				<div>
					<Lesson />
				</div>
			</div>
		)
	}
});