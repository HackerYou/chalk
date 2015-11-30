import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import lessonData from '../../services/lesson.jsx';

export default React.createClass({
	displayName: 'New Lesson',
	mixins:[AuthMixin,History],
	createLesson(e) {
		e.preventDefault();
		lessonData.createLesson({
			title: this.refs.name.value
		}).then(res => {
			this.history.pushState(null,`/lesson/${res.lesson._id}/edit`);
		});
	},
	render(){
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link className="linkBtn" to="topics"><button className="primary"><i className="chalk-home"></i>back to topics</button></Link>
					</header>
				</div>
				<section className="full card detailsForm topicsForm">
				<form action="" onSubmit={this.createLesson}>
					<div className="fieldRow">
						<label htmlFor="name" className="inline largeLabel">Name</label>
						<input type="text" placeholder="Lesson Name" ref="name" />
						<button className="success">Create Lesson</button>
						<Link className="linkBtn" to="classroom">
							<button className="error">Cancel</button>
						</Link>
					</div>
				</form>
				</section>
			</div>
		)
	}
});