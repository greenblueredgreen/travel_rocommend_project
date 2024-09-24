import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // email 값을 받아오기
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  //alert(email);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=0nn0y45wnv&submodules=geocoder`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
      const response = await axios.get(`/api/map/search`, {
        params: { query: searchQuery },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const items = response.data.items;
      setPlaces(items);
      displayPlacesOnMap(items);

      if (items.length > 0) {
        searchNearbyPlaces(items[0]);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setError("검색 중 오류가 발생했습니다.");
    }
  };

  const searchNearbyPlaces = async (place) => {
    try {
      const attractionsResponse = await axios.get(
        `/api/map/nearby?lat=${place.mapx}&lng=${place.mapy}&type=관광지`
      );
      const restaurantsResponse = await axios.get(
        `/api/map/nearby?lat=${place.mapx}&lng=${place.mapy}&type=맛집`
      );

      setAttractions(attractionsResponse.data.items);
      setRestaurants(restaurantsResponse.data.items);

      displayNearbyPlacesOnMap(
        attractionsResponse.data.items.concat(restaurantsResponse.data.items)
      );
    } catch (error) {
      setError("주변 장소 검색 중 오류가 발생했습니다.");
    }
  };

  const displayPlacesOnMap = (places) => {
    if (!map) return;

    map.removeAllMarkers && map.removeAllMarkers();

    const bounds = new window.naver.maps.LatLngBounds();
    places.forEach((place) => {
      const position = new window.naver.maps.LatLng(place.mapx, place.mapy);
      bounds.extend(position);

      const marker = new window.naver.maps.Marker({
        position: position,
        map: map,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h5 class="mb-1">${place.title}</h5>
            <p class="mb-0">${place.roadAddress || place.address}</p>
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

    map.fitBounds(bounds);
  };

  const displayNearbyPlacesOnMap = (places) => {
    if (!map) return;

    places.forEach((place, index) => {
      const position = new window.naver.maps.LatLng(place.mapx, place.mapy);

      const marker = new window.naver.maps.Marker({
        position: position,
        map: map,
        icon: {
          content: `<div class="bg-${
            place.category.includes("관광") ? "primary" : "danger"
          } text-white rounded-circle p-2" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${
            index + 1
          }</div>`,
          anchor: new window.naver.maps.Point(15, 15),
        },
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h5 class="mb-1">${place.title}</h5>
            <p class="mb-1">${place.roadAddress || place.address}</p>
            <p class="mb-0">${place.category}</p>
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
  };

  return (
      <div className="container-fluid px-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1 ml-1">네이버 지도 장소 검색</span>
            <div className="navbar-nav ms-auto mt-2">
              <button className="btn btn-outline-primary me-2 mb-2" onClick={() => navigate('/planner', { state: { email: email } })}>플래너</button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/mypage', { state: { email: email } })}>마이페이지</button>
            </div>
          </div>
        </nav>

      <div className="container mt-3">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="장소를 입력하세요"
          />
          <button className="btn btn-primary" onClick={searchPlaces}>
            검색
          </button>
        </div>

        <div
          ref={mapRef}
          style={{ width: "100%", height: "300px", marginBottom: "20px" }}
          className="rounded"
        ></div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">검색 결과</div>
              <ul className="list-group list-group-flush">
                {places.map((place, index) => (
                  <li key={index} className="list-group-item">
                    <h6 className="mb-1">{place.title}</h6>
                    <small>{place.roadAddress || place.address}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">주변 관광지</div>
              <ul className="list-group list-group-flush">
                {attractions.map((attraction, index) => (
                  <li key={index} className="list-group-item">
                    <h6 className="mb-1">{attraction.title}</h6>
                    <p className="mb-1">
                      {attraction.roadAddress || attraction.address}
                    </p>
                    <small>{attraction.category}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">주변 맛집</div>
              <ul className="list-group list-group-flush">
                {restaurants.map((restaurant, index) => (
                  <li key={index} className="list-group-item">
                    <h6 className="mb-1">{restaurant.title}</h6>
                    <p className="mb-1">
                      {restaurant.roadAddress || restaurant.address}
                    </p>
                    <small>{restaurant.category}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
