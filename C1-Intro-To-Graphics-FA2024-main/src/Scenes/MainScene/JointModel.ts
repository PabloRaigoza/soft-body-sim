import {
    ANodeModel2D, ANodeModel2DPRSA, ANodeModel3D, ANodeModel,
} from "../../anigraph/scene";
import type {TransformationInterface} from "../../anigraph/math";
import {ASerializable} from "../../anigraph/base";
import {BoundingBox2D, HasBounds2D, Polygon2D, VertexArray} from "../../anigraph/geometry";
import {Color, Mat3, Transformation2DInterface, Vec2} from "../../anigraph/math";

let G = 1;
@ASerializable("JointModel")
export class JointModel extends ANodeModel2D{
    _zValue: number = 0;
    _position: Vec2 = new Vec2(0, 0);
    _velocity: Vec2 = new Vec2(0, 0);
    _mass: number = 1;
    _lt: number = 0;

    set zValue(value) {
        this._zValue = value;
        this.signalGeometryUpdate();
    }

    get verts(): Polygon2D{
        return this._geometry.verts as Polygon2D;
    }

    get zValue() {
        return this._zValue;
    }


    /**
     * Adds the provided JointModel as a child, and sets the child's parent to be this.
     * @param newChild
     */
    adoptChild(newChild:JointModel){
        // newChild.reparent(this, false);
        newChild.reparent(this);
    }

    constructor(verts?: Polygon2D, transform?: TransformationInterface, ...args: any[]) {
        super(...args);
        this.setTransform(transform??Mat3.Identity());
        this.setVerts(
            verts??Polygon2D.CreateForRendering(true, true, false)
        )

        let pnts = Polygon2D.CircleVArray(1, 15);
        for (let i = 0; i < pnts.nVerts; i++)
            this.verts.addVertex(pnts.vertexAt(i), Color.FromRGBA(1,0,0,1));

        this.setPos(new Vec2(0, 4));
    }

    getTransform3D() {
        return this.transform.getMat4();
    }

    setPos(pos: Vec2){
        this._position = pos;

        this.setTransform(Mat3.Translation2D(pos));
    }

    /**
     * Iterate through vertices and set their colors
     * @param color
     */
    setUniformColor(color:Color){
        this.verts.FillColor(color);
    }

    /**
     * Returns the transform from object coordinates (the coordinate system where this.verts is
     * defined) to world coordinates
     * @returns {Mat3}
     */
    getWorldTransform2D():Mat3{
        let parent = this.parent;
        if(parent instanceof ANodeModel3D){
            throw new Error("3D Node models not supported in C1!")
        }
        if(parent && (parent instanceof ANodeModel2D || parent instanceof ANodeModel2DPRSA)){
            return parent.getWorldTransform().times(this.transform.getMatrix());
        }else{
            return this.transform.getMatrix();
        }
    }

    /**
     * Should return a list of all intersections with provided other polygon in world coordinates.
     * @param other
     * @returns {Vec2[]}
     */
    getIntersectionsWith(other: JointModel): Vec2[] {
        let thisGeometry = this.verts.GetTransformedBy(this.getWorldTransform2D());
        let otherGeometry = other.verts.GetTransformedBy(other.getWorldTransform2D());
        return thisGeometry.getIntersectionsWithPolygon(otherGeometry);
    }


    timeUpdate(t: number, ...args: any[]): void {
        const G = 0.01;
        let F = new Vec2(0, 0);
        let dt = t - this._lt;  // Delta time for the current frame
        dt = 1;
        F.y += -G;  // Add gravity force

        // Check for collision with the ground
        if (this._position.y <= -5) {
            this._position.y = -5;  // Ensure position doesn't go below the ground
            this._velocity.y = Math.abs(this._velocity.y);  // Flip velocity in y-direction to simulate bounce
            F.y += G * 0.4;
        } else {
        }
        
        // Update position on screen or environment
        this._velocity = this._velocity.plus(F.times(dt / this._mass));  // Update velocity using force
        this._position = this._position.plus(this._velocity.times(dt));  // Update position
        this.setPos(this._position);

    }
}
