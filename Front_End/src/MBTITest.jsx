import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MBTITest.css";
import {
  infj_places,
  infp_places,
  intp_places,
  intj_places,
  istj_places,
  isfj_places,
  istp_places,
  isfp_places,
  estj_places,
  estp_places,
  esfj_places,
  esfp_places,
  enfj_places,
  entj_places,
  entp_places,
  enfp_places,
} from "./10_place.js";

const MBTITest = () => {
  const location = useLocation();
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);

  useEffect(() => {
    if (location.state?.registrationComplete) {
      setShowRegistrationMessage(true);
      // 상태를 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const questions = [
    {
      question: "여행지에서 새로운 사람들과 만나는 것을 즐기시나요?",
      options: [
        "여행지에서 새로운 사람들 만나기",
        "여행지에서 혼자 힐링여행하기",
      ],
      type: "EI",
    },
    {
      question:
        "게스트하우스나 펜션 자체에서 진행하는 파티에 참석하시는 것을 즐기시나요?",
      options: ["파티에 적극적으로 참여하기", "조용히 개인 시간 보내기"],
      type: "EI",
    },
    {
      question: "새로운 여행지를 탐험하는 것을 선호하시나요?",
      options: ["새로운 장소 탐험하기", "익숙한 장소 재방문하기"],
      type: "EI",
    },
    {
      question: "여행지의 역사적인 장소나 박물관 탐방을 좋아하시나요?",
      options: ["역사적 장소와 박물관 방문", "현대적이고 트렌디한 장소 방문"],
      type: "SN",
    },
    {
      question: "모르는 길을 찾을 때 어떤 방식을 선호하시나요?",
      options: [
        "구체적인 주소와 지도 사용",
        "주변 풍경을 보며 직관적으로 찾기",
      ],
      type: "SN",
    },
    {
      question: "여행 중 이동시간을 어떻게 보내시나요?",
      options: ["현재에 집중하며 풍경 감상", "미래 계획을 세우거나 상상하기"],
      type: "SN",
    },
    {
      question: "여행지 선택 시 무엇을 중요하게 고려하시나요?",
      options: ["실용성과 효율성", "감성과 분위기"],
      type: "TF",
    },
    {
      question: "여행 중 동행자가 사고가 났을 때 어떻게 대처하시나요?",
      options: ["실질적인 해결책 제시하기", "정서적 지지와 위로하기"],
      type: "TF",
    },
    {
      question: "여행 중 의사결정을 어떻게 하시나요?",
      options: ["논리적인 분석을 통해 결정", "개인적 가치관에 따라 결정"],
      type: "TF",
    },
    {
      question: "여행 일정을 어떻게 관리하시나요?",
      options: ["꼼꼼한 계획 세우고 따르기", "즉흥적으로 결정하기"],
      type: "JP",
    },
    {
      question: "여행 계획을 세울 때 어떤 역할을 선호하시나요?",
      options: ["주도적으로 계획 짜기", "다른 사람의 계획 따르기"],
      type: "JP",
    },
    {
      question: "여행지에서 예상치 못한 장소를 발견했을 때 어떻게 하시나요?",
      options: ["계획대로 진행하기", "즉흥적으로 일정 변경하기"],
      type: "JP",
    },
  ];

  const mbtiPlaces = {
    INFJ: infj_places,
    INFP: infp_places,
    INTP: intp_places,
    INTJ: intj_places,
    ISTJ: istj_places,
    ISFJ: isfj_places,
    ISTP: istp_places,
    ISFP: isfp_places,
    ESTJ: estj_places,
    ESTP: estp_places,
    ESFJ: esfj_places,
    ESFP: esfp_places,
    ENFP: enfp_places,
    ENTP: entp_places,
    ENFJ: enfj_places,
    ENTJ: entj_places,
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [recommendedPlace, setRecommendedPlace] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [mbtiResult, setMbtiResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
    setIsLoading(false);
  }, []);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (index) => {
    if (currentQuestion < shuffledQuestions.length) {
      const { type } = shuffledQuestions[currentQuestion];
      setScores((prevScores) => ({
        ...prevScores,
        [type[index]]: prevScores[type[index]] + 1,
      }));
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setRecommendedPlace(null);
    setShuffledQuestions(shuffleArray(questions));
    setMbtiResult("");
  };

  const calculateMBTI = () => {
    const result =
      (scores.E > scores.I ? "E" : "I") +
      (scores.S > scores.N ? "S" : "N") +
      (scores.T > scores.F ? "T" : "F") +
      (scores.J > scores.P ? "J" : "P");
    setMbtiResult(result);
    return result;
  };

  const recommendPlace = () => {
    const mbtiType = calculateMBTI();
    const places = mbtiPlaces[mbtiType];
    if (places && places.length > 0) {
      setRecommendedPlace(places[Math.floor(Math.random() * places.length)]);
    } else {
      console.log(`No recommended places found for MBTI type: ${mbtiType}`);
      setRecommendedPlace(null);
    }
  };

  useEffect(() => {
    if (
      currentQuestion >= shuffledQuestions.length &&
      shuffledQuestions.length > 0
    ) {
      recommendPlace();
    }
    {
      showRegistrationMessage && (
        <div className="alert alert-success" role="alert">
          회원가입이 완료되었습니다! 더 많은 기능을 이용해보세요.
        </div>
      );
    }
  }, [currentQuestion, shuffledQuestions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (currentQuestion >= shuffledQuestions.length || shuffledQuestions.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow">
              <Card.Body className="text-center">
                <h2 className="mb-4">당신의 MBTI 유형은 {mbtiResult}입니다!</h2>
                {recommendedPlace && (
                  <div className="mb-4">
                    <h3>추천 여행지 : {recommendedPlace.name}</h3>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}>
                      {recommendedPlace.image && (
                        <img
                          src={recommendedPlace.image}
                          alt={recommendedPlace.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                <p className="text-muted mt-2">
                  회원가입하여 더 다양한 여행지 추천을 받아보세요!
                </p>
                <div className="d-flex flex-wrap justify-content-center">
                  <Button onClick={resetTest} className="m-2 me-5 btn-success">
                    다시 테스트하기
                  </Button>
                  <Link to="/signup" className="btn btn-primary m-2">
                    회원가입
                  </Link>
                  <Link to="/login" className="btn btn-primary m-2">
                    로그인
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
              <h2 className="text-center mb-4">MBTI별 여행 성향 테스트</h2>
          <Card className="shadow mb-4">
            <Card.Body>
              <p className="text-center mb-1">{currentQ.question}</p>
            </Card.Body>
          </Card>
          <Row className="g-4">
            {currentQ.options.map((option, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card
                  className="shadow h-100 option-card"
                  onClick={() => handleAnswer(index)}
                  style={{ 
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Card.Body 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      minHeight: "100px",
                    }}
                  >
                    <p className="text-center mb-0">{option}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MBTITest;
