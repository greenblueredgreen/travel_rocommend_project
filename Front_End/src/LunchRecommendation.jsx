import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { GeoAlt, Telephone, Globe, Star } from 'react-bootstrap-icons';

function LunchRecommendations() {
    const [lunchList, setLunchList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const selectCount = 1;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=8323252951a97b41155cd927ab433d7c&libraries=services";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const fetchLunchRecommendations = async (latitude, longitude) => {
        setIsLoading(true);
        setError(null);
        setLunchList([]);

        try {
            for (let i = 1; i <= selectCount; i++) {
                const response = await fetch('/lunch/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latitude, longitude, page: i }),
                });

                if (!response.ok) {
                    throw new Error("추천 목록을 가져오는데 실패했습니다.");
                }

                const result = await response.json();
                const items = result.documents || [];
                setLunchList((prevList) => [...prevList, ...items]);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecommendClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchLunchRecommendations(latitude, longitude);
                },
                (error) => {
                    console.error(error);
                    setError('위치 정보를 가져오는데 실패했습니다.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError('지오로케이션을 지원하지 않는 브라우저입니다.');
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center mb-4">
                <Col xs={12} className="text-center">
                    <h2 className="mb-4">내 주변 맛집 찾기</h2>
                    <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleRecommendClick}
                        disabled={isLoading}
                        className="shadow-sm"
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                불러오는 중...
                            </>
                        ) : (
                            '맛집 추천 받기'
                        )}
                    </Button>
                </Col>
            </Row>

            {error && (
                <Row className="justify-content-center mb-4">
                    <Col xs={12} md={8}>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                </Row>
            )}

            <Row className="g-4">
                {lunchList.map((item, index) => (
                    <Col key={index} xs={12} md={6} lg={4}>
                        <Card className="h-100 shadow-sm hover-shadow transition">
                            <Card.Body>
                                <Card.Title className="border-bottom pb-2">
                                    {item.place_name || "이름 없음"}
                                </Card.Title>
                                <Card.Text as="div">
                                    <div className="mb-2">
                                        <GeoAlt className="me-2 text-primary"/>
                                        {item.address_name}
                                    </div>
                                    {item.phone && (
                                        <div className="mb-2">
                                            <Telephone className="me-2 text-primary"/>
                                            {item.phone}
                                        </div>
                                    )}
                                    {item.category_name && (
                                        <div className="mb-2">
                                            <Star className="me-2 text-primary"/>
                                            {item.category_name}
                                        </div>
                                    )}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-top-0">
                                <Button
                                    variant="outline-primary"
                                    href={item.place_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-100"
                                >
                                    <Globe className="me-2"/>
                                    상세정보 보기
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {!isLoading && lunchList.length === 0 && !error && (
                <Row className="justify-content-center mt-4">
                    <Col xs={12} className="text-center text-muted">
                        <p>버튼을 클릭하여 맛집을 추천받아보세요!</p>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default LunchRecommendations;