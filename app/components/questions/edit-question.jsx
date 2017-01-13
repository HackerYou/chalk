import React from 'react';
import { Link, History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from '../questions/cards.jsx';
import CodeMirror from 'react-codemirror';
import FilteredSearch from '../questions/filteredSearch.jsx';
require('codemirror/mode/javascript/javascript');
import NotificationSystem from 'react-notification-system';

let defaults = {
	javascript: ''
};

function findIndex(array,key,value) {
	let index = 0;
	for(let i = 0; i< array.length; i++) {
		if(array[i][key] === value) {
			index = i;
		}
	}
	return index;
}

export default React.createClass({
	_notificationSystem: null,
	displayName: 'Questions',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			answerOption: [],
			code: defaults.javascript,
			mode: 'markdown',
			readOnly: false,
			showType: 'multiple choice',
			questions: [],
			realAnswer: "",
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'false',
			updatedQuestion: {
				title: '',
				body: '',
				category: '',
				difficulty: '',
				type: '',
				multiChoice: [],
				unitTest: ''
			}
		}
	},
	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	},
	componentWillMount() {
		questionData.getQuestionById(this.props.params.questionId)
			.then((res) => {
				console.log("ress", res);
				this.setState({
					updatedQuestion: {
						title: res.question.title,
						body: res.question.body,
						category: res.question.category,
						difficulty: res.question.difficulty,
						type: res.question.type,
						multiChoice: res.question.multiChoice,
						unitTest: res.question.unitTest
					}
				})
			})
		//get question by Id
			
	},
	_successNotification: function(messageObj) {
		this._notificationSystem.addNotification({
			message: messageObj.message,
			level: messageObj.level === 'error' ? 'error' : 'success',
			dismissible: false,
			title: messageObj.title
		});
	},
	removeOption(id, index) {
		//made a copy of updatedQuestion
		const updatedObj = Object.assign({}, this.state.updatedQuestion);
		//removed the item using index
		updatedObj.multiChoice.splice(index, 1);

		this.setState({
			updatedQuestion: updatedObj
		})
	},
	addOption(e) {
		e.preventDefault();
		let setLabel = this.setLabel.value;
		let setValue = this.setValue.value;
		const setAnswer = this.setAnswer.value;
		const answerArray = this.state.updatedQuestion.multiChoice.slice();
		const updatedObj = Object.assign({}, this.state.updatedQuestion);

		console.log("setq answer", setAnswer)
		if(setLabel !== '' && setValue !== '') {
			updatedObj.multiChoice.push({
				label: setLabel,
				value: setValue,
			})
			this.setState({
				// answerOption: answerArray,
				updatedQuestion: updatedObj

			})
			this.setValue.value = "";
			this.setLabel.value = ""
		}
	},
	changeMode(e) {
	//Handles Codemirror implementation
		var mode = e.target.value;

		this.setState({
			mode: mode
		});

	},
	updateCode(newCode) {
	//Handles Codemirror implementation
		this.setState({
			updatedQuestion: {
				unitTest: newCode
			}
		})
	},
	renderCode() {
	//Handles Codemirror implementation
		var options = {
			lineNumbers: true,
			mode: this.state.mode,
			theme: 'cobalt',
			fixedGutter: true
		};
		return (
			<div>
		 		<CodeMirror value={this.state.updatedQuestion.unitTest} onChange={this.updateCode} options={options}/>
				<select onChange={this.changeMode} value={this.state.mode} className="fieldRow">
					<option value="javascript">JavaScript</option>
				</select>
				<input type="submit" value="validate" className="success"/>
			</div>
		)
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			return <QuestionCards key={`question-${i}`} question={item} removeCard={this.removeCard} editCard={this.editQuestion} selectButton={this.state.selectButton} showSelected="false"/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	removeCard(e,questionId) {
		e.preventDefault();
		console.log("hello",questionId)
		questionData.deleteQuestion(questionId)
			.then((res) => {
				let questionsArray = Array.from(this.state.questions);
				let questionsIndex = findIndex(questionsArray,"_id",questionId);
				questionsArray.splice(questionsIndex,1);
				this.setState({
					questions: questionsArray
				});
			});
	},
	
	getType(e) {
		const chosenType = e.target.value;
		this.setState({
			showType: chosenType
		})
		//if showType is equal MC then add class
	},
	updateQuestion(e) {
		e.preventDefault();
		const updatedQuestion = this.state.updatedQuestion;
		console.log("update",updatedQuestion)

		const title = this.state.updatedQuestion.title;
		const body = this.state.updatedQuestion.body;
		const multiAnswer = this.setAnswer.value;

		if(this.state.updatedQuestion.type === 'code') {
			updatedQuestion.unitTest = this.state.code;
		}
		else {
			Object.assign(updatedQuestion,{
				multiChoice: this.state.updatedQuestion.multiChoice,
				multiAnswer
			});
		}
		questionData.editQuestion(this.props.params.questionId, updatedQuestion)
			.then(res => {

				this._successNotification({
				title: 'Question',
				message: 'Saved Successfully'
			});
		});

		this.setAnswer.value = "";
	},
	validateCode(e) {
		e.preventDefault();
		console.log("sending");
		//do some validating here
	},
	changeQuestionView() {
		this.setState({
			showType: this.getType.value
		});
	},
	showFiltered(options) {
		this.setState(options);
	},
	updateField(e) {
		console.log("hello", e.target)
		//make a copy of the original state
		const ogQ = Object.assign({},this.state.updatedQuestion);

		ogQ[e.target.name] = e.target.value;

		this.setState({
			updatedQuestion: ogQ
		})
	},
	render() {
		return (
			<div className="classCard">
				<NotificationSystem ref="notificationSystem" style={false}/>
				<h2>Title of your question: {this.state.updatedQuestion.title}</h2>
				<section className="full detailsForm topicsForm card">
					<h3>Assign Attributes to your Question:</h3>
					<form onSubmit={this.updateQuestion}>
						<div className="fieldRow">
							<label className="inline largeLabel">Title of your question:</label>
							<input type="text" name="title" value={this.state.updatedQuestion.title} onChange={this.updateField}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Category</label>
							<select name="category" value={this.state.updatedQuestion.category} onChange={this.updateField}>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">What is the Question?</label>
							<textarea name="body" value={this.state.updatedQuestion.body} className="inline largeLabel" onChange={this.updateField}  row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select name="difficulty" value={this.state.updatedQuestion.difficulty}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" value={this.state.updatedQuestion.type} onChange={this.updateField}>
								<option value="multiple choice">Multiple Choice</option>
								<option value="code">Code</option>
							</select>
						</div>
						<div className="typeCard" onFocus={this.testing}>
							<div className={this.state.updatedQuestion.type === 'multiple choice' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Multiple Choice:</h3>
									<label className="inline largeLabel">Label of your Answers</label>
									<input type="text" ref={ref => this.setLabel = ref}/>
								</div>
								<div className="fieldRow">
									<label className="inline largeLabel">Set a value</label>
									<input type="text" ref={ref => this.setValue = ref}/>
									<button onClick={this.addOption} className="success">Add option</button>
								</div>
								<div className="fieldRow mcOptions">
								{this.state.updatedQuestion.multiChoice.map((item, i) => {
										return (
											<div className="mcOptions--duo" key={i}>
												<input className="inline" name="lala" type="radio" value={item.value}/>
												<label>{item.label}</label>
												<i onClick={() => this.removeOption(item._id, i)} className="fa fa-times"></i>
											</div>
										)
									})}
								</div>
							</div>
							<div className="fieldRow">
								<label className="inline largeLabel">What is the answer?</label>
								<input type="text" ref={ref => this.setAnswer = ref}/>
							</div>
							<div className={this.state.updatedQuestion.type === 'code' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Code Based Question:</h3>
									{this.renderCode()}
								</div>
							</div>
						</div>
						<input type="submit" value="Save" className="success"/>
						<Link to={`/questions`}>Go back</Link>
					</form>
				</section>
			</div>
		)
	}
});
