module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['testUtils.js']
};