// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

/**
  TODO localstorage
  Default to cm/euro
  If user changes save in localstorage 
  _.get*Unit() return localstorage if exists, else default.
*/

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


    var pizza = function(){
      var _ = this;
      _.pizzas = [];

      _.priceUnits = {
        'euro'   : '€',
        'pound'  : '',
        'dollar' : '$'
      };
      _.diameterUnits = {
        'metric'  : 'cm',
        'imperial': 'inches'
      };
      _.priceUnitDefault    = '€';
      _.diameterUnitDefault = 'cm';

      _.changeUnit = function(unit, newValue){
        if(unit == 'price'){
          localStorage.setItem('priceUnitDefault', newValue);
        }
        if(unit == 'diameter'){
          localStorage.setItem('diameterUnitDefault', newValue); 
        }
      };

      _.init = function(){
        
      }

      _.getPriceUnit = function(){
        if(localStorage.getItem('priceUnitDefault') == null){
          return _.priceUnitDefault;
        } else {
          return localStorage.getItem('priceUnitDefault');
        }
      };

      _.getDiameterUnit = function(){
        if(localStorage.getItem('diameterUnitDefault') == null){
          return _.diameterUnitDefault;
        } else {
          return localStorage.getItem('diameterUnitDefault');
        }
      };

      _.make = function(price, diameter){
        var priceVal         = document.createTextNode(price + _.getPriceUnit());
        var diameterVal      = document.createTextNode(diameter + _.getDiameterUnit());
        var pizzaList        = document.getElementById('pizzaList');
        var priceElement     = document.createElement('div');
        var diameterElement  = document.createElement('div');
        var pastry           = document.createElement('div');

        _.pizzas.push({
          "price": parseInt(price), 
          "priceUnit": _.getPriceUnit(),
          "diameter": parseInt(diameter),
          "diameterUnit": _.getDiameterUnit()
        });

        console.log(_.pizzas);
        
        diameterElement.appendChild(diameterVal);
        priceElement.appendChild(priceVal);
        priceElement.setAttribute('class','pizza__price');
        diameterElement.setAttribute('class', 'pizza__diameter');
        pastry.setAttribute('class','pizza');
        
        pastry.appendChild(diameterElement);
        pastry.appendChild(priceElement);
        pizzaList.appendChild(pastry);
      };

      _.calculateBestValue = function(){
        var bestValue = null;
        for(var i = 0; i < _.pizzas.length; i++){
          var thisPizza = _.pizzas[i];
          var radius = thisPizza.diameter / 2;
          var area = 3.141592 * (radius * radius);
          console.log('area:'+area+' price per cm^2: '+thisPizza.price/area);
        }
      };
      _.init();
    };
  
    var pizza = new pizza();
    var addPizza = document.getElementById('addPizza');
    addPizza.addEventListener('click', function(e){
      var diameter = document.getElementById('pizzaDiameter');
      var price    = document.getElementById('pizzaPrice');
      pizza.make(price.value, diameter.value);
      pizza.calculateBestValue();
    });

    var change = document.getElementsByClassName('changeUnit');
    Array.from(change).forEach(function(element) {
      element.addEventListener('change', function(){
        console.log(this.value);
        pizza.changeUnit(this.dataset.unit, this.value);
        return true;
      });
    });
  });
})
