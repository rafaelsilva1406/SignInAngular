window.missionpro.service = (function(model){
	function handleError(obj)
	{
	    return obj.status + " : " + obj.statusText;
	}

	function init(obj)
	{
	    obj.service('loginService', ['$http', '$location', '$q', function ($http, $location, $q) {
			//this.getUser = function () {
			//    return $http.get("db/user.json")
			//		.then(
			//			function (response) {
			//			    model.user.init(response.data.data);
			//			    return model.user;
			//			},
			//			function (httpError) {
			//			    handleError(httpError);
			//			});
			//};
			this.getDomain = function (){
				return $http.get("db/domain.json")
					.then(
						function (response) {
							var domainItems = [];
							$.each(response.data.data, function (i, obj) {
								domainItems.push(model.domain.init(obj));
							});
							return domainItems;
						},
						function (response) {
						    handleError(response);
						}
					);
			};
			this.auth = function (data) {
			    var json = {},
			        req = {};
				json.data = {};
				json.data.credentials = {};
				json.data.credentials.userEmail = data.username + "@" + data.domain;
				json.data.credentials.userPassword = data.password;
			
			    return $http({
			        method: 'POST',
			        url:'http://192.168.1.48:10080/appstack/public/v1/rest-login',
			        data: json
			    }).then(
					function (response) {
					    model.user.init(response.data.data);
					     return model.user.getUser();
					},
					function (response) {
					    return handleError(response);
					}
				);
			};
		}]);
	}

	return {
		init:init
	};
})(window.missionpro.model);