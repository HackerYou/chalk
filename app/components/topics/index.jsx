import React from 'react';
import { Link , History } from 'react-router';
import Topic from '../topic/index.jsx';
import NewTopic from '../topic/new.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import topicData from '../../services/topic.jsx';
import Loading from '../loading/index.jsx';

export default React.createClass({
	displayName: 'Topics',
	mixins: [AuthMixin, History],
	originalTopics: [],
	getInitialState(){
		return {
			topics: [],
			loading: true
		}
	},
	componentWillMount(){
		topicData.getTopics().then(res => {
			this.originalTopics = res.topic;

			this.setState({
				topics: res.topic,
				loading: false
			});
		});
	},
	filterTopics(event) {
		let selectedEvent = event.target.value;
		let topics = this.state.topics;
		let originalTopics = this.originalTopics;
		if(selectedEvent === 'all') {
			this.setState({
				topics: originalTopics
			});
		}
		else {
			this.setState({
				topics: originalTopics.filter(topic => topic.category === selectedEvent)
			});
		}

	},
	searchTopics(event) {
		event.preventDefault();
		let searchTopic = new RegExp(this.refs.searchQuery.value,'ig');
		let originalTopics = this.originalTopics;
		if(searchTopic === '') {
			this.setState({
				topics: originalTopics
			});
		}
		else {
			this.setState({
				topics: originalTopics.filter(topic => topic.title.match(searchTopic))
			});
		}

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
					<Link className="linkBtn" to='course-templates'><button className="primary">Course Templates</button></Link>
					</header>
					<h1>Topics</h1>
				</div>
				<NewTopic card="card"/>

				<section className="full card topicsForm searchTopics">

					<form action="" onSubmit={this.searchTopics}>
						<div className="fieldRow">
							<label className="inline" htmlFor="search">Search by name</label>
							<input type="search" placeholder="Search for a topic" ref="searchQuery"/>
							<label htmlFor="category" className="inline">Filter by category</label>
							<select name="category" id="category" onChange={this.filterTopics}>
								<option value="all">All</option>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="wordpress">WordPress</option>
								<option value="tools">Tools</option>
							</select>
						</div>
					</form>
				</section>
				<Loading loading={this.state.loading}/>
				<section className="topicsWrap" >
					{(this.state.topics).map(this.renderTopics)}
				</section>
			</div>
		)
	}
});
