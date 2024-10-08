import { VectorBase } from "../VectorBase";
import { Random } from "../../Random";
import { ASerializable } from "../../../base";
import * as THREE from "three";

// function V2(elements?: Array<number>):Vec2;
function V2(...args: Array<any>): Vec2 {
  return new Vec2(...args);
}

export { V2 };

@ASerializable("Vec2")
export class Vec2 extends VectorBase {
  static N_DIMENSIONS: number = 2;

  /**
   * Creates Vec2 from x and y
   * @param x
   * @param y
   */
  public constructor(x: number, y: number);
  /**
   * Creates Vec2 from a list of elements
   * @param elements
   */
  public constructor(elements?: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    super(...args);
  }

  _setToDefault() {
    this.elements = [0, 0];
  }

  get nDimensions() {
    return 2;
  }

  toString() {
    return `Vec2(${this.x}, ${this.y})`;
  }

  static Random(range?:[number,number]) {
    var rand = new this(Random.floatArray(2));
    if(range !== undefined){
      rand = new this(range[0],range[0]).plus(rand.times(range[1]-range[0]));
    }
    return rand;
  }

  getHPointElements(){
    return [...this.elements, 1.0];
  }

  getHVectorElements(){
    return [...this.elements, 0.0];
  }

  // Add another vector to this one, modifying it in place
  addInPlace(other: Vec2): Vec2 {
      this.x += other.x;
      this.y += other.y;
      return this; // return the modified vector
  }

  // Add another vector and return a new Vec2
  add(other: Vec2): Vec2 {
      return new Vec2(this.x + other.x, this.y + other.y);
  }

}
