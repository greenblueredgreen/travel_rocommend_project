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
        const latitude = item.y;  // 위도 변수에 담기
        const longitude = item.x;  // 경도 변수에 담기

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

        // 검색한 위도와 경도를 기반으로 맛집 추천 요청
        fetchLunchRecommendations(latitude, longitude);


        //TO_DO
        fetch('/recommend/findAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            page: '1',
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('네트워크 응답이 좋지 않습니다.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // 추천 맛집 목록 처리
          })
          .catch((error) => {
            console.error('문제가 발생했습니다:', error);
          });


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

  //위도 경도에 해당하는 맛집 추천
  const [lunchList, setLunchList] = useState([]); // 추천 목록을 저장하는 상태
    const selectCount = 1; // 추천받을 페이지 수 (필요에 따라 변경 가능)

    // Kakao 지도 API 스크립트를 로드하는 useEffect
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=8323252951a97b41155cd927ab433d7c&libraries=services";
        script.async = true;
        document.head.appendChild(script);

        // 스크립트 로드 후에 처리할 로직이 있다면 추가 가능
        return () => {
            document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
        };
    }, []);

  const fetchLunchRecommendations = async (latitude, longitude) => {
    setLunchList([]); // 초기화

    for (let i = 1; i <= selectCount; i++) {
        try {
            const response = await fetch('/lunch/recommend', {  // API 경로 확인
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude, page: i }),
            });
            
            if (!response.ok) {
                // 상태 코드와 응답 텍스트를 추가로 확인
                console.error(`HTTP 상태 코드: ${response.status}`);
                const errorText = await response.text();
                console.error("응답 내용:", errorText);
                throw new Error("추천 목록을 가져오는데 실패했습니다.");
            }

            const result = await response.json();
            //console.log("Fetched result:", result);
            //alert(result);
            //alert(JSON.stringify(result, null, 2)); // 객체를 보기 좋게 출력
        
            const items = result.documents || [];
            setLunchList((prevList) => [...prevList, ...items]);
        } catch (error) {
            console.error(error);
            alert('추천 목록을 가져오는데 실패했습니다.');
        }
    }
};

  return (
    <div>
      <div className="search">
        <input
          id="address"
          type="text"
          class="mt-3"
          placeholder="검색할 주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          id="submit"
          type="button"
          class="btn btn-info"
          value="주소검색"
          onClick={() => searchAddressToCoordinate(address)}
        />
      </div>
      <div ref={mapRef} style={{ width: '1000px', height: '500px' }}></div>
      <div>
        <table>
          <thead>
            <tr>
              <th>주소&nbsp;&nbsp;   </th>
              <th>위도&nbsp;&nbsp;  </th>
              <th>경도&nbsp;&nbsp;  </th>
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

      <hr></hr>
      <div>
        <div id="lunch_list" class="mt-3">
                {lunchList.length > 0 ? (
                    lunchList.map((item, index) => (
                        <div key={index} className="lunch_list_content">
                            <h3>{item.place_name || "이름 없음"}</h3> {/* place_name이 없을 경우를 대비 */}
                            {/* <p class="mt-3">주소 : {item.address_name}</p> */}
                            {/* 주소를 클릭하면 지도 이동 */}
                            <p
                              className="mt-3"
                              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                              onClick={() => moveMap(item.y, item.x)} // item.y와 item.x를 사용해 해당 좌표로 이동
                            >
                              주소 : {item.address_name}
                            </p>
                            
                            <a href={item.place_url} target="_blank" rel="noopener noreferrer">자세히 보기 - 사이트 연결</a>
                            <p class="mt-2">전화번호: {item.phone || "없음"}</p>
                        </div>
                    ))
                ) : (
                    <p>추천 목록이 없습니다.</p>
                )}
            </div>
      </div>
    </div>
  );
};

export default NaverMap;