import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'QuestionCards',
	mixins: [AuthMixin,History],
	// getInitialState() {
	// 	return {
	// 		answerOption: []
	// 	}
	// },
	
	render() {
		return (
			<div className="inline card questionCard">
				<ul className="questionCard--attr">
					<li>JS</li>
					<li>Medium</li>
					<li>MC</li>
				</ul>
				<div className="questionCard--attr">
					<p>How do you do the thing that makes that thing Flexbox?</p>
				</div>
			</div>

		)
	}
});
