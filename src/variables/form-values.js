
const values = [
    "opacity",
    "colour"
];

export default new function(){
    values.forEach(x=>{
        Object.defineProperty(this,x,{
            get:()=>document.values[x].value
        });
    });
}
