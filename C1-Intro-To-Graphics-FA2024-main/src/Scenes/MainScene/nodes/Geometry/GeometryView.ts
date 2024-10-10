// import {ANodeView, ALineSegmentsGraphic, VertexArray3D, VertexArray2D, Color} from "../../../../index";
// import {ANodeView} from "../../../nodeView";
// import {ALineSegmentsGraphic} from "../../../../rendering";

// import {LineSegmentsModel2D} from "./LineSegmentsModel2D";
// import {VertexArray3D, VertexArray2D, Color} from "../../../../math";
import {ANodeView} from "../../../../anigraph/scene";
import {ALineSegmentsGraphic} from "../../../../anigraph/rendering";
import {GeometryModel} from "./GeometryModel";
import { ALineGraphic } from "../../../../anigraph/rendering"; 
import { Color } from "../../../../anigraph/math";
import { NodeTransform3D } from "../../../../anigraph/math";
import { V3 } from "../../../../anigraph/math";
import { VertexArray2D } from "anigraph";
import { Polygon2DView } from "anigraph/starter/nodes/polygon2D";

export class GeometryView extends Polygon2DView {
    controlShape!:ALineGraphic;
    newVerts!:VertexArray2D;

    get model():GeometryModel{
        return this._model as GeometryModel;
    }
    static Create(model:GeometryModel){
        let view = new GeometryView();
        view.setModel(model);
        return view;
    }

    // init(){
    //     this.controlShape = new Polygon2DView();
    //     this.controlShape.init();
    // }

    init(){
        this.controlShape = new ALineGraphic();
        this.newVerts = this.model.verts.clone().FillColor(Color.FromString("#aaaaaa"));
        this.newVerts.addVertex(this.model.verts.vertexAt(0), Color.FromString("#aaaaaa"));
        this.controlShape.init(this.newVerts.FillColor(Color.FromString("#aaaaaa")), this.model.getFrameMaterial());
        this.controlShape.setLineWidth(this.model.lineWidth);
        this.controlShape.visible = true;
        this.registerAndAddGraphic(this.controlShape);
    }

    // update(): void {
    //     this.updateGeometry();
    // }

    update(): void {
        this.controlShape.visible = true;
        this.newVerts = this.model.verts.clone().FillColor(Color.FromString("#aaaaaa"));
        this.newVerts.addVertex(this.model.verts.vertexAt(0), Color.FromString("#aaaaaa"));
        this.controlShape.setVerts2D(this.newVerts.FillColor(Color.FromString("#aaaaaa")));
        // this.setTransform(this.model.transform);
        this.controlShape.setLineWidth(this.model.lineWidth);
        this.setTransform(new NodeTransform3D(V3(0.0, 0.0, -0.1)));
    }
}