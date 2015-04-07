// var firebaseApp = "https://my-firebase-app.firebaseio.com/";
var firebaseApp = "https://boodalaunch.firebaseio.com/events/twitter:2689192069/";

var converter = new Showdown.converter();

var Slide = React.createClass({displayName: "Slide",
	render: function() {
		var rawMarkup = converter.makeHtml(this.props.children.toString());
		return (
			React.createElement("div", {className: "slide"}, 
				React.createElement("h2", {className: "title"}, this.props.look.description), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
			);
	}
});
var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, this.props.author), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

var SlideList = React.createClass({displayName: "SlideList",
  render: function() {
    var slideNodes = this.props.data.map(function (slide, index) {
      return React.createElement(Slide, {key: index, title: slide.look.description}, slide.look.description);
    });
    return React.createElement("div", {className: "slideList"}, slideNodes);
  }
});
var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return React.createElement(Comment, {key: index, author: comment.author}, comment.text);
    });
    return React.createElement("div", {className: "commentList"}, commentNodes);
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
        React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments});

    // Here we push the update out to Firebase
    this.firebaseRefs["data"].push(comment);
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseApp + "commentBox"), "data");
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});

var SlideBox = React.createClass({displayName: "SlideBox",
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(slide) {
    var slides = this.state.data;
    slides.push(slide);
    this.setState({data: slides});

    // Here we push the update out to Firebase
    this.firebaseRefs["data"].push(slide);
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseApp + "slideBox"), "data");
  },
  render: function() {
    return (
      React.createElement("div", {className: "slideBox"}, 
        React.createElement("h1", null, "Slides"), 
        React.createElement(SlideList, {data: this.state.data})
      )
    );
  }
});

React.render(
  React.createElement(SlideBox, null),
  document.getElementById('content')
);