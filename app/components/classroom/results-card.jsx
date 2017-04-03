import React from 'react';
import { Link , History} from 'react-router';

function correctAnswers(test) {
	return test.answers.filter((item) => {
		return item.correct === true || item.correct.numFailedTestSuites === 0
	});
}

const getResults = (testResults, testsTaken) => {
	let results = [];

	// tests and results are stored in separate places, let's merge them together
	const testsWithResults = testsTaken.map((test) => {
		for (let key in testResults) {
			if(key === test._id) {
				test.answers = testResults[key].answers
			}
		}
		return test;
	});

	testsWithResults.forEach((test) => {
		const { title, answers, questions } = test;
		const mark = answers ? answers.filter((answer) => answer.correct).length : []
		const outOf = questions.length;
		const requiredToPass = questions.length * 0.6;
		const passed = (mark / questions.length) > 0.6;

		const result = {
			title,
			answers,
			questions,
			mark,
			outOf,
			passed
		}
		results.push(result);
	});


	return results;
}

const showResults = (results, isAdmin) => {
	results = results.map((result, i) => {
		const { mark, outOf, passed, title } = result;
		const modifier = passed ? "pass" : "fail";

		return (
		<li key={`testProgress-${i}`} className='testProgress__test' >
			<div className={`testProgress__circles testProgress__circles--${modifier}`}>
				<i className='fa fa-check'></i>
			</div>
			 <span className='testProgress__testName'>{title}</span>&nbsp;<span>{isAdmin ? `(${mark}/${outOf})` : null}</span>
		</li>)
	});

	return results;
}

export default function TestCard(props) {
	const testRes = props.studentInfo.tests;
	const answers = [];
	const correct = {};
	for(let key in props.studentInfo.test_results) {
		answers.push(props.studentInfo.test_results[key]);
	}
	const results = getResults(props.studentInfo.test_results, props.studentInfo.tests);

	return (
		<div className="classCard">
			<article className="card">
				<h3 className="studentName">{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress">
						{showResults(results, props.isAdmin)}
					</ul>
				</div>
			</article>
		</div>
	)
}
