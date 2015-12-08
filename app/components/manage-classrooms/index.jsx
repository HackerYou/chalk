import React from 'react';
import { Link } from 'react-router';
import Course from '../course/index.jsx';
import coursesData from '../../services/courses.jsx';

export default React.createClass({
	displayName: 'ManageClassrooms',
	getInitialState(){
		return {
			courses: {},
			templates: []
		}
	},
	componentWillMount(){
		coursesData.getTemplates().then(res=>{
			this.setState({
				templates: res.course
			});
		});

		coursesData.getCourses().then(res=>{
			this.setState({
				courses: res.course
			});
		});
	},
	renderCourses(key){
		return <Course key={key} index={key} details={this.state.courses[key]} />
	},
	renderOptions(key, index){
		return <option key={index} value={this.state.templates[index]._id}>{this.state.templates[index].title}</option>
	},
	createCourse(e){
		e.preventDefault();
		//create course
		let createCourse = coursesData.createCourse({
			'title': this.refs.title.value,
			'template': this.refs.template.value,
			'term': this.refs.term.value,
			//these don't seem to be posting to the course, what is the proper key?
			'start_date': this.refs.start.value,
			'end_date': this.refs.end.value,
			//
			'instructor': this.refs.instructor.value,
			'description': this.refs.description.value
		});
		let getTemplate = coursesData.getTemplateById(this.refs.template.value);

		$.when(createCourse, getTemplate).then((createRes, getRes)=>{
			let courseId = createRes[0].course._id;
			let data = getRes[0].course.sections;
			coursesData.updateCourse(courseId, {
				'sections': data
			}).then(res=>{
				this.setState({courses: this.state.courses.concat(res.course)});
			});
		});
	},
	render() {
		return (
			<div className="container">
				<header className="topContent">
					<Link className="linkBtn" to='/dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				</header>
				<div className="card setupCard">
					<h2>Create a new classroom</h2>
					<form onSubmit={this.createCourse} action="">
						<div className="fieldRow">
							<label htmlFor="template" className="inline">Template</label>
							<select ref="template" name="template" id="template">
								{(this.state.templates).map(this.renderOptions)}
							</select>
						</div>
						<div className="fieldRow">
							<label htmlFor="title" className="inline">Title</label>
							<input ref="title" id="term" type="text" placeholder="Enter Course Title"/>
							<label htmlFor="term" className="inline">Term</label>
							<input ref="term" id="term" type="text" placeholder="eg Fall 2015"/>
						</div>
						<div className="fieldRow">
							<label htmlFor="startdate" className="inline">Start Date</label>
							<input ref="start" id="startdate" type="text" placeholder="Enter Start Date"/>
							<label htmlFor="enddate" className="inline">End Date</label>
							<input ref="end" type="text" id="enddate" placeholder="Enter End Date"/>
						</div>
						<div className="fieldRow">
							<label htmlFor="instructor" className="inline">Instructor</label>
							<select ref="instructor" name="instructor" id="instructor">
								<option value="drew">Drew Minns</option>
								<option value="ryan">Ryan Christiani</option>
								<option value="kristen">Kristen Spencer</option>
							</select>
							<small><a href="#">Create new instructor</a></small>
						</div>
						<div className="fieldRow">
							<label htmlFor="desc">Classroom Description</label>
							<textarea ref="description" name="desc" id="desc" cols="30" rows="10"></textarea>
						</div>
						<button className="success">Create Classroom</button>
					</form>
				</div>
				<div className="content">
					<h1>Your Classrooms</h1>
					<section className="dashWrap">
						 {Object.keys(this.state.courses).map(this.renderCourses)}
					</section>
				</div>
			</div>
		)
	}
});