(function () {
    var module = angular.module('Chat');

    module.controller('LoginController', function ($scope, $rootScope, $socket, $location) {
        $scope.hola = "Mundo";
        $scope.error = false;
        $scope.login = function (user) {
            console.log('hey');
            $socket.emit('login', user);
        };

        $socket.on('loginSuccess', function (user) {
            $rootScope.user = user;
            $location.path('/chat');
        });

        $socket.on('loginFailure', function () {
            $scope.error = true;
        });
    });

    module.controller('MainController', function ($scope, $rootScope, $socket) {
        $socket.on('updateUsers', function (users) {
            $rootScope.users = users;
            $scope.messages = [{
                user: 'javo',
                message: 'Hola'
            }];
            $scope.sendMessage = function (message) {
                if (message) {
                    $socket.emit('newMessage', message);
                }
            };

            $socket.on('newMessage', function (message) {
                scope.messages.push(message);
            });
        });
    });

    module.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.on('keypress', function (evt) {
                if (evt.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                }
            });
        };
    });

    module.config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'login',
            controller: 'LoginController'
        }).when('/chat', {
            templateUrl: 'chat-box',
            controller: 'MainController'
        }).
        otherwise({
            redirectTo: '/chat'
        });

        $locationProvider.html5Mode(true);
    });


})();
