import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";
import {
    ALineMaterialModel,
    ANodeModel2D,
    ASerializable,
    Color, Curve2DModel, CurveInterpolationModes,
    V2,
    Vec2, Vector,
    VectorBase,
    VertexArray2D
} from "../../../../anigraph";


@ASerializable("SpringModel")
export class SpringModel extends ANodeModel2D {
    lineWidth: number = 0.01;

    getFrameMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    constructor() {
        super();
        this.verts.initColorAttribute()
    }
}
