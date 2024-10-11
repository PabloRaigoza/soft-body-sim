import {ANodeView} from "../../../../anigraph/scene";
import {ALineSegmentsGraphic} from "../../../../anigraph/rendering";
import {SpringModel} from "./SpringModel";
import { ALineGraphic } from "../../../../anigraph/rendering"; 
import { Color } from "../../../../anigraph/math";
import { NodeTransform3D } from "../../../../anigraph/math";
import { V3 } from "../../../../anigraph/math";
import { VertexArray2D } from "anigraph";

export class SpringView extends ANodeView {
    // controlShape!:ALineGraphic;
    controlShapes: ALineGraphic[] = [];

    get model():SpringModel{
        return this._model as SpringModel;
    }
    // static Create(model:SpringModel){
    //     let view = new SpringView();
    //     view.setModel(model);
    //     return view;
    // }

    init(){
        // this.controlShape = new ALineGraphic();
        this.controlShapes = [];
        for (let edge in this.model.edges) {
            let controlShape = new ALineGraphic();
            // controlShape.init(this.model.edges[edge].clone().FillColor(Color.FromString("#00aa00")), this.model.getFrameMaterial());
            let newVerts = new VertexArray2D();
            newVerts.initColorAttribute();
            newVerts.addVertex(this.model.joints[this.model.edges[edge].x].position, this.model.color);
            newVerts.addVertex(this.model.joints[this.model.edges[edge].y].position, this.model.color);
            controlShape.init(newVerts, this.model.getFrameMaterial());
            controlShape.setLineWidth(this.model.lineWidth);
            controlShape.visible = true;
            this.controlShapes.push(controlShape);
            this.registerAndAddGraphic(controlShape);
        }
        // this.controlShape.init(this.model.verts.clone().FillColor(Color.FromString("#00aa00")), this.model.getFrameMaterial());
        // this.controlShape.setLineWidth(this.model.lineWidth);
        // this.controlShape.visible = true;
        for (let controlShape of this.controlShapes) {
            this.registerAndAddGraphic(controlShape);
        }
        // this.registerAndAddGraphic(this.controlShape);
    }

    update(): void {
        // console.log('SpringView update')
        // this.controlShape.visible = true;
        // this.controlShape.setVerts2D(this.model.verts.clone().FillColor(Color.FromString("#00aa00")));
        // // console.log(this.model.verts.vertexAt(0).y);
        // this.controlShape.setLineWidth(this.model.lineWidth);
        let i = 0;
        for (let edge in this.model.edges) {
            let controlShape = this.controlShapes[i];
            controlShape.visible = true;
            let newVerts = new VertexArray2D();
            newVerts.initColorAttribute();
            newVerts.addVertex(this.model.joints[this.model.edges[edge].x].position, this.model.color);
            newVerts.addVertex(this.model.joints[this.model.edges[edge].y].position, this.model.color);
            controlShape.setVerts2D(newVerts);
            controlShape.setLineWidth(this.model.lineWidth);
            i++;
        }

        this.setTransform(new NodeTransform3D(V3(0.0, 0.0, -0.1)));
    }
}
