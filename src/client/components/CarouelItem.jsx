import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CarouelItem.css";
import styled from "styled-components";

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;
const ItemCard = styled.div`
  img {
    height: 100%;
    max-height: 120px;
    width: auto;
    object-fit: cover;
    margin-left: 10px;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
`;
const DetailLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

class CarouselLeftArrow extends Component {
  render() {
    return (
      <a
        href="/#"
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
        href="/#"
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
    const { description, price, defaultPaths, _id } = this.props.slide;
    return (
      <div>
        <ItemCard className="carousel__slide carousel__slide--active">
          <div>
            <img src={defaultPaths.frontendPath} alt="for sell" />
          </div>
          <Info>
            <DetailLink to={"/details/" + _id}>
              <div>{description}</div>
              <div>{price} $</div>
            </DetailLink>
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
    let results = this.props.slides.slice(
      this.state.activeIndex,
      this.state.activeIndex + 3
    );
    return (
      <div className="carousel-container">
        <div className="carousel">
          <CarouselLeftArrow onClick={e => this.goToPrevSlide(e)} />
          <Main>
            {results.map((slide, index) => (
              <CarouselSlide
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                slide={slide}
              />
            ))}
          </Main>
          <CarouselRightArrow onClick={e => this.goToNextSlide(e)} />
        </div>
      </div>
    );
  };
}
