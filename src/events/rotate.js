import { Cinnamon } from "../../lib/cinnamon-esm";

const RADIANS = Cinnamon.RADIANS;

var set_point = function(point,x,y,angle){

	var dx = point[x],
		dy = point[y],
		_angle = Math.atan(dx/dy) * RADIANS,
		d = _angle === 90
			? dx
			: dy / Math.cos(_angle / RADIANS),
		angle_angle = _angle + angle;
	if (angle_angle < 0) {
		angle_angle = 360 + angle_angle;
	}
	else if (angle_angle > 360) {
		angle_angle = angle_angle - 360;
	}

	// if (window.one === point && y === "y") {
	// 	console.log("Point y: ", y, point[y] - Math.cos(angle_angle/RADIANS) * d, "|", Math.cos(angle_angle/RADIANS), d);
	// }
	if (point === this.points[0] && y === "y") {
		// console.log("Points: ", angle_angle, _angle, angle, "|", point[y], Math.cos(angle_angle/RADIANS) * d, point[y] - Math.cos(angle_angle/RADIANS) * d);
    }
    

	point[x] = Math.sin(angle_angle/RADIANS) * d;
    point[y] = Math.cos(angle_angle/RADIANS) * d;
    
    // console.log("Rotate: ", point, angle_angle, d);

}

export var rotate = function(x,y,angle){
	// this.polygons.forEach(function(polygon){
	// 	polygon.points.forEach(function(point){
	// 		set_point.apply(this,[point,x,y,angle]);
	// 	}.bind(this));
	// }.bind(this));

	// this.lines.forEach(function(line){
	// 	set_point.apply(this,[line.a,x,y,angle]);
	// 	set_point.apply(this,[line.b,x,y,angle]);
	// }.bind(this));

	this.points.forEach(function(point){
		set_point.apply(this,[point.ghost,x,y,angle]);
	}.bind(this));


	// console.log("Rotate: ", x, y, angle);

	// if (x === "x" && y === "z") {
	// 	this.actual.xz += angle;
	// }
	// if (x === "y" && y === "z") {
	// 	this.actual.yz += angle;
	// }
}
