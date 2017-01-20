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
			members: []
		}
	},
	componentDidMount() {
		coursesData.getCourseById(this.props.params.courseId)
			.then(res => {
				const members = res.course.students
					.map(student => student._id)
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
		return (
				this.state.members.map((res) => {
					console.log("user", res.user);
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