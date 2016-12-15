import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import TestData from '../../services/tests.jsx';
import questionData from '../../services/questions.jsx'
import config from '../../services/config.jsx';
import CreateTest from '../create-test/index.jsx';
import QuestionCards from '../questions/cards.jsx';
import CodeMirror from 'react-codemirror';

let defaults = {
	markdown: '# Heading\n\nWrite your notes here!',
	javascript: 'var code = {\n\Write your code here!};'
};

export default React.createClass({
	displayName: 'ViewTest',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			members: [],
			questions: [],
			code: defaults.markdown,
			mode: 'markdown'
		}
	},
	componentDidMount() {
		//this.props.params.testId
		TestData.getTest("5851be14c6453c7d2925b889")
			.then(res => {
				console.log("the test", res)
				const questions = res.test.questions;
				this.setState({
					questions
				})
			});
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
	renderQuestions() {
		const questions = this.state.questions;
		return (
			questions.map((res, i) => {
				// console.log(res)
				let mc = res.multiChoice;
				const code = res.unitTest;
				return (
					<div key={i} className="full detailsForm card">
						<h3>{res.body}</h3>
						{
							(() => {
								if(res.type === "multiple choice") {
									return mc.map((item, i) => {
										return (
											<div key={i} className="fieldRow fieldRowQuestion">
												<input name={res._id} type="radio" value={item.value} />
												<label>{item.label}</label>
											</div>
										)
									});
								} else {
									return (
										<div>
											<p>{code}</p>
											{this.renderCode()}
										</div>
									) 
								} 
							})()
						}
					</div>
				)
			})
		)
	},
	render() {
		return (
			<div className="classCard">
				<h2>Show Test</h2>
				{this.renderQuestions()}
			</div>
		)
	}	

});
