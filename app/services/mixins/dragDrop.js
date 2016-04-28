'use strict'
let placeholder = document.createElement('li');
placeholder.className = 'placeholder';

export default {

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
			var relY = e.clientY - this.over.offsetTop;
			var height = this.over.offsetHeight / 2;
			let parent = e.target.parentNode;

			if (relY > height){
				this.nodePlacement = 'after';
				parent.insertBefore(placeholder, e.target.nextElementSibling);
			} else if (relY < height){
				this.nodePlacement = "before";
				parent.insertBefore(placeholder, e.target);
			} 
			
		}
	}
}