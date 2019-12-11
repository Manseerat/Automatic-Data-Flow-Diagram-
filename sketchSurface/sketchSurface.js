/* global paper */
import { Sketch } from '../sketch/SRL.js';

export default class SketchSurface {
    constructor(canvasId) {
        if (!canvasId) {
            throw 'Need a canvasId to create a sketch surface';
        }

        let canvas = document.querySelector(`canvas#${canvasId}`);
        if (!canvas) {
            throw `Canvas with ID ${canvasId} not found`;
        }

        canvas.dataset.paperIndex = paper.setup(canvasId).project._index;

        this.paperProject = paper.project;
        this.canvasHeight = paper.view.size.height;
        this.canvasWidth = paper.view.size.width;

        this.sketch = new Sketch();
        this.paperProject;
        this.canvasHeight = 0;
        this.canvasWidth = 0;
        this.strokeColor = '#999';
        this.strokeWidth = 2;
        this.strokes = {};
        this.activePaperPath = undefined;
        this.activeSRLStroke = undefined;
        this.paperToSRL = {};
        this.srlToPaper = {};

        this.drawTool = createDrawTool(this);
        this.eraseTool = createEraseTool(this);

        paper.project.sketchSurface = this;
        paper.project.name = canvasId;
    }

    // Clears the canvas of all elements
    clear() {
        for (let i = 0; i < this.paperProject.layers.length; i++) {
            this.paperProject.layers[i].removeChildren();
        }
    }

    // Redraws the given sketch and sets it as the sketch for this sketch surface
    redrawSketch(sketch) {
        this.sketch = sketch;
        for (let id in sketch.strokes) {
            this.redrawStroke(sketch.strokes[id]);
        }
    }

    createPaperPath(style) {
        let path = new paper.Path({ strokeColor: this.strokeColor, strokeWidth: this.strokeWidth, name: 'stroke' });
        if (style) { path.style = style; }

        let highlightPath = new paper.Path({ strokeColor: 'red', strokeWidth: 5, name: 'highlight' });
        highlightPath.strokeColor.alpha = 0.0001; // PaperJS does not trigger onMouseEnter if alpha is 0. This workaround hides the element still while allowing onMouseEnter

        highlightPath.onMouseEnter = function() {
            if (paper.tool.name === 'erase' && this.parent.erasable) {
                this.strokeColor.alpha = 1;
            }
        };

        highlightPath.onMouseLeave = function() {
            if (this.strokeColor.alpha === 1) {
                this.strokeColor.alpha = 0.0001;
            }
        };

        this.activePaperPath = new paper.Group([path, highlightPath]);
        this.activePaperPath.erasable = true;
        return this.activePaperPath;
    }

    createSRLStroke() {
        this.activeSRLStroke = new Sketch.Stroke();
        this.activeSRLStroke.attributes = { color: this.strokeColor, width: this.strokeWidth };
        return this.activeSRLStroke;
    }

    addPaperPoint(x, y) {
        this.activePaperPath.children.stroke.add(x, y);
        this.activePaperPath.children.highlight.add(x, y);
    }

    addSRLPoint(x, y) {
        let newPoint = new Sketch.Point({x: x, y: y, t: Date.now()});
        this.activeSRLStroke.addPoint(newPoint);
    }

    redrawStroke(stroke, style) {
        if (!stroke) return;
        if (!style) style = stroke.attributes;

        let group = this.createPaperPath(style);
        if (stroke.parent === undefined) {
            this.srlToPaper[stroke.id] = group;
            this.paperToSRL[group.id] = stroke.id;
        } else {
            this.srlToPaper[stroke.parent] = group;
            this.paperToSRL[group.id] = stroke.parent;
        }

        for (let point of stroke.points) {
            this.addPaperPoint(point.x, point.y);
        }
        return group;
    }
}

