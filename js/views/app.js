// js/views/app.js

var app = app || {};

// app.AppView is top-level view
app.AppView = Backbone.View.extend({

	el: '#todoapp',

	// template for the line of statistics at the bottom of the app
	statsTemplate: _.template( $('#stats-template').html() ),

	events: {
		'keypress #new-todo':     'createOnEnter', // create a new item when enter is pressed during input
		'click #clear-completed': 'clearCompleted', // clear completed items when 'clear completed' button is clicked
		'click #toggle-all':      'toggleAllComplete' // toggle all items' state when 'mark all' checkbox is clicked
	},

	initialize: function(){
		this.allCheckbox = this.$('#toggle-all')[0]; // need [0] so that this.allCheckbox.checked can be used
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);

		// trigger a model's 'visible' event when its 'completed' state is changed
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);

		app.Todos.fetch(); // fetch models for app.Todos collection
	},

	// re-rendering means refreshing the statistics
	render: function(){
		var completed = app.Todos.completed().length; // number of completed items
		var remaining = app.Todos.remaining().length; // number of non-completed items

		if (app.Todos.length) { // if there is one or more items
			// show item list and footer
			this.$main.show();
			this.$footer.show();

			// refresh statistics
			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected') // set all categories as not selected
				.filter('[href="#/' + (app.TodoFilter || '') + '"]') // either one category is selected or nothing is selected
				.addClass('selected');
		} else {
			// if there is no item, hide item list and footer
			this.$main.hide();
			this.$footer.hide();
		}

		// if there is no remaining, box is checked
		// if there is one or more remaining, box is unchecked
		this.allCheckbox.checked = !remaining;
	},

	// add a single todo item to the list by creating a view for it,
	// and appending its element to the '<ul>'
	addOne: function(todo){
		var view = new app.TodoView({model: todo});
		$('#todo-list').append(view.render().el); // when the view changes, the appended element will change accordingly
	},

	// add all items in the Todos collection at once
	addAll: function(){
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},

	// trigger a todo model's 'visible' event
	filterOne: function(todo){
		todo.trigger('visible');
	},

	// apply filterOne to all models in Todos collection
	filterAll: function(){
		app.Todos.each(this.filterOne, this);
	},

	// make new attributes for createOnEnter
	newAttributes: function(){
		return {
			title: this.$input.val().trim(), // set title to input value
			order: app.Todos.nextOrder(),
			completed: false
		};
	},

	// create a model when enter is hit in input
	createOnEnter: function(event){
		// if the key pressed is not enter key OR if the input is just whitespace, do nothing
		if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
			return;
		}

		// if the key pressed is enter key and the input is more than just whitespace
		app.Todos.create(this.newAttributes()); // create = instantiate + save + add to set
		this.$input.val(''); // reset the input to blank
	},

	// destroy completed models on the server (localStorage)
	clearCompleted: function(){
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},

	// change all items' 'completed' attribute according to the state of the checkbox and save to database
	toggleAllComplete: function(){
		var completed = this.allCheckbox.checked; // know if the checkbox is checked

		app.Todos.each(function(todo){
			todo.save({
				'completed': completed
			});
		});
	}
});