package com.travel.map;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travel.map.bo.MapService;

@RestController
@RequestMapping("/api/map")
@CrossOrigin(origins = "http://localhost:3000")  // React 앱의 주소
public class MapRestController {

    private final MapService mapService;

    @Autowired
    public MapRestController(MapService mapService) {
        this.mapService = mapService;
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> searchPlaces(@RequestParam(value = "query") String query) {
        Map<String, Object> result = mapService.searchPlaces(query);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(result);
    }
}