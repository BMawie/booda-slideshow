// var firebaseApp = "https://my-firebase-app.firebaseio.com/";
var firebaseApp = "https://boodalaunch.firebaseio.com/events/twitter:2689192069/";
var cloudinary = "http://res.cloudinary.com/misberri/image/upload/";

var Slide = React.createClass({displayName: "Slide",
	render: function() {
		return (
			React.createElement("div", {className: "slide"}, 
				React.createElement("div", {className: "slide-image"}, 
					React.createElement("img", {src: "http://res.cloudinary.com/misberri/image/upload/"+this.props.children})
				), 
				React.createElement("div", {className: "slide-content"}, 
					React.createElement("h2", {className: "title"}, this.props.title)
      	)
			)
			);
	}
});

var SlideList = React.createClass({displayName: "SlideList",
  render: function() {
    var slideNodes = this.props.data.map(function (slide, index) {
      return React.createElement(Slide, {key: index, title: slide.look.description}, 
	      slide.look.image.cloudinary_public_id
	      );
    });
    return React.createElement("div", {className: "slideList"}, slideNodes);
  }
});

var SlideBox = React.createClass({displayName: "SlideBox",
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseApp), "data");
  },
  render: function() {
    return (
      React.createElement(SlideList, {data: this.state.data})
    );
  }
});

React.render(
  React.createElement(SlideBox, null),
  document.getElementById('content')
);