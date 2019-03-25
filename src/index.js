import React, {useEffect, useState, useRef} from 'react';
// import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import lottieApi from 'lottie-api/dist/lottie_api';

// LottieTypes
export default function Lottie({ props }) {
  useEffect(() => {
    const {
      optionsIn,
    } = props;
    const { eventListeners } = props;

    const el = useRef(null);

    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
      segments,
    } = optionsIn;

    let options = {
      container: el.current,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
    };

    options = { ...options, ...optionsIn };

    let anim = lottie.loadAnimation(options);

    const setSpeed = () => {
      anim.setSpeed(props.speed);
    };

    const setDirection = () => {
      anim.setDirection(props.direction);
    };

    const setAnimationControl = () => {
      const { animationControl } = props;
      if (animationControl) {
        const properties = Object.keys(animationControl);

        properties.forEach((property) => {
          const propertyPath = animApi.getKeyPath(property);
          const value = animationControl[property];
          animApi.addValueCallback(propertyPath, () => value);
        });
      }
    };

    const play = () => {
      anim.play();
    };

    const playSegments = (shouldForce) => {
      anim.playSegments(props.segments, shouldForce);
    };

    const stop = () => {
      anim.stop();
    };

    const pause = () => {
      if (props.isPaused && !anim.isPaused) {
        anim.pause();
      } else if (!props.isPaused && anim.isPaused) {
        anim.pause();
      }
    };

    const destroy = () => {
      anim.destroy();
    };

    const registerEvents = (eventListeners) => {
      eventListeners.forEach((eventListener) => {
        anim.addEventListener(eventListener.eventName, eventListener.callback);
      });
    };

    const deRegisterEvents = (eventListeners) => {
      eventListeners.forEach((eventListener) => {
        anim.removeEventListener(eventListener.eventName, eventListener.callback);
      });
    };


    setSpeed();
    setDirection();
    animApi = lottieApi.createAnimationApi(anim);
    registerEvents(eventListeners);
    setAnimationControl();

    return () => {
      deRegisterEvents(props.eventListeners);
      destroy();
      options.animationData = null;
      anim = null;
      animApi = null;
    }
  }, []);

  // componentWillUpdate(nextProps
  useEffect( () => {
    /* Recreate the animation handle if the data is changed */
    if (options.animationData !== nextProps.options.animationData) {
      deRegisterEvents(props.eventListeners);
      destroy();
      options = { ...options, ...nextProps.options };
      anim = lottie.loadAnimation(options);
      animApi = lottieApi.createAnimationApi(anim);
      registerEvents(nextProps.eventListeners);
    }
  });

  // componentDidUpdate
  useEffect( () => {
    if (props.isStopped) {
      stop();
    } else if (props.segments) {
      const shouldForce = !!props.forceSegments;
      playSegments(shouldForce);
    } else {
      play();
    }

    setAnimationControl();
    pause();
    setSpeed();
    setDirection();
  });

  // Render
  const {
    width,
    height,
    ariaRole,
    ariaLabel,
    title,
  } = props;

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
    ...props.style,
  };

  return (
    // Bug with eslint rules https://github.com/airbnb/javascript/issues/1374
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={el}
      style={lottieStyles}
      title={title}
      role={ariaRole}
      aria-label={ariaLabel}
      tabIndex="0"
    />
  );
}

/*
ref={(c) => {
        el = c;
      }}
*/

/*
type LottieTypes = {
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
};

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  title: '',
};
*/
