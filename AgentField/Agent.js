var agentAlpha = 90;
var Agent = function (noiseZRange) {
  this.vector = Vec(random(width), random(height));
  this.vectorOld = Vec(this.vector.x,this.vector.y);
  this.stepSize = random(1, 5);
  this.angle;
  this.noiseZ = random(noiseZRange);
};

Agent.prototype.update = function (strokeWidth, noiseZVelocity, hit, mode) {
 
  this.vector.x += cos(this.angle) * this.stepSize;
  this.vector.y += sin(this.angle) * this.stepSize;


  if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
  if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
  if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
  if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;

  // color stuff
  let col;
  if(mode){
  col = map(this.vector.y *this.vector.x, 0, height*width, 150, 260);
  }else{
  col = map(this.vector.y *this.vector.x, 0, height*width, 300, 200);
  }

  !hit? stroke(chroma(col, 1, 0.6, "hsl").rgb(), agentAlpha):stroke(0);
  let strW = map(dist(this.vector.x, this.vector.y, width/2,height/2),0,dist(0,0,width/2,height/2), strokeWidth, noiseZVelocity*strokeWidth )
  strokeWeight(strW);
  line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);

  this.vectorOld = Vec(this.vector.x,this.vector.y);

  this.noiseZ += noiseZVelocity;
};

Agent.prototype.update1 = function (
  strokeWidth,
  noiseScale,
  noiseStrength,
  noiseZVelocity,
  hit
) {
  this.angle =
    noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) *
    noiseStrength;

  this.update(strokeWidth, noiseZVelocity, hit, true);
};

Agent.prototype.update2 = function (
  strokeWidth,
  noiseScale,
  noiseStrength,
  noiseZVelocity,
  hit
) {
  this.angle =
    noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) *
    24;
  this.angle = (this.angle - floor(this.angle)) * noiseStrength;

  this.update(strokeWidth, noiseZVelocity, hit,false);
};
