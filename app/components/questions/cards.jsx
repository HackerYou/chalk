import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';

export default React.createClass({
	displayName: 'QuestionCards',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			questions: []
		}
	},
	componentDidMount() {
		questionData.getQuestion()
			.then(data => {
				// console.log("what is this", data)
				const questionsArray = data.questions
				const dataArray = []
				questionsArray.map((item) => {
					// console.log(item.body)
					dataArray.push({
						question: item.body,
						category: item.category,
						difficulty: item.difficulty,
						type: item.type
					})

				})
				this.setState({
					questions: dataArray
				})
				// console.log("dataaaa", dataArray);
			})
	},
	render() {
		return (
			<div className="questionCard__wrapper">
				{this.state.questions.map((item, i) => {
					if(item.question) {
						console.log(item.question)
						return (
							<div key={i} className="inline card questionCard">
								<ul className="questionCard--attr">
									<li>{item.category}</li>
									<li>{item.difficulty}</li>
									<li>{item.type}</li>
								</ul>
								<div className="questionCard--attr">
									<p>{item.question}</p>
								</div>
							</div>
						)
					}
				})}
			</div>
		)
	}
});
