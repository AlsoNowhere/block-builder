const get = (scope,property,action) => {
    if (!(scope instanceof Object)) {
        throw new Error("Thyme, get, scope -- You must pass an Object as the scope");
    }
    if (typeof property !== "string") {
        throw new Error("Thyme, get, property -- You must pass a string as the property");
    }
    if (!(action instanceof Function)) {
        throw new Error("Thyme, get, action -- You must pass a function as the action");
    }

    Object.defineProperty(scope,property,{
        get: action
    });
};

const loadElement = function(
    element
){
    if (!(element instanceof Element)) {
        throw new Error("Cinnamon, loadElement, element -- You must pass a DOM/HTML element.");
    }

    this.element = element;

    return this;
};

const defaultColour = "grey";
const defaultSize = 2;

const Point = function(
    x = 0,
    y = 0,
    z = 0,
    options = {
        colour: defaultColour,
        size: defaultSize
    }
){
    if (typeof x !== "number") {
        throw new Error("Cinnamon, Point, x -- You must pass a number to x argument.");
    }
    if (typeof y !== "number") {
        throw new Error("Cinnamon, Point, y -- You must pass a number to y argument.");
    }
    if (typeof z !== "number") {
        throw new Error("Cinnamon, Point, z -- You must pass a number to z argument.");
    }
    if (!(options instanceof Object)) {
        throw new Error("Cinnamon, Point, options -- You must pass an Object or undefined to the options argument.");
    }

    this.x = x;
    this.y = y;
    this.z = z;

    this.ghost = {x,y,z,negative:false};
    Object.seal(this.ghost);

    this.colour = options.colour || defaultColour;
    this.size = options.size || defaultSize;

    Object.freeze(this);
};

Point.centre = new Point(0,0,0);

Point.prototype = new function PointPrototype(){
    this.reset = function(){
        this.ghost.x = this.x;
        this.ghost.y = this.y;
        this.ghost.z = this.z;
        this.ghost.negative = false;
    };
    
    Object.freeze(this);
};

const Direction = function(
    dir_zx = 0,
    dir_y = 0
){
    if (typeof dir_zx !== "number") {
        throw new Error("Cinnamon, Direction, dir_zx -- You must pass a number to dir_zx argument.");
    }
    if (typeof dir_y !== "number") {
        throw new Error("Cinnamon, Direction, dir_y -- You must pass a number to dir_y argument.");
    }

    this.dir_zx = dir_zx;
    this.dir_y = dir_y;

    Object.freeze(this);
};

const Aperture = function(
    zx = 45
){
    if (typeof zx !== "number") {
        throw new Error("Cinnamon, Aperture, zx -- You must pass a number to zx argument.");
    }

    this.zx = zx;
    this.y = 0;

    Object.seal(this);
};

const Settings = function(
    originalPoint = new Point(),
    originalDirection = new Direction(),
    aperture = new Aperture()
){
    if (!(originalPoint instanceof Point)) {
        throw new Error("Cinnamon, Settings, originalPoint -- You must pass an instance of Cinnamon.Point as originalPoint argument.");
    }
    if (!(originalDirection instanceof Direction)) {
        throw new Error("Cinnamon, Settings, originalDirection -- You must pass an instance of Cinnamon.Direction as originalDirection argument.");
    }
    if (!(aperture instanceof Aperture)) {
        throw new Error("Cinnamon, Settings, aperture -- You must pass an instance of Cinnamon.Aperture as aperture argument.");
    }

    this.originalPoint = originalPoint;
    this.originalDirection = originalDirection;
    this.aperture = aperture;

    Object.seal(this);
};

