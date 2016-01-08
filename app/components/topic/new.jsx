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
		let card;
		if (this.props.card === 'card') {
			card = "full detailsForm topicsForm card";
		} else {
			card = "full detailsForm topicsForm";
		}
		return (
			<div>
				<section className={card}>
				<form action="" onSubmit={this.createTopic}>
					<div className="fieldRow">
						<label htmlFor="name" className="inline largeLabel">Create new topic</label>
						<input type="text" placeholder="Topic Name" ref="name" />
						<button className="success">Create Topic</button>
					</div>
				</form>
				</section>
			</div>
		)
	}
});
