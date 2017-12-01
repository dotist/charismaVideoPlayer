function episodeData() {
  return {
    "episodeId": "Release 1",
    "enable": true,
    "dev": true,
    "sceneElements": [
      {
        "targetZone": 2 ,
        "name": "fin1",
        "type": "text",
        "text": "Fin",
        "videoId": "243426602",
        "position": {
          "x": 175,
          "y": 200,
        },
        "styles": {
          "transform": "rotate(-90deg)",
        },
      },
      {
        "targetZone": 7,
        "name": "echo1",
        "type": "text",
        "text": "Echo",
        "videoId": "243426602",
        "classes": 'scene_element--style_1',
        "position": {
          "x": 0,
          "y": 100,
        },
        "styles": {
          "transform": "rotate(45deg)",
        },
      },
      {
        "targetZone": 15,
        "name": "r1e1",
        "type": "image",
        "thumbnail": "joke.jpg",
        "videoId": "243426602",
        "position": {
          "x": 0,
          "y": 0,
        },
        "styles": {
          "transform": 'scale(1)'
        },
      },
    ]
  };
}