const addDefaultSettings = function(
    settings = new Settings()
) {
    if (!(settings instanceof Settings)) {
        throw new Error("Cinnamon, addDefaultSettings, settings -- You must pass an instance of Settings to settings argument.");
    }

    this.x = settings.originalPoint.x;
    this.y = settings.originalPoint.y;
    this.z = settings.originalPoint.z;

    this.dir_zx = settings.originalDirection.dir_zx;
    this.dir_y = settings.originalDirection.dir_y;

    this.aperture = settings.aperture;
    this.aperture.y = this.aperture.zx * this.height / this.width;

    return this;
};

const ShapeEvent = function(
    eventName,
    callback
){
    this.eventName = eventName;
    this.callback = callback;
};

const Polygon = function(
    points = [],
    options = {
        colour: defaultColour,
        events: []
    }
){
    if (!(points instanceof Array)) {
        throw new Error("Cinnamon, Polygon, points -- You must pass an Array to the points argument.");
    }
    if (points.length < 3) {
        throw new Error(`Cinnamon, Polygon, points -- You must at least 3 points, you have passed ${points.length}.`);
    }
    if (!(options instanceof Object)) {
        throw new Error("Cinnamon, Polygon, options -- You must pass an Object or undefined to the options argument.");
    }
    if (options.events && !(options.events instanceof Array)) {
        throw new Error("Cinnamon, Polygon, options.events -- If you add an events property to the options object it must be an Array.");
    }

    const events = (options.events || []).filter(x=>{
        return x instanceof ShapeEvent;
    });

    if (events.length < (options.events || []).length) {
        console.warn(`Cinnamon, Polygon, options.events -- ${options.events.length - events.length} were filtered from this list because they were not instances of Cinnamon.ShapeEvent. Ensure your data is clean.`);
    }

    this.points = points;

    Object.defineProperty(this,"centre",{
        get(){
            const x = points.reduce((a,b)=>a+b.x,0)/points.length;
            const y = points.reduce((a,b)=>a+b.y,0)/points.length;
            const z = points.reduce((a,b)=>a+b.z,0)/points.length;
            return {x,y,z};
        }
    });
    Object.defineProperty(this,"ghostCentre",{
        get(){
            const x = points.reduce((a,b)=>a+b.ghost.x,0)/points.length;
            const y = points.reduce((a,b)=>a+b.ghost.y,0)/points.length;
            const z = points.reduce((a,b)=>a+b.ghost.z,0)/points.length;
            return {x,y,z};
        }
    });

    this.colour = options.colour;

    this.events = events;
    Object.freeze(this.events);

    if (options.marker !== undefined) {
        this.marker = options.marker;
    }

    Object.seal(this);
};

const addPoints = function(
    points
){
    if (!(points instanceof Array)) {
        throw new Error("Cinnamon, addPoints, points -- You must pass an Array to the points argument.");
    }

    const filtered = points.filter(x => x instanceof Point);

    if (filtered.length < points.length) {
        console.warn(`${filter.length - points.length} points were filtered out because they were not instances of Cinnamon.Point. Please clean your data.`);
    }

    this.points.push(...filtered);

    return this;
};

const addPolygons = function(
    polygons
){
    if (!(polygons instanceof Array)) {
        throw new Error("Cinnamon, addPolygons, polygons -- You must pass an Array to the polygons argument.");
    }

    const filtered = polygons.filter(x => x instanceof Polygon);

    if (filtered.length < polygons.length) {
        console.warn(`${filter.length - polygons.length} polygons were filtered out because they were not instances of Cinnamon.Polygon. Please clean your data.`);
    }

    this.polygons.push(...filtered);

    return this;
};

const RADIANS = 180 / Math.PI;

const resolveZX = (pointA,pointB) => {
    return Math.atan((pointB.x - pointA.x) / (pointB.z - pointA.z)) * RADIANS;
};

const resolveY = (pointA,pointB) => {
    return Math.atan((pointB.y - pointA.y) / (Math.pow(Math.pow(pointB.z,2)+Math.pow(pointB.x,2),1/2) - Math.pow(Math.pow(pointA.z,2)+Math.pow(pointA.x,2),1/2))) * RADIANS;
    // return Math.atan((pointB.y - pointA.y) / (pointB.z - pointA.z)) * RADIANS;
};

