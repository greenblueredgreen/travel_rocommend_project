import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, Form, Table, Spinner, Alert } from 'react-bootstrap';
import { GeoAlt, Telephone, Globe } from 'react-bootstrap-icons';

const NaverMap = () => {
  const [address, setAddress] = useState('');
  const [mapList, setMapList] = useState([]);
  const [lunchList, setLunchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const selectCount = 1;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=z75e0lcnqe&submodules=geocoder';
    script.async = true;

    script.onload = () => {
      window.naver = window.naver || {};
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=8323252951a97b41155cd927ab433d7c&libraries=services";
    kakaoScript.async = true;
    document.head.appendChild(kakaoScript);

    return () => {
      document.head.removeChild(kakaoScript);
    };
  }, []);

  const initMap = () => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.552758094502494, 126.98732600494576),
      zoom: 15,
    });

    const marker = new window.naver.maps.Marker({
      map: map,
      title: "남산서울타워",
      position: new window.naver.maps.LatLng(37.552758094502494, 126.98732600494576),
      icon: {
        content: '<img src="/resources/img/chu.png" alt="" style="width: 32px; height: 32px;">',
        size: new window.naver.maps.Size(32, 32),
        anchor: new window.naver.maps.Point(16, 32),
      },
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: '<div style="width:200px;text-align:center;padding:10px;"><b>서울남산타워</b><br> - 네이버 지도 - </div>',
    });

    window.naver.maps.Event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });
  };

  const searchAddressToCoordinate = (address) => {
    setIsLoading(true);
    setError(null);

    window.naver.maps.Service.geocode(
      { query: address },
      (status, response) => {
        if (status === window.naver.maps.Service.Status.ERROR) {
          setError('검색 중 오류가 발생했습니다.');
          setIsLoading(false);
          return;
        }
        if (response.v2.meta.totalCount === 0) {
          setError('올바른 주소를 입력해주세요.');
          setIsLoading(false);
          return;
        }
        
        const item = response.v2.addresses[0];
        const latitude = item.y;
        const longitude = item.x;

        const newMapList = [
          ...mapList,
          {
            address: item.roadAddress,
            latitude: latitude,
            longitude: longitude,
          },
        ];

        setMapList(newMapList);
        moveMap(item.y, item.x);
        fetchLunchRecommendations(latitude, longitude);
        setIsLoading(false);
      }
    );
  };

  const moveMap = (lat, lng) => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(lat, lng),
      zoom: 15,
    });
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchAddressToCoordinate(address);
    }
  };

  const fetchLunchRecommendations = async (latitude, longitude) => {
    setLunchList([]);
    
    for (let i = 1; i <= selectCount; i++) {
      try {
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
      } catch (error) {
        console.error(error);
        setError('추천 목록을 가져오는데 실패했습니다.');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} className="text-center">
          <h2 className="mb-4">주소 검색 및 맛집 찾기</h2>
          <Form className="d-flex justify-content-center gap-2 mb-4">
            <Form.Control
              type="text"
              placeholder="검색할 주소"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ maxWidth: '400px' }}
            />
            <Button 
              variant="primary"
              onClick={() => searchAddressToCoordinate(address)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                '주소 검색'
              )}
            </Button>
          </Form>
        </Col>
      </Row>

      {error && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col xs={12}>
          <div ref={mapRef} style={{ width: '100%', height: '500px' }} className="border rounded shadow-sm" />
        </Col>
      </Row>

      {mapList.length > 0 && (
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Card.Title>검색 기록</Card.Title>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>주소</th>
                      <th>위도</th>
                      <th>경도</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapList.map((item, index) => (
                      <tr key={index}>
                        <td>{item.address}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="g-4">
        {lunchList.map((item, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="border-bottom pb-2">
                  {item.place_name || "이름 없음"}
                </Card.Title>
                <Card.Text as="div">
                  <div className="mb-2">
                    <GeoAlt className="me-2 text-primary"/>
                    <span 
                      className="text-primary" 
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => moveMap(item.y, item.x)}
                    >
                      {item.address_name}
                    </span>
                  </div>
                  {item.phone && (
                    <div className="mb-2">
                      <Telephone className="me-2 text-primary"/>
                      {item.phone}
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
    </Container>
  );
};

export default NaverMap;