var app = app || {};

// Todo Model
app.Todo = Backbone.Model.extend({

	// 'title' is todo item's title; 'completed' indicates if it's completed
	defaults: {
		title: '',
		completed: false
	},

	// toggle the 'completed' state of this todo
	toggle: function(){
		this.save({
			completed: !this.get('completed')
		});
	}
});

