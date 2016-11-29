import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import searchMembers from '../../services/mixins/searchMember.js';
// import coursesData from '../../services/courses.jsx';

export default React.createClass({
	displayName: 'Questions',
	mixins: [AuthMixin,History, searchMembers],



	render() {
		return (
			<div className="classCard">
				<h2>Create your questions</h2>
				<section className="full detailsForm topicsForm card">
					<div className="inlineFieldRow">
						<label className="inline largeLabel">Create your question:</label>
						<input type="text"></input>
					</div>
				</section>
				<section className="full detailsForm topicsForm card">
					<div className="fieldRow">
						<label className="inline largeLabel">Category</label>
						<select>
							<option value="html">HTML</option>
							<option value="css">CSS</option>
							<option value="javascript">JavaScript</option>
							<option value="javascript">React</option>
						</select>
						<label className="inline largeLabel">Title</label>
						<select>
							<option value="css">Flexbox</option>
							<option value="javascript">Functions</option>
							<option value="css">CSS Advanced Selectors</option>
							<option value="javascript">React Components</option>
						</select>
					</div>
					<div className="fieldRow">
						<label className="inline largeLabel">Level of Difficulty</label>
						<select>
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="hard">Hard</option>
						</select>
						<label className="inline largeLabel">Type</label>
						<select>
							<option value="easy">Multiple Choice</option>
							<option value="medium">Code</option>
						</select>
					</div>
				</section>
				<section className="full detailsForm topicsForm card">
					<div className="fieldRow">
						<label className="inline largeLabel">Add Answers</label>
						<input type="text" />
						<input type="submit"/>
					</div>
				</section>
			</div>
		)
	}
});
