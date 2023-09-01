const fs = require("fs");
const path = require("path");

const p = (fileName) =>
  path.join(path.dirname(process.mainModule.filename), "data", fileName);

const getContentFromFile = (cb, fileName) => {
  fs.readFile(p(fileName), (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const Movies = {
  all: (cb) => getContentFromFile(cb, "movieList.json"),
};

const Videos = {
  all: (cb) => getContentFromFile(cb, "videoList.json"),
};
const UserTokens = {
  all: (cb) => getContentFromFile(cb, "userToken.json"),
};
const Genres = {
  all: (cb) => getContentFromFile(cb, "genreList.json"),
};

const MediaType = {
  all: (cb) => getContentFromFile(cb, "mediaTypeList.json"),
};

module.exports = { Movies, Videos, UserTokens, Genres, MediaType };
