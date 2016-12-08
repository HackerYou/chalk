import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from '../questions/cards.jsx';
let CodeMirror = require('react-codemirror');

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
			showCategory: 'html',
			showLevel: 'easy',
			questions: [],
			realAnswer: "",
			showFiltered: false,
			filteredQuestions: []
		}
	},
	componentWillMount() {
		questionData.getQuestion()
			.then(data => {
				this.setState({
					questions: data.questions
				});
			});
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
			mode: this.state.mode
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
			return <QuestionCards key={`question-${i}`} question={item} removeCard={this.removeCard}/>
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
	addQuestion(e) {
		e.preventDefault();
		const title = this.questionTitle.value;
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
			questionData.createQuestion(question).then(res => {
				const questionsArray = Array.from(this.state.questions);
				questionsArray.push(res.question);
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
	filterSearch(e) {
		e.preventDefault();
		const category = this.searchCategory.value;
		const type = this.searchType.value;
		const difficulty = this.searchLevel.value;
		// const searchKey = this.searchKey.value;
		const compare = (filteredOption,key) =>  {
			return (question) => {
				return filteredOption === 'all' || question[key] === filteredOption;
			}
		}
		const questions = this.state.questions
			.filter(compare(category,'category'))
			.filter(compare(type,'type'))
			.filter(compare(difficulty,'difficulty'));
			
		if(category !== 'all' || type !== 'all' || difficulty !== 'all') {
			this.setState({
				showFiltered: true,
				filteredQuestions: questions
			});
		}
		else {
			this.setState({
				showFiltered: false
			});
		}
	},
	changeQuestionView() {
		this.setState({
			showType: this.getType.value
		});
	},
	render() {
		return (
			<div className="classCard">
				<h2>Questions</h2>
				<section className="full detailsForm topicsForm card">
					<h3>Assign Attributes to your Question:</h3>
					<form onSubmit={this.addQuestion}>
						<div className="fieldRow">
							<label className="inline largeLabel">Title of your question:</label>
							<input type="text" ref={ref => this.questionTitle = ref}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Category</label>
							<select ref={ref => this.getCategory = ref}>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">What is the Question?</label>
							<textarea className="inline largeLabel" ref={ref => this.question = ref} row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select ref={ref => this.getLevel = ref}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" ref={ref => this.getType = ref} defaultValue={this.state.showType} onChange={(e) => this.changeQuestionView() }>
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
									{this.state.answerOption.map((item, i) => {
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
						<input type="submit" value="Submit" className="success"/>
					</form>
				</section>
				
				<section className="full detailsForm topicsForm card">
					<form onSubmit={this.filterSearch}>
						<div className="fieldRow">
							<h3>Filter Search:</h3>
							<label className="inline largeLabel">Category</label>
							<select ref={ref => this.searchCategory = ref}>
								<option value="all">All</option>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
							<label className="inline largeLabel">Search keyword</label>
							<input type="text" ref={ref => this.searchKey = ref} />
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select ref={ref => this.searchLevel = ref}>
								<option value="all">All</option>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label className="inline largeLabel">Type</label>
							<select ref={ref => this.searchType = ref}>
								<option value="all">All</option>
								<option value="multiple choice">Multiple Choice</option>
								<option value="code">Code</option>
							</select>
							<input type="submit" value="Search" className="primary"/>
						</div>
					</form>
				</section>
				<section>
					<h3>All Questions:</h3>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
				</section>
			</div>
		)
	}
});
