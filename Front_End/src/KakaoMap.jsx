import React, { useEffect, useRef, useState } from 'react';

const KakaoMap = () => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [placesService, setPlacesService] = useState(null);
    
    useEffect(() => {
        const loadKakaoMapScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=8f3729a7e53ff95199d50012d5cf02c6&libraries=services,clusterer,drawing"; // YOUR_APP_KEY를 실제 API 키로 변경하세요.
                script.onload = resolve;
                script.onerror = () => {
                    console.error("Kakao Maps API 로드 실패");
                    reject(new Error("Kakao Maps API 로드 실패"));
                };
                document.head.appendChild(script);
            });
        };

        const initKakaoMap = () => {
            if (window.kakao && window.kakao.maps) { // 추가된 확인
                const mapOption = {
                    center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
                    level: 2
                };
                const kakaoMap = new window.kakao.maps.Map(mapContainer.current, mapOption);
                setMap(kakaoMap);
                setPlacesService(new window.kakao.maps.services.Places());
            } else {
                console.error("Kakao Maps API가 로드되지 않았습니다.");
            }
        };

        loadKakaoMapScript()
            .then(() => {
                initKakaoMap();
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const searchPlaces = (keyword) => {
        if (!placesService) return;

        placesService.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const bounds = new window.kakao.maps.LatLngBounds();
                data.forEach(place => {
                    bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                });
                map.setBounds(bounds);
            } else {
                console.error('장소 검색 실패:', status);
            }
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const keyword = event.target.keyword.value;
        searchPlaces(keyword);
    };

    return (
        <div>
            <div className="option">
                <form onSubmit={handleSearch}>
                    키워드 : <input type="text" name="keyword" size="15" />
                    <button type="submit">검색하기</button>
                </form>
            </div>
            <hr />
            <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
        </div>
    );
};

export default KakaoMap;
