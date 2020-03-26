
export var move = function(x,y,z){
	// this.polygons.forEach(function(polygon){
	// 	polygon.points.forEach(function(point){
	// 		point.x += x;
	// 		point.y += y;
	// 		point.z += z;
	// 	});
	// });

	// this.lines.forEach(function(line){
	// 	line.a.x += x;
	// 	line.a.y += y;
	// 	line.a.z += z;

	// 	line.b.x += x;
	// 	line.b.y += y;
	// 	line.b.z += z;
	// });

	this.points.forEach(function(point){
		point.ghost.x += x;
		point.ghost.y += y;
		point.ghost.z += z;
	});

	// this.actual.x -= x;
	// this.actual.y -= y;
	// this.actual.z -= z;
}
