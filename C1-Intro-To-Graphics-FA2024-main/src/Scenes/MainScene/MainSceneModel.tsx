import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2, V3, AParticle2D, Vec2, Mat3, LineSegmentsModel2D, LineSegmentsView2D, AObjectNode, ALineSegmentsGraphic, VertexArray2D, SVGAsset, AMaterialManager} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {AMaterial} from "../../anigraph";
import { SplineModel } from "./nodes";
import { SpringModel } from "./nodes/Spring/SpringModel";
import { JointModel } from "./nodes/Joint/JointModel";
import { GeometryModel } from "./nodes/Geometry/GeometryModel";
import { NodeTransform2D } from "../../anigraph/math";
import { Polygon2DModel } from "anigraph/starter/nodes/polygon2D";
import { CatModel } from "Scenes/Catamari/nodes";
import { CustomSVGModel } from "Scenes/Example2/nodes/CustomSVGModel";
import { LabCatFloationgHeadModel } from "Scenes/Example2/nodes/LabCatFloatingHead/LabCatFloationgHeadModel";
import React from "react";

let nErrors = 0;

/**
 * This is your Scene Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends App2DSceneModel{
    _splines:SplineModel[] = [];
    color:Color = Color.FromRGBA([1, 0, 0, 1]);
    current_scene: string = "basic";
    current_mesh: string = "simple";
    gSz: number = 1;
    radius: number = 0.1;

    get splines():SplineModel[]{
        return this._splines;
    }

    get currentSpline():SplineModel{
        return this._splines[this._splines.length-1];
    }

    labCatFloatingHead!:LabCatFloationgHeadModel;
    labCatSVG!:SVGAsset;
    labCatVectorHead!:CustomSVGModel;

    /**
     * This will add variables to the control pannel
     * @param appState
     */
    initAppState(appState:AppState){
        //appState.addSliderIfMissing("SliderValue1", 0, 0, 1, 0.001);
        appState.addColorControl("JointColor", Color.FromRGBA([1, 0, 0, 1]));
        appState.addSliderIfMissing("SpringStiffness", 0.3, 0.01, 0.5, 0.01);
        appState.addSliderIfMissing("JointRadius", 0.1, 0, 0.3, 0.01);
        appState.addColorControl("SpringColor", Color.FromRGBA([1, 1, 1, 1]));
        appState.addColorControl("SceneColor", Color.FromString('#3fff03'));
        appState.addSliderIfMissing("Gravity", 0.002, -0.02, 0.03, 0.0001);
        appState.addSliderIfMissing("t", 1, 0.1, 1, 0.1);
        appState.addSliderIfMissing("ImpulseScale", 0.3, -0.4, 0.4, 0.01);
        appState.addSliderIfMissing("MeshSize", 1, 0.1, 2, 0.1);
    }

    async PreloadAssets(): Promise<void> {
        await super.PreloadAssets();
        let appState = GetAppState();

        /**
         * We will talk about shaders later in the semester. For now, just know that each one of these is something like
         * a material used for rendering objects.
          */
        await appState.loadShaderMaterialModel(AMaterialManager.DefaultMaterials.INSTANCED_TEXTURE2D_SHADER);
        await appState.loadShaderMaterialModel(AMaterialManager.DefaultMaterials.PARTICLE_TEXTURE_2D_SHADER);
        await appState.loadShaderMaterialModel(DefaultMaterials.TEXTURED2D_SHADER);
        // await this.loadTexture( "./images/gradientParticle.png", "GaussianSplat")
        this.labCatSVG = await SVGAsset.Load("./images/svg/LabCatVectorHead.svg");
        await LabCatFloationgHeadModel.PreloadAssets();
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
                            
    springs:SpringModel[] = [];
    sceneShapes: Polygon2DModel[] = [];
    isDynamicScene:boolean = false;
    polygonMaterial!:AMaterial;
    catModel: CatModel = new CatModel();
    initScene(){
        let appState = GetAppState();
        this.addNewSpline();
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);

        this.createScenesAndMeshes("mesh", "dynamic");
        // appState.setState("LabCatScale", 1.0);
        // appState.setReactGUIContentFunction(
        //     (props:{appState:AppState})=>{
        //         return (
        //             <React.Fragment>
        //             {`Lab Cat head scale is ${props.appState.getState("LabCatScale")}`}
        //             </React.Fragment>
        //         );
        //     }
        // );
        // this.labCatVectorHead.visible = false;
        this.subscribe(appState.addStateValueListener("JointColor", (newValue)=>{
            // console.log('joings')
            // for (let joint of this.springs[0].joints
            for (let joint of this.springs[0].joints) joint.setUniformColor(newValue);
            for (let joint of this.springs[0].joints) joint.signalGeometryUpdate(); // signal that the geometry of our polygon has changed so that the view will update
            
        }), "JointColorSubscription")
        this.subscribe(appState.addStateValueListener("SpringStiffness", (newValue)=>{
            this.springs[0].setStiff(newValue);
        }), "StiffnessSubscription")
        this.subscribe(appState.addStateValueListener("JointRadius", (newValue)=>{ 
            this.radius = newValue;
            for (let joint of this.springs[0].joints) joint.setJointRadius(newValue);
            for (let joint of this.springs[0].joints) joint.reradius(newValue);
        }), "RadiusSubscription")
        this.subscribe(appState.addStateValueListener("SpringColor", (newValue)=>{
            this.springs[0].setColor(newValue); 
        }), "SpringColorSubscription")
        this.subscribe(appState.addStateValueListener("Gravity", (newValue)=>{
            for (let joint of this.springs[0].joints) joint.setGravity(newValue);
            for (let joint of this.springs[0].joints) joint.signalGeometryUpdate();
        }), "GravitySubscription")
        this.subscribe(appState.addStateValueListener("t", (newValue)=>{
            for (let joint of this.springs[0].joints) joint.setDt(newValue);
            for (let joint of this.springs[0].joints) joint.signalGeometryUpdate();
        }), "DtSubscription")
        this.subscribe(appState.addStateValueListener("ImpulseScale", (newValue)=>{
            this.springs[0].setImpulse(newValue);
        }), "ImpulseSubscription")
        this.subscribe(appState.addStateValueListener("SceneColor", (newValue)=>{
            for (let shape of this.sceneShapes) shape.setUniformColor(newValue);
            for (let shape of this.sceneShapes) shape.signalGeometryUpdate();
        }), "SceneColorSubscription")
        this.subscribe(appState.addStateValueListener("MeshSize", (newValue)=>{
            this.gSz = newValue;
            for (let joint of this.springs[0].joints) joint.reradius(this.radius);
            this.createScenesAndMeshes(this.current_mesh, this.current_scene);
        }), "MeshSizeSubscription")

        
    }

    createScenesAndMeshes(meshOption: string, sceneOption: string) {
        this.springs = [];  
        this.sceneShapes = [];
        this.isDynamicScene = false;
        this.releaseChildren();
        this.removeChildren(); 
        this.releaseChildren();
        this.removeChildren();
        this.releaseChildren();
        this.removeChildren();
        this.releaseChildren();
        this.removeChildren();
        this.releaseChildren();
        this.removeChildren();

        // console.log('here')  

        this.current_mesh = meshOption;
        this.current_scene = sceneOption;

        if (sceneOption == "basic") this.obstacles_basic();
        else if (sceneOption == "dynamic") this.obstacles_dynamic();
        else if (sceneOption == "cross") this.obstacles_cross();

        if (meshOption == "simple") this.basicMesh();
        else if (meshOption == "mesh") this.complexMesh();
        else if (meshOption == "truss") this.basicTrussMesh();
        else if (meshOption == "circular") this.circularMesh();


        this.springs[0].setColor(GetAppState().getState("SpringColor"));
        this.springs[0].setJointColor(GetAppState().getState("JointColor"));
        
        this.labCatVectorHead = new CustomSVGModel(this.labCatSVG);
        this.labCatVectorHead.setTransform(
            Mat3.Translation2D(new Vec2(100, 100))
        )
        this.labCatVectorHead.zValue = 10;
        // this.labCatVectorHead.visible = false;
        // this.labCatVectorHead.zValue = 10;
        this.addChild(this.labCatVectorHead);
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
        ];
        
        // Define the translation vector
        let tr = new Vec2(0, 10);
        
        // Shift all points up by the translation vector using a loop
        for (let i = 0; i < points.length; i++) points[i] = points[i].add(tr);
        for (let i = 0; i < points.length; i++) spring.addJoint(points[i], this.polygonMaterial, this, this.radius);

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
            spring.addEdge(i, j, this.gSz*Math.sqrt(points[i].add(points[j].times(-1)).dot(points[i].add(points[j].times(-1)))));
        }

        let polys: VertexArray2D[] = [];
        for (let scenePoly of this.sceneShapes) {
            polys.push(scenePoly.verts.GetTransformedBy(scenePoly.transform as Mat3));
        }
        spring.setPolys(polys);
        
        this.addChild(spring);
        this.springs.push(spring);
    }
    complexMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);

        let top_left = new Vec2(-4, 8);
        let gSz = this.gSz;
        let points: Vec2[] = [];
        
        for (let i = 0; i <= 23; i++) points.push(top_left.add(new Vec2(i % 4 * gSz, Math.floor(i / 4) * gSz)));
        for (let i = 0; i < points.length; i++) spring.addJoint(points[i], this.polygonMaterial, this, this.radius);
        
        function calculateDistance(p1:Vec2, p2:Vec2) { return Math.sqrt(p1.minus(p2).dot(p1.minus(p2))); }
        
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

        let polys: VertexArray2D[] = [];
        for (let scenePoly of this.sceneShapes) {
            polys.push(scenePoly.verts.GetTransformedBy(scenePoly.transform as Mat3));
        }
        spring.setPolys(polys);
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

        spring.addJoint(p0, this.polygonMaterial, this, this.radius);
        spring.addJoint(p1, this.polygonMaterial, this, this.radius);
        spring.addJoint(p2, this.polygonMaterial, this, this.radius);
        spring.addJoint(p3, this.polygonMaterial, this, this.radius);

        spring.addEdge(0,1,2*this.gSz * Math.sqrt(p0.minus(p1).dot(p0.minus(p1))));
        spring.addEdge(0,2,2*this.gSz * Math.sqrt(p0.minus(p2).dot(p0.minus(p2))));
        spring.addEdge(0,3,2*this.gSz * Math.sqrt(p0.minus(p3).dot(p0.minus(p3))));
        spring.addEdge(1,2,2*this.gSz * Math.sqrt(p1.minus(p2).dot(p1.minus(p2))));
        spring.addEdge(1,3,2*this.gSz * Math.sqrt(p1.minus(p3).dot(p1.minus(p3))));
        spring.addEdge(2,3,2*this.gSz * Math.sqrt(p2.minus(p3).dot(p2.minus(p3))));

        let polys: VertexArray2D[] = [];
        for (let scenePoly of this.sceneShapes) {
            polys.push(scenePoly.verts.GetTransformedBy(scenePoly.transform as Mat3));
        }
        spring.setPolys(polys);


        this.addChild(spring);
        this.springs.push(spring);

    }
    circularMesh() {
        let spring = new SpringModel();
        spring.setMaterial(this.polygonMaterial);
    
        let center = new Vec2(0, 10); // Center point
        let innerRadius = 0.5;  // Inner circle radius
        let outerRadius = 1.0;  // Outer circle radius
        let numInnerPoints = 8; // Number of points in the inner circle
        let numOuterPoints = 16; // Number of points in the outer circle
        let innerPoints: Vec2[] = [];
        let outerPoints: Vec2[] = [];
    
        // Add the center point as a joint in the spring model
        spring.addJoint(center, this.polygonMaterial, this, this.radius);
        
        // Generate points for the inner circle
        for (let i = 0; i < numInnerPoints; i++) {
            let angle = (i / numInnerPoints) * 2 * Math.PI;
            let x = innerRadius * Math.cos(angle);
            let y = innerRadius * Math.sin(angle);
            innerPoints.push(new Vec2(x, y).add(center));
        }
    
        // Generate points for the outer circle
        for (let i = 0; i < numOuterPoints; i++) {
            let angle = (i / numOuterPoints) * 2 * Math.PI;
            let x = outerRadius * Math.cos(angle);
            let y = outerRadius * Math.sin(angle);
            outerPoints.push(new Vec2(x, y).add(center));
        }

        // Add inner and outer points as joints in the spring model
        for (let point of innerPoints) {
            spring.addJoint(point, this.polygonMaterial, this, this.radius);
        }
        for (let point of outerPoints) {
            spring.addJoint(point, this.polygonMaterial, this, this.radius);
        }
    
        // Function to calculate the Euclidean distance between two points
        function calculateDistance(p1: Vec2, p2: Vec2) {
            return Math.sqrt(p1.minus(p2).dot(p1.minus(p2)));
        }
    
        // Connect the center point to all inner circle points
        for (let i = 0; i < numInnerPoints; i++) {
            spring.addEdge(0, i + 1, calculateDistance(center, innerPoints[i])); // The center is joint 0
        }

        // Add edges for inner circle (connect all neighboring points in a loop)
        for (let i = 0; i < numInnerPoints; i++) {
            let nextIndex = (i + 1) % numInnerPoints;
            spring.addEdge(i + 1, nextIndex + 1, calculateDistance(innerPoints[i], innerPoints[nextIndex]));
        }

        // Add edges for outer circle (connect all neighboring points in a loop)
        for (let i = 0; i < numOuterPoints; i++) {
            let nextIndex = (i + 1) % numOuterPoints;
            spring.addEdge(numInnerPoints + i + 1, numInnerPoints + nextIndex + 1, calculateDistance(outerPoints[i], outerPoints[nextIndex]));
        }

        // Add more connections between inner and outer circles
        for (let i = 0; i < numInnerPoints; i++) {
            let correspondingOuterIndex = Math.floor(i * (numOuterPoints / numInnerPoints));

            // Connect inner point to two outer points (to the corresponding outer point and its neighbor)
            let outerLeftIndex = (correspondingOuterIndex - 1 + numOuterPoints) % numOuterPoints; // Neighbor on the left
            let outerRightIndex = (correspondingOuterIndex + 1) % numOuterPoints; // Neighbor on the right

            // Connect inner point to corresponding outer point and its left and right neighbors
            spring.addEdge(i + 1, numInnerPoints + correspondingOuterIndex + 1, calculateDistance(innerPoints[i], outerPoints[correspondingOuterIndex]));
            spring.addEdge(i + 1, numInnerPoints + outerLeftIndex + 1, calculateDistance(innerPoints[i], outerPoints[outerLeftIndex]));
            spring.addEdge(i + 1, numInnerPoints + outerRightIndex + 1, calculateDistance(innerPoints[i], outerPoints[outerRightIndex]));
        }

    
    
        // Add polygons (triangular elements) to the mesh if needed
        let polys: VertexArray2D[] = [];
        for (let scenePoly of this.sceneShapes) {
            polys.push(scenePoly.verts.GetTransformedBy(scenePoly.transform as Mat3));
        }
        spring.setPolys(polys);
    
        this.addChild(spring);
        this.springs.push(spring);
    }
    
    

    obstacles_cross() {
        let myRect = new Polygon2DModel();
        myRect.setMaterial(this.polygonMaterial);
        myRect.verts.addVertex(new Vec2(-8, -5 + 1), GetAppState().getState("SceneColor"));
        myRect.verts.addVertex(new Vec2(8.5, -5), GetAppState().getState("SceneColor"));
        myRect.verts.addVertex(new Vec2(8.5, -4), GetAppState().getState("SceneColor"));
        myRect.verts.addVertex(new Vec2(-8, -4 + 1), GetAppState().getState("SceneColor"));
        this.addChild(myRect);
        this.sceneShapes.push(myRect);

        let myRect2 = new Polygon2DModel();
        myRect2.setMaterial(this.polygonMaterial);
        myRect2.verts.addVertex(new Vec2(8, 5), GetAppState().getState("SceneColor"));
        myRect2.verts.addVertex(new Vec2(9, 5), GetAppState().getState("SceneColor"));
        myRect2.verts.addVertex(new Vec2(9, -7), GetAppState().getState("SceneColor"));
        myRect2.verts.addVertex(new Vec2(8, -7), GetAppState().getState("SceneColor"));
        this.addChild(myRect2);
        this.sceneShapes.push(myRect2);

    }
    obstacles_basic() {
        let triangle = new Polygon2DModel();
        triangle.setMaterial(this.polygonMaterial);
        triangle.verts.addVertex(new Vec2(-6, -5), GetAppState().getState("SceneColor"));
        triangle.verts.addVertex(new Vec2(-2, -5), GetAppState().getState("SceneColor"));
        triangle.verts.addVertex(new Vec2(-4, -1), GetAppState().getState("SceneColor"));
        triangle.setTransform(Mat3.Translation2D(new Vec2(-2, -.2)));
        this.addChild(triangle);
        this.sceneShapes.push(triangle);

        let rect = new Polygon2DModel();
        rect.setMaterial(this.polygonMaterial);
        rect.verts.addVertex(new Vec2(-8, -6), GetAppState().getState("SceneColor"));
        rect.verts.addVertex(new Vec2(-8, -5), GetAppState().getState("SceneColor"));
        rect.verts.addVertex(new Vec2(8, -5), GetAppState().getState("SceneColor"));
        rect.verts.addVertex(new Vec2(8, -6), GetAppState().getState("SceneColor"));
        this.addChild(rect);
        this.sceneShapes.push(rect);

        let rect2 = new Polygon2DModel();
        rect2.setMaterial(this.polygonMaterial);
        rect2.verts.addVertex(new Vec2(0, 0), GetAppState().getState("SceneColor"));
        rect2.verts.addVertex(new Vec2(0, 1), GetAppState().getState("SceneColor"));
        rect2.verts.addVertex(new Vec2(8, 1), GetAppState().getState("SceneColor"));
        rect2.verts.addVertex(new Vec2(8, 0), GetAppState().getState("SceneColor"));
        rect2.setTransform(Mat3.Rotation(Math.PI/4).times(Mat3.Translation2D(new Vec2(0, -3))));
        this.addChild(rect2);
        this.sceneShapes.push(rect2);

        let rect3 = new Polygon2DModel();
        rect3.setMaterial(this.polygonMaterial);
        rect3.verts.addVertex(new Vec2(0, 0), GetAppState().getState("SceneColor"));
        rect3.verts.addVertex(new Vec2(0, 1), GetAppState().getState("SceneColor"));
        rect3.verts.addVertex(new Vec2(8, 1), GetAppState().getState("SceneColor"));
        rect3.verts.addVertex(new Vec2(8, 0), GetAppState().getState("SceneColor"));
        rect3.setTransform(Mat3.Rotation(-Math.PI/4).times(Mat3.Translation2D(new Vec2(-10, 1))));
        this.addChild(rect3);
        this.sceneShapes.push(rect3);
    }

    obstacles_dynamic() {
        this.isDynamicScene = true;
        let leftWall = new Polygon2DModel();
        leftWall.setMaterial(this.polygonMaterial);
        leftWall.verts.addVertex(new Vec2(-15, 8), GetAppState().getState("SceneColor"));
        leftWall.verts.addVertex(new Vec2(-7, 8), GetAppState().getState("SceneColor"));
        leftWall.verts.addVertex(new Vec2(-7, -8), GetAppState().getState("SceneColor"));
        leftWall.verts.addVertex(new Vec2(-15, -8), GetAppState().getState("SceneColor"));
        this.addChild(leftWall);
        this.sceneShapes.push(leftWall);

        let bottomWall = new Polygon2DModel();
        bottomWall.setMaterial(this.polygonMaterial);
        bottomWall.verts.addVertex(new Vec2(-10, -8), GetAppState().getState("SceneColor"));
        bottomWall.verts.addVertex(new Vec2(10, -8), GetAppState().getState("SceneColor"));
        bottomWall.verts.addVertex(new Vec2(10, -20), GetAppState().getState("SceneColor"));
        bottomWall.verts.addVertex(new Vec2(-10, -20), GetAppState().getState("SceneColor"));
        this.addChild(bottomWall);
        this.sceneShapes.push(bottomWall);

        let rightWall = new Polygon2DModel();
        rightWall.setMaterial(this.polygonMaterial);
        rightWall.verts.addVertex(new Vec2(7, 8), GetAppState().getState("SceneColor"));
        rightWall.verts.addVertex(new Vec2(15, 8), GetAppState().getState("SceneColor"));
        rightWall.verts.addVertex(new Vec2(15, -8), GetAppState().getState("SceneColor"));
        rightWall.verts.addVertex(new Vec2(7, -8), GetAppState().getState("SceneColor"));
        this.addChild(rightWall);
        this.sceneShapes.push(rightWall);

        let bottomPeg = new Polygon2DModel();
        bottomPeg.setMaterial(this.polygonMaterial);
        bottomPeg.verts.addVertex(new Vec2(-1, -8), GetAppState().getState("SceneColor"));
        bottomPeg.verts.addVertex(new Vec2(1, -8), GetAppState().getState("SceneColor"));
        bottomPeg.verts.addVertex(new Vec2(1, -20), GetAppState().getState("SceneColor"));
        bottomPeg.verts.addVertex(new Vec2(-1, -20), GetAppState().getState("SceneColor"));
        this.addChild(bottomPeg);
        this.sceneShapes.push(bottomPeg);
    }




    timeUpdate(t: number) {
        try {
            if (this.isDynamicScene) {
                let leftWall = this.sceneShapes[0];
                let bottomWall = this.sceneShapes[1];
                let rightWall = this.sceneShapes[2];
                let bottomWallPeg = this.sceneShapes[3];

                leftWall.setTransform(Mat3.Translation2D(new Vec2(3 * Math.sin(t) + 2, 0)));
                bottomWall.setTransform(Mat3.Translation2D(new Vec2(0, 3 + 3 * Math.sin(t + Math.PI / 2))));
                rightWall.setTransform(Mat3.Translation2D(new Vec2(-2 + -3 * Math.sin(t + Math.PI * 3 / 2), 0)));
                bottomWallPeg.setTransform(Mat3.Translation2D(new Vec2(0, 10 + 2*Math.sin(2*t + Math.PI / 8))));

                let newPolys: VertexArray2D[] = [];
                for (let scenePoly of this.sceneShapes) newPolys.push(scenePoly.verts.GetTransformedBy(scenePoly.transform as Mat3));
                for (let spring of this.springs) spring.setPolys(newPolys);
            }
            for (let spring of this.springs) spring.timeUpdate(t);
        }
        catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}