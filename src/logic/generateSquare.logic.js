import { Cinnamon } from "../../lib/cinnamon-esm";

const defaultColour = "rgba(0,0,0,0.3)";
const defaultSize = 5;

export const generateSquare = (x,y,z,marker,options) => [
    new Cinnamon.Polygon([
        new Cinnamon.Point(x,y,z),
        new Cinnamon.Point(x,y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x,y+(options.size||defaultSize),z+(options.size||defaultSize)),
        new Cinnamon.Point(x,y+(options.size||defaultSize),z)
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_0"
    }),
    new Cinnamon.Polygon([
        new Cinnamon.Point(x+(options.size||defaultSize),y,z),
        new Cinnamon.Point(x+(options.size||defaultSize),y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z)
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_1"
    }),

    new Cinnamon.Polygon([
        new Cinnamon.Point(x,y,z),
        new Cinnamon.Point(x,y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y,z)
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_2"
    }),
    new Cinnamon.Polygon([
        new Cinnamon.Point(x,y+(options.size||defaultSize),z),
        new Cinnamon.Point(x,y+(options.size||defaultSize),z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z)
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_3"
    }),

    new Cinnamon.Polygon([
        new Cinnamon.Point(x,y,z),
        new Cinnamon.Point(x+(options.size||defaultSize),y,z),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z),
        new Cinnamon.Point(x,y+(options.size||defaultSize),z)
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_4"
    }),
    new Cinnamon.Polygon([
        new Cinnamon.Point(x,y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y,z+(options.size||defaultSize)),
        new Cinnamon.Point(x+(options.size||defaultSize),y+(options.size||defaultSize),z+(options.size||defaultSize)),
        new Cinnamon.Point(x,y+(options.size||defaultSize),z+(options.size||defaultSize))
    ],{
        colour:options.colour||defaultColour,
        events: options.events,
        marker: marker + "_5"
    }),
];