const centre = new Point(0,0,0);

const resolvePoint = (_width,_height,relative,aperture,point) => {

    let zx = resolveZX(centre,point);
    let y = resolveY(centre,point);

    const width = _width / 2 + zx / aperture.zx * relative / 2;
    const height = _height / 2 - y / aperture.zx * relative / 2;

    return {
        width,
        height
    };
};

const getDistance = (a,b) => Math.pow(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2),1/2);

const getDistance3D = (a,b) => Math.pow(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)+Math.pow(b.z-a.z,2),1/2);

const render = function(){
    let str = ``;

    (this.type === 1 || this.type === 2) && this.reset();

// Sort polygons by the distance from the centre at the view point. This means that polygons that are further away are behind polygons that are closer.
    const sortedPolygons = this.polygons.sort((a,b)=>getDistance3D(b.ghostCentre,Point.centre)-getDistance3D(a.ghostCentre,Point.centre));
    sortedPolygons
        .forEach((polygon,index) => {
            if (!!polygon.points.find(x=>x.ghost.negative)) {
                return;                    
            }
            const colour = polygon.colour;
            const points = polygon.points.map(point=>{
                const {width, height} = resolvePoint(this.width,this.height,this.relative,this.aperture,point.ghost)||{};
                return `${width},${height}`;
            }).filter(x=>!x.includes("NaN")).join(" ");
            const styles = `fill:${colour};`;
            const marker = polygon.marker ? `data-marker="${polygon.marker}"` : "";
            str += `<polygon points="${points}" style="${styles}" id="${index}" ${marker} />`;
        });

    this.lines.forEach(line => {
        if (line.a.ghost.negative || line.b.ghost.negative) {
            return;                    
        }
        const colour = line.colour;
        const thickness = line.size;
        const {aWidth, aHeight} = resolvePoint(this.width,this.height,this.relative,this.aperture,line.a.ghost)||{};
        const {bWidth, bHeight} = resolvePoint(this.width,this.height,this.relative,this.aperture,line.b.ghost)||{};
        const styles = `stroke:${colour};stroke-width:${thickness};`;
        str += `<line x1="${aWidth}" y1="${aHeight}" x2="${bWidth}" y2="${bHeight}" style="${styles}" />`;
    });

    this.points.forEach(point => {
        if (point.ghost.negative) {
            return;                    
        }
        const colour = point.colour;
        const size = point.size;
        const {width, height} = resolvePoint(this.width,this.height,this.relative,this.aperture,point.ghost)||{};
        const styles = `fill:${colour};`;
        str += `<circle cx="${width}" cy="${height}" r="${size}" style="${styles}" />`;
    });

// Add these elements to the HTML.
    this.element.innerHTML = str;

// Add events to polygons.
    const polygons = [...this.element.getElementsByTagName("polygon")];
    polygons.forEach(element=>{
        const polygon = sortedPolygons[element.id];
        polygon.events.forEach(polygonEvent=>{
            element.addEventListener(
                polygonEvent.eventName,
                event => {
                    const result = polygonEvent.callback(polygon,this,event,element);
                    result !== false && this.render();
                }
            );
        });
    });
};

const getAngle = (a,b) => {
    const dx = b.x-a.x;
    const dy = b.y-a.y;
    const angle = Math.atan(dx/dy) * RADIANS;
    return angle;
};

const getXY = (angle,distance) => {

    const x = Math.sin(angle / RADIANS) * distance;
    const y = Math.cos(angle / RADIANS) * distance;

    return {
        x,
        y
    }
};

