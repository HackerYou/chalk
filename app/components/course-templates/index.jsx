import React from 'react';
import { Link, History } from 'react-router';
import Template from '../template/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import courseData from '../../services/courses.jsx';

export default React.createClass({
	displayName: 'CourseTemplates',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			courses: []
		}
	},
	componentWillMount(){
		courseData.getTemplates().then(res=>{
			this.setState({courses: res.course});
		})
	},
	renderTemplates(key, index){
		return <Template key={index} index={index} details={this.state.courses[index]} />
	},
	createTemplate(e){
		e.preventDefault();
		courseData.createTemplate({
			'title': this.refs.title.value
		}).then(res=>{
			//update state
			let newState = this.state.courses.slice();
			newState.push(res.course);
			this.setState({courses: newState});
			// push to edit template route
			this.history.pushState(null,`/course-templates/${res.course._id}/edit`);
		});
	},
	render() {
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Course Templates</h1>
				</div>
				<section className="full card detailsForm">
					<form action="" onSubmit={this.createTemplate}>
						<h2>Create New Template</h2>
						<div className="fieldRow">
							<label htmlFor="enddate" className="inline largeLabel">Template Name</label>
							<input type="text" ref="title" placeholder="eg. Intro To Web Development"/>
							<button className="success">Save Template</button>
							<Link to="dashboard" className="linkBtn"><button className="error">Cancel</button></Link>
						</div>
					</form>
				</section>
				<div className="container">
					<section className="templateWrap">
						{(this.state.courses).map(this.renderTemplates)}
					</section>
				</div>
			</div>
		)
	}
});