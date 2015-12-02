import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import lessonData from '../../services/lesson.jsx';
import coursesData from '../../services/courses.jsx';
export default React.createClass({
	displayName: 'New Lesson',
	mixins:[AuthMixin,History],
	createLesson(e) {
		e.preventDefault();
		//create lesson
		lessonData.createLesson({
			title: this.refs.name.value
		}).then(res=>{
			//get lesson id and add lesson to section
			let lessonId = res.lesson._id;
			console.log(lessonId)
			let sectionId = this.props.params.sectionId;
			coursesData.addLessonToSection(sectionId, lessonId).then(res=>{
				this.history.pushState(null, `/lesson/${lessonId}/${this.props.params.classroomId}/edit`);
			});
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
						<Link className="linkBtn" to={`/course-templates/${this.props.params.classroomId}/edit`}>
							<button className="error">Cancel</button>
						</Link>
					</div>
				</form>
				</section>
			</div>
		)
	}
});