const reset = function(){
    [
        ...this.points,
        ...this.lines.reduce((a,b)=>(a.push(b.a,b.b),a),[]),
        ...this.polygons.reduce((a,b)=>(a.push(...b.points),a),[])
    ]
    .forEach(point => {
        point.reset();

		point.ghost.x -= this.x;
        point.ghost.y -= this.y;
        point.ghost.z -= this.z;

/*  -- Type 1 --  */
        // const dx = Math.tan(this.dir_zx / RADIANS) * (point.ghost.z - this.z);
        // const dXz = Math.tan(this.dir_zx / RADIANS) * dx;

        // point.ghost.x += dx;
        // point.ghost.z -= dXz;

        // const dy = Math.tan(this.dir_y / RADIANS) * (point.ghost.z - this.z);
        // const dYz = Math.tan(this.dir_y / RADIANS) * dy;

        // point.ghost.y += dy;
        // point.ghost.z -= dYz;

/*  -- Type 2 --  */
        // const dx = Math.tan(this.dir_zx / RADIANS) * (point.ghost.z - this.z);
        // point.ghost.x += dx;
        // const dy = Math.tan(this.dir_y / RADIANS) * (point.ghost.z - this.z);
        // point.ghost.y += dy;

/*  -- Type 3 --  */
        // const distance = getDistance(new Point(this.x,this.y,this.z),point);
        // const dx = Math.sin(this.dir_zx / RADIANS) * distance;
        // const dz = Math.tan(this.dir_zx / RADIANS) * dx;
        // point.ghost.x -= dx;
        // point.ghost.z += distance - dx;

/*  -- Type 4 --  */
		{ // ZX
			const distance = getDistance({x:this.x,y:this.z},{x:point.ghost.x,y:point.ghost.z});
			const angle = getAngle({x:this.x,y:this.z},{x:point.ghost.x,y:point.ghost.z});
			const newAngle = angle - (this.dir_zx > 180 ? this.dir_zx - 360 : this.dir_zx);
			const {x,y} = getXY(newAngle,distance);
			if ((newAngle > 270 && newAngle < 360) || (newAngle > -90 && newAngle < 90)) {
				point.ghost.x = x;
			}
			else {
				point.ghost.x = -x;
			}
			if (newAngle > -90 && newAngle < 90) {
				point.ghost.z = y;
			}
			else {
				point.ghost.z = -y;
			}
		}
		{ // Y
			const distance = getDistance({x:this.z,y:this.y},{x:point.ghost.z,y:point.ghost.y});
			const angle = getAngle({x:this.y,y:this.z},{x:point.ghost.y,y:point.ghost.z});
			const newAngle = angle - this.dir_y;
			const {x,y} = getXY(newAngle,distance);
			point.ghost.z = y;
			point.ghost.y = x;
		}
		{
			const angleZX = getAngle({x:this.x,y:this.z},{x:point.ghost.x,y:point.ghost.z});
			const angleY = getAngle({x:this.y,y:this.z},{x:point.ghost.y,y:point.ghost.z});
			if (point.ghost.z < 0){
				point.ghost.negative = true;
			}
			if (angleZX > this.aperture.zx || angleZX < -this.aperture.zx) {
				point.ghost.negative = true;
			}
			if (angleY > this.aperture.y || angleY < -this.aperture.y) {
				point.ghost.negative = true;
			}
		}
    });
};

const Line = function(
    a,
    b,
    options = {
        colour: defaultColour,
        thickness: defaultSize
    }
){
    if (!(a instanceof Point)) {
        throw new Error("Cinnamon, Line, a -- You must pass an instance of Cinnamon.Point for the argument a.");
    }
    if (!(b instanceof Point)) {
        throw new Error("Cinnamon, Line, b -- You must pass an instance of Cinnamon.Point for the argument b.");
    }
    if (!(options instanceof Object)) {
        throw new Error("Cinnamon, Line, options -- You must pass an Object or undefined to the options argument.");
    }

    this.a = a;
    this.b = b;

    this.colour = options.colour || defaultColour;
    this.thickness = options.thickness || defaultSize;

    Object.freeze(this);

};

