import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, V3, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D, AObjectNode, ALineSegmentsGraphic, VertexArray2D} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
import { SpringModel } from "./nodes/Spring/SpringModel";
import { JointModel } from "./nodes/Joint/JointModel";
import { GeometryModel } from "./nodes/Geometry/GeometryModel";
import { NodeTransform2D } from "../../anigraph/math";
import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";

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
        this.obstacles_dynamic();
        this.complexMesh();
    }

    basicTrussMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let points: Vec2[] = [
            new Vec2(-2, 0),
            new Vec2(0, 0),
            new Vec2(2, 0),
            new Vec2(-1, 2),
            new Vec2(1, 2),
            new Vec2(-1, -2),
            new Vec2(1, -2),
            // new Vec2(-4, 0), // If needed, uncomment these
            // new Vec2(4, 0)  // If needed, uncomment these
        ];
        
        // Define the translation vector
        let tr = new Vec2(0, 10);
        
        // Shift all points up by the translation vector using a loop
        for (let i = 0; i < points.length; i++) {
            points[i] = points[i].add(tr);
        }

        // Add joints for all points using a loop
        for (let i = 0; i < points.length; i++) {
            spring.addJoint(points[i], this.polygonMaterial, this);
        }
        // spring.addJoint(p7, this.polygonMaterial, this);
        // spring.addJoint(p8, this.polygonMaterial, this);

        // Top half
        const edges: [number, number][] = [
            [0, 1],
            [1, 2],
            [3, 4],
            [0, 3],
            [1, 4],
            [2, 4],
            [1, 3]
        ];
        
        for (let [i, j] of edges) {
            spring.addEdge(i, j, Math.sqrt(points[i].add(points[j].times(-1)).dot(points[i].add(points[j].times(-1)))));
        }

        // Bottom half
        // spring.addEdge(0,5,Math.sqrt(p0.add(p5.times(-1)).dot(p0.add(p5.times(-1)))));
        // spring.addEdge(1,5,Math.sqrt(p1.add(p5.times(-1)).dot(p1.add(p5.times(-1)))));
        // spring.addEdge(1,6,Math.sqrt(p1.add(p6.times(-1)).dot(p1.add(p6.times(-1)))));
        // spring.addEdge(2,6,Math.sqrt(p2.add(p6.times(-1)).dot(p2.add(p6.times(-1)))));
        // spring.addEdge(5,6,Math.sqrt(p5.add(p6.times(-1)).dot(p5.add(p6.times(-1)))));

        // Diagonal
        // spring.addEdge(0,7,Math.sqrt(p0.add(p7.times(-1)).dot(p0.add(p7.times(-1)))));
        // spring.addEdge(2,8,Math.sqrt(p2.add(p8.times(-1)).dot(p2.add(p8.times(-1)))));

        spring.setPolys([this.myRect2.verts, this.myRect.verts, this.myRect3.verts]);
        
        this.addChild(spring);
        this.springs.push(spring);
    }
    complexMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let points: Vec2[] = [
            new Vec2(-2,2),
            new Vec2(-1,2),
            new Vec2(0,2),
            new Vec2(1,2),
            new Vec2(-2,1),
            new Vec2(-1,1),
            new Vec2(0,1),
            new Vec2(1,1),
            new Vec2(-2,0),
            new Vec2(-1,0),
            new Vec2(0,0),
            new Vec2(1,0),
            new Vec2(-2,-1),
            new Vec2(-1,-1),
            new Vec2(0,-1),
            new Vec2(1,-1),
            new Vec2(-2,-2),
            new Vec2(-1,-2),
            new Vec2(0,-2),
            new Vec2(1,-2),
            new Vec2(-2,-3),
            new Vec2(-1,-3),
            new Vec2(0,-3),
            new Vec2(1,-3)
        ];

        
        // Shift all points up by adding the translation vector
        let translation = new Vec2(0, 10);
        for (let i = 0; i < points.length; i++) {
            points[i] = points[i].add(translation);
        }

        for (let i = 0; i < points.length; i++) {
            spring.addJoint(points[i], this.polygonMaterial, this);
        }

        // Function to calculate the Euclidean distance between two points
        function calculateDistance(p1:Vec2, p2:Vec2) {
            return Math.sqrt(p1.add(p2.times(-1)).dot(p1.add(p2.times(-1))));
        }

        // Add edges based on a grid layout
        for (let i = 0; i <= 23; i++) {
            if ((i + 1) % 4 !== 0) { // Horizontal edges within the same row
                spring.addEdge(i, i + 1, calculateDistance(points[i], points[i + 1]));
            }
            if (i + 4 <= 23) { // Vertical edges between rows
                spring.addEdge(i, i + 4, calculateDistance(points[i], points[i + 4]));
            }
            if ((i + 1) % 4 !== 0 && i + 5 <= 23) { // Diagonal edges (right-down)
                spring.addEdge(i, i + 5, calculateDistance(points[i], points[i + 5]));
            }
            if (i % 4 !== 0 && i + 3 <= 23) { // Diagonal edges (left-down)
                spring.addEdge(i, i + 3, calculateDistance(points[i], points[i + 3]));
            }
        }


        spring.setPolys([this.myRect2.verts, this.myRect.verts, this.myRect3.verts]);
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

    myRect:Polygon2DModel = new Polygon2DModel();
    myRect2:Polygon2DModel = new Polygon2DModel();
    myRect3:Polygon2DModel = new Polygon2DModel();
    myTriangle:Polygon2DModel = new Polygon2DModel();
    myRect4:Polygon2DModel = new Polygon2DModel();
    obstacles_cross() {
        this.myRect = new Polygon2DModel();
        this.myRect.setMaterial(this.polygonMaterial);
        this.myRect.verts.addVertex(new Vec2(-8, -5 + 1), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8.5, -5), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8.5, -4), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(-8, -4 + 1), Color.FromString("#aaaaaa"));
        this.addChild(this.myRect);

        this.myRect2 = new Polygon2DModel();
        this.myRect2.setMaterial(this.polygonMaterial);
        this.myRect2.verts.addVertex(new Vec2(8, 5), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(9, 5), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(9, -7), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(8, -7), Color.FromString("#aaaaaa"));
        this.addChild(this.myRect2);

    }
    obstacles_basic() {
        this.myTriangle = new Polygon2DModel();
        this.myTriangle.setMaterial(this.polygonMaterial);
        this.myTriangle.verts.addVertex(new Vec2(-6, -5), Color.FromString("#aaaaaa"));
        this.myTriangle.verts.addVertex(new Vec2(-2, -5), Color.FromString("#aaaaaa"));
        this.myTriangle.verts.addVertex(new Vec2(-4, -1), Color.FromString("#aaaaaa"));
        this.addChild(this.myTriangle);

        this.myRect = new Polygon2DModel();
        this.myRect.setMaterial(this.polygonMaterial);
        this.myRect.verts.addVertex(new Vec2(-8, -6), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(-8, -5), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8, -5), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8, -6), Color.FromString("#aaaaaa"));
        this.addChild(this.myRect);

        this.myRect2 = new Polygon2DModel();
        this.myRect2.setMaterial(this.polygonMaterial);
        this.myRect2.verts.addVertex(new Vec2(0, 0), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(0, 1), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(8, 1), Color.FromString("#aaaaaa"));
        this.myRect2.verts.addVertex(new Vec2(8, 0), Color.FromString("#aaaaaa"));
        this.myRect2.setTransform(Mat3.Rotation(Math.PI/4).times(Mat3.Translation2D(new Vec2(0, -3))));
        this.addChild(this.myRect2);

        this.myRect3 = new Polygon2DModel();
        this.myRect3.setMaterial(this.polygonMaterial);
        this.myRect3.verts.addVertex(new Vec2(0, 0), Color.FromString("#aaaaaa"));
        this.myRect3.verts.addVertex(new Vec2(0, 1), Color.FromString("#aaaaaa"));
        this.myRect3.verts.addVertex(new Vec2(8, 1), Color.FromString("#aaaaaa"));
        this.myRect3.verts.addVertex(new Vec2(8, 0), Color.FromString("#aaaaaa"));
        this.myRect3.setTransform(Mat3.Rotation(-Math.PI/4).times(Mat3.Translation2D(new Vec2(-11, 1))));
        this.addChild(this.myRect3);
    }

    obstacles_dynamic() {
        this.myTriangle = new Polygon2DModel();
        this.myTriangle.setMaterial(this.polygonMaterial);
        this.myTriangle.verts.addVertex(new Vec2(-5.5, -1), Color.FromString("#aaaaaa"));
        this.myTriangle.verts.addVertex(new Vec2(-2.5, -1), Color.FromString("#aaaaaa"));
        this.myTriangle.verts.addVertex(new Vec2(-4, 2), Color.FromString("#aaaaaa"));
        this.addChild(this.myTriangle);

        this.myRect = new Polygon2DModel();
        this.myRect.setMaterial(this.polygonMaterial);
        this.myRect.verts.addVertex(new Vec2(-8, -6), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(-8, -5), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8, -5), Color.FromString("#aaaaaa"));
        this.myRect.verts.addVertex(new Vec2(8, -6), Color.FromString("#aaaaaa"));
        this.addChild(this.myRect);

        this.myRect2 = new Polygon2DModel();
        this.myRect2.setMaterial(this.polygonMaterial);
        this.myRect2.verts.addVertex(new Vec2(-3, -0.25), Color.FromString("#777777"));
        this.myRect2.verts.addVertex(new Vec2(-3, 0.25), Color.FromString("#777777"));
        this.myRect2.verts.addVertex(new Vec2(3, 0.25), Color.FromString("#777777"));
        this.myRect2.verts.addVertex(new Vec2(3, -0.25), Color.FromString("#777777"));
        this.myRect2.setTransform(Mat3.Translation2D(new Vec2(-4,2)).times(Mat3.Rotation(Math.PI/4)));
        this.addChild(this.myRect2);

        this.myRect3 = new Polygon2DModel();
        this.myRect3.setMaterial(this.polygonMaterial);
        this.myRect3.verts.addVertex(new Vec2(-3, -0.25), Color.FromString("#777777"));
        this.myRect3.verts.addVertex(new Vec2(-3, 0.25), Color.FromString("#777777"));
        this.myRect3.verts.addVertex(new Vec2(3, 0.25), Color.FromString("#777777"));
        this.myRect3.verts.addVertex(new Vec2(3, -0.25), Color.FromString("#777777"));
        this.myRect3.setTransform(Mat3.Translation2D(new Vec2(-4,2)).times(Mat3.Rotation(-Math.PI/4)));
        this.addChild(this.myRect3);

        this.myRect4 = new Polygon2DModel();
        this.myRect4.setMaterial(this.polygonMaterial);
        this.myRect4.verts.addVertex(new Vec2(-5.5, -5), Color.FromString("#aaaaaa"));
        this.myRect4.verts.addVertex(new Vec2(-2.5, -5), Color.FromString("#aaaaaa"));
        this.myRect4.verts.addVertex(new Vec2(-2.5, -1), Color.FromString("#aaaaaa"));
        this.myRect4.verts.addVertex(new Vec2(-5.5, -1), Color.FromString("#aaaaaa"));
        this.addChild(this.myRect4);
    }




    timeUpdate(t: number) {
        try {
            for (let spline of this.splines) spline.timeUpdate(t);
            for (let spring of this.springs) spring.timeUpdate(t);
            this.myRect2.setTransform(Mat3.Translation2D(new Vec2(-4,2)).times(Mat3.Rotation(t)).times(Mat3.Rotation(Math.PI/4)));
            this.myRect3.setTransform(Mat3.Translation2D(new Vec2(-4,2)).times(Mat3.Rotation(t)).times(Mat3.Rotation(-Math.PI/4)));
        }

        catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}