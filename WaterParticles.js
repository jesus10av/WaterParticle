var system;

var contadoragua = 0;

var img;
var fire;
var firedos
var smk;
var iceberg;

var nube;
var nubedos;

var chorrouno;
var chorrodos;
var humo;

var nubex = 500;
var nubedosx = 650;

var barcox = 0;
var contador = 0;

function setup() {
  createCanvas(1200, 650);
  
  // rio
  system = new ParticleSystem(createVector(width/2, 50));

  //---- Flamas de fuego
  fire = new FuegoSystem(createVector(220,240));
  firedos = new FuegoSystem(createVector(320,240));
  
  //---Bote
  img = loadImage  ("bote.png");
  //-- nuber
  nube = loadImage("cloud.png");
  nubedos = loadImage("cloud.png");
  //--iceberg
  iceberg= loadImage("iceberg3.png");
  

  //--humo
  humo = new SmokeSystem( createVector(220, 30) );

  smk = loadImage("smoke.png")
  filter(BLUR, 3);

  //Lluvia
  chorrouno = new WaterSystem(createVector(600, 100) );
  chorrodos = new WaterSystem(createVector(740, 100) );
  
  

}

function draw() {
  background(255, 255, 255);

  nubex = nubex + 0.60;
  nubedosx = nubedosx + 0.60;
  barcox += 1;
  contadoragua = contadoragua+1;
  
  
  if(barcox >= 120){
    barcox = 120;
    fire.addParticle();
    fire.run();
    firedos.addParticle();
    firedos.run();
    contador=contador+1;
    if(contador>100){
      humo.addParticle();
      humo.run();
    }
  }
  

  image(img, barcox, 60, img.width, img.height);
  image(nube,nubex,0, nube.width, nube.height);
  image(nubedos, nubedosx, 0, nubedos.width, nubedos.height );
  image(iceberg, 250, 180, img.width, img.height);

  system.addParticle();
  system.run();

  

  chorrouno.addParticle();
  chorrouno.run();

  chorrodos.addParticle();
  chorrodos.run();

  
}

//------------------ A simple Particle class--------------------------------------
var Particle = function(position) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(-3, 0);
  this.position = createVector(width, random(height/2-20, height/2+350));
  this.lifespan = width;
  this.alpha = 255;
  this.extra = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
  this.alpha -= 1;
  this.extra -= 0.58; 
};

// Method to display
Particle.prototype.display = function() {
//  stroke(200, this.lifespan);
//  strokeWeight(2);
  noStroke();
  var radius = 80;

  var red = 255 - this.extra; 
  var green = 284 - this.extra; 



  fill(red, green, 255, 255);
  ellipse(this.position.x, this.position.y, 2500, radius);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  for (var i = 0; i<3; i++){
    this.particles.push(new Particle(this.origin));
  }
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};//Fin metodo run
//-----------------------------------------------------------
//+++ INICIO DE fuego QUE HEREDAN DE LAS PARTICLES +++++++
var Fire = function(position)
{
    //Hacer que herede de particles
    Particle.call(this, position);
    //Modificar comportamiento
    //posicion indicada en constructor
    this.position = createVector(position.x, position.y);
    //Que no se alejen mucho
    this.velocity = createVector(random(-0.1,0.1), random(-1,0));
    //Tiempo de vida = distancia que se aleja del barco
    this.lifespan = random(50,250);
    //Transparencia
    this.alpha = (this.lifespan-= 4);
    
};//fin objeto tipo fire

//Now, in order to make sure that our Smoke object share the same //methods as Particle objects, we need to specify that their prototype //should be based on the Particle prototype:
Fire.prototype = Object.create(Particle.prototype);
Fire.prototype.constructor = Fire;

//-------INICIO METODOS DE OBJETOS TIPO FUEGO------
//Display Smoke que parezca humo colorado
Fire.prototype.display = function()
{
    noStroke();
    //Dar color al fuego
    //colorMode(HSB);
    //Para la variable hue crear una variable que haga
    //ver que el feugo cambia de color a medida
    //que tiempo transcurre
    var colorfuego = (255-this.alpha);
    //Fin color fuego

    //Color flama y dimension de particulas
    fill(255, colorfuego, 0, this.alpha);
    ellipse(this.position.x, this.position.y, 15, 15);
    
};//Fin metodo display fire

