import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, V3, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D, AObjectNode, ALineSegmentsGraphic, VertexArray2D} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
import { SpringModel } from "./nodes/Spring/SpringModel";
import { JointModel } from "./nodes/Joint/JointModel";
import { GeometryModel } from "./nodes/Geometry/GeometryModel";
import { NodeTransform2D } from "../../anigraph/math";

let nErrors = 0;

/**
 * This is your Scene Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends App2DSceneModel{

    _splines:SplineModel[] = [];
    get splines():SplineModel[]{
        return this._splines;
    }

    get currentSpline():SplineModel{
        return this._splines[this._splines.length-1];
    }

    /**
     * This will add variables to the control pannel
     * @param appState
     */
    initAppState(appState:AppState){
        //appState.addSliderIfMissing("SliderValue1", 0, 0, 1, 0.001);
        appState.addColorControl("ParticleColor", Color.FromString("#d20909"));
    }

    /**
     * Use this function to initialize the content of the scene.
     * Generally, this will involve creating instances of ANodeModel subclasses and adding them as children of the scene:
     * ```
     * let myNewModel = new MyModelClass(...);
     * this.addChild(myNewModel);
     * ```
     *
     * You may also want to add tags to your models, which provide an additional way to control how they are rendered
     * by the scene controller. See example code below.
     */

    addSpline(spline:SplineModel){
        this.addChild(spline);
        this._splines.push(spline);
    }

    addNewSpline(){
        this.addSpline(new SplineModel());
    }
                            
    joints:JointModel[] = [];
    springs:SpringModel[] = [];
    polygonMaterial!:AMaterial;
    initScene(){
        let appState = GetAppState();
        this.addNewSpline();
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);
        
        // Obstracle 1
        this.Obstracle1();
        // Mesh options
        this.basicTrussMesh();
    }

    basicTrussMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let p0 = new Vec2(-2,0);
        let p1 = new Vec2(0,0);
        let p2 = new Vec2(2,0);
        let p3 = new Vec2(-1,2);
        let p4 = new Vec2(1,2);
        let p5 = new Vec2(-1,-2);
        let p6 = new Vec2(1,-2);
        let p7 = new Vec2(-4,0);
        let p8 = new Vec2(4,0);

        // Shift all points up 1
        let tr = new Vec2(0,10);
        p0 = p0.add(tr);
        p1 = p1.add(tr);
        p2 = p2.add(tr);
        p3 = p3.add(tr);
        p4 = p4.add(tr);
        p5 = p5.add(tr);
        p6 = p6.add(tr);
        p7 = p7.add(tr);
        p8 = p8.add(tr);

        spring.addJoint(p0, this.polygonMaterial, this);
        spring.addJoint(p1, this.polygonMaterial, this);
        spring.addJoint(p2, this.polygonMaterial, this);
        spring.addJoint(p3, this.polygonMaterial, this);
        spring.addJoint(p4, this.polygonMaterial, this);
        spring.addJoint(p5, this.polygonMaterial, this);
        spring.addJoint(p6, this.polygonMaterial, this);
        spring.addJoint(p7, this.polygonMaterial, this);
        spring.addJoint(p8, this.polygonMaterial, this);

        // Top half
        spring.addEdge(0,1,Math.sqrt(p0.add(p1.times(-1)).dot(p0.add(p1.times(-1)))));
        spring.addEdge(1,2,Math.sqrt(p1.add(p2.times(-1)).dot(p1.add(p2.times(-1)))));
        spring.addEdge(3,4,Math.sqrt(p3.add(p4.times(-1)).dot(p3.add(p4.times(-1)))));
        spring.addEdge(0,3,Math.sqrt(p0.add(p3.times(-1)).dot(p0.add(p3.times(-1)))));
        spring.addEdge(1,4,Math.sqrt(p1.add(p4.times(-1)).dot(p1.add(p4.times(-1)))));
        spring.addEdge(2,4,Math.sqrt(p2.add(p4.times(-1)).dot(p2.add(p4.times(-1)))));
        spring.addEdge(1,3,Math.sqrt(p1.add(p3.times(-1)).dot(p1.add(p3.times(-1)))));

        // Bottom half
        spring.addEdge(0,5,Math.sqrt(p0.add(p5.times(-1)).dot(p0.add(p5.times(-1)))));
        spring.addEdge(1,5,Math.sqrt(p1.add(p5.times(-1)).dot(p1.add(p5.times(-1)))));
        spring.addEdge(1,6,Math.sqrt(p1.add(p6.times(-1)).dot(p1.add(p6.times(-1)))));
        spring.addEdge(2,6,Math.sqrt(p2.add(p6.times(-1)).dot(p2.add(p6.times(-1)))));
        spring.addEdge(5,6,Math.sqrt(p5.add(p6.times(-1)).dot(p5.add(p6.times(-1)))));

        // Diagonal
        spring.addEdge(0,7,Math.sqrt(p0.add(p7.times(-1)).dot(p0.add(p7.times(-1)))));
        spring.addEdge(2,8,Math.sqrt(p2.add(p8.times(-1)).dot(p2.add(p8.times(-1)))));

        this.addChild(spring);
        this.springs.push(spring);
    }

    myRect:GeometryModel = new GeometryModel();
    Obstracle1() {
        // Create a new rectangle model
        const transform = new NodeTransform2D(
            new Vec2(10, 20),   // position (translation)
            Math.PI / 4,        // rotation (45 degrees in radians)
            new Vec2(2, 2),     // scale (uniform scaling of 2)
            new Vec2(5, 5)      // anchor point (optional, default is Vec2(0,0))
        );

        this.myRect = new GeometryModel();
        // rectangle1.setMaterial(this.polygonMaterial);
        // rectangle1.verts.addVertex(new Vec2(8,-5));
        // rectangle1.verts.addVertex(new Vec2(8,-6));
        // rectangle1.verts.addVertex(new Vec2(-8,-6));
        // rectangle1.verts.addVertex(new Vec2(-8,-5));
        // rectangle1.verts.addVertex(new Vec2(8,-5));
        // rectangle1.setTransform(transform);
        this.addChild(this.myRect);

        // // Create a new triangle model
        // //let triangle1 = new TrianglesModel();
        // let triangle = new GeometryModel();
        // triangle.setMaterial(this.polygonMaterial);
        // triangle.verts.addVertex(V2(-6, -5));
        // triangle.verts.addVertex(V2(0, -5));
        // triangle.verts.addVertex(V2(-3, 1));
        // triangle.verts.addVertex(V2(-6, -5));
        // this.addChild(triangle);

        // // Create a new rectangle model
        // let rectangle2 = new GeometryModel();
        // rectangle2.setMaterial(this.polygonMaterial);
        // rectangle2.verts.addVertex(new Vec2(1,-2));
        // rectangle2.verts.addVertex(new Vec2(5,5));
        // rectangle2.verts.addVertex(new Vec2(6,4));
        // rectangle2.verts.addVertex(new Vec2(2,-3));
        // rectangle2.verts.addVertex(new Vec2(1,-2));
        // this.addChild(rectangle2);

        // // Create a new rectangle model
        // let rectangle3 = new GeometryModel();
        // rectangle3.setMaterial(this.polygonMaterial);
        // rectangle3.verts.addVertex(new Vec2(-1,3));
        // rectangle3.verts.addVertex(new Vec2(0,4));
        // rectangle3.verts.addVertex(new Vec2(-6,7));
        // rectangle3.verts.addVertex(new Vec2(-7,6));
        // rectangle3.verts.addVertex(new Vec2(-1,3));
        // this.addChild(rectangle3);
    }



    timeUpdate(t: number) {
        try {
            for (let spline of this.splines) spline.timeUpdate(t);
            // for (let joint of this.joints) joint.timeUpdate(t);
            for (let spring of this.springs) spring.timeUpdate(t);
            this.myRect.setTransform(Mat3.Rotation(t));
        }

        catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}