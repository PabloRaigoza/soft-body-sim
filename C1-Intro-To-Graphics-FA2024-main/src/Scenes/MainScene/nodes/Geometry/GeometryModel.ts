import { Color, MeshBasicMaterial, MeshBasicMaterialParameters, MeshStandardMaterial, MeshStandardMaterialParameters} from "three";
import { ANodeModel2D, APolygon2DGraphic, ASerializable, ALineMaterialModel, Mat3, Vec2, ANodeModel2DPRSA, NodeTransform2D, TransformationInterface, Transformation2DInterface } from "../../../../anigraph";
import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";


@ASerializable("GeometryModel")
export class GeometryModel extends Polygon2DModel{

    lineWidth: number = 0.005; 


    getFrameMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    constructor() {
        super();
        this.verts.initColorAttribute()
        this.verts.addVertex(new Vec2(8,-5));
        this.verts.addVertex(new Vec2(8,-6));
        this.verts.addVertex(new Vec2(-8,-6));
        this.verts.addVertex(new Vec2(-8,-5));
        this.verts.addVertex(new Vec2(8,-5));
        //this.addTransformListener()
    }

    setTransform(transform: TransformationInterface): void {
        let newVerts = this.verts.clone().GetTransformedBy(transform as Mat3);
        this.setVerts(newVerts);
    }

    get transform(): Mat3 {
        return this._transform as Mat3;
    }

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
    // setTransform(transform:Transformation2DInterface){
    //     console.log('jere')
    //     return this.setTransformMat3(transform);
    // }

    // static createTriangle(color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Vertices for an equilateral triangle centered at the origin
    //     const triangleVerts = [
    //         0, 1,   // Top vertex
    //         -1, -1, // Bottom-left vertex
    //         1, -1   // Bottom-right vertex
    //     ];
        
    //     // Create the triangle with the vertex array and color/material
    //     return new APolygon2DGraphic(triangleVerts, color);
    // }

    // static createSquare(color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Vertices for a square centered at the origin
    //     const squareVerts = [
    //         -1, -1, // Bottom-left vertex
    //         1, -1,  // Bottom-right vertex
    //         1, 1,   // Top-right vertex
    //         -1, 1   // Top-left vertex
    //     ];
        
    //     // Create the square with the vertex array and color/material
    //     return new APolygon2DGraphic(squareVerts, color);
    // }

    // static createRectangle(width: number, height: number, color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Half-width and half-height for the rectangle
    //     const halfWidth = width / 2;
    //     const halfHeight = height / 2;
        
    //     // Vertices for a rectangle centered at the origin
    //     const rectangleVerts = [
    //         -halfWidth, -halfHeight, // Bottom-left vertex
    //         halfWidth, -halfHeight,  // Bottom-right vertex
    //         halfWidth, halfHeight,   // Top-right vertex
    //         -halfWidth, halfHeight   // Top-left vertex
    //     ];
        
    //     // Create the rectangle with the vertex array and color/material
    //     return new APolygon2DGraphic(rectangleVerts, color);
    // }

    // static createCircle(radius: number, segments: number, color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Vertices for a circle centered at the origin
    //     const circleVerts = [];
    //     for (let i = 0; i < segments; i++) {
    //         const angle = (i / segments) * 2 * Math.PI;
    //         const x = radius * Math.cos(angle);
    //         const y = radius * Math.sin(angle);
    //         circleVerts.push(x, y);
    //     }
        
    //     // Create the circle with the vertex array and color/material
    //     return new APolygon2DGraphic(circleVerts, color);
    // }

    // static createPolygon(vertices: number[], color?: Color | THREE.Color | THREE.Material | THREE.Material[]): APolygon2DGraphic {
    //     // Create the polygon with the vertex array and color/material
    //     return new APolygon2DGraphic(vertices, color);
    // }

}