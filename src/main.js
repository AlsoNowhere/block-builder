
import { Cinnamon } from "../lib/cinnamon-esm";

import values, { distance } from "./variables/values";
import formValues from "./variables/form-values";

// Shapes
import { reset } from "./stores/reset.store";
import { addFloor } from "./logic/add-floor.logic";

const bbModule = dill.module("Floor");

const Data = function(){
    this.oninit = function(){

// Shapes
        this.cinnamon.addPolygons(addFloor([],this.cinnamon));
        this.cinnamon.render();
        reset.run = this.cinnamon.addMovement(3);

        document.values.opacity.value = 0.3;
        document.values.colour.value = "#3d7fe3";
    }
    this.cinnamon = new Cinnamon(
        document.getElementById("display"),
        distance.z
    )
    .addDefaultSettings();

    this.handleForm = function(event){
        event.preventDefault();
        this.cinnamon.polygons
            .filter(x=>x.marker.includes("$square"))
            .forEach(x=>x.colour=x.colour.replace(/,[^,)]+\)/g,`,${formValues.opacity})`));
        this.cinnamon.render();
    }

    this.deleteMode = false;
    this.setDelete = function(_,element){
        this.deleteMode = element.checked;
        values.deleteMode = this.deleteMode;
    }
}

dill.create(bbModule,Data,document.body);
