import {ALineMaterialModel, ANodeModel2DPRSA, ASerializable, NodeTransform2D, V2, VertexArray2D} from "../../../../anigraph";
import { GeometryModel } from "./GeometryModel";

/**
 * This custom model simply auto-assigns the three vertices of a triangle to this.verts
 * It demonstrates how to pre-define geometry for all instances of a particular custom model
 * This is a pretty basic example, mostly used to demonstrate TriangleAtVerticesView and SmallTriangleGraphicElement
 *
 * If you create a custom model, it is important to add the @Serializable decordator with the name of the model.
 * This automates a lot of otherwise painful stuff.
 */
@ASerializable("GeometryModel")
export class TrianglesModel extends GeometryModel{
    constructor(transform?: NodeTransform2D) {
        super();
        // create vertex array with simple vertices (no colors, texture coordinates, etc)
        let polygonMaterial = ALineMaterialModel.GlobalInstance.CreateMaterial();
        
    }
}
