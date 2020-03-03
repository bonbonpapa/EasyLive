import React, { Component } from "react";
import "./CarouelItem.css";

import styled from "styled-components";
import Card from "@material-ui/core/Card";

const ItemCard = styled(Card)`
  img {
    width: 200px;
    height: 200px;
    float: left;
    object-fit: cover;
  }
`;
const Info = styled.div`
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

class CarouselIndicator extends Component {
  render() {
    return (
      <li>
        <a
          className={
            this.props.index == this.props.activeIndex
              ? "carousel__indicator carousel__indicator--active"
              : "carousel__indicator"
          }
          onClick={this.props.onClick}
        />
      </li>
    );
  }
}

class CarouselSlide extends Component {
  render() {
    const { description, price, defaultPaths } = this.props.slide;
    return (
      <ItemCard
        className={
          this.props.index == this.props.activeIndex
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

        {/* <p className="carousel-slide__content">
          {this.props.slide.description}
        </p>

        <p>
          <strong className="carousel-slide__author">
            {this.props.slide._id}
          </strong>
          ,{" "}
          <small className="carousel-slide__source">
            {this.props.slide.price}
          </small>
        </p> */}
      </ItemCard>
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

          <CarouselRightArrow onClick={e => this.goToNextSlide(e)} />

          {/* <ul className="carousel__indicators">
            {this.props.slides.map((slide, index) => (
              <CarouselIndicator
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                isActive={this.state.activeIndex == index}
                onClick={e => this.goToSlide(index)}
              />
            ))}
          </ul> */}
        </div>
      </div>
    );
  };
}

// Render Carousel component
//  render(<Carousel slides={carouselSlidesData} />, carouselContainer);
