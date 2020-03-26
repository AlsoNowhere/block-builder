
import { Cinnamon } from "../../lib/cinnamon-esm";
import { generateSquare } from "./generateSquare.logic";
import { reset } from "../stores/reset.store";
import values, { range, size, y, floorColour, hoverColour } from "../variables/values";

const boxEvents = [
    new Cinnamon.ShapeEvent("click",
        (model,cinnamon)=>{

            const split = model.marker.replace("$floor","").replace("$square","").split("_");
            let i = parseInt(split[0]);
            let j = parseInt(split[1]);
            let k = parseInt(split[2]);

            if (values.deleteMode) {
                cinnamon.polygons = cinnamon.polygons.filter(x=>{
                    const _split = x.marker.replace("$floor","").replace("$square","").split("_");
                    let _i = parseInt(_split[0]);
                    let _j = parseInt(_split[1]);
                    let _k = parseInt(_split[2]);
                    return _i !== i || _j !== j || _k !== k;
                });
                return;
            }

            const position = split[3];
            const goBack = reset.run();

            if (position === "0") {
                i--;
            }
            if (position === "1") {
                i++;
            }
            if (position === "2") {
                k--;
            }
            if (position === "3") {
                k++
            }
            if (position === "4") {
                j--;
            }
            if (position === "5") {
                j++;
            }
            cinnamon.addPolygons(generateSquare(i*size,k*size+y,cinnamon.offset+j*size,`$square${i}_${j}_${k}`,{colour:values.boxColour,size,events:boxEvents}));
            goBack();
        }
    ),
    new Cinnamon.ShapeEvent("mouseenter",(_,__,___,element)=>{
        element.style.fill = hoverColour;
        return false;
    }),
    new Cinnamon.ShapeEvent("mouseleave",(_,cinnamon)=>{
        [...cinnamon.element.children]
            .filter(x=>x.nodeName==="polygon"&&x.attributes["data-marker"].nodeValue.substr(0,7)==="$square")
            .forEach(x=>x.style.fill=cinnamon.polygons.find(y=>y.marker===x.attributes["data-marker"].nodeValue).colour);
        return false;
    })
];

export const addFloor = (polygons,cinnamon) => {
    const floorEvents = [
        new Cinnamon.ShapeEvent("click",
            (model,cinnamon)=>{
                const split = model.marker.replace("$floor","").replace("$square","").split("_");
                const i = parseInt(split[0]);
                const j = parseInt(split[1]);
                const k = 0;
                const goBack = reset.run();
                cinnamon.addPolygons(generateSquare(i*size,y,cinnamon.offset+j*size,`$square${i}_${j}_${k}`,{colour:values.boxColour,size,events:boxEvents}));
                goBack();
            })
    ];

    for (let i = -range ; i < range ; i++) {
        for (let j = -range ; j < range ; j++) {
            polygons.push(
                new Cinnamon.Polygon([
                    new Cinnamon.Point(i*size,y,cinnamon.offset+j*size),
                    new Cinnamon.Point(i*size+size,y,cinnamon.offset+j*size),
                    new Cinnamon.Point(i*size+size,y,cinnamon.offset+j*size+size),
                    new Cinnamon.Point(i*size,y,cinnamon.offset+j*size+size)
                ],{colour:floorColour,events:floorEvents,marker:`$floor${i}_${j}`})
            );
        }
    }
    return polygons;
}
