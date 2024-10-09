// import {ANodeView, ALineSegmentsGraphic, VertexArray3D, VertexArray2D, Color} from "../../../../index";
// import {ANodeView} from "../../../nodeView";
// import {ALineSegmentsGraphic} from "../../../../rendering";

// import {LineSegmentsModel2D} from "./LineSegmentsModel2D";
// import {VertexArray3D, VertexArray2D, Color} from "../../../../math";
import {ANodeView} from "../../../../anigraph/scene";
import {ALineSegmentsGraphic} from "../../../../anigraph/rendering";
import {SpringModel} from "./SpringModel";

export class SpringView extends ANodeView{
    lineSegments!:ALineSegmentsGraphic;
    get model():SpringModel{
        return this._model as SpringModel;
    }
    static Create(model:SpringModel){
        let view = new SpringView();
        view.setModel(model);
        return view;
    }

    init(){
        // this.lines = new ALineSegmentsGraphic(VertexArray3D.CreateForRendering(false, false, true))
        this.lineSegments = ALineSegmentsGraphic.Create(this.model.verts, this.model.material.threejs, this.model.lineWidth)
        // this.lines.setLineWidth(0.01);
        this.registerAndAddGraphic(this.lineSegments);
    }

    update(): void {
        this.lineSegments.setVerts(this.model.verts);
        this.lineSegments.setLineWidth(this.model.lineWidth);
    }
}
