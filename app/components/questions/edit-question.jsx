import React from 'react';
import { Link, History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from '../questions/cards.jsx';
import CodeMirror from 'react-codemirror';
import FilteredSearch from '../questions/filteredSearch.jsx';
require('codemirror/mode/javascript/javascript');

let defaults = {
	markdown: '# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)',
	javascript: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
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
	displayName: 'Questions',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			answerOption: [],
			code: defaults.markdown,
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
				multiChoice: []
			}
		}
	},
	componentWillMount() {
		questionData.getQuestionById(this.props.params.questionId)
			.then((res) => {
				this.setState({
					updatedQuestion: {
						title: res.question.title,
						body: res.question.body,
						category: res.question.category,
						difficulty: res.question.difficulty,
						type: res.question.type,
						multiChoice: res.question.multiChoice
					}
				})
			})
		//get question by Id
			
	},

	addOption(e) {
		e.preventDefault();
		let setLabel = this.setLabel.value;
		let setValue = this.setValue.value;
		const setAnswer = this.setAnswer.value;
		const answerArray = this.state.answerOption.slice();

		console.log("setq answer", setAnswer)
		if(setLabel !== '' && setValue !== '') {
			answerArray.push({
				label: setLabel,
				value: setValue,
			})

			this.setState({
				answerOption: answerArray
			})

			this.setValue.value = "";
			this.setLabel.value = ""
		}
	},
	//Handles Codemirror implementation
	changeMode(e) {
		var mode = e.target.value;
		this.setState({
			mode: mode,
			code: defaults[mode]
		});

	},
	//Handles Codemirror implementation
	updateCode(newCode) {
		this.setState({
			code: newCode
		})
	},
	//Handles Codemirror implementation
	renderCode() {
		var options = {
			lineNumbers: true,
			mode: this.state.mode,
			theme: 'cobalt',
			fixedGutter: true
		};
		return (
			<div>
		 		<CodeMirror value={this.state.code} onChange={this.updateCode} options={options}/>
				<select onChange={this.changeMode} value={this.state.mode} className="fieldRow">
					<option value="markdown">Markdown</option>
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
		const title = this.state.updateQuestion.title;
		const body = this.question.value;
		const multiAnswer = this.setAnswer.value;
		const question = {
			title,
			type: this.state.showType,
			body,
			category: this.getCategory.value,
			difficulty: this.getLevel.value,
		};
		if(title !== '' && body !== '') {
			if(this.state.showType === 'code') {
				question.unitTest = this.state.code;
			}
			else {
				Object.assign(question,{
					multiChoice: this.state.answerOption,
					multiAnswer
				});
			}
			questionData.editQuestion(this.props.params.questionId)
				.then(res => {
					console.log("res", res)
					const questionsArray = Array.from(this.state.questions);
					questionsArray.push(res.question);
					console.log("questions array", questionsArray)
					this.setState({
						questions: questionsArray
					})
			});
			this.setAnswer.value = "";
		}
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
		console.log("val", e.target.value);
		console.log("lala", ogQ)
		this.setState({
			updatedQuestion: ogQ
		})
	},
	render() {
		console.log("sjdh", this.state.currQuestion)
		return (
			<div className="classCard">
				<h2>Questions</h2>
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
							<textarea value={this.state.updatedQuestion.body} className="inline largeLabel" ref={ref => this.question = ref} row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select value={this.state.updatedQuestion.difficulty} ref={ref => this.getLevel = ref}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" value={this.state.updatedQuestion.type} ref={ref => this.getType = ref} defaultValue={this.state.showType} onChange={(e) => this.changeQuestionView() }>
								<option value="multiple choice">Multiple Choice</option>
								<option value="code">Code</option>
							</select>
						</div>
						<div className="typeCard" onFocus={this.testing}>
							<div className={this.state.showType === 'multiple choice' ? 'showType' : 'hideType'}>
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
								<div className="fieldRow">
									{this.state.updatedQuestion.multiChoice.map((item, i) => {
										return (
											<div key={i}>
												<label>{item.label}</label>
												<input className="inline" name="lala" type="radio" value={item.value}/>
											</div>
										)
									})}
								</div>
								<div className="fieldRow">
									<label className="inline largeLabel">What is the answer?</label>
									<input type="text" ref={ref => this.setAnswer = ref}/>
								</div>
							</div>
							<div className={this.state.showType === 'code' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Code Based Question:</h3>
									{this.renderCode()}
								</div>
							</div>
						</div>
						<input type="submit" value="Save" className="success"/>
					</form>
				</section>
			</div>
		)
	}
});
