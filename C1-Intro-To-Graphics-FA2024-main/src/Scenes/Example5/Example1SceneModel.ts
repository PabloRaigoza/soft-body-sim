import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {Polygon2DModel} from "../../anigraph/starter/nodes/polygon2D";
import {AMaterial, AppState, Color, DefaultMaterials, GetAppState, Mat3, Mat4, Polygon2D, V2} from "../../anigraph";
import {Polygon2DModelPRSA} from "../../anigraph/starter/nodes/polygon2D/Polygon2DModelPRSA";
import {CustomPolygon2DModel, CustomPolygon2DPRSAModel} from "./CustomPolygon2DModel";
import {CustomPolygon2DMat3Model} from "./CustomPolygon2DModel";

/**
 * These will be options to choose from in our example drop-down widget of the control panel.
 * @type {string[]}
 */
const SelectionOptions = [
    "Option 1",
    "Option 2",
    "Option 3"
]


export class Example1SceneModel extends App2DSceneModel{

    nChainLinks = 5;


    /**
     * This will be a list of polygon models that we will use to make up our scene
     * @type {Polygon2DModel[]}
     */
    polygons:CustomPolygon2DModel[] = []

    /**
     * A material for drawing polygons
     * @type {AMaterial}
     */
    polygonMaterial!:AMaterial;

    /**
     * This will add variables to the control pannel.
     * You can add sliders and color pickers and drop down menus (oh my!).
     *
     * @param appState
     */
    initAppState(appState:AppState){
        // Adding a slider for an app state called "PolygonScale" with initial value 1, min 0, max 5, and step size 0.001
        appState.addSliderIfMissing("PolygonScale", 1, 0, 5, 0.001);

        appState.addSliderIfMissing("Spikiness", 0, 0, 1, 0.001);
        appState.addSliderIfMissing("PolygonRotation", 0, -2*Math.PI, 2*Math.PI, 0.001);

        // Adding a color picker to control a color stored in app state with key "ColorValue1"
        appState.addColorControl("ColorValue1", Color.FromString("#123abe"));

        // Dropdown menus with options are a bit more annoying but also doable...
        appState.setSelectionControl(
            "ExampleDropDown",
            "Option 1",
            SelectionOptions
        )

        for(let i=0; i<this.nChainLinks;i++){
            appState.addSliderIfMissing(`Link${i}Rotation`, 0, -2*Math.PI, 2*Math.PI, 0.001);
        }
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
    initScene(){
        let appState = GetAppState();

        // Initialize a material to use for drawing colored polygons
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);


        /**
         * We can define functions inside of other functions. Here we will use this to define a function that generates
         * the geometry for a k-spiked polygon. Take note that you need to define your polygon vertices in the right
         * order. In this example, if you traverse the vertices in the counter-clockwise order the geometry will come
         * out wrong!
         *
         * @param k
         * @param spikiness
         * @param color
         * @returns {Polygon2D}
         */
        function createSpikyGeometry(k:number, spikiness:number=0, color:Color){
            let polygon = Polygon2D.CreateForRendering() // default is hasColors=true, hasTextureCoords=false
            // color = color??appState.getState("ColorValue1");
            let spikeScale = 1-spikiness;
            for(let v=0;v<k;v++){
                let theta_step = -2*Math.PI/k; // The sign matters here!
                let theta = v*theta_step;
                let thetab = (v+0.5)*theta_step;
                polygon.addVertex(V2(Math.cos(theta), Math.sin(theta)), color);
                polygon.addVertex(V2(Math.cos(thetab), Math.sin(thetab)).times(spikeScale), color);
            }
            return polygon;
        }

        // Now let's create a polygon with spiky geometry
        let newPolygon = new CustomPolygon2DMat3Model(createSpikyGeometry(10, appState.getState("Spikiness"), appState.getState("ColorValue1")));

        // We set its material to be the simple RGB material
        newPolygon.setMaterial(this.polygonMaterial);

        // Now we add it as a child of our scene model
        this.addChild(newPolygon);
        this.polygons.push(newPolygon);

        // Here we subscribe to the "ColorValue1" App state control that we created in `initAppState` above
        this.subscribe(appState.addStateValueListener("Spikiness", (newValue)=>{
            newPolygon.setVerts(createSpikyGeometry(10, appState.getState("Spikiness"), appState.getState("ColorValue1")))
            newPolygon.signalGeometryUpdate(); // signal that the geometry of our polygon has changed so that the view will update
        }), "SpikinessSubscription")

        this.subscribe(appState.addStateValueListener("PolygonScale", (newValue)=>{
            let rotation = appState.getState("PolygonRotation");
            newPolygon.setTransform(Mat3.Rotation(rotation).times(Mat3.Scale2D(newValue)));
        }), "PolygonScaleSubscription")
    }


    /**
     * This is the function that gets called every time the frame updates. Check other scenes for examples that use the
     * t parameter.
     * @param t
     */
    timeUpdate(t: number) {
        try {
            // let newPolygon = this.children[0] as CustomPolygon2DMat3Model;
            let newPolygon = this.polygons[0];
            let newScale = 5 + 2*Math.sin(t);
            // newPolygon.setTransform(Mat3.Rotation(0).times(Mat3.Scale2D(1)));
            let a = Mat3.Rotation(t).times(Mat3.Scale2D(newScale));
            // let a = Mat3.Identity();
            // newPolygon.setTransform(a);
            // Specify whether to convert to Mat3 to Mat4 as 2D homogeneous or linear
            newPolygon.setTransformMat3(a);
            // console.log(newPolygon);
        }catch(e) {
            console.error(e);
        }
    }
}
