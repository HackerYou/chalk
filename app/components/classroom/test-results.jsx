import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import config from '../../services/config.jsx';
import Sticky from '../../services/sticky.js';
import Loading from '../loading/index.jsx';
import validator from 'validator';
import TestData from '../../services/tests.jsx';
import TestCards from '../classroom/results-card.jsx';

export default React.createClass({
	displayName: 'TestResults',
	mixins: [AuthMixin,History],
	originalMembers: [],
	getInitialState(){
		document.body.className = '';
		return{
			user: {},
			testResults: [],
			studentInfo: {},
			members: [],
			tests: []
		}
	},
	componentDidMount() {
		coursesData.getCourseById(this.props.params.courseId)
			.then(res => {
				console.log(res.course.students);
				const members = res.course.students
					.map(student => student._id)
					.map(userData.getUser);

				Promise.all(members)
					.then(students => {
						this.setState({
							members: students,
						});
					});
		});
	},
	renderCards() {
		const members = this.state.members;
		return (	
				members.map((res) => {
					return <TestCards studentInfo={res.user} />
					
				})
			)
	},
	render() {
		return (
			<section className="dashWrap">
				{this.renderCards()}
			</section>
		)
	}

});