const movementBuffer = 5;
const increment = 1;

let coolingOff = false;
let timeout;

const wipeWindows = function(
    element = this.element
){
    if (!(element instanceof Element)) {
        throw new Error("Cinnamon, wipeWindows, element -- You must pass a DOM/HTML element or undefined to the element argument.");
    }

    let mouseDown = false;
    let previouseMouse = null;
    element.addEventListener("mousedown",event=>{
        mouseDown = true;
        previouseMouse = {x:event.clientX,y:event.clientY};
    });
    element.addEventListener("mouseup",()=>{
        mouseDown = false;
        previouseMouse = null;
    });
    element.addEventListener("mousemove",event=>{
        if (!mouseDown) {
            return;
        }
        const dx = previouseMouse.x - event.clientX;
        const dy = previouseMouse.y - event.clientY;
        if (dx > movementBuffer || dx < -movementBuffer) {
            previouseMouse = {x:event.clientX,y:previouseMouse.y};
            this.x += dx < -movementBuffer ? increment : -increment;
        }
        else if (dy > movementBuffer || dy < -movementBuffer) {
            previouseMouse = {x:previouseMouse.x,y:event.clientY};
            this.y += dy < -movementBuffer ? increment : -increment;
        }
        else {
            return;
        }
        if (!coolingOff) {
            this.render();
            coolingOff = true;
            timeout = setTimeout(()=>{
                coolingOff = false;
            },1000/30);
        }
    });
    document.body.addEventListener("keyup",event=>{
        const key = event.which;
        if (key !== 37 && key !== 38 && key !== 39 && key !== 40) {
            return;
        }
        if (key === 37) {
            this.x--;
        }
        if (key === 39) {
            this.x++;
        }
        if (key === 38) {
            this.y--;
        }
        if (key === 40) {
            this.y++;
        }
        if (!coolingOff) {
            this.render();
            coolingOff = true;
            timeout = setTimeout(()=>{
                coolingOff = false;
            },1000/30);
        }
    });
    element.addEventListener("wheel",event=>{
        this.z += event.deltaY / 100;
        if (!coolingOff) {
            this.render();
            coolingOff = true;
            timeout = setTimeout(()=>{
                coolingOff = false;
            },1000/30);
        }
    });
};

const movementBuffer$1 = 5;
const increment$1 = 1;

let coolingOff$1 = false;
let timeout$1;

const sauronsEye = function(
    element = this.element
){
    if (!(element instanceof Element)) {
        throw new Error("Cinnamon, sauronsEye, element -- You must pass a DOM/HTML element or undefined to the element argument.");
    }

    let mouseDown = false;
    let previouseMouse = null;
    element.addEventListener("mousedown",event=>{
        mouseDown = true;
        previouseMouse = {x:event.clientX,y:event.clientY};
    });
    element.addEventListener("mouseup",()=>{
        mouseDown = false;
        previouseMouse = null;
    });
    element.addEventListener("mousemove",event=>{
        if (!mouseDown) {
            return;
        }
        const dx = previouseMouse.x - event.clientX;
        const dy = previouseMouse.y - event.clientY;
        if (dx > movementBuffer$1 || dx < -movementBuffer$1) {
            previouseMouse = {x:event.clientX,y:previouseMouse.y};
            this.dir_zx += dx < -movementBuffer$1 ? increment$1 : -increment$1;
            if (this.dir_zx > 360) {
                this.dir_zx = 360 - this.dir_zx;
            }
            else if (this.dir_zx < 0) {
                this.dir_zx = 360 + this.dir_zx;
            }
        }
        else if (dy > movementBuffer$1 || dy < -movementBuffer$1) {
            previouseMouse = {x:previouseMouse.x,y:event.clientY};
            if (this.dir_y < 90 || this.dir_zx > -90) {
                this.dir_y += dy < -movementBuffer$1 ? -increment$1 : increment$1;
            }
        }
        else {
            return;
        }
        if (!coolingOff$1) {
            this.render();
            coolingOff$1 = true;
            timeout$1 = setTimeout(()=>{
                coolingOff$1 = false;
            },1000/30);
        }
    });
    document.body.addEventListener("keyup",event=>{
        const key = event.which;
        if (key !== 37 && key !== 38 && key !== 39 && key !== 40) {
            return;
        }
        if (key === 37) {
            this.x--;
        }
        if (key === 39) {
            this.x++;
        }
        if (key === 38) {
            this.y--;
        }
        if (key === 40) {
            this.y++;
        }
        if (!coolingOff$1) {
            this.render();
            coolingOff$1 = true;
            timeout$1 = setTimeout(()=>{
                coolingOff$1 = false;
            },1000/30);
        }
    });
};

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
	point[x] = Math.sin(angle_angle/RADIANS) * d;
    point[y] = Math.cos(angle_angle/RADIANS) * d;
};