function createDrawTool(sketchSurface) {
    let drawTool = new paper.Tool();
    drawTool.name = 'draw';

    drawTool.onMouseDown = function(event) {
        let paperGroup = sketchSurface.createPaperPath();
        let srlStroke = sketchSurface.createSRLStroke();

        sketchSurface.paperToSRL[paperGroup.id] = srlStroke.id;
        sketchSurface.srlToPaper[srlStroke.id] = paperGroup;

        sketchSurface.addPaperPoint(event.point.x, event.point.y);
        sketchSurface.addSRLPoint(event.point.x, event.point.y);
    };

    drawTool.onMouseDrag = function(event) {
        sketchSurface.addPaperPoint(event.point.x, event.point.y);
        sketchSurface.addSRLPoint(event.point.x, event.point.y);
    };




    /*


    Main changes are made in this code (Mouse up function)

    */
    drawTool.onMouseUp = function(event) {

        // stroke taken as input
        sketchSurface.sketch.addStroke(sketchSurface.activeSRLStroke);
        var prediction = '';

        // get perfect matching template
        if (sketchSurface.recognize) prediction =  sketchSurface.recognize(sketchSurface.sketch);
        
        // store points of input stroke
        var points_list = sketchSurface.activeSRLStroke.points;
        console.log(points_list);

        // delete the input stroke from the sketch surface
        let hits = paper.project.hitTestAll(event.point, {
            segments: true,
            fill: true,
            class: paper.Path,
            tolerance: 5,
            stroke: true
        });
        
        // remove all remaining trace of deleted stroke
        let removedIds = [];
        for (let i = 0; i < hits.length; i++) {
            let hit = hits[i];
            if (!hit.item.parent || !hit.item.parent.erasable) { continue; }
            if (hit.item.parent.constructor !== paper.Group) { continue; }
            hit.item.parent.remove();
            let sketch = sketchSurface.sketch;
            let paperId = hit.item.parent.id;
            let srlId = sketchSurface.paperToSRL[paperId];
            sketch.removeStroke(srlId);
            removedIds.push(srlId);
            delete sketchSurface.srlToPaper[srlId];
            delete sketchSurface.paperToSRL[paperId];
        }


        // initialize to form a new formal shape using the template
        let paperGroup = sketchSurface.createPaperPath();
        let srlStroke = sketchSurface.createSRLStroke();

        //calculate centroid for input stroke
        var x_c = 0.0, y_c = 0.0, p_x_c=0.0, p_y_c=0.0;
	    for (var i = 0; i < points_list.length; i++) {
		    x_c += points_list[i].x;
            y_c += points_list[i].y;
	    }
	    x_c /= points_list.length;
        y_c /= points_list.length;

        // calculate centroid for best matching template
        for (var i = 0; i < prediction.length; i++) {
		    p_x_c += prediction[i].x;
            p_y_c += prediction[i].y;
	    }
	    p_x_c /= prediction.length;
        p_y_c /= prediction.length;

        // calculate maximum distance from centroid to points of input stroke
        var max_dist = 0.0;
        for (var i = 0; i < points_list.length; i++) {
            var dist = Math.sqrt(Math.pow(points_list[i].x-x_c,2)+Math.pow(points_list[i].y-y_c,2))
            if(dist>max_dist)
                max_dist=dist;
        }

        // calculate maximum distance from centroid to points of template
        var p_max_dist = 0.0;
        for (var i = 0; i < prediction.length; i++) {
            var p_dist = Math.sqrt(Math.pow(prediction[i].x-p_x_c,2)+Math.pow(prediction[i].y-p_y_c,2))
            if(p_dist>p_max_dist)
                p_max_dist=p_dist;
        }

        // translate template to origin
        for (var i = 0; i < prediction.length; i++) {
		    prediction[i].x = ( prediction[i].x - (p_x_c));
            prediction[i].y = (prediction[i].y - (p_y_c));
        }

        // scale the template to match size of the input stroke
        for (var i = 0; i < prediction.length; i++) {
		    prediction[i].x = parseInt( prediction[i].x*parseFloat((max_dist)/parseFloat(p_max_dist)));
            prediction[i].y = parseInt(prediction[i].y*(parseFloat(max_dist)/parseFloat(p_max_dist)));
            //console.log(prediction[i]);
        }
        
        // translate template to the centroid of input stroke
        for (var i = 0; i < prediction.length; i++) {
		    prediction[i].x = ( prediction[i].x + (x_c));
            prediction[i].y = (prediction[i].y + (y_c));
        }

        

        // for (var i = 0; i < prediction.length; i++) {
		//     prediction[i].x = parseInt( prediction[i].x*parseFloat((max_dist)/parseFloat(p_max_dist)));
        //     prediction[i].y = parseInt(prediction[i].y*(parseFloat(max_dist)/parseFloat(p_max_dist)));
        //     console.log(prediction[i]);
	    // }
        
        // draw the transformed template on the canvas
        for(var i=0;i<prediction.length;i++)
            sketchSurface.addPaperPoint(prediction[i].x, prediction[i].y);

        // mid point circle drawing algorithm
        // console.log(max_dist);
        // var x_val = max_dist;
        // var y_val = 0;
        // var radiusError = 1-max_dist;
        // var x0=x_c,y0=y_c;
        // while (x_val >= y_val) {
        //     sketchSurface.addPaperPoint(x_val + x0, y_val + y0);
        //     sketchSurface.addPaperPoint(y_val + x0, x_val + y0);
        //     sketchSurface.addPaperPoint(-x_val + x0, y_val + y0);
        //     sketchSurface.addPaperPoint(-y_val + x0, x_val + y0);
        //     sketchSurface.addPaperPoint(-x_val + x0, -y_val + y0);
        //     sketchSurface.addPaperPoint(-y_val + x0, -x_val + y0);
        //     sketchSurface.addPaperPoint(x_val + x0, -y_val + y0);
        //     sketchSurface.addPaperPoint(y_val + x0, -x_val + y0);
        //     y_val++;
    
        //     if (radiusError < 0) {
        //         radiusError += 2 * y_val + 1;
        //     }   
        //     else {
        //         x_val--;
        //         radiusError+= 2 * (y_val - x_val + 1);
        //     }   
        // }

        //ctx.clearRect(40,40,60,60);
        //ctx.strokeRect(45,45,50,50);
        //ctx.beginPath();
        // ctx.arc(x_c, y_c, 50, 0, 2 * Math.PI);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = '#FF0000';
        // ctx.stroke();

        // console.log(x_c,y_c);

        // for(var i=0;i<64;i++)
        //     sketchSurface.addPaperPoint(x_c+i, y_c+i);



    };
    return drawTool;
}

function createEraseTool(sketchSurface) {
    let eraseTool = new paper.Tool();
    eraseTool.name = 'erase';
    eraseTool.onMouseDown = erase;
    eraseTool.onMouseDrag = erase;
    return eraseTool;

    function erase(event) {
        let hits = paper.project.hitTestAll(event.point, {
            segments: true,
            fill: true,
            class: paper.Path,
            tolerance: 5,
            stroke: true
        });

        let removedIds = [];
        for (let i = 0; i < hits.length; i++) {
            let hit = hits[i];
            if (!hit.item.parent || !hit.item.parent.erasable) { continue; }
            if (hit.item.parent.constructor !== paper.Group) { continue; }
            hit.item.parent.remove();
            let sketch = sketchSurface.sketch;
            let paperId = hit.item.parent.id;
            let srlId = sketchSurface.paperToSRL[paperId];
            sketch.removeStroke(srlId);
            removedIds.push(srlId);
            delete sketchSurface.srlToPaper[srlId];
            delete sketchSurface.paperToSRL[paperId];
        }

        if (sketchSurface.onErase) sketchSurface.onErase(removedIds);
    }
}
