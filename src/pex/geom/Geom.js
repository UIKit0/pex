//Module wrapper for geometry related classes.
define([
  "pex/geom/Cube",
  "pex/geom/SimpleCube",
  "pex/geom/Sphere",
  "pex/geom/LineBuilder",
  "pex/geom/Path",
  "pex/geom/Loft",
  "pex/geom/Plane",
  "pex/geom/hem/HEM",
  "pex/geom/BoundingBox"
  ],
  function(Cube, SimpleCube, Sphere, LineBuilder, Path, Loft, Plane, HEM, BoundingBox) {
    return {
      Cube : Cube,
      SimpleCube : SimpleCube,
      Sphere : Sphere,
      LineBuilder : LineBuilder,
      Path : Path,
      Loft : Loft,
      Plane : Plane,
      HEM : HEM,
      BoundingBox : BoundingBox
    };
});