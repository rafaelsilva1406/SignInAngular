window.missionpro.controller = (function () {

    function init(obj) {
        obj.controller('LoginController', ['$scope', '$location', 'loginService', 'localStorageService', '$modal', 'promiseTracker', 'cfpLoadingBar', function ($scope, $location, loginService, localStorageService, $modal, promiseTracker, cfpLoadingBar) {
            var $modalInstance = {},
                $promise = {};
            $scope.domainList = [];
            $scope.master = {};
            $scope.responseMessage = '';
            $scope.progress = promiseTracker();

            $scope.start = function () {
                cfpLoadingBar.start();
            };

            $scope.complete = function () {
                cfpLoadingBar.complete();
            }

            loginService.getDomain()
                .then(function (data) {
                    if (typeof data === 'string' || data instanceof String) {
                        $scope.responseMessage = data;
                    } else {
                        $scope.domainList.push(data[0]);
                        $scope.domainSelected = data[0];
                    }
                });

            $scope.submit = function (user) {
                $scope.start();
                if ($scope.loginForm.$valid) {
                    user.domain = $scope.domainSelected.name;
                    $scope.master = angular.copy(user);
                    $promise = loginService.auth($scope.master)
                        .then(function (data) {
                           
                            if (typeof data === 'string' || data instanceof String) {
                                $scope.responseMessage = data;
                            } else {
                                localStorageService.set('user', Base64.encode(angular.toJson(data)));
                                $scope.user = {};
                                $scope.loginForm.$setPristine();
                                $scope.loginForm.$setValidity();
                                $scope.loginForm.$setUntouched();
                                $scope.responseMessage = "Login Successful!";
                            }
                            $scope.complete();
                            $modalInstance = $modal.open({
                                animation: true,
                                templateUrl: 'views/partial/messageModal.html',
                                controller: 'LoginModalController',
                                size: 'lg',
                                resolve: {
                                    responseMessage: function () {
                                        return $scope.responseMessage;
                                    }
                                }
                            });
                        });
                    $scope.progress.addPromise($promise);
                }
            };
        }]);
        obj.controller('LogoutController', ['$scope', '$location', 'loginService', 'localStorageService', '$modal', function ($scope, $location, loginService, localStorageService, $modal) {
            localStorageService.clearAll();
            $modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/partial/logoutModal.html',
                controller: 'LogoutModalController',
                size: 'lg',
            });
        }]);
        obj.controller('LoginModalController', function ($scope, $modalInstance, responseMessage) {
            $scope.modalTitle = "Login";
            $scope.modalBody = responseMessage;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
        obj.controller('LogoutModalController', function ($scope, $modalInstance, $location) {
            $scope.modalTitle = "Logout";
            $scope.modalBody = "GoodBye.";
            $scope.redirect = function () {
                $modalInstance.dismiss('cancel');
                $location.path("/login");
            };
        });
    }

    return {
        init: init
    };
})();