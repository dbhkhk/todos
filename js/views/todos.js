// js/views/todos.js

var app = app || {};

app.TodoView = Backbone.View.extend({
	tagName: 'li', // create new <li>

	template: _.template( $('#item-template').html() ),

	events: {
		'click .toggle':  'toggleCompleted',
		'click .destroy': 'clear',
		'dbclick label':  'edit', // double click on item title to edit the title
		'keypress .edit': 'updateOnEnter', // either hit enter or 'blur' input will call updateOnEnter
		'blur .edit':     'close'
	},

	initialize: function(){
		// {model: todo} will be passed in when a TodoView is created
		// listen to model's change and render
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function(){
		this.$el.html( this.template( this.model.attributes ) );

		this.$el.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();

		this.$input = this.$('.edit'); // update this.$input once render is called
		return this;
	},

	toggleVisible: function(){
		this.$el.toggleClass('hidden', this.isHidden());
	},

	isHidden: function(){
		var isCompleted = this.model.get('completed');
		return (
			(!isCompleted && app.TodoFilter === 'completed')
			|| (isCompleted && app.TodoFilter === 'active')
		);
	},

	toggleCompleted: function(){
		this.model.toggle();
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
	},

	clear: function(){
		this.model.destroy();
	}
});