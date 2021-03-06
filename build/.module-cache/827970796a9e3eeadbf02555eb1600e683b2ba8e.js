// var firebaseApp = "https://my-firebase-app.firebaseio.com/";
var firebaseApp = "https://boodalaunch.firebaseio.com/events/twitter:2689192069/";
var cloudinary = "http://res.cloudinary.com/misberri/image/upload/";

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var currentSlide = 0;

var Slide = React.createClass({displayName: "Slide",
	render: function() {
		var classes = React.addons.classSet({
      'slide': true,
      'slide--active': this.props.isActive
    });
		return (
			React.createElement("div", {className: classes}, 
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
    	var isActive = currentSlide === index;
      return React.createElement(Slide, {key: index, title: slide.look.description, isActive: isActive}, 
	      slide.look.image.cloudinary_public_id
	      );
    });
    return React.createElement("div", {className: "slideList"}, slideNodes);
  }
});

// State transitions
var actions = {
  toggleNext: function() {
    console.log("something worked");
    var current = currentSlide;
    var next = current + 1;
    if (next > this.state.data.length - 1) {
      next = 0;
    }
    currentSlide = next;
    render(this.state)
  },
  togglePrev: function() {
    console.log("something worked");
    var current = currentSlide;
    var prev = current - 1;
    if (prev < 0) {
      prev = this.state.data.length - 1;
    }
    currentSlide = prev;
    render(this.state);
  },
  toggleSlide: function(id) {
    console.log("something worked");
    var index = this.state.data.map(function (el) {
      return (
        el.id
      );
    });
    var currentIndex = index.indexOf(id);
    currentSlide = currentIndex;
    render(this.state);
  }
};

// Prev and Next buttons
var Controls = React.createClass({displayName: "Controls",
  togglePrev: function() {
    actions.togglePrev();
  },
  toggleNext: function() {
    actions.toggleNext();
  },
  render: function() {
    return (
      React.createElement("div", {className: "controls"}, 
        React.createElement("div", {className: "toggle toggle--prev", onClick: this.togglePrev}, "Prev"), 
        React.createElement("div", {className: "toggle toggle--next", onClick: this.toggleNext}, "Next")
      )
    );
  }
});

var SlideBox = React.createClass({displayName: "SlideBox",
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return { data: [] };
  },
  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseApp), "data");
  },
  render: function() {
    return (
    	React.createElement("div", {className: "slideshow"}, 
	      React.createElement(SlideList, {data: this.state.data}), 
	      React.createElement(Controls, null)
      )
    );
  }
});

React.render(
  React.createElement(SlideBox, null),
  document.getElementById('content')
);