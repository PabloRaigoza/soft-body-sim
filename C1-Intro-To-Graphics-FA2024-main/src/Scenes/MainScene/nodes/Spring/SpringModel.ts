import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";
import {
    ALineMaterialModel,
    AMaterial,
    ANodeModel2D,
    AObject,
    AObjectState,
    ASerializable,
    Color, Curve2DModel, CurveInterpolationModes,
    Mat3,
    V2,
    Vec2, Vec3, Vector,
    VectorBase,
    VertexArray2D
} from "../../../../anigraph";
import { JointModel } from "../Joint/JointModel";
import { VertexArray } from "../../../../anigraph/geometry";
import { MainSceneModel } from "Scenes/MainScene/MainSceneModel";
import { time } from "console";


@ASerializable("SpringModel")
export class SpringModel extends ANodeModel2D {
    lineWidth: number = 0.003;
    damping: number = 0.00;
    stiffness: number = 0.3;
    _impulse: number = 0.3;
    color: Color = Color.FromRGBA(1, 1, 1, 1);
    edges: Vec3[] = [];
    _polys: VertexArray2D[] = [];
    selected_joint: number = -1;

    @AObjectState change : boolean = false;
    joints: JointModel[] = [];
    newVerts: Vec2[] = [];

    getFrameMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    constructor() {
        super();
        this.verts.initColorAttribute()
    }

    addJoint(pos: Vec2, mat: AMaterial, ctx:MainSceneModel, radius: number) {
        let joint = new JointModel();
        joint.setPos(pos);
        joint.setJointRadius(radius);
        joint.setMaterial(mat);
        this.joints.push(joint);
        // this.verts.addVertex(joint.position, Color.White());
        ctx.addChild(joint);
        this.signalGeometryUpdate();
    }

    addEdge(i: number, j: number, l: number) {
        this.edges.push(new Vec3(i, j, l));
        // this.verts.addVertex(this.joints[i].position, Color.White());
        // this.verts.addVertex(this.joints[j].position, Color.White());
    }

    setPolys(polys: VertexArray2D[]) {
        this._polys = polys;
        for (let joint of this.joints) joint.setPolys(polys);
    }
    setStiff(stiff: number) {
        this.stiffness = stiff;
        this.signalGeometryUpdate();
    }
    setColor(color: Color) {
        this.color = color;
        this.signalGeometryUpdate();
    }
    setImpulse(impulse: number) {
        this._impulse = impulse;
        this.signalGeometryUpdate();
    }
    dragStart(point : Vec2) {
        // Find closest joint
        let closestJoint = this.joints[0];
        let closestDistance = Infinity;
        for (let joint of this.joints) {
            let distance = joint.position.minus(point).dot(joint.position.minus(point));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestJoint = joint;
            }
        }

