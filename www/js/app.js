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

      _.hash = function(str){
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ~~(((hash << 5) - hash) + str.charCodeAt(i));
        }
        return hash;
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

      _.remove = function(event){
        var pizzaId = this.dataset.itemid;
        var pizzaElement = document.getElementById(pizzaId);
        pizzaElement.parentNode.removeChild(pizzaElement);
        console.log(pizzaId);
        for( i=_.pizzas.length-1; i>=0; i--) {
          if( _.pizzas[i].pizzaId == pizzaId) _.pizzas.splice(i,1);
        }
      };

      _.make = function(price, diameter){
        var priceVal         = document.createTextNode(price + _.getPriceUnit());
        var diameterVal      = document.createTextNode(diameter + _.getDiameterUnit());
        var removeText           = document.createTextNode('Delete');

        var pizzaList        = document.getElementById('pizzaList');

        var priceElement     = document.createElement('div');
        var diameterElement  = document.createElement('div');
        var pastry           = document.createElement('div');
        var remove           = document.createElement('button');

        var pizzaId = _.hash(parseInt(price)+''+parseInt(diameter)+_.getDiameterUnit()+_.getPriceUnit());

        
        if(document.getElementById(pizzaId) == null && price != '' && diameter != ''){
          remove.appendChild(removeText);
          remove.setAttribute('class','button button-assertive button-delete');
          remove.setAttribute('data-itemid',pizzaId);

          _.pizzas.push({
            "pizzaId": pizzaId,
            "price": parseInt(price), 
            "priceUnit": _.getPriceUnit(),
            "diameter": parseInt(diameter),
            "diameterUnit": _.getDiameterUnit()
          });

          console.log('Pizza array: '+_.pizzas);
          
          diameterElement.appendChild(diameterVal);
          priceElement.appendChild(priceVal);
          priceElement.setAttribute('class','pizza__price');
          diameterElement.setAttribute('class', 'pizza__diameter');
          pastry.setAttribute('class','pizza');
          pastry.setAttribute('id',pizzaId);
          
          pastry.appendChild(diameterElement);
          pastry.appendChild(priceElement);
          remove.addEventListener('click', _.remove, true);
          pastry.appendChild(remove);
          pizzaList.appendChild(pastry);
        }
      };

      _.calculateBestValue = function(){
        var bestValue = null;
        priceAreaRatios = [];
        for(var i = 0; i < _.pizzas.length; i++){
          var thisPizza = _.pizzas[i];
          var radius = thisPizza.diameter / 2;
          var area = 3.141592 * (radius * radius);

          priceAreaRatios.push({
            'id'   : thisPizza.pizzaId,
            'priceAreaRatio' : thisPizza.price/area
          });

          //console.log('area:'+area+' price per cm^2: '+thisPizza.price/area);
        }

        var smallest = 0;
        for(p = 0; p < priceAreaRatios.length; p++){
          if(priceAreaRatios[smallest].priceAreaRatio> priceAreaRatios[p].priceAreaRatio){
            smallest = p;
          }
        }

        cheapestPizza = document.getElementById(priceAreaRatios[smallest].id);
        cheapestPizza.classList.add('bestValue');
        cheapestPizza.scrollIntoView(true);
        console.log(smallest);
      };
    };

  
    var pizza = new pizza();
    var addPizza = document.getElementById('addPizza');
    addPizza.addEventListener('click', function(e){
      var diameter = document.getElementById('pizzaDiameter');
      var price    = document.getElementById('pizzaPrice');
      pizza.make(price.value, diameter.value);
    });

    var change = document.getElementsByClassName('changeUnit');
    Array.from(change).forEach(function(element) {
      element.addEventListener('change', function(){
        console.log(this.value);
        pizza.changeUnit(this.dataset.unit, this.value);
        return true;
      });
    });

    var calc = document.getElementById('calculate');
    calc.addEventListener('click', function(){
      pizza.calculateBestValue();
    });
  });
})