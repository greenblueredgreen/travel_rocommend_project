// import React, { useEffect, useRef, useState } from 'react';

// const KakaoMap = () => {
//     const mapContainer = useRef(null);
//     const [map, setMap] = useState(null);
//     const [placesService, setPlacesService] = useState(null);
    
//     useEffect(() => {
//         const loadKakaoMapScript = () => {
//             return new Promise((resolve, reject) => {
//                 const script = document.createElement('script');
//                 script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=8f3729a7e53ff95199d50012d5cf02c6&libraries=services,clusterer,drawing"; // YOUR_APP_KEY를 실제 API 키로 변경하세요.
//                 script.onload = resolve;
//                 script.onerror = () => {
//                     console.error("Kakao Maps API 로드 실패");
//                     reject(new Error("Kakao Maps API 로드 실패"));
//                 };
//                 document.head.appendChild(script);
//             });
//         };

//         const initKakaoMap = () => {
//             if (window.kakao && window.kakao.maps) { // 추가된 확인
//                 const mapOption = {
//                     center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
//                     level: 2
//                 };
//                 const kakaoMap = new window.kakao.maps.Map(mapContainer.current, mapOption);
//                 setMap(kakaoMap);
//                 setPlacesService(new window.kakao.maps.services.Places());
//             } else {
//                 console.error("Kakao Maps API가 로드되지 않았습니다.");
//             }
//         };

//         loadKakaoMapScript()
//             .then(() => {
//                 initKakaoMap();
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }, []);

//     const searchPlaces = (keyword) => {
//         if (!placesService) return;

//         placesService.keywordSearch(keyword, (data, status) => {
//             if (status === window.kakao.maps.services.Status.OK) {
//                 const bounds = new window.kakao.maps.LatLngBounds();
//                 data.forEach(place => {
//                     bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
//                 });
//                 map.setBounds(bounds);
//             } else {
//                 console.error('장소 검색 실패:', status);
//             }
//         });
//     };

//     const handleSearch = (event) => {
//         event.preventDefault();
//         const keyword = event.target.keyword.value;
//         searchPlaces(keyword);
//     };

//     return (
//         <div>
//             <div className="option">
//                 <form onSubmit={handleSearch}>
//                     키워드 : <input type="text" name="keyword" size="15" />
//                     <button type="submit">검색하기</button>
//                 </form>
//             </div>
//             <hr />
//             <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//         </div>
//     );
// };

// export default KakaoMap;

import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    // Kakao Maps API 로드
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=8f3729a7e53ff95199d50012d5cf02c6&libraries=services";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        // 마커를 클릭하면 장소명을 표출할 인포윈도우
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        // 지도를 생성
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 장소 검색 객체 생성
        const ps = new window.kakao.maps.services.Places();

        // 키워드로 장소를 검색
        ps.keywordSearch('강남 맛집', (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const bounds = new window.kakao.maps.LatLngBounds();

            data.forEach((place) => {
              displayMarker(place, map, infowindow);
              bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
            });

            // 검색된 장소 위치를 기준으로 지도 범위 재설정
            map.setBounds(bounds);
          }
        });
      }
    };

    return () => document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
  }, []);

  // 지도에 마커를 표시하는 함수
  const displayMarker = (place, map, infowindow) => {
    const marker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });

    // 마커 클릭 이벤트 등록
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`);
      infowindow.open(map, marker);
    });
  };

  return <div id="map" style={{ width: '100%', height: '350px' }} />;
};

export default KakaoMap;