        if (closestDistance < 0.5) {
            closestJoint.setSelected(true);
            this.selected_joint = this.joints.indexOf(closestJoint);
            return true;
        }
        return false;
    }

    dragging(point : Vec2) {
        if (this.selected_joint != -1) {
            this.joints[this.selected_joint].setPos(point);
        }
    }

    setJointColor(color: Color) {
        for (let joint of this.joints) joint._color = color;
    }

    dragEnd() {
        if (this.selected_joint != -1) {
            this.joints[this.selected_joint].setSelected(false);
            this.selected_joint = -1;
            for (let joint of this.joints) joint._velocity = new Vec2(0, 0);
        }
    }

    cursorImpulses: Vec2[] = [];
    cursorImpulse(cursor: Vec2) {
        this.cursorImpulses.push(cursor.clone());
    }

    keyImpulses: Vec2[] = [];
    keyImpulse(forceDir: Vec2) { this.keyImpulses.push(forceDir); }

    timeUpdate(t: number, ...args: any[]): void {
        for (let cursor of this.cursorImpulses) {
            for (let joint of this.joints) {
                let normal = joint.position.minus(cursor);
                normal.normalize();
                joint.applyForce(normal.times(this._impulse/20));
            }
        }
        this.cursorImpulses = [];
        
        for (let keyImpulse of this.keyImpulses) {
            for (let joint of this.joints) {
                let normal = keyImpulse;
                normal.normalize();
                joint.applyForce(normal.times(this._impulse));
            }
        }
        this.keyImpulses = [];
        
        for (let edge of this.edges) {
            let i = edge.x;
            let j = edge.y;
            let l = edge.z;
            let A = this.joints[i].position;
            let B = this.joints[j].position;
            let vA = this.joints[i]._velocity;
            let vB = this.joints[j]._velocity;
            let F_d1 = B.add(A.times(-1))
            F_d1.normalize();
            let F_d = F_d1.dot(vA.add(vB.times(-1))) * this.damping;
            let diff = B.add(A.times(-1));
            let F_s = (Math.sqrt(diff.dot(diff)) - l) * this.stiffness;

            // let a = (Math.sqrt(B.minus(A).dot(B.minus(A))) - l) * this.stiffness;

            let F = F_d + F_s;
            this.joints[i].applyForce(F_d1.times(F));
            this.joints[j].applyForce(F_d1.times(-F));
            // this.joints[i]._force = F_d1.times(F);
            // this.joints[j]._force = F_d1.times(-F);
        }
        // // Compute the forces of consitute joints
        // let A = this.joints[0].position;
        // let B = this.joints[1].position;
        // let vA = this.joints[0]._velocity;
        // let vB = this.joints[1]._velocity;
        // let F_d1 = B.add(A.times(-1))
        // F_d1.normalize();
        // let F_d = F_d1.dot(vA.add(vB.times(-1))) * this.damping;
        // let diff = B.add(A.times(-1));
        // let F_s = (Math.sqrt(diff.dot(diff)) - this.restLength) * this.stiffness;
        // let F = F_d + F_s;
        // // F *= 0.5;
        // // console.log(Math.sqrt(diff.dot(diff)));

        // // Apply forces to joints
        // this.joints[0]._force = F_d1.times(F);
        // this.joints[1]._force = F_d1.times(-F);
        // for (let i = 0; i < this.joints.length; i++) {
        //     // console.log(i);
        //     let i1 = i;
        //     let i2 = (i + 1) % this.joints.length;
        //     let A = this.joints[i1].position;
        //     let B = this.joints[i2].position;
        //     let vA = this.joints[i1]._velocity;
        //     let vB = this.joints[i2]._velocity;
        //     let F_d1 = B.add(A.times(-1))
        //     F_d1.normalize();
        //     let F_d = F_d1.dot(vA.add(vB.times(-1))) * this.damping;
        //     let diff = B.add(A.times(-1));
        //     let F_s = (Math.sqrt(diff.dot(diff)) - this.restLength) * this.stiffness;
        //     let F = F_d + F_s;
        //     this.joints[i1]._force = F_d1.times(F);
        //     this.joints[i2]._force = F_d1.times(-F);
        // }

        
        for (let joint of this.joints) joint.timeUpdate(t, this.joints);
        // for (let i = 0; i < this.joints.length; i++) {
        //     let j = this.joints[i].position;
        //     let toAdd = new Vec2(j.x - this.verts.vertexAt(i).x, j.y - this.verts.vertexAt(i).y);
        //     let a = this.verts.vertexAt(i).addInPlace(toAdd);
        //     console.log(this.verts.vertexAt(i).y - j.y);
        // }

        // let newVerts = new VertexArray2D();
        // newVerts.initColorAttribute();
        // for (let i = 0; i < this.joints.length; i++) {
        //     let j = this.joints[i].position;
        //     newVerts.addVertex(j, Color.White());
        // }
        // newVerts.addVertex(this.joints[0].position, Color.White());
        // this.setVerts(newVerts);

        let newVerts = new VertexArray2D();
        newVerts.initColorAttribute();
        for (let edge of this.edges) {
            let i = edge.x;
            let j = edge.y;
            newVerts.addVertex(this.joints[i].position, this.color);
            newVerts.addVertex(this.joints[j].position, this.color);
        }

        this.change = !this.change;
        // console.log('SpringModel timeUpdate')
    }
}
