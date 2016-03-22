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
			loading: true,
			topicCount: 0,
			page: 1, 
			totalPages: 0
		}
	},
	componentWillMount(){
		topicData.getTopics({limit:25}).then(res => {
			this.originalTopics = res.topic;

			let totalPag = Math.ceil(res.totalCount/25);


			this.setState({
				topics: res.topic,
				loading: false,
				topicCount: res.totalCount,
				totalPages: totalPag
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
	prevPage(e){
		e.preventDefault();
		let prevPage = this.state.page - 1;
		if (prevPage === 0) {
			return;
		} else {
			let pageOffset = (prevPage-1)*25;
			topicData.getTopics({limit: 25, offset: pageOffset}).then(res=>{
				this.setState({
					topics: res.topic,
					page: prevPage
				});
			});	
		}
	},
	nextPage(e){
		e.preventDefault();
		let nextPage = this.state.page + 1;

		if (nextPage > this.state.totalPages){
			return;
		} else {
			let pageOffset = this.state.page*25;
			topicData.getTopics({limit: 25, offset: pageOffset}).then(res=>{
				this.setState({
					topics: res.topic,
					page: nextPage
				});
			});
			
		}

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
								<option value="seo">SEO</option>
							</select>
						</div>
					</form>
				</section>
				<Loading loading={this.state.loading}/>
				<div className="pages">
					<button className="primary" onClick={this.prevPage}>Previous Topics</button>
					<button className="primary" onClick={this.nextPage}>Next Topics</button>
				</div>
				<section className="topicsWrap" >
					{(this.state.topics).map(this.renderTopics)}
				</section>
			</div>
		)
	}
});
