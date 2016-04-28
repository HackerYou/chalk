import React from 'react';
import AuthMixin from '../../services/authMixin.jsx';
import { Link, History } from 'react-router';
import coursesData from '../../services/courses.jsx';

let placeholder = document.createElement('li');
placeholder.className = 'placeholder';

export default React.createClass({
	displayName: 'Section-List',
	mixins:[AuthMixin,History],
	getInitialState(){
		return {
			section: {
				lessons: [],
				classroomId: this.props.classroomId
			}
		}
	},
	componentDidMount(){
		coursesData.getSection(this.props.id).then(res=>{
			this.setState({
				section: res.section
			});

		})
	},
	componentDidUpdate(){
		// when drag and drop reordering occurs, update section
		coursesData.updateSection(this.props.id, this.state.section);
	},
	dragStart(e){
		this.dragged = e.currentTarget;
		e.dataTransfer.effectAllowed = 'move'
		// Firefox requires calling dataTransfer.setData for the drag to work 
		//(http://webcloud.se/sortable-list-component-react-js/)
		e.dataTransfer.setData('text/html', e.currentTarget);
	},
	dragEnd(e){
		this.dragged.style.display = 'flex';
		this.dragged.parentNode.removeChild(placeholder);

		//update state
		let lessons = this.state.section.lessons;
		let prevIndex = Number(this.dragged.dataset.id);
		var newIndex = Number(this.over.dataset.id);

		if (prevIndex < newIndex) newIndex--;
		if(this.nodePlacement == "after") newIndex++;

		lessons.splice(prevIndex, 0, lessons.splice(newIndex, 1)[0]);
		this.setState({
			section: {
				lessons: lessons,
				classroomId: this.props.classroomId
			}
		});
	},
	dragOver(e){
		e.preventDefault;
		this.dragged.style.display = 'none';
		if(e.target.className == 'placeholder') return;
		if(e.target.hasAttribute("draggable")) {
			this.over = e.target;
			//track relative positioning of mouse inside element being dragged over
			var pos = this.over.getBoundingClientRect();
			var mousePos = e.clientY;
			var relY = mousePos - pos.top;
			var height = this.over.offsetHeight / 2;
			let parent = e.target.parentNode;

			if (relY > height){
				this.nodePlacement = 'after';
				parent.insertBefore(placeholder, this.over.nextElementSibling);
			} else if (relY < height){
				this.nodePlacement = "before";
				parent.insertBefore(placeholder, this.over);
			} 
			
		}
	},
	renderLessons(key, index){
		return <li key={index} index={index} data-id={index} className="lessonRow" draggable="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart} >
				<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.props.classroomId}`} className="lessonInfo">
					<p className="lessonTitle">{this.state.section.lessons[index].title}</p>
				</Link>
				<div className="lessonMeta">
					<span>
						<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.props.classroomId}`}>view</Link>
						<Link to={`/lesson/${this.state.section.lessons[index]._id}/${this.props.classroomId}/edit`}>|edit</Link>
					</span>
				</div>
		</li>
	},
	render(){
		return (
			<ol onDragOver={this.dragOver}>
			 {(this.state.section.lessons).map(this.renderLessons)}
			</ol>
		)
	}
});
