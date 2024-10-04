import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';

const NaverMap = () => {
  const [address, setAddress] = useState('');
  const [mapList, setMapList] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Naver Maps API 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=z75e0lcnqe&submodules=geocoder';
    script.async = true;

    // 스크립트 로드 후 naver 객체를 설정
    script.onload = () => {
      // naver 객체가 전역으로 존재하도록 설정
      window.naver = window.naver || {};
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 정리
      document.head.removeChild(script);
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
    window.naver.maps.Service.geocode(
      { query: address },
      (status, response) => {
        if (status === window.naver.maps.Service.Status.ERROR) {
          return alert('Something Wrong!');
        }
        if (response.v2.meta.totalCount === 0) {
          return alert('올바른 주소를 입력해주세요.');
        }
        const item = response.v2.addresses[0];
        const newMapList = [
          ...mapList,
          {
            address: item.roadAddress,
            latitude: item.y,
            longitude: item.x,
          },
        ];
        setMapList(newMapList);
        moveMap(item.y, item.x);
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

  return (
    <div>
      <div className="search">
        <input
          id="address"
          type="text"
          placeholder="검색할 주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          id="submit"
          type="button"
          value="주소검색"
          onClick={() => searchAddressToCoordinate(address)}
        />
      </div>
      <div ref={mapRef} style={{ width: '1000px', height: '500px' }}></div>
      <div>
        <table>
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
        </table>
      </div>
    </div>
  );
};

export default NaverMap;
