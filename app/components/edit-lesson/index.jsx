import React from 'react';
import { Link } from 'react-router';
import Lesson from '../lesson/index.jsx';

export default React.createClass({
	displayName: 'EditLesson',
	render() {
		return (
			<div>
				<header className="topContent container">
					<Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
					<button className="success"><i className="chalk-save"></i>save content</button>
				</header>
				<section className="full card detailsForm">
					<form action="">
						<label htmlFor="lessonName" className="inline">Lesson Name</label>
						<input type="text" placeholder="enter lesson name here" className="nameInput"/>
						<button className="success"><i className="chalk-save"></i>Save Lesson</button>
						<button className="error"><i className="chalk-close"></i>Cancel</button>
					</form>
				</section>
				<div>
					<Lesson />
				</div>
			</div>
		)
	}
});