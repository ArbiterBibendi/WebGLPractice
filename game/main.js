import { init, DrawTriangle } from "../engine/webgl.js";
import {red, blue, green} from "../engine/constants/colors.js"
const triangleVerticesPosition = [-0.5, 0.5, -1, -0.5, 0, -0.5];
let triangleVerticesColor = []
triangleVerticesColor = triangleVerticesColor.concat(red).concat(blue).concat(green);
console.log(triangleVerticesColor);
const main = async () => {
    await init();
    DrawTriangle(triangleVerticesPosition, triangleVerticesColor);
}
main();