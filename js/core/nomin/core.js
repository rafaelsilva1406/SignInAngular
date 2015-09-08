window.missionpro.app = (function (service,controller) {
	var app = angular.module('app', ["ui.router", "ngMessages", "LocalStorageModule", "ui.bootstrap", "ajoslin.promise-tracker", 'chieffancypants.loadingBar', 'ngAnimate']);

	function configs() {
		app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/login');
			$stateProvider
			  .state('login', {
				  url: '/login',
				  templateUrl: 'views/page/login.html',
				  controller: 'LoginController'
			  })
			  .state('logout', {
				  url: '/logout',
				  templateUrl: 'views/page/logout.html',
				  controller: 'LogoutController'
			  })
		      .state('redirect', {
		          url: '/redirect',
		          templateUrl: 'views/page/redirect.html',
		          controller: 'RedirectController'
		      });
		}])
		  .config(['$httpProvider', function ($httpProvider) {
			  $httpProvider.defaults.useXDomain = true;
			  delete $httpProvider.defaults.headers.common['X-Requested-With'];
		  }])
		  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
			  localStorageServiceProvider
				  .setStorageType('sessionStorage');
		  }])
		  .config(function (cfpLoadingBarProvider) {
			  cfpLoadingBarProvider.includeSpinner = true;
			  cfpLoadingBarProvider.latencyThreshold = 5000;
			  cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</span></div>';
		  });

		//hello.init({
		//    google: '100923009912-lreflop7s1378c5p346264iqtq53ma45.apps.googleusercontent.com'
		//}, { redirect_uri: 'http://localhost:32560/' });
		//hello.on('auth.login', function (auth) {
		//    hello('google').login().then(function () {
		//        alert('You are signed in to Google');
		//    }, function (e) {
		//        alert('Signin error: ' + e.error.message);
		//    });
		//});
	}

	function init() {
		configs();
		service.init(app);
		controller.init(app);
	}

	return {
		app: app,
		init: init,
	};
})(window.missionpro.service,window.missionpro.controller);
window.missionpro.app.init();