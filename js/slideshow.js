// var firebaseApp = "https://my-firebase-app.firebaseio.com/";
var firebaseApp = "https://boodalaunch.firebaseio.com/events/twitter:2689192069/";
var cloudinary = "http://res.cloudinary.com/misberri/image/upload/";

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var currentSlide = 0;
var e;

var Slide = React.createClass({
	render: function() {
		var classes = React.addons.classSet({
      'slide': true,
      'slidein': true,
      'slide--active': this.props.isActive
    });
    var id = this.props.isActive ? 'slide--active' : '';
		return (
			<div className={classes} id={id}>
				<div className="slide-image">
					<img src={"http://res.cloudinary.com/misberri/image/upload/"+this.props.children} />
				</div>
				<div className="slide-content">
					<h2 className="title">{this.props.title}</h2>
      	</div>
			</div>
			);
	}
});

var SlideList = React.createClass({
  render: function() {
  	if (currentSlide >= this.props.data.length) currentSlide = 0;
    var slideNodes = this.props.data.map(function (slide, index) {
    	var isActive = currentSlide === index;
      return <Slide key={index} title={slide.look.description} isActive={isActive} idx={index}>
	      {slide.look.image.cloudinary_public_id}
	      </Slide>;
    });
    return <div className="slideList">{slideNodes}</div>;
  }
});

var SlideBox = React.createClass({
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
    	<div className="slideshow">
	      <SlideList data={this.state.data} />
      </div>
    );
  }
});

var listener = function (e) {
  console.log(e.type);
  switch(e.type) {
    case "animationstart":
    case "webkitAnimationStart":
    	initE();
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
	e.addEventListener("webkitAnimationStart", listener, false);
	e.addEventListener("webkitAnimationEnd", listener, false);
	e.addEventListener("animationend", listener, false);
	e.addEventListener("webkitAnimationIteration", listener, false);
	e.addEventListener("animationiteration", listener, false);
}

var render = function() {
	React.render(
	  <SlideBox />,
	  document.getElementById('content')
	);
}

render();

setTimeout(initE, 2000);





