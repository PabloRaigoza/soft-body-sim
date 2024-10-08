import {AppState, Color, DefaultMaterials, GetAppState, Polygon2D, V2} from "../../anigraph";
import {App2DSceneModel} from "../../anigraph/starter/App2D/App2DSceneModel";
import {Polygon2DModel} from "../../anigraph/starter/nodes/polygon2D";
import {AMaterial} from "../../anigraph";


let nErrors = 0;

/**
 * This is your Scene Model class. The scene model is the main data model for your application. It is the root for a
 * hierarchy of models that make up your scene/
 */
export class MainSceneModel extends App2DSceneModel{

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
    initScene(){
        let appState = GetAppState();

        // add a circle to the scene
        this.polygonMaterial = appState.CreateMaterial(DefaultMaterials.RGBA_SHADER);

        // add a square to the scene
        let square = new Polygon2DModel();
        square.setMaterial(this.polygonMaterial);
        square.verts.addVertex(V2(0,0), Color.FromRGBA(1,0,0,1));
        square.verts.addVertex(V2(1,0), Color.FromRGBA(0,1,0,1));
        square.verts.addVertex(V2(1,1), Color.FromRGBA(0,0,1,1));
        square.verts.addVertex(V2(0,1), Color.FromRGBA(1,1,0,1));
        this.addChild(square);

        // add a triangle to the scene
        let triangle = new Polygon2DModel();
        triangle.setMaterial(this.polygonMaterial);
        triangle.verts.addVertex(V2(1,1), Color.FromRGBA(1,0,0,1));
        triangle.verts.addVertex(V2(3,2), Color.FromRGBA(0,1,0,1));
        triangle.verts.addVertex(V2(3,3), Color.FromRGBA(0,0,1,1));
        this.addChild(triangle);

        // add a circle to the scene
        let circle = new Polygon2DModel();
        circle.setMaterial(this.polygonMaterial);
        let pnts = Polygon2D.CircleVArray(0.5, 10);
        // circle.verts.addVertices(pnts[0], pnts[1]);
        for (let i = 0; i < pnts.nVerts; i++)
            circle.verts.addVertex(pnts.vertexAt(i), Color.FromRGBA(1,0,0,1));
        circle.setVerts(pnts);
        this.addChild(circle);
    }



    timeUpdate(t: number) {
        try {
        }catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
        }
    }
}
