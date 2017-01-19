import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
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
				// console.log(res.course.students);
				const members = res.course.students
					//returns an array with all of the 
					//student ids ['id1, id2, id3, id4']
					//maps over those ids
					.map(student => student._id)
					//maps over
					.map(userData.getUser);

				Promise.all(members)
					.then(student => {

						this.setState({
							members: student
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