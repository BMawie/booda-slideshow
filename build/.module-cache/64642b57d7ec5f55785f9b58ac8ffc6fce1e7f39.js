// var firebaseApp = "https://my-firebase-app.firebaseio.com/";
var firebaseApp = "https://boodalaunch.firebaseio.com/events/twitter:2689192069/";
var cloudinary = "http://res.cloudinary.com/misberri/image/upload/";

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var currentSlide = 0;
var e;

var Slide = React.createClass({displayName: "Slide",
	render: function() {
		var classes = React.addons.classSet({
      'slide': true,
      'slidein': true,
      'slide--active': this.props.isActive
    });
    var id = this.props.isActive ? 'slide--active' : '';
		return (
			React.createElement("div", {className: classes, id: id}, 
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
      return React.createElement(Slide, {key: index, title: slide.look.description, isActive: isActive, idx: index}, 
	      slide.look.image.cloudinary_public_id
	      );
    });
    return React.createElement("div", {className: "slideList"}, slideNodes);
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
	      React.createElement(SlideList, {data: this.state.data})
      )
    );
  }
});

var render = function() {
	React.render(
	  React.createElement(SlideBox, null),
	  document.getElementById('content')
	);
	initE();
}

render();

var listener = function (e) {
  console.log(e.type);
  switch(e.type) {
    case "animationstart":
      break;
    case "animationend":
    case "webkitAnimationEnd":
    case "animationiteration":
    case "webkitAnimationIteration":
    	currentSlide += 1;
    	render();
      break;
  }
};

var initE = function() {
	e = document.getElementById('slide--active');
	e.addEventListener("animationstart", listener, false);
	e.addEventListener("webkitAnimationEnd", listener, false);
	e.addEventListener("animationend", listener, false);
	e.addEventListener("webkitAnimationIteration", listener, false);
	e.addEventListener("animationiteration", listener, false);
}

setTimeout(initE, 2000);




