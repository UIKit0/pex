define(['pex/geom/Vec3'], function(Vec3) {
  //position is bottom left corner of the cell
  function Octree(position, size) {
    this.root = new Octree.Cell(position, size, 0);
  }

  Octree.fromBoundingBox = function(bbox) {
    return new Octree(Vec3.clone(bbox.min), Vec3.clone(bbox.getSize()));
  }

  Octree.MaxLevel = 8;

  //p = {x, y, z}
  Octree.prototype.add = function(p) {
    this.root.add(p);
  }

  //check if the point was already added to the octreee
  Octree.prototype.has = function(p) {
    return this.root.has(p);
  }

  Octree.prototype.findNearestPoint = function(p, options) {
    options = options || {};
    return this.root.findNearestPoint(p, options);
  }

  Octree.Cell = function(position, size, level) {
    this.position = position;
    this.size = size;
    this.level = level;
    this.points = [];
    this.children = [];
  }

  Octree.Cell.prototype.has = function(p) {
    if (!this.contains(p)) return null;

    if (this.children.length > 0) {
      for(var i=0; i<this.children.length; i++) {
        var duplicate = this.children[i].has(p);
        if (duplicate) {
          return duplicate;
        }
      }
      return null;
    }
    else {
      for(var i=0; i<this.points.length; i++) {
        var o = this.points[i];
        if (p[0] == o[0] && p[1] == o[1] && p[2] == o[2]) {
          return o;
        }
      }
      return null;
    }
  }

  Octree.Cell.prototype.add = function(p) {
    this.points.push(p);

    if (this.children.length > 0) {
      this.addToChildren(p);
    }
    else {
      if (this.points.length > 1 && this.level < Octree.MaxLevel) {
        this.split();
      }
    }
  }

  Octree.Cell.prototype.addToChildren = function(p) {
    for(var i=0; i<this.children.length; i++) {
      if (this.children[i].contains(p)) {
        this.children[i].add(p);
        break;
      }
    }
  }

  Octree.Cell.prototype.contains = function(p) {
    return p[0] >= this.position[0]
        && p[1] >= this.position[1]
        && p[2] >= this.position[2]
        && p[0] <= this.position[0] + this.size[0]
        && p[1] <= this.position[1] + this.size[1]
        && p[2] <= this.position[2] + this.size[2];
  }

  // 1 2 3 4
  // 5 6 7 8
  Octree.Cell.prototype.split = function() {
    var x = this.position[0];
    var y = this.position[1];
    var z = this.position[2];
    var w2 = this.size[0]/2;
    var h2 = this.size[1]/2;
    var d2 = this.size[2]/2;

    this.children.push(new Octree.Cell(Vec3.fromValues(x, y, z), Vec3.fromValues(w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x + w2, y, z), Vec3.fromValues( w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x, y, z + d2), Vec3.fromValues( w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x + w2, y, z + d2), Vec3.fromValues( w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x, y + h2, z), Vec3.fromValues(w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x + w2, y + h2, z), Vec3.fromValues( w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x, y + h2, z + d2), Vec3.fromValues( w2, h2, d2), this.level + 1));
    this.children.push(new Octree.Cell(Vec3.fromValues(x + w2, y + h2, z + d2), Vec3.fromValues( w2, h2, d2), this.level + 1));

    for(var i=0; i<this.points.length; i++) {
      this.addToChildren(this.points[i]);
    }
  }

  Octree.Cell.prototype.findNearestPoint = function(p, options) {
    var nearest = null;
    if (this.children.length > 0) {
      for(var i=0; i<this.children.length; i++) {
        var child = this.children[i];
        if (child.points.length > 0 && child.contains(p)) {
          nearest = child.findNearestPoint(p, options);
          if (nearest) break;
        }
      }
    }
    if (!nearest && this.points.length > 0) {
      var minDistSq = 99999;
      for(var i=0; i<this.points.length; i++) {
        var distSq = Vec3.distanceSquared(this.points[i], p);
        if (distSq < minDistSq) {
          if (distSq < 0.0001 && options.notSelf) continue;
          minDistSq = distSq;
          nearest = this.points[i];
        }
      }
    }
    return nearest;
  }

  return Octree;
});