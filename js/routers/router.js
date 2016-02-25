// js/routers/router.js

var app = app || {};

var Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
		// matches ...index.html#anything; pass "anything" in setFilter except:
		// if "anything" starts with '/', pass string after '/'
	},

	setFilter: function(param){
		if (param) {
			param = param.trim();
		}
		app.TodoFilter = param || '';

		// trigger a collection 'filter' event, causing hiding/unhiding of Todo view items
		app.Todos.trigger('filter');
	}
});

// create an instance of the router
app.TodoRouter = new Workspace();

// route the initial URL
Backbone.history.start();