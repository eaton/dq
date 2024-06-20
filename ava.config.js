export default {
  files: ['test/**/*', '!test/**/fixtures/**/*', '!test/**/*.md'],
  extensions: {
    ts: 'module',
  },
  nodeArguments: ['--import=tsimp'],
};
