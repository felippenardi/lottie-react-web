import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef} from 'react';
// import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import lottieApi from 'lottie-api/dist/lottie_api';

// LottieTypes
export default forwardRef(function Lottie(props, ref) {
  const { eventListeners } = props;
  ref = ref || React.createRef({});
  const el = useRef(null);
  const [anim, setAnim] = useState(null);
  // const [animData, setAnimData] = useState(null);
  const [animApi, setAnimApi] = useState(null);
  const [state, setState] = useState({play: true, speed: props.speed || 1})
  // const [animationDataOld, setAnimationData] = useState(null);
  

  // Config
  const {
    loop,
    autoplay,
    rendererSettings,
    segments,
  } = props.options;
  let animationData = props.options.animationData;
  if(animationData && animationData.default) animationData = animationData.default;

  const options = {
    ...props.options,
    container: el.current || null,
    renderer: 'svg',
    loop: loop !== false,
    autoplay: autoplay !== false,
    segments: segments !== false,
    animationData,
    rendererSettings,
  };

  const setSpeed = (speed = null) => {
    // _anim = _anim || anim;
    // if(!_anim) return;
    // _anim.setSpeed(speed || props.speed);
    const s = speed || props.speed;
    setState(p=>({...p, speed: s}));
  };

  const setDirection = (direction = null) => {
    // _anim = _anim || anim;
    // if(!_anim) return;
    // _anim.setDirection(props.direction);
    setState(p=>({...p, direction: direction || props.direction}));
  };

  const setAnimationControl = (_animApi) => {
    _animApi = _animApi || animApi;
    if(!_animApi) return;
    const { animationControl } = props;
    if (animationControl) {
      const properties = Object.keys(animationControl);

      properties.forEach((property) => {
        const propertyPath = _animApi.getKeyPath(property);
        const value = animationControl[property];
        _animApi.addValueCallback(propertyPath, () => value);
      });
    }
  };

  const play = () => {
    // _anim = _anim || anim;
    // if(!_anim) return;
    // _anim.play();
    setState(p=>({...p, play: true, pause: false, segments: null}));
  };

  const playSegments = (segments, shouldForce) => {
    // if(!anim) return;
    setState(p=>({...p, segments: segments || props.segments, shouldForce: shouldForce}))
  };

  const stop = () => {
    // if(!anim) return;
    // anim.stop();
    setState(p=>({...p, play: false, pause: false}));
  };

  const pause = () => {
    // if(!anim) return;
    // if(state.pause != props.isPaused) 
    setState(p=>({...p, pause: true}));
    /*
    if (props.isPaused && !anim.isPaused) {
      // anim.pause();
      setState(p=>({...p, pause: true}));
    } else if (!props.isPaused && anim.isPaused) {
      anim.pause();
    }*/
  };

  const destroy = () => {
    if(!anim) return;
    anim.destroy();
  };

  const registerEvents = (eventListeners, _anim) => {
    if(!eventListeners) return;
    _anim = _anim || anim;
    eventListeners.forEach((eventListener) => {
      _anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  };

  const deRegisterEvents = (eventListeners, _anim) => {
    if(!eventListeners) return;
    _anim = _anim || anim;
    eventListeners.forEach((eventListener) => {
      _anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  };

  useEffect(() => {
    options.container = el.current;

    const _anim = lottie.loadAnimation(options);
    const _animApi = lottieApi.createAnimationApi(_anim);
    setAnim(_anim);
    setAnimApi(_animApi);

    setSpeed(props.speed);
    // setDirection();
    registerEvents(eventListeners, _anim);
    setAnimationControl(_animApi);

    return () => {
      deRegisterEvents(props.eventListeners, _anim);
      destroy();
      options.animationData = null;
      // setAnim(null);
      // setAnimApi(null);
    };
  }, [el, options.animationData]);

  useImperativeHandle(ref, () => ({
    play: play,
    registerEvents: registerEvents,
    deRegisterEvents: deRegisterEvents,
    setSpeed: setSpeed,
    setDirection: setDirection,
    anim: anim, 
    animApi: animApi,
    playSegments: playSegments,
    pause: pause,
    destroy: destroy,
    stop: stop
  }));

  // componentDidUpdate
  useEffect( () => {
    if (props.isStopped) stop();
    else if (props.segments && props.segments !== state.segments) {
      const shouldForce = !!props.forceSegments;
      playSegments(props.segments, shouldForce);
    } else {
      play();
      // console.log('aw')
    }

    if(props.isPaused) pause();
    if(props.speed) setSpeed(props.speed);
    if(props.direction) setDirection(props.direction);

    // setAnimationControl();
  }, [props]);

  useEffect( () => {
    if(!anim) return;
    if(state.pause) anim.pause();
    else if(state.segments) anim.playSegments(state.segments, state.shouldForce);
    else if(state.play===true) anim.play();
    else if(state.play===false) anim.stop();

    if(state.speed) anim.setSpeed(state.speed);
    if(state.direction) anim.setDirection(state.direction);
    // setSpeed(state.speed);
    // (state.direction);
  }, [state, anim]);

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
});

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
