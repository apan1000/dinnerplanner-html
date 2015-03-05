// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
dinnerPlannerApp.factory('Dinner',function ($resource) {
  
  /*
  Keys:
  other: dvxveCJB1QugC806d29k1cE6x23Nt64O
  FB: dvxltQK4R4bLekoy63EflsMu6R0q44ze
  Ellinor: dvxy2iVl2OIUF0Hx3rKp1t0t3GfA6v9Q
  */

  this.numberOfGuests = 3;
  this.menu = [];
  var keys = ['dvxveCJB1QugC806d29k1cE6x23Nt64O',
        'dvxltQK4R4bLekoy63EflsMu6R0q44ze',
        'dvxy2iVl2OIUF0Hx3rKp1t0t3GfA6v9Q'];
  this.key = keys[2];
  this.DishSearch = $resource('http://api.bigoven.com/recipes',{pg:1,rpp:4,api_key:this.key});
  this.Dish = $resource('http://api.bigoven.com/recipe/:id',{api_key:this.key}); 


  //Sets the number of guests to num
  this.setNumberOfGuests = function(num) {
    if(num > 0) {
      this.numberOfGuests = num;
    }
  }

  //Returns number of guests
  this.getNumberOfGuests = function() {
    return parseInt(this.numberOfGuests);
  }

  //Returns the dish that is on the menu for selected type 
  this.getSelectedDish = function(type) {
    for(key in this.menu) {
      if(this.menu[key].Category == type) {
        return this.menu[key];
      }
    }
  }

  //Returns all the dishes on the menu.
  this.getFullMenu = function() {
    return this.menu;
  }

  //Returns all ingredients for all the dishes on the menu.
  this.getAllIngredients = function() {
    var ingredients = [];
    for(key in this.menu) {
      ingredients = ingredients.concat(this.menu[key].Ingredients);
    }
    return ingredients;
  }

  //Returns the total price of the menu (all the ingredients multiplied by number of guests).
  this.getTotalMenuPrice = function() {
    var ingredients = this.getAllIngredients();
    var totalPrice = 0;
    for(key in ingredients){
      totalPrice += parseFloat(ingredients[key].MetricQuantity) * this.numberOfGuests;
    }
    return totalPrice;

  }

  //Returns the price of a dish (all the ingredients multiplied by number of guests).
  this.getDishPrice = function(dish) {
    var price = 0;
    for(key in dish.Ingredients) {
      price += parseFloat(dish.Ingredients[key].MetricQuantity) * this.numberOfGuests;
    }
    return price;
  }

  //Adds the passed dish to the menu. If the dish of that type already exists on the menu
  //it is removed from the menu and the new one added.
  this.addDishToMenu = function(id) {
    var apiKey = this.key;
    var url = "http://api.bigoven.com/recipe/"+id+"?api_key="+apiKey;
    console.log("url: "+url);
    $.ajax({
      type: "GET",
      dataType: 'json',
      cache: false,
      context: this, //this == dinnerModel
      url: url,
      success: function (data) {
        console.log(data);
        var dish = data;
        for(key in this.menu) {
          if(this.menu[key].RecipeID != dish.RecipeID) {
            if(this.menu[key].Category == dish.Category) {
              this.removeDishFromMenu(this.menu[key].RecipeID);
            }
          } else {
            return;
          }
        }
        this.menu.push(data);
      },
      error: function(jqXHR,textStatus,errorThrown) {
      }
    }); 
  }

  //Removes dish from menu
  this.removeDishFromMenu = function(id) {
    for(key in this.menu) {
      if(this.menu[key].RecipeID == id){
        var index = this.menu.indexOf(this.menu[key]);
        this.menu.splice(index,1);
      }
    }
  }

  //Removes all dishes from menu
  this.emptyMenu = function() {
    this.menu = [];
  }

  // TODO in Lab 5: Add your model code from previous labs
  // feel free to remove above example code
  // you will need to modify the model (getDish and getAllDishes) 
  // a bit to take the advantage of Angular resource service
  // check lab 5 instructions for details

  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});