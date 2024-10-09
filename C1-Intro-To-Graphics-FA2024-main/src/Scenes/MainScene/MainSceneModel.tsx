import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
import { SpringModel } from "./nodes/Spring/SpringModel";
import { JointModel } from "./nodes/Joint/JointModel";

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
    polygonMaterial!:AMaterial;
    someSpring:SpringModel = new SpringModel();
    initScene(){
        let appState = GetAppState();
        this.addNewSpline();
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);

        // Create a new joint model
        let aJoint = new JointModel();
        aJoint.setMaterial(this.polygonMaterial);
        this.addChild(aJoint);
        this.joints.push(aJoint);

        // Create a new spring model
        // this.someSpring = new SpringModel();
        // this.someSpring.setMaterial(this.polygonMaterial);
        // this.someSpring.addLine(new Vec2(0,0), new Vec2(0,1), Color.White(), Color.FromRGBA(1,0,0,1));
        // this.someSpring.addLine(new Vec2(0,1), new Vec2(1,1), Color.White(), Color.FromRGBA(1,0,0,1));
        // this.someSpring.addLine(new Vec2(1,1), new Vec2(1,0), Color.White(), Color.FromRGBA(1,0,0,1));
        
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);
        spring.verts.addVertex(V2(0,0), Color.White());
        spring.verts.addVertex(V2(0,1), Color.White());
        spring.verts.addVertex(V2(1,1), Color.White());
        spring.verts.addVertex(V2(1,0), Color.White());
        this.addChild(spring);

        // let spline = new SplineModel();
        // spline.setMaterial(this.polygonMaterial);
        // spline.verts.addVertex(V2(0,0), Color.White());
        // spline.verts.addVertex(V2(0,1), Color.White());
        // spline.verts.addVertex(V2(1,1), Color.White());
        // spline.verts.addVertex(V2(1,0), Color.White());
        // this.addChild(spline);
    }



    timeUpdate(t: number) {
        try {
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