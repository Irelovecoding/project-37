const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Mouse = Matter.Mouse;
var gameState;

var bedroomImg, gardenImg, washroomImg;
var lastFed;
var foodStock;
function setup() {
    readState=database.ref('gameState');
    readState.on("value",function(data){
        gameState=data.val();
    })


    canvas = createCanvas(1000,1000);
	engine = Engine.create();
    world = engine.world;
    
    dog=createSprite(800,200,150,150);
    dog.addImage(sadDog);
    dog.scale=0.15;

    feed=createButton("Feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);
     };

     function preload() {
         bedroomImg=loadImage("Bed room.png");
         gardenImg=loadImage("Garden.png");
         washroomImg=loadImage("Wah room.png");
     }
  

function draw() {
    background("black");
   fill(255,255,254);
    textSize(15);
    if(lastFed>=12){
        text("Last Feed : "+ lastFed%12 + "PM", 350,30);
    }else if(lastFed==0){
        text("Last Feed : 12AM", 350,30);
    }else{
        text("Last Feed :"+ lastFed + "AM", 350,30);
    }
    fedTime=database.ref(feedTime);
    fedTime.on("value",function(data){
        lastFed=data.val();
    });

    if(gameState!="Hungry"){
        feed.hide();
        addFood.hide();
        dog.remove();
    }else{
        feed.show();
        addFood.show();
        dog.addImage(sadDog);
    }

    currentTime=hour();
    if(currentTime===(lastFed+1)){
        update("Playing");
        foodObj.garden();
    }else if(currentTime==(lastFed+2)){
        update("Sleeping");
        foodObj.bedroom();
    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
        update("Bathing");
        foodObj.washroom();
    }else{
        update("Hungry")
        foodObj.display();
    }

}

function feedDog() {
   dog.addImage(happyDog);
   foodObj.updateFoodStock(foodObj.getFoodStock()-1);
   database.ref('/').update({
       Food:foodObj.getFoodStock(),
       FeedTime:hour()
        })
}
function addFoods() {
    foodS++;
    database.ref('/').update({Food:foodS})
  
}

function update(state){
    database.ref('/').update({
        gameState:state
    });
}
