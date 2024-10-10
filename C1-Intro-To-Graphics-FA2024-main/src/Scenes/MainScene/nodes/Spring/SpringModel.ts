import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";
import {
    ALineMaterialModel,
    ANodeModel2D,
    AObject,
    AObjectState,
    ASerializable,
    Color, Curve2DModel, CurveInterpolationModes,
    Mat3,
    V2,
    Vec2, Vector,
    VectorBase,
    VertexArray2D
} from "../../../../anigraph";
import { JointModel } from "../Joint/JointModel";
import { VertexArray } from "../../../../anigraph/geometry";


@ASerializable("SpringModel")
export class SpringModel extends ANodeModel2D {
    lineWidth: number = 0.005;
    damping: number = 0.001;
    stiffness: number = 0.1;
    restLength: number = 6;

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

    timeUpdate(t: number, ...args: any[]): void {
        // Compute the forces of consitute joints
        let A = this.joints[0].position;
        let B = this.joints[1].position;
        let vA = this.joints[0]._velocity;
        let vB = this.joints[1]._velocity;
        let F_d1 = B.add(A.times(-1))
        F_d1.normalize();
        let F_d = F_d1.dot(vA.add(vB.times(-1))) * this.damping;
        let diff = B.add(A.times(-1));
        let F_s = (Math.sqrt(diff.dot(diff)) - this.restLength) * this.stiffness;
        let F = F_d + F_s;
        // F *= 0.5;
        // console.log(Math.sqrt(diff.dot(diff)));

        // Apply forces to joints
        this.joints[0]._force = F_d1.times(F);
        this.joints[1]._force = F_d1.times(-F);

        for (let joint of this.joints) joint.timeUpdate(t);
        // for (let i = 0; i < this.joints.length; i++) {
        //     let j = this.joints[i].position;
        //     let toAdd = new Vec2(j.x - this.verts.vertexAt(i).x, j.y - this.verts.vertexAt(i).y);
        //     let a = this.verts.vertexAt(i).addInPlace(toAdd);
        //     console.log(this.verts.vertexAt(i).y - j.y);
        // }

        let newVerts = new VertexArray2D();
        newVerts.initColorAttribute();
        for (let i = 0; i < this.joints.length; i++) {
            let j = this.joints[i].position;
            newVerts.addVertex(j, Color.White());
        }
        this.setVerts(newVerts);
        this.change = !this.change;
        // console.log('SpringModel timeUpdate')
    }
}
