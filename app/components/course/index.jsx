import React from 'react';
import { Link, History } from 'react-router';

export default React.createClass({
	displayName: 'Course',
	mixins: [History],
	goToClass(e){
		e.preventDefault();
		this.history.pushState(null, `/classroom/${e.target.id}/edit`);
	},
	render() {
		return (
			<div to="/classroom" className="classCard">
				<article className="card ">
					<h3>{this.props.details.title}</h3>
					<h4>Instructor: {this.props.details.instructor}</h4>
					<footer className="classCardMeta">
						<p className="red"><strong>{this.props.details.term}</strong></p>
						<button id={this.props.details._id} onClick={this.goToClass} className="primary">View Class</button>
					</footer>
				</article>
			</div>
		)
	}
});