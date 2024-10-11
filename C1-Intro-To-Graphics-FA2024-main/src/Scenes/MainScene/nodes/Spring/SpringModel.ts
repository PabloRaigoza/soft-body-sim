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


@ASerializable("SpringModel")
export class SpringModel extends ANodeModel2D {
    lineWidth: number = 0.003;
    damping: number = 0.00;
    stiffness: number = 0.3;
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

    addJoint(pos: Vec2, mat: AMaterial, ctx:MainSceneModel) {
        let joint = new JointModel();
        joint.setPos(pos);
        joint.setMaterial(mat);
        this.joints.push(joint);
        // this.verts.addVertex(joint.position, Color.White());
        ctx.addChild(joint);
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
        }
    }

    dragging(point : Vec2) {
        if (this.selected_joint != -1) {
            this.joints[this.selected_joint].setPos(point);
        }
    }

    dragEnd() {
        if (this.selected_joint != -1) {
            this.joints[this.selected_joint].setSelected(false);
            // this.joints[this.selected_joint]._velocity = new Vec2(0, 0);
            this.selected_joint = -1;
            for (let joint of this.joints) joint._velocity = new Vec2(0, 0);
        }
    }

    timeUpdate(t: number, ...args: any[]): void {
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
            newVerts.addVertex(this.joints[i].position, Color.White());
            newVerts.addVertex(this.joints[j].position, Color.White());
        }

        this.change = !this.change;
        // console.log('SpringModel timeUpdate')
    }
}
