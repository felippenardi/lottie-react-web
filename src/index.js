import React from "react";
import PropTypes from "prop-types";
import lottie from "lottie-web";
import lottieApi from "lottie-api/dist/lottie_api";

export default class Lottie extends React.Component {
  componentDidMount() {
    const { options, eventListeners } = this.props;

    const {
      loop,
      autoplay,
      animationData,
      path,
      renderer = "svg",
      rendererSettings,
      assetsPath,
    } = options;

    this.options = {
      container: this.el,
      path,
      renderer,
      loop: loop !== false,
      autoplay: autoplay !== false,
      animationData,
      rendererSettings,
      assetsPath,
    };

    this.options = { ...this.options, ...options };

    this.anim = lottie.loadAnimation(this.options);
    this.setSpeed();
    this.setDirection();
    this.animApi = lottieApi.createAnimationApi(this.anim);
    this.registerEvents(eventListeners);
    this.setAnimationControl();

    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.segments) {
      this.playSegments(true);
    } else {
      this.play();
    }
  }

  componentWillUpdate(nextProps /* , nextState */) {
    /* Recreate the animation handle if the data is changed */
    if (this.options.animationData !== nextProps.options.animationData) {
      this.deRegisterEvents(this.props.eventListeners);
      this.destroy();
      this.options = { ...this.options, ...nextProps.options };
      this.anim = lottie.loadAnimation(this.options);
      this.animApi = lottieApi.createAnimationApi(this.anim);
      this.registerEvents(nextProps.eventListeners);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.options.loop !== undefined) {
      this.anim.loop = this.props.options.loop;
    }

    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.segments) {
      if (
        JSON.stringify(this.props.segments) ===
        JSON.stringify(prevProps.segments)
      ) {
        return;
      }
      this.playSegments(this.props.forceSegments);
    } else {
      this.play();
    }

    this.setAnimationControl();
    this.pause();
    this.setSpeed();
    this.setDirection();
  }

  componentWillUnmount() {
    this.deRegisterEvents(this.props.eventListeners);
    this.destroy();
    this.options.animationData = null;
    this.anim = null;
    this.animApi = null;
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.anim.setDirection(this.props.direction);
  }

  setAnimationControl() {
    const { animationControl } = this.props;
    if (animationControl) {
      const properties = Object.keys(animationControl);

      properties.forEach((property) => {
        const propertyPath = this.animApi.getKeyPath(property);
        const value = animationControl[property];
        this.animApi.addValueCallback(propertyPath, () => value);
      });
    }
  }

  play() {
    this.anim.play();
  }

  playSegments(shouldForce) {
    this.anim.playSegments(this.props.segments, shouldForce);
  }

  stop() {
    this.anim.stop();
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause();
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause();
    }
  }

  destroy() {
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  render() {
    const {
      width,
      height,
      ariaRole,
      ariaLabel,
      title,
      tabIndex,
    } = this.props;

    const getSize = (initial) => {
      let size;

      if (typeof initial === 'number') {
        size = `${initial}px`;
      } else {
        size = initial || '100%';
      }

      return size;
    };

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      overflow: 'hidden',
      margin: '0 auto',
      outline: 'none',
      ...this.props.style,
    };

    return (
      // Bug with eslint rules https://github.com/airbnb/javascript/issues/1374
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
        title={title}
        role={ariaRole}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      />
    );
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  forceSegments: PropTypes.bool,
  direction: PropTypes.number,
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  title: '',
  tabIndex: 0,
};
