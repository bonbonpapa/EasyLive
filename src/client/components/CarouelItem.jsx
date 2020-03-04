import React, { Component } from "react";
import "./CarouelItem.css";
import styled from "styled-components";

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
`;
const ItemCard = styled.div`
  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class CarouselLeftArrow extends Component {
  render() {
    return (
      <a
        href="#"
        className="carousel__arrow carousel__arrow--left"
        onClick={this.props.onClick}
      >
        <span className="fa fa-2x fa-angle-left" />
      </a>
    );
  }
}

class CarouselRightArrow extends Component {
  render() {
    return (
      <a
        href="#"
        className="carousel__arrow carousel__arrow--right"
        onClick={this.props.onClick}
      >
        <span className="fa fa-2x fa-angle-right" />
      </a>
    );
  }
}

class CarouselSlide extends Component {
  render() {
    const { description, price, defaultPaths } = this.props.slide;
    return (
      <div>
        <ItemCard
          className={
            this.props.index === this.props.activeIndex
              ? "carousel__slide carousel__slide--active"
              : "carousel__slide"
          }
        >
          <div>
            <img src={defaultPaths.frontendPath} />
          </div>
          <Info>
            <div>{description}</div>
            <div>{price} $</div>
          </Info>
        </ItemCard>
      </div>
    );
  }
}

// Carousel wrapper component
export default class CarouselItem extends Component {
  constructor(props) {
    super(props);

    this.goToSlide = this.goToSlide.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);

    this.state = {
      activeIndex: 0
    };
  }

  goToSlide(index) {
    this.setState({
      activeIndex: index
    });
  }

  goToPrevSlide(e) {
    e.preventDefault();

    let index = this.state.activeIndex;
    let { slides } = this.props;
    let slidesLength = slides.length;

    if (index < 1) {
      index = slidesLength;
    }

    --index;

    this.setState({
      activeIndex: index
    });
  }

  goToNextSlide(e) {
    e.preventDefault();

    let index = this.state.activeIndex;
    let { slides } = this.props;
    let slidesLength = slides.length - 1;

    if (index === slidesLength) {
      index = -1;
    }

    ++index;

    this.setState({
      activeIndex: index
    });
  }

  render = () => {
    return (
      <div class="carousel-container">
        <div className="carousel">
          <CarouselLeftArrow onClick={e => this.goToPrevSlide(e)} />

          <ul className="carousel__slides">
            {this.props.slides.map((slide, index) => (
              <CarouselSlide
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                slide={slide}
              />
            ))}
          </ul>
        </div>
        <div className="carousel">
          <ul className="carousel__slides">
            {this.props.slides.map((slide, index) => (
              <CarouselSlide
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                slide={slide}
              />
            ))}
          </ul>
        </div>
        <div className="carousel">
          <ul className="carousel__slides">
            {this.props.slides.map((slide, index) => (
              <CarouselSlide
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                slide={slide}
              />
            ))}
          </ul>

          <CarouselRightArrow onClick={e => this.goToNextSlide(e)} />
        </div>
      </div>
    );
  };
}

// Render Carousel component
//  render(<Carousel slides={carouselSlidesData} />, carouselContainer);
