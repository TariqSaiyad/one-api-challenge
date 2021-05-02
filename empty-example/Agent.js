var agentAlpha = 90;
var Agent = function (noiseZRange) {
  this.vector = createVector(random(width), random(height));
  this.vectorOld = this.vector.copy();
  this.stepSize = random(1, 5);
  this.angle;
  this.noiseZ = random(noiseZRange);
};

Agent.prototype.update = function (strokeWidth, noiseZVelocity, hit) {
 

  this.vector.x += cos(this.angle) * this.stepSize;
  this.vector.y += sin(this.angle) * this.stepSize;


  if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
  if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
  if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
  if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;

  // color stuff
  let col = map(this.vector.y, 0, height, 250, 360);
  stroke(chroma(col, 1, 0.6, "hsl").rgb(), agentAlpha);
  if (hit) {
    stroke(0);
  }
  strokeWeight(strokeWidth * this.stepSize);
  line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);

  this.vectorOld = this.vector.copy();

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

  this.update(strokeWidth, noiseZVelocity, hit);
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

  this.update(strokeWidth, noiseZVelocity, hit);
};
