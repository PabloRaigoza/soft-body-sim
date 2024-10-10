import { Color, MeshBasicMaterial, MeshBasicMaterialParameters, MeshStandardMaterial, MeshStandardMaterialParameters} from "three";
import { ANodeModel2D, APolygon2DGraphic, ASerializable, ALineMaterialModel, Mat3, Vec2, ANodeModel2DPRSA, NodeTransform2D, TransformationInterface, Transformation2DInterface } from "../../../../anigraph";
import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";
import { Polygon2DModelPRSA } from "anigraph/starter/nodes/polygon2D/Polygon2DModelPRSA";


@ASerializable("GeometryModel")
export class GeometryModel extends Polygon2DModelPRSA{

    lineWidth: number = 0.005; 


    getFrameMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    constructor() {
        super();
        this.verts.initColorAttribute()
        // this.verts.addVertex(new Vec2(8,-5+2));
        // this.verts.addVertex(new Vec2(8,-6+2));
        // this.verts.addVertex(new Vec2(-8,-6-2));
        // this.verts.addVertex(new Vec2(-8,-5-2));
        // this.verts.addVertex(new Vec2(-8,-7));
        // this.verts.addVertex(new Vec2(8, -3));
        // this.verts.addVertex(new Vec2(8, -4));
        // this.verts.addVertex(new Vec2(-8, -8));
        //this.addTransformListener()
    }

    setTransform(transform: TransformationInterface): void {
        let newVerts = this.verts.clone().GetTransformedBy(transform as Mat3);
        this.setVerts(newVerts);
    }

    // get transform(): Mat3 {
    //     return this._transform as Mat3;
    // }

    /**
     * Sets the transform to an identity Mat3
     */
    setTransformToIdentity(){
        this._transform = new Mat3();
    }

    /**
     * If the input transform is not a Mat3, it will be converted to one.
     * Note that this can throw away information! E.g., there are different combinations of position and anchor that map to the same Mat3 object.
     * @param transform
     */


    createRectangle(transform: Mat3) {
        this.verts.addVertex(new Vec2(-4,-0.25));
        this.verts.addVertex(new Vec2(-4,0.25));
        this.verts.addVertex(new Vec2(4,0.25));
        this.verts.addVertex(new Vec2(4,-0.25));
        this.setTransform(transform);
        
    }
    createSquare(transform: Mat3) {
        this.verts.addVertex(new Vec2(-1,-1));
        this.verts.addVertex(new Vec2(-1,1));
        this.verts.addVertex(new Vec2(1,1));
        this.verts.addVertex(new Vec2(1,-1));
        this.setTransform(transform);
        
    }
    createTriangle(transform: Mat3) {
        this.verts.addVertex(new Vec2(-1,0));
        this.verts.addVertex(new Vec2(1,0));
        this.verts.addVertex(new Vec2(0,2));
        this.setTransform(transform);
        
    }
    createPolygon(transform: Mat3, vertices?: number[]) {
        if (vertices) {
            if (vertices.length < 4) {
                throw new Error("Invalid number of vertices for polygon");
            }
            for (let i = 0; i < vertices.length; i+=2) {
                this.verts.addVertex(new Vec2(vertices[i],vertices[i+1]));
            }
        }
        this.setTransform(transform);
        
    }

    // static createPolygon(vertices: number[], color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Create the polygon with the vertex array and color/material
    //     return new APolygon2DGraphic(vertices, color);
    // }

}