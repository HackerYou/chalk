import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import topicData from '../../services/topic.jsx';

export default React.createClass({
	displayName: 'New Topic',
	mixins:[AuthMixin,History],
	createTopic(e) {
		e.preventDefault();
		topicData.createTopic({
			title: this.refs.name.value
		}).then(res => {
			this.history.pushState(null,`/topic/${res.topic._id}/edit`);
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
				<form action="" onSubmit={this.createTopic}>
					<div className="fieldRow">
						<label htmlFor="name" className="inline largeLabel">Name</label>
						<input type="text" placeholder="Topic Name" ref="name" />
						<button className="success">Create Topic</button>
						<Link className="linkBtn" to="topics">
							<button className="error">Cancel</button>
						</Link>
					</div>
				</form>
				</section>
			</div>
		)
	}
});