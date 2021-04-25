var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bg;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  bg = loadImage("sky1.jpg");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(200,625,20,50);
 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  
  ground = createSprite(200,720,3000,200);
 // ground.addImage("ground",groundImage);
  ground.x = ground.width/2 ;
  ground.shapeColor = "green";
 // ground.velocityX = -(6 + 3*score/100);


 // ground.velocityX = -2;
  gameOver = createSprite(camera.position.x-10,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x-10,340);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,635,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  textSize(25);
  fill("black")
  text("Score: "+ score, camera.position.x+500,200);

  console.log(trex.y);
  
  
  invisibleGround.x = camera.position.x-500;
  //ground.x =200;
  if (gameState===PLAY){
    
  trex.x = camera.position.x-600;
    if(camera.position.x = camera.position.x+13){
      score = score+1;
    }
    invisibleGround.x = camera.position.x-500;
    if(keyDown("space") && trex.y >= 535) {
      trex.velocityY = -15;
    }
   
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x <camera.position.x-500){
      ground.x = camera.position.x;
      
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x = camera.position.x-10;
    restart.x =  camera.position.x-10;
    
   
    trex.velocityY = 0;
   // obstaclesGroup.setVelocityXEach(0);
    //cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    

    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 20 === 0) {
    var cloud = createSprite(camera.position.x+650,520,40,10);
    cloud.y = Math.round(random(300,500));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    
    
     //assign lifetime to the variable
    cloud.lifetime = 1500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x+650,585,10,40);
   
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
    obstacle.scale = 1;
    obstacle.lifetime = 1500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}