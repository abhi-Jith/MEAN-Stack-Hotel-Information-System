angular.module('meanhotel',['ngRoute'])
.config(config)
.controller('HotelsController, HotelsController');

function config($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'angular-app/hotels.html',
            controller:HotelsController,
            controllerAs:'vm'
        });

}

function HotelsController() {
    var vm= this;
    vm.title=' Hotel Information App';

}