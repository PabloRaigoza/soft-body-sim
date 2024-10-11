import {App2DSceneController} from "../../anigraph/starter/App2D/App2DSceneController";
import {MainSceneModel} from "./MainSceneModel";
import {
    ADragInteraction,
    ASerializable,
    AGLContext,
    AInteractionEvent,
    AKeyboardInteraction, ANodeModel, ANodeView,
    Color,
    GetAppState, LineSegmentsModel2D, LineSegmentsView2D, V2,
    A2DMeshView,
    ASVGView,
    Mat3
} from "../../anigraph";
import {Polygon2DModel, Polygon2DView} from "../../anigraph/starter/nodes/polygon2D";
import {MyCustomModel, MyCustomView, SplineModel, SplineView} from "./nodes";
import {callLabCatForth} from "../Catamari/nodes";
import {ASceneInteractionMode} from "../../anigraph/starter";
import { JointModel } from "./nodes/Joint/JointModel";
import { JointView } from "./nodes/Joint/JointModelView";
import { SpringModel } from "./nodes/Spring/SpringModel";
import { SpringView } from "./nodes/Spring/SpringView";
import { GeometryModel } from "./nodes/Geometry/GeometryModel";
import { GeometryView } from "./nodes/Geometry/GeometryView";
import { LabCatFloationgHeadModel } from "Scenes/Example2/nodes/LabCatFloatingHead/LabCatFloationgHeadModel";
import { CustomSVGModel } from "Scenes/Example2/nodes/CustomSVGModel";

/**
 * This is your Scene Controller class. The scene controller is responsible for managing user input with the keyboard
 * and mouse, as well as making sure that the view hierarchy matches the model heirarchy.
 */
@ASerializable("MainSceneController")
export class MainSceneController extends App2DSceneController{
    mainInteractionMode!: ASceneInteractionMode;

    get model():MainSceneModel{
        return this._model as MainSceneModel;
    }

    get splineModel(){
        return this.model.currentSpline;
    }

    get springModel() {
        return this.model.springs[0];
    }

    get labCatModel(){
        return this.model.labCatVectorHead;
    }


    /**
     * The main customization you might do here would be to set the background color or set a background image.
     * Check out Lab Cat's helpful Example2 scene for example code that sets the background to an image.
     * @returns {Promise<void>}
     */
    async initScene(): Promise<void> {
        // You can set the clear color for the rendering context
        await super.initScene();
        this.setClearColor(Color.FromString('#323232'));
        this.initControlPanelControls();
        // Subscribe to stuff if desired...
        // const self = this;
        // this.subscribe()
    }

    initControlPanelControls(){
        const appState = GetAppState();
        const self = this;
        // appState.addSliderControl("ExampleSlider", 0, -1, 1, 0.001);
        // appState.addButton("Button", ()=>{
        //     console.log("Button pressed!")
        //     console.log(self)
        // })

        var soft_body = {
            1: "simple",
            2: "mesh",
            3: "truss",
            4: "circular"
        }

        let soft_body_options = Object.values(soft_body);
        appState.setGUIControlSpecKey(
            "SoftBodyOptions",
            {
                options: soft_body_options,
                value: soft_body_options[0],
                onChange:(selected:any)=>{
                    // switch (selected){
                    //     case soft_body_options[1]:
                    //         this.model.createScenesAndMeshes("simple", this.model.current_scene);
                    //         break;
                    //     case soft_body_options[2]:
                    //         this.model.createScenesAndMeshes("complex", this.model.current_scene);
                    //         break;
                    //     case soft_body_options[3]:
                    //         this.model.createScenesAndMeshes("truss", this.model.current_scene);
                    //         break;
                    //     case soft_body_options[4]:
                    //         this.model.createScenesAndMeshes("circular", this.model.current_scene);
                    // }
                    if (selected === soft_body_options[0]){
                        this.model.createScenesAndMeshes("simple", this.model.current_scene);
                    }
                    if (selected === soft_body_options[1]){
                        this.model.createScenesAndMeshes("mesh", this.model.current_scene);
                    }
                    if (selected === soft_body_options[2]){
                        this.model.createScenesAndMeshes("truss", this.model.current_scene);
                    }
                    if (selected === soft_body_options[3]){
                        this.model.createScenesAndMeshes("circular", this.model.current_scene);
                    }
                }
            }
        )
        var scenes = {
            1 : "basic",
            2 : "dynamic",
            3 : "slant"
        }
        let scene_options = Object.values(scenes);
        appState.setGUIControlSpecKey(
            "SceneOptions",
            {
                options: scene_options,
                value: scene_options[0],
                onChange:(selected:any)=>{
                    // switch (selected){
                    //     case scene_options[1]:
                    //         this.model.createScenesAndMeshes(this.model.current_mesh, "basic");
                    //         break;
                    //     case scene_options[2]:
                    //         this.model.createScenesAndMeshes(this.model.current_mesh, "dynamic");
                    //         break;
                    //     case scene_options[3]:
                    //         this.model.createScenesAndMeshes(this.model.current_mesh, "cross");
                    //         break;
                    // }
                    if (selected === scene_options[0]){
                        this.model.createScenesAndMeshes(this.model.current_mesh, "basic");
                    }
                    if (selected === scene_options[1]){
                        this.model.createScenesAndMeshes(this.model.current_mesh, "dynamic");
                    }
                    if (selected === scene_options[2]){
                        this.model.createScenesAndMeshes(this.model.current_mesh, "cross");
                    }
                }
            }
        )
    }



