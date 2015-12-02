import React from 'react';
import { Link , History} from 'react-router';
import coursesData from '../../services/courses.jsx';
export default React.createClass({
	displayName: 'Template',
	mixins: [History],
	editTemplate(){
		let id = this.props.details._id;
		this.history.pushState(null,`/course-templates/${id}/edit`);
	},
	render() {
		return (
			<div className="classCard">
				<article className="card">
					<h3>{this.props.details.title}</h3>
					<footer className="classCardMeta">
					<button onClick={this.editTemplate} className="primary">View/Edit</button>
					</footer>
				</article>
			</div>
		)
	}
});