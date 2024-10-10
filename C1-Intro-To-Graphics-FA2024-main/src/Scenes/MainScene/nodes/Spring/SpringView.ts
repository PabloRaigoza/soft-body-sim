import {ANodeView} from "../../../../anigraph/scene";
import {ALineSegmentsGraphic} from "../../../../anigraph/rendering";
import {SpringModel} from "./SpringModel";
import { ALineGraphic } from "../../../../anigraph/rendering"; 
import { Color } from "../../../../anigraph/math";
import { NodeTransform3D } from "../../../../anigraph/math";
import { V3 } from "../../../../anigraph/math";

export class SpringView extends ANodeView {
    controlShape!:ALineGraphic;

    get model():SpringModel{
        return this._model as SpringModel;
    }
    // static Create(model:SpringModel){
    //     let view = new SpringView();
    //     view.setModel(model);
    //     return view;
    // }

    init(){
        this.controlShape = new ALineGraphic();
        this.controlShape.init(this.model.verts.clone().FillColor(Color.FromString("#00aa00")), this.model.getFrameMaterial());
        this.controlShape.setLineWidth(this.model.lineWidth);
        this.controlShape.visible = true;
        this.registerAndAddGraphic(this.controlShape);
    }

    update(): void {
        // console.log('SpringView update')
        this.controlShape.visible = true;
        this.controlShape.setVerts2D(this.model.verts.clone().FillColor(Color.FromString("#00aa00")));
        // console.log(this.model.verts.vertexAt(0).y);
        this.controlShape.setLineWidth(this.model.lineWidth);
        this.setTransform(new NodeTransform3D(V3(0.0, 0.0, -0.1)));
    }
}