    /**
     * Specifies what view classes to use for different model class.
     * If you create custom models and views, you will need to link them here by calling `addModelViewSpec` with the
     * model class as the first argument and the view class as the second. Check out Example2 and Example3 for examples
     * with custom nodes added.
     */
    initModelViewSpecs() {

        // This line tells the controller that whenever a Polygon2DModel is added to the model hierarchy, we should
        // create and add a corresponding Polygon2DView and connect it to the new model
        this.addModelViewSpec(Polygon2DModel, Polygon2DView);
        this.addModelViewSpec(MyCustomModel, MyCustomView);
        this.addModelViewSpec(LineSegmentsModel2D, LineSegmentsView2D);
        this.addModelViewSpec(SplineModel, SplineView);
        this.addModelViewSpec(SpringModel, SpringView);
        this.addModelViewSpec(GeometryModel, GeometryView);
        this.addModelViewSpec(JointModel, JointView);
        this.addModelViewSpec(LabCatFloationgHeadModel, A2DMeshView);
        this.addModelViewSpec(CustomSVGModel, ASVGView);
    }

    /**
     * This will create any view specified by an addModelViewSpec call by default.
     * Only use this function if you want to do something custom / unusual that can't be contelled with a spec.
     * @param {ANodeModel} nodeModel
     * @returns {ANodeView}
     */
    createViewForNodeModel(nodeModel: ANodeModel): ANodeView {
        return super.createViewForNodeModel(nodeModel);
    }

    initInteractions() {
        super.initInteractions();
        const self = this;

        /**
         * Here we will create an interaction mode, which defines one set of controls
         * At any point, there is an active interaction mode.
         */
        this.mainInteractionMode = new ASceneInteractionMode(
            "MainInteractionMode",
            this,
            {
                onKeyDown: (event:AInteractionEvent, interaction:AKeyboardInteraction)=>{
                },
                onKeyUp:(event:AInteractionEvent, interaction:AKeyboardInteraction)=>{
                    // if(event.key==='s'){
                    // }
                    // if(event.key==='S'){
                    // }
                    // if(event.key==='ArrowRight'){
                    // }
                    // if(event.key==='ArrowLeft'){
                    // }
                    // if(event.key==='ArrowUp'){
                    // }
                    // if(event.key==='ArrowDown'){
                    // }
                    // // if (event.key === 'i') {
                    // //     let ndcCursor = event.ndcCursor;
                    // //     if (ndcCursor) {
                    // //         let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                    // //         console.log(cursorPosition);
                    // //         this.springModel.impulse(cursorPosition.clone());
                    // //     }
                    // // }
                    if (event.key === 'w' || event.key === 'ArrowUp') this.springModel.keyImpulse(V2(0, 1));
                    if (event.key === 's' || event.key === 'ArrowDown') this.springModel.keyImpulse(V2(0, -1));
                    if (event.key === 'a' || event.key === 'ArrowLeft') this.springModel.keyImpulse(V2(-1, 0));
                    if (event.key === 'd' || event.key === 'ArrowRight') this.springModel.keyImpulse(V2(1, 0));
                },
                // onClick:(event:AInteractionEvent)=>{
                //     let ndcCursor = event.ndcCursor;
                //     if (ndcCursor) {
                //         let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                //         this.springModel.cursorImpulse(cursorPosition.clone());
                //     }
                // },
                onMouseMove:(event:AInteractionEvent)=>{
                    let ndcCursor = event.ndcCursor;
                    if (ndcCursor) {
                        let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                        let someJointPos = this.springModel.joints[0].position.clone();

                        // Compute rotation angle (radians) heading
                        let heading = cursorPosition.minus(someJointPos);
                        let angle = Math.atan2(heading.y, heading.x) - Math.PI/2;

                        this.labCatModel.setTransform(
                            // Mat3.Scale2D(3).times(Mat3.Translation2D(cursorPosition))
                            // Mat3.Translation2D(cursorPosition).times(Mat3.Scale2D(3))
                            Mat3.Translation2D(cursorPosition)
                                .times(Mat3.Rotation(angle))
                                .times(Mat3.Scale2D(3))
                        )
                    }
                },
                onDragStart:(event:AInteractionEvent, interaction:ADragInteraction)=>{
                    let ndcCursor = event.ndcCursor;
                    if (ndcCursor) {
                        let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                        if (this.springModel.dragStart(cursorPosition)) {
                            this.springModel.signalGeometryUpdate();
                        } else {
                            let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                            this.springModel.cursorImpulse(cursorPosition.clone());
                            this.labCatModel.visible = true;
                        }

                    }
                    // console.log('drag start')
                },
                onDragMove:(event:AInteractionEvent, interaction:ADragInteraction)=>{
                    let ndcCursor = event.ndcCursor;
                    if (ndcCursor) {
                        let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                        this.springModel.dragging(cursorPosition);
                        this.springModel.signalGeometryUpdate();

                        if (this.springModel.selected_joint == -1) {
                            let cursorPosition = this.model.worldPointFromNDCCursor(ndcCursor)
                            this.springModel.cursorImpulse(cursorPosition.clone());
                        }
                    }
                },
                onDragEnd:(event:AInteractionEvent, interaction:ADragInteraction)=>{
                    let ndcCursor = event.ndcCursor;
                    if (ndcCursor) {
                        this.springModel.dragEnd();
                        this.springModel.signalGeometryUpdate();

                        this.labCatModel.visible = false;
                    }
                    // console.log('drag end')
                },
            }
        )
        this.defineInteractionMode("MainInteractionMode", this.mainInteractionMode);
        this.setCurrentInteractionMode("MainInteractionMode");
    }

}
