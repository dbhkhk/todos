// js/views/todos.js

var app = app || {};

app.TodoView = Backbone.View.extend({
	tagName: 'li', // create new <li>

	template: _.template( $('#item-template').html() ),

	events: {
		'dbclick label':  'edit', // double click on item title to edit the title
		'keypress .edit': 'updateOnEnter', // either hit enter or 'blur' input will call updateOnEnter
		'blur .edit':     'close'
	},

	initialize: function(){
		// {model: todo} will be passed in when a TodoView is created
		// listen to model's change and render
		this.listenTo(this.model, 'change', this.render);
	},

	render: function(){
		this.$el.html( this.template( this.model.attributes ) );
		this.$input = this.$('.edit'); // update this.$input once render is called
		return this;
	},

	edit: function(){
		this.$el.addClass('editing'); // give the item 'editing' style
		this.$input.focus(); // focus on input box
	},

	// if new input exists, update item title and remove 'editing' style
	close: function(){
		var value = this.$input.val().trim();

		if (value) {
			this.model.save({title: value});
		}

		this.$el.removeClass('editing');
	},

	updateOnEnter: function(e){
		if (e.which === ENTER_KEY) {
			this.close();
		}
	}
});