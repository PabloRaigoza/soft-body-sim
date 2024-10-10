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
        
        // Obstacle 1
        this.Obstacle1();
        // Mesh options
        this.basicMesh();
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
    complexMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let p0 = new Vec2(-2,2);
        let p1 = new Vec2(-1,2);
        let p2 = new Vec2(0,2);
        let p3 = new Vec2(1,2);
        let p4 = new Vec2(-2,1);
        let p5 = new Vec2(-1,1);
        let p6 = new Vec2(0,1);
        let p7 = new Vec2(1,1);
        let p8 = new Vec2(-2,0);
        let p9 = new Vec2(-1,0);
        let p10 = new Vec2(0,0);
        let p11 = new Vec2(1,0);
        let p12 = new Vec2(-2,-1);
        let p13 = new Vec2(-1,-1);
        let p14 = new Vec2(0,-1);
        let p15 = new Vec2(1,-1);
        let p16 = new Vec2(-2,-2);
        let p17 = new Vec2(-1,-2);
        let p18 = new Vec2(0,-2);
        let p19 = new Vec2(1,-2);
        let p20 = new Vec2(-2,-3);
        let p21 = new Vec2(-1,-3);
        let p22 = new Vec2(0,-3);
        let p23 = new Vec2(1,-3);

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
        p9 = p9.add(tr);
        p10 = p10.add(tr);
        p11 = p11.add(tr);
        p12 = p12.add(tr);
        p13 = p13.add(tr);
        p14 = p14.add(tr);
        p15 = p15.add(tr);
        p16 = p16.add(tr);
        p17 = p17.add(tr);
        p18 = p18.add(tr);
        p19 = p19.add(tr);
        p20 = p20.add(tr);
        p21 = p21.add(tr);
        p22 = p22.add(tr);
        p23 = p23.add(tr);

        spring.addJoint(p0, this.polygonMaterial, this);
        spring.addJoint(p1, this.polygonMaterial, this);
        spring.addJoint(p2, this.polygonMaterial, this);
        spring.addJoint(p3, this.polygonMaterial, this);
        spring.addJoint(p4, this.polygonMaterial, this);
        spring.addJoint(p5, this.polygonMaterial, this);
        spring.addJoint(p6, this.polygonMaterial, this);
        spring.addJoint(p7, this.polygonMaterial, this);
        spring.addJoint(p8, this.polygonMaterial, this);
        spring.addJoint(p9, this.polygonMaterial, this);
        spring.addJoint(p10, this.polygonMaterial, this);
        spring.addJoint(p11, this.polygonMaterial, this);
        spring.addJoint(p12, this.polygonMaterial, this);
        spring.addJoint(p13, this.polygonMaterial, this);
        spring.addJoint(p14, this.polygonMaterial, this);
        spring.addJoint(p15, this.polygonMaterial, this);
        spring.addJoint(p16, this.polygonMaterial, this);
        spring.addJoint(p17, this.polygonMaterial, this);
        spring.addJoint(p18, this.polygonMaterial, this);
        spring.addJoint(p19, this.polygonMaterial, this);
        spring.addJoint(p20, this.polygonMaterial, this);
        spring.addJoint(p21, this.polygonMaterial, this);
        spring.addJoint(p22, this.polygonMaterial, this);
        spring.addJoint(p23, this.polygonMaterial, this);

        // horizontal
        spring.addEdge(0, 1, Math.sqrt(p0.add(p1.times(-1)).dot(p0.add(p1.times(-1)))));
        spring.addEdge(0, 4, Math.sqrt(p0.add(p4.times(-1)).dot(p0.add(p4.times(-1)))));
        spring.addEdge(0, 5, Math.sqrt(p0.add(p5.times(-1)).dot(p0.add(p5.times(-1)))));
        spring.addEdge(1, 2, Math.sqrt(p1.add(p2.times(-1)).dot(p1.add(p2.times(-1)))));
        spring.addEdge(1, 4, Math.sqrt(p1.add(p4.times(-1)).dot(p1.add(p4.times(-1)))));
        spring.addEdge(1, 5, Math.sqrt(p1.add(p5.times(-1)).dot(p1.add(p5.times(-1)))));
        spring.addEdge(1, 6, Math.sqrt(p1.add(p6.times(-1)).dot(p1.add(p6.times(-1)))));
        spring.addEdge(2, 3, Math.sqrt(p2.add(p3.times(-1)).dot(p2.add(p3.times(-1)))));
        spring.addEdge(2, 5, Math.sqrt(p2.add(p5.times(-1)).dot(p2.add(p5.times(-1)))));
        spring.addEdge(2, 6, Math.sqrt(p2.add(p6.times(-1)).dot(p2.add(p6.times(-1)))));
        spring.addEdge(2, 7, Math.sqrt(p2.add(p7.times(-1)).dot(p2.add(p7.times(-1)))));
        spring.addEdge(3, 6, Math.sqrt(p3.add(p6.times(-1)).dot(p3.add(p6.times(-1)))));
        spring.addEdge(3, 7, Math.sqrt(p3.add(p7.times(-1)).dot(p3.add(p7.times(-1)))));
        spring.addEdge(4, 5, Math.sqrt(p4.add(p5.times(-1)).dot(p4.add(p5.times(-1)))));
        spring.addEdge(4, 8, Math.sqrt(p4.add(p8.times(-1)).dot(p4.add(p8.times(-1)))));
        spring.addEdge(4, 9, Math.sqrt(p4.add(p9.times(-1)).dot(p4.add(p9.times(-1)))));
        spring.addEdge(5, 6, Math.sqrt(p5.add(p6.times(-1)).dot(p5.add(p6.times(-1)))));
        spring.addEdge(5, 8, Math.sqrt(p5.add(p8.times(-1)).dot(p5.add(p8.times(-1)))));
        spring.addEdge(5, 9, Math.sqrt(p5.add(p9.times(-1)).dot(p5.add(p9.times(-1)))));
        spring.addEdge(5, 10, Math.sqrt(p5.add(p10.times(-1)).dot(p5.add(p10.times(-1)))));
        spring.addEdge(6, 7, Math.sqrt(p6.add(p7.times(-1)).dot(p6.add(p7.times(-1)))));
        spring.addEdge(6, 9, Math.sqrt(p6.add(p9.times(-1)).dot(p6.add(p9.times(-1)))));
        spring.addEdge(6, 10, Math.sqrt(p6.add(p10.times(-1)).dot(p6.add(p10.times(-1)))));
        spring.addEdge(6, 11, Math.sqrt(p6.add(p11.times(-1)).dot(p6.add(p11.times(-1)))));
        spring.addEdge(7, 10, Math.sqrt(p7.add(p10.times(-1)).dot(p7.add(p10.times(-1)))));
        spring.addEdge(7, 11, Math.sqrt(p7.add(p11.times(-1)).dot(p7.add(p11.times(-1)))));
        spring.addEdge(8, 9, Math.sqrt(p8.add(p9.times(-1)).dot(p8.add(p9.times(-1)))));
        spring.addEdge(8, 12, Math.sqrt(p8.add(p12.times(-1)).dot(p8.add(p12.times(-1)))));
        spring.addEdge(8, 13, Math.sqrt(p8.add(p13.times(-1)).dot(p8.add(p13.times(-1)))));
        spring.addEdge(9, 10, Math.sqrt(p9.add(p10.times(-1)).dot(p9.add(p10.times(-1)))));
        spring.addEdge(9, 12, Math.sqrt(p9.add(p12.times(-1)).dot(p9.add(p12.times(-1)))));
        spring.addEdge(9, 13, Math.sqrt(p9.add(p13.times(-1)).dot(p9.add(p13.times(-1)))));
        spring.addEdge(9, 14, Math.sqrt(p9.add(p14.times(-1)).dot(p9.add(p14.times(-1)))));
        spring.addEdge(10, 11, Math.sqrt(p10.add(p11.times(-1)).dot(p10.add(p11.times(-1)))));
        spring.addEdge(10, 13, Math.sqrt(p10.add(p13.times(-1)).dot(p10.add(p13.times(-1)))));
        spring.addEdge(10, 14, Math.sqrt(p10.add(p14.times(-1)).dot(p10.add(p14.times(-1)))));
        spring.addEdge(10, 15, Math.sqrt(p10.add(p15.times(-1)).dot(p10.add(p15.times(-1)))));
        spring.addEdge(11, 14, Math.sqrt(p11.add(p14.times(-1)).dot(p11.add(p14.times(-1)))));
        spring.addEdge(11, 15, Math.sqrt(p11.add(p15.times(-1)).dot(p11.add(p15.times(-1)))));
        spring.addEdge(12, 13, Math.sqrt(p12.add(p13.times(-1)).dot(p12.add(p13.times(-1)))));
        spring.addEdge(12, 16, Math.sqrt(p12.add(p16.times(-1)).dot(p12.add(p16.times(-1)))));
        spring.addEdge(12, 17, Math.sqrt(p12.add(p17.times(-1)).dot(p12.add(p17.times(-1)))));
        spring.addEdge(13, 14, Math.sqrt(p13.add(p14.times(-1)).dot(p13.add(p14.times(-1)))));
        spring.addEdge(13, 16, Math.sqrt(p13.add(p16.times(-1)).dot(p13.add(p16.times(-1)))));
        spring.addEdge(13, 17, Math.sqrt(p13.add(p17.times(-1)).dot(p13.add(p17.times(-1)))));
        spring.addEdge(13, 18, Math.sqrt(p13.add(p18.times(-1)).dot(p13.add(p18.times(-1)))));
        spring.addEdge(14, 15, Math.sqrt(p14.add(p15.times(-1)).dot(p14.add(p15.times(-1)))));
        spring.addEdge(14, 17, Math.sqrt(p14.add(p17.times(-1)).dot(p14.add(p17.times(-1)))));
        spring.addEdge(14, 18, Math.sqrt(p14.add(p18.times(-1)).dot(p14.add(p18.times(-1)))));
        spring.addEdge(14, 19, Math.sqrt(p14.add(p19.times(-1)).dot(p14.add(p19.times(-1)))));
        spring.addEdge(15, 18, Math.sqrt(p15.add(p18.times(-1)).dot(p15.add(p18.times(-1)))));
        spring.addEdge(15, 19, Math.sqrt(p15.add(p19.times(-1)).dot(p15.add(p19.times(-1)))));
        spring.addEdge(16, 17, Math.sqrt(p16.add(p17.times(-1)).dot(p16.add(p17.times(-1)))));
        spring.addEdge(16, 20, Math.sqrt(p16.add(p20.times(-1)).dot(p16.add(p20.times(-1)))));
        spring.addEdge(16, 21, Math.sqrt(p16.add(p21.times(-1)).dot(p16.add(p21.times(-1)))));
        spring.addEdge(17, 18, Math.sqrt(p17.add(p18.times(-1)).dot(p17.add(p18.times(-1)))));
        spring.addEdge(17, 20, Math.sqrt(p17.add(p20.times(-1)).dot(p17.add(p20.times(-1)))));
        spring.addEdge(17, 21, Math.sqrt(p17.add(p21.times(-1)).dot(p17.add(p21.times(-1)))));
        spring.addEdge(17, 22, Math.sqrt(p17.add(p22.times(-1)).dot(p17.add(p22.times(-1)))));
        spring.addEdge(18, 19, Math.sqrt(p18.add(p19.times(-1)).dot(p18.add(p19.times(-1)))));
        spring.addEdge(18, 21, Math.sqrt(p18.add(p21.times(-1)).dot(p18.add(p21.times(-1)))));
        spring.addEdge(18, 22, Math.sqrt(p18.add(p22.times(-1)).dot(p18.add(p22.times(-1)))));
        spring.addEdge(18, 23, Math.sqrt(p18.add(p23.times(-1)).dot(p18.add(p23.times(-1)))));
        spring.addEdge(19, 22, Math.sqrt(p19.add(p22.times(-1)).dot(p19.add(p22.times(-1)))));
        spring.addEdge(19, 23, Math.sqrt(p19.add(p23.times(-1)).dot(p19.add(p23.times(-1)))));
        spring.addEdge(20, 21, Math.sqrt(p20.add(p21.times(-1)).dot(p20.add(p21.times(-1)))));
        spring.addEdge(21, 22, Math.sqrt(p21.add(p22.times(-1)).dot(p21.add(p22.times(-1)))));
        spring.addEdge(22, 23, Math.sqrt(p22.add(p23.times(-1)).dot(p22.add(p23.times(-1)))));


        this.addChild(spring);
        this.springs.push(spring);
    }

    basicMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let p0 = new Vec2(-2,2);
        let p1 = new Vec2(-1,2);
        let p2 = new Vec2(-2,1);
        let p3 = new Vec2(-1,1);

        let tr = new Vec2(0,10);
        p0 = p0.add(tr);
        p1 = p1.add(tr);
        p2 = p2.add(tr);
        p3 = p3.add(tr);

        spring.addJoint(p0, this.polygonMaterial, this);
        spring.addJoint(p1, this.polygonMaterial, this);
        spring.addJoint(p2, this.polygonMaterial, this);
        spring.addJoint(p3, this.polygonMaterial, this);

        spring.addEdge(0,1,Math.sqrt(p0.add(p1.times(-1)).dot(p0.add(p1.times(-1)))));
        spring.addEdge(0,2,Math.sqrt(p0.add(p2.times(-1)).dot(p0.add(p2.times(-1)))));
        spring.addEdge(0,3,Math.sqrt(p0.add(p3.times(-1)).dot(p0.add(p3.times(-1)))));
        spring.addEdge(1,2,Math.sqrt(p1.add(p2.times(-1)).dot(p1.add(p2.times(-1)))));
        spring.addEdge(1,3,Math.sqrt(p1.add(p3.times(-1)).dot(p1.add(p3.times(-1)))));
        spring.addEdge(2,3,Math.sqrt(p2.add(p3.times(-1)).dot(p2.add(p3.times(-1)))));
        this.addChild(spring);
        this.springs.push(spring);

    }

    Obstacle1() {
        // Create a new rectangle model
        let transform1 = Mat3.Translation2D(0,-6).times(Mat3.Scale2D(2));
        let rectangle1 = new GeometryModel();
        rectangle1.setMaterial(this.polygonMaterial);
        rectangle1.createRectangle(transform1);
        this.addChild(rectangle1);

        // Create a new triangle model
        let transform2 = Mat3.Translation2D(-4,-5.5).times(Mat3.Scale2D(2));
        let triangle = new GeometryModel();
        triangle.setMaterial(this.polygonMaterial);
        triangle.createTriangle(transform2);
        this.addChild(triangle);

        // Create a new rectangle model
        let transform3 = Mat3.Translation2D(4,0).times(Mat3.Scale2D(1).times(Mat3.Rotation(Math.PI/4)));
        let rectangle2 = new GeometryModel();
        rectangle2.setMaterial(this.polygonMaterial);
        rectangle2.createRectangle(transform3);
        this.addChild(rectangle2);

        // Create a new rectangle model
        let transform4 = Mat3.Translation2D(-4,6).times(Mat3.Scale2D(1).times(Mat3.Rotation(-Math.PI/4)));
        let rectangle3 = new GeometryModel();
        rectangle3.setMaterial(this.polygonMaterial);
        rectangle3.createRectangle(transform4);
        this.addChild(rectangle3);

    }
    wing2:GeometryModel = new GeometryModel();
    wing3:GeometryModel = new GeometryModel();
    wing2_copy:GeometryModel = new GeometryModel();
    wing3_copy:GeometryModel = new GeometryModel();
    Obstacle2() {
        // Create a new rectangle model
        let transform1 = Mat3.Translation2D(0,-6).times(Mat3.Scale2D(2));
        let rectangle1 = new GeometryModel();
        rectangle1.setMaterial(this.polygonMaterial);
        rectangle1.createRectangle(transform1);
        this.addChild(rectangle1);

        // Create a new triangle model
        let transform2 = Mat3.Translation2D(-4,-5.5).times(Mat3.Scale2D(2));
        let triangle = new GeometryModel();
        triangle.setMaterial(this.polygonMaterial);
        triangle.createTriangle(transform2);
        this.addChild(triangle);

        // Create a new rectangle model
        let transform3 = Mat3.Scale2D(0.5).times(Mat3.Rotation(Math.PI/2));
        let transform31 = Mat3.Scale2D(0.5)
        this.wing2.setMaterial(this.polygonMaterial);
        this.wing2_copy.setMaterial(this.polygonMaterial);
        this.wing2_copy.createRectangle(transform31);
        this.wing2.createRectangle(transform3);
        this.addChild(this.wing2);

        // Create a new wing model
        let transform4 = Mat3.Scale2D(0.5).times(Mat3.Rotation(0));
        let transform41 = Mat3.Scale2D(0.5)
        this.wing3.setMaterial(this.polygonMaterial);
        this.wing3_copy.setMaterial(this.polygonMaterial);
        this.wing3_copy.createRectangle(transform41);
        this.wing3.createRectangle(transform4);
        this.addChild(this.wing3);

    }



    timeUpdate(t: number) {
        try {
            for (let spline of this.splines) spline.timeUpdate(t);
            // for (let joint of this.joints) joint.timeUpdate(t);
            for (let spring of this.springs) spring.timeUpdate(t);
            this.wing2.setTransform(Mat3.Rotation(Math.PI/4).times(Mat3.Translation2D(-4,3)));
            this.wing3.setTransform(Mat3.Rotation(-Math.PI/4).times(Mat3.Translation2D(-4,3)));
        }

        catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}