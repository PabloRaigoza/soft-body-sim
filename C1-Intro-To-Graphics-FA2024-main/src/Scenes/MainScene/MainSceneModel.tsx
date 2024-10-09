import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {Polygon2DModel} from "../../anigraph/starter/nodes/polygon2D";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
import { SpringModel } from "./nodes/Spring/SpringModel";

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

    polygons:Polygon2DModel[] = []
    polygonMaterial!:AMaterial;
    circle = new Polygon2DModel();
    circlePosition: Vec2 = V2(0, 0); // Start at (0,0)
    rectangleModel = new LineSegmentsModel2D();
    // particleSystem!:ExampleParticleSystemModel;
    async initScene(){
        let appState = GetAppState();

        this.addNewSpline();

        // add a circle to the scene
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);

        // Create the rectangle using LineSegmentsModel2D
        this.rectangleModel.setMaterial(this.polygonMaterial); // Assuming there's a setMaterial method

        // Define the vertices for the rectangle
        const bottomLeft = V2(-2, -2);
        const bottomRight = V2(2, -2);
        const topRight = V2(2, 2);
        const topLeft = V2(-2, 2);

        // Add edges to the rectangle model
        this.rectangleModel.addLine(bottomLeft, bottomRight, Color.White(), Color.White()); // Bottom edge
        this.rectangleModel.addLine(bottomRight, topRight, Color.White(), Color.White()); // Right edge
        this.rectangleModel.addLine(topRight, topLeft, Color.White(), Color.White()); // Top edge
        this.rectangleModel.addLine(topLeft, bottomLeft, Color.White(), Color.White()); // Left edge

        // Add the rectangle model to the scene
        this.addChild(this.rectangleModel);

        // // add a circle to the scene
        // let circle = new Polygon2DModel();
        this.circle.setMaterial(this.polygonMaterial);
        let pnts = Polygon2D.CircleVArray(0.5, 1000);
        // circle.verts.addVertices(pnts[0], pnts[1]);
        for (let i = 0; i < pnts.nVerts; i++)
            this.circle.verts.addVertex(pnts.vertexAt(i), Color.FromRGBA(1,0,0,1));
        // circle.setVerts(pnts);
        this.addChild(this.circle);
    }

    addSpline(spline:SplineModel){
        this.addChild(spline);
        this._splines.push(spline);
    }

    addNewSpline(){
        this.addSpline(new SplineModel());
                            
    joints:JointModel[] = []
    polygonMaterial!:AMaterial;
    someSpring:SpringModel = new SpringModel();
    initScene(){
        let appState = GetAppState();

        // add a circle to the scene
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);

        // Create a new joint model
        let aJoint = new JointModel();
        aJoint.setMaterial(this.polygonMaterial);
        this.addChild(aJoint);
        this.joints.push(aJoint);

        // Create a new spring model
        this.someSpring = new SpringModel();
        this.someSpring.setMaterial(this.polygonMaterial);
        this.someSpring.addLine(new Vec2(0,0), new Vec2(0,1), Color.White(), Color.White());
        this.someSpring.addLine(new Vec2(0,1), new Vec2(1,1), Color.White(), Color.White());
        this.someSpring.addLine(new Vec2(1,1), new Vec2(1,0), Color.White(), Color.White());
        this.addChild(this.someSpring);
    }



    timeUpdate(t: number) {
        try {
            let t = this.clock.time;
            for (let spline of this.splines){
                spline.timeUpdate(t);
            }
            // Update all models
            for (let joint of this.joints) {
                joint.timeUpdate(t);
            }
        }

        catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}