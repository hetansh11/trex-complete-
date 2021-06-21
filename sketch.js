var PLAY = 1;
var END = 0;
var gameState = PLAY;
var over
var restart

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var overImage

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  jump=loadSound("jump.mp3")
  Die=loadSound("die.mp3")
  checkpoint=loadSound ("checkPoint.mp3")
  

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  overImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  over=createSprite(width/2,height/2,20,20)
  over.addImage(overImage)
  restart=createSprite(width/2,height/2,20,20)
  restart.addImage(restartImage)
  restart.scale=0.5
  trex.debug=false
  trex.setCollider("circle",0,0,40)
  ground = createSprite(width/2,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(50,height-10,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(0,0,0);
  //displaying score
  text("Score: "+ score, width-100,30);
  
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+Math.round(score/100));
    //scoring
    score = score + Math.round(frameCount/60);
    restart.visible=false
    if (ground.x < 0){
      ground.x = ground.width/2;
    
    }
    if(score>0&&score%100===0){
     checkpoint.play() 
    }
    //jump when the space key is pressed
    if((touches.length>0||(keyDown("space")))&& trex.y >= height-50) {
      jump.play()
      touches=[]
        trex.velocityY = -13;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
     
      Die.play()
    }
    over.visible=false
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     trex.changeAnimation("collided" , trex_collided)
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-2)
     cloudsGroup.setLifetimeEach(-2)
      over.visible=true
     restart.visible=true
     
     if(mousePressedOver(restart)){
       console.log("gameRestart")
       gameState=PLAY
       obstaclesGroup.destroyEach();
       cloudsGroup.destroyEach();
       score=0
        trex.changeAnimation("running", trex_running)
       
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-40   ,10,40);
   obstacle.velocityX = -(6+Math.round(score/100));
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,height-60,40,10);
    cloud.y = Math.round(random(height-200,height-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

