window.missionpro.controller = (function () {

    function init(obj) {
        obj.controller('LoginController', ['$scope', '$location', 'loginService', 'localStorageService', '$modal', 'promiseTracker', function ($scope, $location, loginService, localStorageService, $modal, promiseTracker) {
            $scope.domainList = [];
            $scope.master = {};
            $scope.responseMessage = '';
            $scope.progress = promiseTracker();
            var $modalInstance = {},
                $promise = {};
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
                if ($scope.loginForm.$valid) {
                    user.domain = $scope.domainSelected.name;
                    $scope.master = angular.copy(user);
                    $promise = loginService.auth($scope.master)
                        .then(function (data) {
                           
                            if (typeof data === 'string' || data instanceof String) {
                                $scope.responseMessage = data;
                            } else {
                                localStorageService.set('user', Base64.encode(angular.toJson(data)));
                                $scope.responseMessage = "Login Successful!";
                            }

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

        obj.controller('LoginModalController', function ($scope, $modalInstance, responseMessage) {
            $scope.modalTitle = "Login";
            $scope.modalBody = responseMessage;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
    }

    return {
        init: init
    };
})();