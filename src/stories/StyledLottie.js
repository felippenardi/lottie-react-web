import React from 'react';
import Lottie from '../index';
import * as animationData from './TwitterHeart.json';

export default class StyledLottie extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      transformInput: 0,
      opacityInput: 100,
      styles: {},
    };
  }

  handleStyleChanges(cssProperty) {
    this.setState(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [cssProperty.name]: cssProperty.value,
      },
    }));
  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
    };
    const { transformInput, opacityInput } = this.state;
    const defaultOptions = { animationData };

    return (<div>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        style={this.state.styles}
      />

      <p style={centerStyle}>Rotate: {transformInput}°</p>
      <input
        style={centerStyle}
        type="range" value={transformInput} min="0" max="360" step="5"
        onChange={(e) => {
          this.setState({ transformInput: e.currentTarget.value });
          this.handleStyleChanges({ name: 'transform', value: `rotate(${e.currentTarget.value}deg)` });
        }}
      />
      <p style={centerStyle}>Opacity: {opacityInput}</p>
      <input
        style={centerStyle}
        type="range" value={opacityInput} min="0" max="100" step="10"
        onChange={(e) => {
          this.setState({ opacityInput: +e.currentTarget.value });
          this.handleStyleChanges({ name: 'opacity', value: +e.currentTarget.value / 100 });
        }}
      />
    </div>);
  }
}
