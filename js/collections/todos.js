var app = app || {};

// TodoList collection
var TodoList = Backbone.Collection.extend({

	// this collection's model
	model: app.Todo,

	// save all todo items under 'todos-backbone' namespace
	localStorage: new Backbone.LocalStorage('todos-backbone'),

	// method to get all todo items that are completed 
	completed: function(){
		return this.filter(function(todo){
			return todo.get('completed');
		});
	},

	// method to get all todo items that are not completed
	remaining: function(){
		return this.without.apply(this, this.completed());
	},

	// generate order number for the next todo item
	nextOrder: function(){
		if (!this.length){
			return 1;
		}
		return this.last().get('order') + 1;
	},

	// Todos are sorted by their original insertion order
	comparator: function(todo){
		return todo.get('order');
	}
});

// create our global collection of todos
app.Todos = new TodoList(); // why use capital T?