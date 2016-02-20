var app = app || {};

// app.AppView is top-level view
app.AppView = Backbone.View.extend({

	el: '#todoapp',

	// template for the line of statistics at the bottom of the app
	statsTemplate: _.template( $('#stats-template').html() ),

	events: {
		'keypress #new-todo':     'createOnEnter', // create a new item
		'click #clear-completed': 'clearCompleted', // clear completed items
		'click #toggle-all':      'toggleAllComplete' // mark all items as completed
	},

	initialize: function(){
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);

		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.lestenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);

		app.Todos.fetch();
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

		this.allCheckbox.checked = !remaining;
	},

	// add a single todo item to the list by creating a view for it,
	// and appending its element to the '<ul>'
	addOne: function(todo){
		var view = new app.TodoView({model: todo});
		$('#todo-list').append(view.render().el);
	},

	// add all items in the Todos collection at once
	addAll: function(){
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},

	filterOne: function(todo){
		todo.trigger('visible');
	},

	filterAll: function(){
		app.Todos.each(this.filterOne, this);
	},

	newAttributes: function(){
		return {
			title: this.$input.val().trim(),
			order: app.Todos.nextOrder(),
			completed: false
		};
	},

	createOnEnter: function(event){
		if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
			return;
		}

		app.Todos.create(this.newAttributes());
		this.$input.val('');
	},

	clearCompleted: function(){
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},

	toggleAllComplete: function(){
		var completed = this.allCheckbox.checked;

		app.Todos.each(function(todo){
			todo.save({
				'completed': completed
			});
		});
	}
});