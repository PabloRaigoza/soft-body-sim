<<<<<<< Updated upstream
import {AppState, Color, GetAppState} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
=======
import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {Polygon2DModel} from "../../anigraph/starter/nodes/polygon2D";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
    initScene(){
=======

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
        // The inside should be transparent (alpha = 0)
        // insideRectangle.verts.addVertex(V2(-100, -100), Color.FromString('#323232')); // Transparent inside
        // insideRectangle.verts.addVertex(V2(-100, -80), Color.FromString('#323232'));  // Transparent inside
        // insideRectangle.verts.addVertex(V2(100, -80), Color.FromString('#323232'));   // Transparent inside
        // insideRectangle.verts.addVertex(V2(100, -100), Color.FromString('#323232'));  // Transparent inside
        // add a square to the scene
        // let square = new Polygon2DModel();
        // square.setMaterial(this.polygonMaterial);
        // square.verts.addVertex(V2(0,0), Color.FromRGBA(1,0,0,1));
        // square.verts.addVertex(V2(1,0), Color.FromRGBA(0,1,0,1));
        // square.verts.addVertex(V2(1,1), Color.FromRGBA(0,0,1,1));
        // square.verts.addVertex(V2(0,1), Color.FromRGBA(1,1,0,1));
        // this.addChild(square);

        // add a triangle to the scene
        // let triangle = new Polygon2DModel();
        // triangle.setMaterial(this.polygonMaterial);
        // triangle.verts.addVertex(V2(1,1), Color.FromRGBA(1,0,0,1));
        // triangle.verts.addVertex(V2(3,2), Color.FromRGBA(0,1,0,1));
        // triangle.verts.addVertex(V2(3,3), Color.FromRGBA(0,0,1,1));
        // this.addChild(triangle);

        //this.addChild(lineModel);

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
>>>>>>> Stashed changes
    }

    addSpline(spline:SplineModel){
        this.addChild(spline);
        this._splines.push(spline);
    }

    addNewSpline(){
        this.addSpline(new SplineModel());
    }



    timeUpdate(t: number) {
        try {
<<<<<<< Updated upstream
=======
            // // Generate small random deltas for the position
            // let deltaX = (Math.random() - 0.5) * 0.4; // Move randomly in x
            // let deltaY = (Math.random() - 0.5) * 0.4; // Move randomly in y

            // // Update circle position
            // this.circlePosition.addInPlace(V2(deltaX, deltaY));

            // // Apply the translation to the circle
            // this.circle.setTransform(
            //     Mat3.Translation2D(this.circlePosition)
            // );

>>>>>>> Stashed changes
        }catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}