var rotate = function(x,y,angle){
	[
        ...this.points,
        ...this.lines.reduce((a,b)=>(a.push(b.a,b.b),a),[]),
        ...this.polygons.reduce((a,b)=>(a.push(...b.points),a),[])
	]
	.forEach(point=>{
		set_point(point.ghost,x,y,angle);
	});
};

var move = function(x,y,z){
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

	// this.points.forEach(function(point){
	// 	point.ghost.x += x;
	// 	point.ghost.y += y;
	// 	point.ghost.z += z;
	// });


	[
        ...this.points,
        ...this.lines.reduce((a,b)=>(a.push(b.a,b.b),a),[]),
        ...this.polygons.reduce((a,b)=>(a.push(...b.points),a),[])
	]
	.forEach(point=>{
		point.ghost.x += x;
		point.ghost.y += y;
		point.ghost.z += z;
	});
	


	// this.actual.x -= x;
	// this.actual.y -= y;
	// this.actual.z -= z;
};

const movementBuffer$2 = 15;
const increment$2 = 5;

let coolingOff$2 = false;
let timeout$2;
let zx = 0;

const pivot = (scope,type,amount,distance) => {
    if (type === "left") {
		rotate.call(scope,"x","z",amount);
		move.call(scope,
			Math.sin(amount/RADIANS)*distance.z*-1,
			0,
			distance.z-Math.cos(amount/RADIANS)*distance.z
		);
	}
	if (type === "right") {
		rotate.call(scope,"x","z",-amount);
		move.call(scope,
			Math.sin(amount/RADIANS)*distance.z,
			0,
			distance.z-Math.cos(amount/RADIANS)*distance.z
		);
	}
	if (type === "down") {
		rotate.call(scope,"y","z",amount);
		move.call(scope,
			0,
			Math.sin(amount/RADIANS)*distance.z*-1,
			distance.z-Math.cos(amount/RADIANS)*distance.z
		);
	}
	if (type === "up") {
		rotate.call(scope,"y","z",-amount);
		move.call(scope,
			0,
			Math.sin(amount/RADIANS)*distance.z,
			distance.z-Math.cos(amount/RADIANS)*distance.z
		);
	}
};

