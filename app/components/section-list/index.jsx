import React from 'react';
import AuthMixin from '../../services/authMixin.jsx';
import { Link, History } from 'react-router';
import coursesData from '../../services/courses.jsx';


export default React.createClass({
	displayName: 'Section-List',
	mixins:[AuthMixin,History],
	getInitialState(){
		return {
			section: {
				lessons: [],
				classroomId: this.props.classroomId
			}
		}
	},
	componentDidMount(){
		coursesData.getSection(this.props.id).then(res=>{
			this.setState({
				section: res.section
			});

		})
	},
	renderLessons(key, index){
		return <li key={index} index={index} className="lessonRow">
				<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.state.classroomId}`} className="lessonInfo">
					<p className="lessonTitle">{this.state.section.lessons[index].title}</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.state.classroomId}`}>view</Link>
						<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.state.classroomId}/edit`}>|edit</Link>
					</span>
				</div>
		</li>
	},
	render(){
		return (
			<ol>
			 {(this.state.section.lessons).map(this.renderLessons)}
			</ol>
		)
	}
});
