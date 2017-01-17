import React from 'react';
import CodeMirror from 'react-codemirror';
require('codemirror/mode/javascript/javascript');

export default function(props) {
	const defaultOptions = {
		lineNumbers: true,
		mode: 'javascript',
		theme: 'material',
		fixedGutter: true
	}
	return (
		<div>
			<section className="codeContainer">
				<div className="codeArea">
					<h4>Unit Test</h4>
		 			<CodeMirror value={props.code} onChange={props.updateCode} options={defaultOptions}/>
				</div>
				<div className="codeArea">
					<h4>Test area (test that the unit test works)</h4>
		 			<CodeMirror value={props.testCode} onChange={props.updateTestCode} options={Object.assign(defaultOptions,{mode: props.testMode})}/>
					<select onChange={props.changeMode} value={props.testMode} className="fieldRow">
						<option value="javascript">JavaScript</option>
						<option value="html">HTML</option>
					</select>
				</div>
			</section>
			<section className="console">
				{(() => {
						if(props.assertionError !== '') {
							return (
								<pre>
									{props.assertionError}
								</pre>
							)
						}
				})()}
				<ul> 
					{props.assertions.map((results) => {
						return results.assertionResults.map((assertion,i) => {
							return <li key={`assertion-${i}`}>{assertion.status} - {assertion.title}</li>
						});
					})}

				</ul>
			</section>
			{
				(() => {
					if(props.questionId !== '') {
						return <input type="submit" value="validate" onClick={props.validateCode} className="success"/>
					}
					else {
						return <p>Submit your question to be able to validate the code.</p>
					}

				})()
				
			}
		</div>
	)
}