const attentionCentre = function() {

    const element = this.element;
    const distance ={
        z: this.offset
    };

    let mouseDown = false;
    let previouseMouse = null;

    element.addEventListener("mousedown",event=>{
        mouseDown = true;
        previouseMouse = {x:event.clientX,y:event.clientY};
    });
    element.addEventListener("mouseup",()=>{
        mouseDown = false;
        previouseMouse = null;
    });
    element.addEventListener("mousemove",event=>{
        if (!mouseDown) {
            return;
        }
        const dx = previouseMouse.x - event.clientX;
        const dy = previouseMouse.y - event.clientY;
        if (dx > movementBuffer$2 || dx < -movementBuffer$2) {
            previouseMouse = {x:event.clientX,y:previouseMouse.y};
// ZX
            dx < -movementBuffer$2 ? (
                (zx += increment$2),
                pivot(this,"down",this.dir_y,distance),
                pivot(this,"left",increment$2,distance),
                pivot(this,"down",-this.dir_y,distance)
            )
            : (
                (zx -= increment$2),
                pivot(this,"down",this.dir_y,distance),
                pivot(this,"right",increment$2,distance),
                pivot(this,"down",-this.dir_y,distance)
            );
        }
        else if (dy > movementBuffer$2 || dy < -movementBuffer$2) {
            previouseMouse = {x:previouseMouse.x,y:event.clientY};
// Y
            if ((this.dir_y < 90 && dy > -movementBuffer$2) || (this.dir_zx > -90 && dy < -movementBuffer$2)) {
                this.dir_y += dy < -movementBuffer$2 ? -increment$2 : increment$2;
                dy < -movementBuffer$2 ? (
                    pivot(this,"down",increment$2,distance)
                )
                : (
                    pivot(this,"down",-increment$2,distance)
                );
            }
        }
        else {
            return;
        }
        if (!coolingOff$2) {
            this.render();
            coolingOff$2 = true;
            timeout$2 = setTimeout(()=>{
                coolingOff$2 = false;
            },1000/30);
        }
    });

    this.element.addEventListener("wheel",event=>{
        this.offset += event.deltaY / 100;
        distance.z = this.offset;
        move.call(this,
			0,
			0,
			event.deltaY / 100
		);
        this.render();
    });

    return function(){
        const values = {
            zx,
            y: this.dir_y
        };
        pivot(this,"down",this.dir_y,distance);
        pivot(this,"left",-zx,distance);
        this.dir_y = 0;
        zx = 0;
        return function(){
            pivot(this,"right",-values.zx,distance);
            pivot(this,"up",values.y,distance);
            this.dir_y = values.y;
            zx = values.zx;
        }.bind(this);
    }.bind(this);
};

const Cinnamon = function(
    element,
    offset = 0
){
    this.element = null;
    if (element instanceof Element) {
        this.loadElement(element);
    }
    this.x = null;
    this.y = null;
    this.z = null;

    this.offset = offset;

    this.dir_zx = null;
    this.dir_y = null;

    this.aperture = null;

    this.points = [];
    this.lines = [];
    this.polygons = [];

    this.type = null;

    Object.seal(this);
};

Cinnamon.Point = Point;
Cinnamon.Line = Line;
Cinnamon.Polygon = Polygon;

Cinnamon.ShapeEvent = ShapeEvent;

Cinnamon.Direction = Direction;
Cinnamon.Settings = Settings;
Cinnamon.Aperture = Aperture;
Cinnamon.RADIANS = RADIANS;

Cinnamon.prototype = new function CinnamonPrototype(){
    get(this,"width",function(){
        return this.element
            ? this.element.clientWidth
            : null;
    });
    get(this,"height",function(){
        return this.element
            ? this.element.clientHeight
            : null;
    });
    get(this,"relative",function(){
        return this.element
            ? this.width
            : null;
    });
    get(this,"centre",function(){
        return new Point(this.x,this.y,this.z);
    });

    this.loadElement = loadElement;
    this.addDefaultSettings = addDefaultSettings;
    this.addPoints = addPoints;
    this.addPolygons = addPolygons;
    this.render = render;
    this.reset = reset;
    this.addMovement = function(type) {
        if (type === "wipe-windows" || type === 1) {
            this.type = 1;
            wipeWindows.apply(this);
        }
        else if (type == "saurons eye" || type === 2) {
            this.type = 2;
            sauronsEye.apply(this);
        }
        else if (type == "attention centre" || type === 3) {
            this.type = 3;
            return attentionCentre.apply(this);
        }
    };
};

export { Cinnamon };
//# sourceMappingURL=cinnamon-esm.js.map
