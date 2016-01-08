import React from 'react';
import { Link , History } from 'react-router';
import Topic from '../topic/index.jsx';
import NewTopic from '../topic/new.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import topicData from '../../services/topic.jsx';

export default React.createClass({
	displayName: 'Topics',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			topics: []
		}
	},
	componentWillMount(){
		topicData.getTopics().then(res => {
			console.log(res.topic)
			this.setState({topics: res.topic});
		});
	},
	renderTopics(key, index){
		return <Topic key={index} index={index} details={this.state.topics[index]} />
	},
	render() {
		return (
			<div className="topics">
				<div className="container">
					<header className="topContent">
					<Link className="linkBtn" to="dashboard"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Topics</h1>
				</div>
				<NewTopic />

				<section className="full card topicsForm">

					<form action="">
						<div className="fieldRow">
							<label className="inline" htmlFor="search">Search by name</label>
							<input type="search" placeholder="Search for a topic"/>
							<label htmlFor="category" className="inline">Filter by category</label>
							<select name="category" id="category">
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="wordpress">WordPress</option>
								<option value="git">Git</option>
								<option value="command_line">Command Line</option>
							</select>
						</div>
					</form>
				</section>
				<section className="topicsWrap" >
					{(this.state.topics).map(this.renderTopics)}
				</section>
			</div>
		)
	}
});
