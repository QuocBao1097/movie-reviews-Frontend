import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link, useParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

const Movie = (props) => {
  const { id } = useParams();
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });
  const getMovie = async (id) => {
    try {
      const response = await MovieDataService.get(id);
      setMovie(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMovie(id);
  }, [id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1);
          return { ...prevState };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Image src={movie.poster + "/100px250"} fluid />
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {props.user && (
                  <Link to={"/movies/" + id + "/review"}>Add Review</Link>
                )}
              </Card.Body>
            </Card>
            <br />
            <h2>Reviews</h2>
            {movie.reviews.map((review, index) => {
              return (
                <div key={index} className="mb-3">
                  <div className="d-flex">
                    <div className="mr-3">
                      <img
                        src="https://via.placeholder.com/64"
                        alt={review.name}
                        className="rounded-circle"
                      />
                    </div>
                    <div>
                      <h5>{review.name + " reviewed on " + review.date}</h5>
                      <p>{review.review}</p>

                      {props.user && props.user.id === review.user_id && (
                        <div className="d-flex">
                          <Link
                            to={{
                              pathname: "/movies/" + id + "/review",
                              state: { currentReview: review },
                            }}
                            className="mr-3"
                          >
                            Edit
                          </Link>
                          <Button
                            variant="link"
                            onClick={() => deleteReview(review._id, index)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Movie;
