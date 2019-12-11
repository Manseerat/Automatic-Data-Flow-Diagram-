/* global paper */
import { Sketch, recognizers } from './sketch/SRL.js';
import SketchSurface from './sketchSurface/sketchSurface.js';
import DollarRecognizer from './dollar.js';
import PDollarRecognizer from './pdollar.js';
//import './lib/paper/paper-full.min.js';

/***** Don't edit until the comment saying to edit bleow unless you know what you are doing *****/
let sketchSurface, sketch;

// These make debugging in the console easier.
window.sketchSurface = sketchSurface;
window.sketch = sketch;

document.addEventListener('DOMContentLoaded', function() {
    attachClickHandlers();
    sketchSurface = new SketchSurface('sketchCanvas');
    sketchSurface.recognize = recognize;
    sketchSurface.onErase = onErase;
    sketch = sketchSurface.sketch;
});

function attachClickHandlers() {
    document.getElementById('draw').addEventListener('click', enableDraw);
    document.getElementById('erase').addEventListener('click', enableErase);
    document.getElementById('delete').addEventListener('click', clearCanvases);
}

/***** Edit things below this point *****/

// This function is called by sketchSurface on a successful erase. The strokeIds are the already erased strokes
function onErase(strokeIds) {
    strokeIds = new Set(strokeIds);
    for (let shapeId in sketch.deleted.shapes) {
        let shape = sketch.deleted.shapes[shapeId];
        if (shape.interpretation === 'shape') {
            for (let substroke of shape.strokes) {
                if (strokeIds.has(substroke.parent)) {
                    // Do something for removing this type of shape
                    break;
                }
            }
        }
    }
}

// This is called every time there is a mouse or pen up event on the canvas
function recognize(sketch) {
    let lastStroke = sketchSurface.activeSRLStroke;
    
    if (lastStroke) { // Segments and places substrokes into sketch.substrokes
        //let substrokes = recognizers.Segment(lastStroke);
        //for (let i = 0; i < substrokes.length; i++) {
            sketch.addStroke(lastStroke);
        //}
    }


    // this function calls $1 algorithm for template matching
    var name = 'default';
    var score = 0.0;
    var ms = 0.0;
    var dr = new DollarRecognizer();
    name = dr.Recognize(lastStroke.getPoints(),true);
    //console.log(name);
    return name;




    //dr.AddGesture('arrow2',lastStroke.getPoints());

    /*var pdr = new PDollarRecognizer();
    var ans = pdr.Recognize(lastStroke.getPoints());
    console.log(ans);*/


    // Example of how you can create a shape
    /*
    let shape = new Sketch.Shape();
    shape.setInterpretation('circle');
    for (let id of substrokeIds) {
        shape.addSubElement(sketch.substrokes[id]);
        delete sketch.substrokes[id]; // Removes from sketch.substrokes if you want to use sketch.substrokes as a holder for unrecognized substrokes
    }
    */
    
    // Example of how you can change the color/size of strokes and make them unerasable given the shapeId
    /*
    let shapeId = undefined;
    for (let substroke of sketch.shapes[shapeId].strokes) {
        let paperPath = sketchSurface.srlToPaper[substroke.parent];
        paperPath.erasable = false;
        paperPath.strokeColor = 'orange';
        paperPath.strokeWidth = 2;
    }
    */
}

function setActiveDrawTool(elem) {
    var activeElems = document.querySelectorAll('#drawOptions .active');
    for (var i = 0; i < activeElems.length; i++) {
        activeElems[i].classList.remove('active');
    }
    elem.classList.add('active');
}

function enableDraw() {
    setActiveDrawTool(this);
    sketchSurface.drawTool.activate();
    document.getElementById('sketchCanvas').classList.remove('erase');
    document.getElementById('sketchCanvas').classList.add('draw');
}

function enableErase() {
    setActiveDrawTool(this);
    sketchSurface.eraseTool.activate();
    document.getElementById('sketchCanvas').classList.add('erase');
    document.getElementById('sketchCanvas').classList.remove('draw');
}

function clearCanvases() {
    if (window.confirm('Do you want to clear the entire sketch and your work?')) {
        clearPaperCanvases();
        clearSketchData();
    }
}

function clearSketchData() {
    for (let shapeId of Object.keys(sketch.shapes)) {
        sketch.deleted.shapes[shapeId] = JSON.parse(JSON.stringify(sketch.shapes[shapeId]));
        delete sketch.shapes[shapeId];
    }
    
    for (let strokeId of Object.keys(sketch.strokes)) {
        sketch.deleted.strokes[strokeId] = JSON.parse(JSON.stringify(sketch.strokes[strokeId]));
        delete sketch.strokes[strokeId];
    }
    
    for (let substrokeId of Object.keys(sketch.substrokes)) {
        sketch.deleted.substrokes[substrokeId] = JSON.parse(JSON.stringify(sketch.substrokes[substrokeId]));
        delete sketch.substrokes[substrokeId];
    }
}

function clearPaperCanvases() {
    sketchSurface.clear();
}
