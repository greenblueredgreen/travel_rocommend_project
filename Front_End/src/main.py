import os
import urllib.request
import json
from config import NAVER_CLIENT_ID, NAVER_CLIENT_SECRET

# 환경 변수에서 API 키를 가져오거나, 없으면 config.py에서 가져옵니다.
client_id = os.environ.get("NAVER_CLIENT_ID", NAVER_CLIENT_ID)
client_secret = os.environ.get("NAVER_CLIENT_SECRET", NAVER_CLIENT_SECRET)

def make_api_request(url):
    #API 요청을 보내고 결과를 반환
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    try:
        response = urllib.request.urlopen(request)
        rescode = response.getcode()
        if rescode == 200:
            response_body = response.read()
            return json.loads(response_body)
        else:
            print(f"Error Code: {rescode}")
            return None
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} - {e.reason}")
        return None

def search_places(place_name, query, display=5):
    #장소 이름과 검색어를 받아서 관련 장소를 검색
    encText = urllib.parse.quote(f"{place_name} {query}")
    url = f"https://openapi.naver.com/v1/search/local.json?query={encText}&display={display}"
    result = make_api_request(url)
    if result and 'items' in result:
        return result['items']
    else:
        return None

def main():
    place_name = input("추천받은 장소를 입력하세요 (예: 부산 해운대): ")
    nearby_places = search_places(place_name, "관광지")
    if nearby_places:
        print("\n근처 관광지:")
        for place in nearby_places:
            print(f"이름: {place['title']}")
            print(f"주소: {place['address']}")
            print(f"카테고리: {place['category']}")
            print("---")
    else:
        print("근처 관광지를 찾을 수 없습니다.")

    nearby_restaurants = search_places(place_name, "맛집")
    if nearby_restaurants:
        print("\n근처 맛집:")
        for restaurant in nearby_restaurants:
            print(f"이름: {restaurant['title']}")
            print(f"주소: {restaurant['address']}")
            print(f"카테고리: {restaurant['category']}")
            print("---")
    else:
        print("근처 맛집을 찾을 수 없습니다.")
