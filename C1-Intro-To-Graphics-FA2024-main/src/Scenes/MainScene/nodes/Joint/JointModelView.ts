import {ASerializable} from "../../../../anigraph/base";
import {ANodeView2D} from "../../../../anigraph/scene";
import {APolygon2DGraphic} from "../../../../anigraph/rendering";
import {JointModel} from "./JointModel";

let nErrors = 0;
@ASerializable("JointView")
export class JointView extends ANodeView2D{
    element!: APolygon2DGraphic;
    get model(): JointModel {
        return this._model as JointModel;
    }
    init(): void {
        this.element = new APolygon2DGraphic();
        this.element.init(this.model.verts, this.model.material.threejs);
        this.registerAndAddGraphic(this.element);
        this.update();
        const self = this;
        this.subscribe(this.model.addGeometryListener(
            ()=>{
                self.updateGeometry();
            }
        ))

    }

    updateGeometry(){
        this.element.setVerts2D(this.model.verts);
    }

    update(): void {
        try {
            // Make the model move
            this.setTransform(this.model.transform);
            // let transform = this.model.transform.getMatrix();
            // let m4 = Mat4.From2DMat3(transform.getMatrix());
            // m4.m23 = this.model.zValue;
            // this.setTransform(m4);

        }catch(e) {
            if(nErrors<1){
                console.error(e);
                nErrors+=1;
            }
            this.setTransform(this.model.getTransform3D());
        }
    }
}
