import React, { useEffect } from 'react';

const MapComponent = ({ query }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=8323252951a97b41155cd927ab433d7c&autoload=false`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map'); 
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 초기 위치 설정
                    level: 3, // 초기 줌 레벨
                };
                const map = new window.kakao.maps.Map(container, options);
                
                // 검색할 장소가 있을 경우 검색 및 마커 추가
                if (query) {
                    searchPlaces(query, map);
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [query]);

    const searchPlaces = (query, map) => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(query, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                // 첫 번째 검색 결과로 마커 추가
                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(data[0].y, data[0].x),
                });
                marker.setMap(map);
                map.setCenter(marker.getPosition());
            } else {
                console.error("장소 검색 실패:", status);
            }
        });
    };

    return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
