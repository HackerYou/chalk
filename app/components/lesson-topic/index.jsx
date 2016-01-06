import React from 'react';
import Exercise from '../exercise/index.jsx';
import Markdown from 'react-remarkable';
import hljs from 'highlight.js';


export default React.createClass({
	displayName: 'LessonTopic',

	render(){
		let hl = function (str, lang) {
	    if (lang && hljs.getLanguage(lang)) {
	      try {
	        return hljs.highlight(lang, str).value;
	      } catch (err) {}
	    }
	    try {
	      return hljs.highlightAuto(str).value;
	    } catch (err) {}
	    return ''; // use external default escaping
	  };
		return (
			<div className="lessonTopic">
				<h2 className="lessonTitle">{this.props.details.title}</h2>
				<Markdown options={{'html':true, highlight: hl}}>{(this.props.details.body)}</Markdown>
			</div>
		)
	}
});