//+++ FIN Fuego PARTICLES +++++++++++++++++++++++++++++++
//-------INICIO SISTEMA DE PARTICULAS DE TIPO FUEGO------
var FuegoSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

//Grosor
FuegoSystem.prototype.addParticle = function() {
  for (var i = 0; i<5; i++){
    this.particles.push(new Fire(this.origin));
  }
};

FuegoSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};//Fin metodo run
//-------------- FIN SISTEMA DE PAERTICULAS DE TIPO FUEGO----
//**************************************************************

//+++ INICIO DE fuego QUE HEREDAN DE LAS PARTICLES +++++++
var Water = function(position)
{
    //Hacer que herede de particles
    Particle.call(this, position);
    //Modificar comportamiento
    //posicion indicada en constructor
    this.position = createVector(position.x, position.y);
    //Que no se alejen mucho
    this.velocity = createVector(random(-0.1,0.1), random(0, 10));
    //Tiempo de vida = distancia que se aleja del barco
    this.lifespan = 20;
    //Transparencia
    this.alpha = 225;
    
};//fin objeto tipo fire

//Now, in order to make sure that our Smoke object share the same //methods as Particle objects, we need to specify that their prototype //should be based on the Particle prototype:
Water.prototype = Object.create(Particle.prototype);
Water.prototype.constructor = Fire;

//-------INICIO METODOS DE OBJETOS TIPO FUEGO------
//Display Smoke que parezca humo colorado
Water.prototype.display = function()
{
    noStroke();
    //Dar color al agua
    var red = 255 - this.alpha; 
    var green = 284 - this.alpha;


    //Color gotas y dimension de particulas
    fill(red, green, 255, this.alpha);
    ellipse(this.position.x, this.position.y, 75, 120);
    
};//Fin metodo display agua

Water.prototype.update = function()
{
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.alpha -=10;
}//Fin update the water

//+++ FIN AGUA PARTICLES +++++++++++++++++++++++++++++++
//-------INICIO SISTEMA DE PARTICULAS DE TIPO AGUA-----
var WaterSystem = function(position) {
  this.origin = position.copy();
  //this.origin.x = this.origin.x+35;
  this.particles = [];
};

//Grosor
WaterSystem.prototype.addParticle = function() {
  for (var i = 0; i<4; i++)
  {
    var pos = this.origin;
    pos.x = pos.x+0.15;
    this.particles.push(new Water(pos));
  }
};

WaterSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};//Fin metodo run
//-------------- FIN SISTEMA DE PAERTICULAS DE TIPO AGUA----
//**********************************************************
//INICIO DE PARTICULAS TIPO SMOKE
var Smoke = function(position)
{
    //Hacer que herede de particles
    Particle.call(this, position);
    //Modificar comportamiento
    
  this.acceleration = createVector(0, -0.05);
  this.velocity = createVector(random(-3, 3), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255.0;
    
};//fin objeto tipo fire

//Now, in order to make sure that our Smoke object share the same //methods as Particle objects, we need to specify that their prototype //should be based on the Particle prototype:
Smoke.prototype = Object.create(Particle.prototype);
Smoke.prototype.constructor = Smoke;

//-------INICIO METODOS DE OBJETOS TIPO FUEGO------
//Display Smoke que parezca humo colorado
Smoke.prototype.display = function()
{
    noStroke();
    fill(0, 0, 0, this.lifespan);
    var radius = 120;
    //ellipse(this.position.x, this.position.y, radius, radius);
    image(smk, this.position.x, this.position.y, radius, radius);
    
};//Fin metodo display fire

//+++ FIN Fuego PARTICLES +++++++++++++++++++++++++++++++
//-------INICIO SISTEMA DE PARTICULAS DE TIPO SMOKE------
var SmokeSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

//Grosor
SmokeSystem.prototype.addParticle = function() {
  for (var i = 0; i<4; i++){
    this.particles.push(new Smoke(this.origin));
  }
};

SmokeSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};//Fin metodo run
//-------------- FIN SISTEMA DE PAERTICULAS DE TIPO FUEGO----