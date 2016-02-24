// js/views/todos.js

var app = app || {};

app.TodoView = Backbone.View.extend({
	tagName: 'li', // create new <li>

	template: _.template( $('#item-template').html() ),

	events: {
		'click .toggle':  'toggleCompleted', // click the checkbox in front of each item to toggle 'completed'
		'click .destroy': 'clear', // click the 'x' following the item to clear
		'dbclick label':  'edit', // double click on item title to edit the title
		'keypress .edit': 'updateOnEnter',
		'blur .edit':     'close'
	},

	initialize: function(){
		// {model: todo} will be passed in when a TodoView is created
		this.listenTo(this.model, 'change', this.render); // listen to model's change and render
		this.listenTo(this.model, 'destroy', this.remove); // remove the view and its el from the DOM, also stop all listening
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function(){
		this.$el.html( this.template( this.model.attributes ) );

		this.$el.toggleClass('completed', this.model.get('completed')); // toggle 'completed' class accordingly
		this.toggleVisible(); // toggle 'hidden' class accordingly

		this.$input = this.$('.edit'); // update this.$input once render is called
		return this;
	},

	// toggle class 'hidden' according to isHidden()
	toggleVisible: function(){
		this.$el.toggleClass('hidden', this.isHidden());
	},

	// returns true if 'hidden' class should be added
	//         false if 'hidden' class should be removed
	isHidden: function(){
		var isCompleted = this.model.get('completed');
		return (
			(!isCompleted && app.TodoFilter === 'completed')
			|| (isCompleted && app.TodoFilter === 'active')
		);
	},

	// toggle 'completed' status of the model
	toggleCompleted: function(){
		this.model.toggle();
	},

	// switch the view into 'editing' mode, display the input field
	edit: function(){
		this.$el.addClass('editing');
		this.$input.focus();
	},

	// if new input exists, update item title; remove 'editing' style
	close: function(){
		var value = this.$input.val().trim();

		if (value) {
			this.model.save({title: value});
		}

		this.$el.removeClass('editing');
	},

	// called when keypress on input
	// if it's enter key, update and close editing
	updateOnEnter: function(e){
		if (e.which === ENTER_KEY) {
			this.close();
		}
	},

	// called when the destroy button after an todo item is clicked
	// destroy the model on server
	clear: function(){
		this.model.destroy();
	}
});