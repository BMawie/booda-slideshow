/** @jsx React.DOM */
var TodoList2 = React.createClass({displayName: "TodoList2",
  render: function() {
    var createItem = function(item, index) {
      return React.createElement("li", {key:  index },  item.text);
    };
    return React.createElement("ul", null,  this.props.items.map(createItem) );
  }
});

var TodoApp2 = React.createClass({displayName: "TodoApp2",
  getInitialState: function() {
    this.items = [];
    return {items: [], text: ""};
  },

  componentWillMount: function() {
    this.firebaseRef = new Firebase("https://ReactFireTodoApp.firebaseio.com/items/");
    this.firebaseRef.limitToLast(25).on("child_added", function(dataSnapshot) {
      // Only keep track of 25 items at a time
      if (this.items.length === 25) {
        this.items.splice(0, 1);
      }

      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(TodoList2, {items:  this.state.items}), 
        React.createElement("form", {onSubmit:  this.handleSubmit}, 
          React.createElement("input", {onChange:  this.onChange, value:  this.state.text}), 
          React.createElement("button", null,  "Add #" + (this.state.items.length + 1) )
        )
      )
    );
  }
});

React.render(React.createElement(TodoApp2, null), document.getElementById("todoApp2"));