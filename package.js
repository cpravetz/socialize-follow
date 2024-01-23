Package.describe({
  name: 'seakaytee:socialize-follow',
  summary: 'A social follow package',
  version: '0.1.0',
  git: 'https://github.com/cpravetz/socialize-follow.git'
});

Package.onUse(function(api) {
  
  api.use(['socialize:user-model']);

  api.imply('socialize:user-model');

  //Add the follow-model files
  api.addFiles('follow-model/common/follow-model.js');
  api.addFiles('follow-model/common/user-extensions.js');
  api.addFiles('follow-model/server/server.js', 'server');

  api.export(['Follow']);
});
