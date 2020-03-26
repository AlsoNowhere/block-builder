
import formValues from "./form-values";
import { hexToRgb } from "../services/hex-to-rgb.service";

export const distance ={
    z: 100
};

export const hoverColour = "#444";
export const range = 2;
export const size = 10;
export const y = -20;
export const floorColour = "rgb(200,200,200)";

export default new function(){
    Object.defineProperty(this,"boxColour",{
        get: () => `rgba(${hexToRgb(formValues.colour)},${formValues.opacity})`
    });
    this.deleteMode = false;
}


