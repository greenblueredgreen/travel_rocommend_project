import React, { useEffect, useRef, useState } from "react";

const Main = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    // 백엔드에서 클라이언트 ID 가져오기
    fetch('http://localhost:8080/api/maps/config')
      .then(response => response.json())
      .then(data => {
        setClientId(data.clientId);
        loadNaverMapsScript(data.clientId);
      })
      .catch(err => setError("Failed to load map configuration"));
  }, []);

  const loadNaverMapsScript = (clientId) => {
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  };

  const initializeMap = () => {
    if (window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
        minZoom: 6,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };
      const newMap = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
    } else {
      setError("네이버 지도 객체를 찾을 수 없습니다.");
    }
  };

  const searchPlaces = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/maps/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (data.errorMessage) {
        throw new Error(data.errorMessage);
      }

      if (data && data.length > 0) {
        setPlaces(data);
        displayPlacesOnMap(data);
      } else {
        setError("검색 결과가 없습니다.");
      }
    } catch (err) {
      setError(`장소 검색 중 오류가 발생했습니다: ${err.message}`);
      console.error(err);
    }
  };

  const displayPlacesOnMap = (places) => {
    if (!map) return;

    // 기존 마커 제거
    map.removeAllMarkers && map.removeAllMarkers();

    places.forEach((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.y, place.x),
        map: map,
        title: place.name,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;min-width:200px;line-height:150%;">
            <h4>${place.name}</h4>
            <p>${place.address}</p>
            <p>${place.category}</p>
          </div>
        `,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });
    });

    // 검색 결과의 중심으로 지도 이동
    if (places.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(new window.naver.maps.LatLng(place.y, place.x));
      });
      map.fitBounds(bounds);
    }
  };

  const geocodeAddress = (address) => {
    if (!window.naver.maps.Service) {
      setError("Geocoder not available");
      return;
    }

    window.naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status === window.naver.maps.Service.Status.ERROR) {
          setError("Something wrong!");
          return;
        }

        if (response.v2.meta.totalCount === 0) {
          setError("No result.");
          return;
        }

        const item = response.v2.addresses[0];
        const point = new window.naver.maps.Point(item.x, item.y);

        map.setCenter(point);
        new window.naver.maps.Marker({
          position: point,
          map: map,
        });
      }
    );
  };

  return (
    <div>
      <h1>네이버 지도 장소 검색</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="지역을 입력하세요 (예: 부산 해운대)"
        />
        <button onClick={searchPlaces}>검색</button>
        <button onClick={() => geocodeAddress(searchQuery)}>주소 검색</button>
      </div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", marginTop: "20px" }}
      ></div>
      <div>
        <h2>검색 결과</h2>
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              <p>{place.category}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Main;