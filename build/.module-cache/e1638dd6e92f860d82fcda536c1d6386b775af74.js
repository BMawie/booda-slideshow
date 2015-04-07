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

var SlideList = React.createClass({displayName: "SlideList",
  render: function() {
    var slideNodes = this.props.data.map(function (slide, index) {
      return React.createElement(Slide, {key: index, title: slide.look.description}, slide.look.description);
    });
    return React.createElement("div", {className: "slideList"}, slideNodes);
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