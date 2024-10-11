import {
    ANodeModel2D, ANodeModel2DPRSA, ANodeModel3D, ANodeModel,
} from "../../../../anigraph/scene";
import type {TransformationInterface} from "../../../../anigraph/math";
import {ASerializable} from "../../../../anigraph/base";
import {BoundingBox2D, HasBounds2D, LineSegment, Polygon2D, VertexArray, VertexArray2D} from "../../../../anigraph/geometry";
import {Color, Mat3, Transformation2DInterface, Vec2} from "../../../../anigraph/math";

let G = 1;
@ASerializable("JointModel")
export class JointModel extends ANodeModel2D{
    _zValue: number = 0;
    _position: Vec2 = new Vec2(0, 0);
    _velocity: Vec2 = new Vec2(0, 0);
    _mass: number = 1;
    _lt: number = 0;
    _force: Vec2 = new Vec2(0, 0);
    _polys: VertexArray2D[] = [];
    _selected: boolean = false;

    set zValue(value) {
        this._zValue = value;
        this.signalGeometryUpdate();
    }

    get verts(): Polygon2D { return this._geometry.verts as Polygon2D; }
    get zValue() { return this._zValue; }
    get position() { return this._position; }

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

        let pnts = Polygon2D.CircleVArray(0.15, 15);
        for (let i = 0; i < pnts.nVerts; i++)
            this.verts.addVertex(pnts.vertexAt(i), Color.FromRGBA(1,0,0,1));

        // this.setPos(new Vec2(0, 4));
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

    applyForce(force: Vec2){
        this._force.addInPlace(force);
    }

    setSelected(selected: boolean) {
        this._selected = selected;
        this._force = new Vec2(0, 0);
        this._velocity = new Vec2(0, 0);
    }

    findClosestIntersection(x1 : number, y1 : number, x2 : number, y2 : number, a : number, b : number) {
        if (x1 == x2) return new Vec2(x1, b);
        if (y1 == y2) return new Vec2(a, y1);
        let m_1 = (y2 - y1) / (x2 - x1);
        let m_2 = -1 / m_1;

        let x = (m_1 * x1 - m_2 * a + b - y1) / (m_1 - m_2);
        let y = m_1 * (x - x1) + y1;
        return new Vec2(x, y);
    }

    setPolys(polys: VertexArray2D[]){ this._polys = polys; }

    environmentCollision(){
        // let poly = new VertexArray2D();
        // poly.addVertex(new Vec2(-8,-7));
        // poly.addVertex(new Vec2(8, -3));
        // poly.addVertex(new Vec2(8, -4));
        // poly.addVertex(new Vec2(-8, -8));
        for (let poly of this._polys){
                

            let minX, minY, maxX, maxY;
            minX = poly.vertexAt(0).x;
            minY = poly.vertexAt(0).y;
            maxX = poly.vertexAt(0).x;
            maxY = poly.vertexAt(0).y;
            for (let i = 0; i < poly.nVerts; i++){
                let pnt = poly.vertexAt(i);
                if (pnt.x < minX) minX = pnt.x;
                if (pnt.y < minY) minY = pnt.y;
                if (pnt.x > maxX) maxX = pnt.x;
                if (pnt.y > maxY) maxY = pnt.y;
            }

            if (minX <= this._position.x && this._position.x <= maxX && minY <= this._position.y && this._position.y <= maxY){
                let castRay = new LineSegment(new Vec2(this._position.x, this._position.y), new Vec2(this._position.x, this._position.y + 1).times(100));
                // Check for intersection with each edge of the polygon
                let numberOfIntersections = 0;
                let closestIntersection = null;
                let closestIntersectionDistance = null;

                for (let i = 0; i < poly.nVerts; i++){
                    let edge = new LineSegment(poly.vertexAt(i), poly.vertexAt((i + 1) % poly.nVerts));
                    let intersection = edge.intersect(castRay);
                    if (intersection) numberOfIntersections++;
                    let closestPoint = this.findClosestIntersection(
                        edge.start.x, edge.start.y,
                        edge.end.x, edge.end.y,
                        this._position.x, this._position.y
                    );
                    if (edge.isPointOnLineSegment(closestPoint)){

                        let distance = closestPoint.minus(this._position).dot(closestPoint.minus(this._position));
                        if (closestIntersection == null) {
                            closestIntersection = closestPoint;
                            closestIntersectionDistance = distance;
                        } else if (distance < (closestIntersectionDistance ?? Infinity)){
                            closestIntersection = closestPoint;
                            closestIntersectionDistance = distance;
                        }
                    }
                }

                if (numberOfIntersections % 2 == 1){
                    let og_pos = this._position.clone();
                    let new_pos = closestIntersection ?? this._position;
                    let normal = new_pos.minus(og_pos);
                    normal.normalize();
                    
                    this.setPos(new_pos.plus(normal.times(0)));
                    let v = this._velocity.clone();
                    let u = normal.times(v.dot(normal) / normal.dot(normal));
                    let w = v.minus(u);
                    this._velocity = w.minus(u);
                    // this._velocity = this._velocity.times(1.1);
                    // return true;
                }
            }
        }
        return false;
    }

    jointsCollision(joints: JointModel[]){
        for (let joint of joints){
            if (joint == this) continue;
            let distance = this._position.minus(joint._position).dot(this._position.minus(joint._position));
            let r = 0.1;
            if (distance < r){
                let og_pos = this._position.clone();
                let new_pos = joint._position.clone();
                let normal = new_pos.minus(og_pos);
                normal.normalize();
                
                this.setPos(new_pos.plus(normal.times(2 * r)));
                let v = this._velocity.clone();
                let u = normal.times(v.dot(normal) / normal.dot(normal));
                let w = v.minus(u);
                this._velocity = w.minus(u);
            }
        }
    }


    timeUpdate(t: number, ...args: any[]): void {
        if (this._selected) return;
        let joints = args[0];

        const G = 0.005;
        let F = this._force;
        let dt = t - this._lt;  // Delta time for the current frame
        dt = 1;
        F.y += -G;

        // if(this.environmentCollision()) F.y = 0;
        this.environmentCollision();
        this.jointsCollision(joints);

        // Check for collision with the ground
        // if (this._position.y <= -5) {
        //     this._position.y = -5;  // Ensure position doesn't go below the ground
            // this._velocity.y = Math.abs(this._velocity.y);  // Flip velocity in y-direction to simulate bounce
        //     // F.y += G;
        // }
        
        // Update position on screen or environment
        this._velocity = this._velocity.plus(F.times(dt / this._mass));  // Update velocity using force
        // set max velocity
        // let maxVel = Infinity;
        let maxVel = 0.05;
        if (this._velocity.dot(this._velocity) > maxVel * maxVel) {
            this._velocity.normalize();
            this._velocity = this._velocity.times(maxVel);
        }
        this._position = this._position.plus(this._velocity.times(dt));  // Update position
        this.setPos(this._position);

        this._force = new Vec2(0, 0);
        this._velocity = this._velocity.times(0.9);  // Apply damping
    }
}
