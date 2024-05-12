import React, { useState, useEffect } from 'react';
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
} from './10_place.js';

const questions = [
  { question: '여행지에서 새로운 사람들과 만나는 것을 즐기시나요?', type: 'EI' },
  { question: '여행 중 혼자만의 시간을 갖는 것이 꼭 필요하다고 생각하시나요?', type: 'EI' },
  { question: '새로운 여행지를 탐험하는 것을 선호하시나요?', type: 'EI' },
  { question: '여행지의 역사적인 장소나 박물관 탐방을 좋아하시나요?', type: 'SN' },
  { question: '모르는 길을 찾을때 구체적인 매장명, 거리, 주소 등을 파악하고 찾나요?', type: 'SN' },
  { question: '여행 계획을 세울 때 상상력을 발휘하여 새로운 경험을 추구하시나요?', type: 'SN' },
  { question: '여행지 선택 시 실용성과 효율성을 중요하게 고려하시나요?', type: 'TF' },
  { question: '여행 중 동행자의 의견에 맞춰 따라가시는 편인가요?', type: 'TF' },
  { question: '여행 중 개인적인 가치관에 따라 의사결정을 내리시나요?', type: 'TF' },
  { question: '여행 일정을 꼼꼼하게 계획하고 정해진 스케줄대로 진행하는 것을 선호하시나요?', type: 'JP' },
  { question: '여행 계획을 주도적으로 짜시나요?', type: 'JP' },
  { question: '여행지에서 이뻐보이는 카페나 이색적인 장소가 있다면 일단 들어가시나요?', type: 'JP' },
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
};

const MBTITest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  });
  const [recommendedPlace, setRecommendedPlace] = useState(null);

  const handleAnswer = (answer) => {
    if (currentQuestion < questions.length) {
      const { type } = questions[currentQuestion];
      const newScores = { ...scores };
      newScores[type[answer === 'yes' ? 0 : 1]] += 1;
      setScores(newScores);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setScores({
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    });
    setRecommendedPlace(null);
  };

  const calculateMBTI = () => {
    const mbtiResult =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    return mbtiResult;
  };

  const recommendPlace = () => {
    const mbtiResult = calculateMBTI();
    const places = mbtiPlaces[mbtiResult];
    console.log(`${places}`);
    if (places && places.length > 0) {
      const randomIndex = Math.floor(Math.random() * places.length);
      setRecommendedPlace(places[randomIndex]);
    } else {
      console.log(`No recommended places found for MBTI type: ${mbtiResult}`);
      setRecommendedPlace(null);
    }
  };

  useEffect(() => {
    if (currentQuestion >= questions.length) {
      recommendPlace();
    }
  }, [currentQuestion]);

  if (currentQuestion < questions.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2>MBTI 여행 성향 테스트</h2>
        <p>{questions[currentQuestion].question}</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '200px' }}>
          <button onClick={() => handleAnswer('yes')}>예</button>
          <button onClick={() => handleAnswer('no')}>아니오</button>
        </div>
      </div>
    );
  } else {
    const mbtiResult = calculateMBTI();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2>MBTI 여행 성향 테스트 결과</h2>
        <p>당신의 MBTI 유형은 {mbtiResult}입니다.</p>
        {recommendedPlace && (
          <div>
            <h3>추천 여행지: {recommendedPlace.name}</h3>
            {recommendedPlace.image && (
              <img src={recommendedPlace.image} alt={recommendedPlace.name} />
            )}
          </div>
        )}
        <button onClick={resetTest}>다시 테스트하기</button>
      </div>
    );
  }
};

export default MBTITest;