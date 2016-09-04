

function Animal(obj) {
    obj = obj || {};

    obj.breath = function() {
      console.info("breathing...");
    }

    return obj;
}

function Shark(obj) {
    obj = obj || {};

    Animal(obj);
    obj.swim = function() {
       console.info("Swimming")
    }
    return obj;
}


shark = Shark();

shark.breath();
shark.swim();
