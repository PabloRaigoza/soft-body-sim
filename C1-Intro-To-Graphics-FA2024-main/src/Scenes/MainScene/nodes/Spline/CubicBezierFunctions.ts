import {Color, Mat4, Vec2, Vec3, Vec4, VectorBase} from "../../../../anigraph";

/*
The function below is technically optional, in that we won't grade it directly, but implementing it may save you some repeated effort on other parts.
For the curious, it also provides a convenient way to explore other types of splines.
 */
export function GetSplineSegmentValueForAlphaAndMatrix(alpha: number, matrix: Mat4, p0: VectorBase, p1: VectorBase, p2: VectorBase, p3: VectorBase):Vec2;
export function GetSplineSegmentValueForAlphaAndMatrix(alpha: number, matrix: Mat4, p0: VectorBase, p1: VectorBase, p2: VectorBase, p3: VectorBase):Vec3;
export function GetSplineSegmentValueForAlphaAndMatrix(alpha: number, matrix: Mat4, p0: VectorBase, p1: VectorBase, p2: VectorBase, p3: VectorBase):Color;
export function GetSplineSegmentValueForAlphaAndMatrix(alpha: number, matrix: Mat4, p0: VectorBase, p1: VectorBase, p2: VectorBase, p3: VectorBase):Vec4;
/**
 * Calculates the value of a cubic spline segment at a given parameter alpha using a transformation matrix.
 *
 * This function blends four control points (p0, p1, p2, p3) based on the parameter alpha and a 4x4 matrix.
 * The matrix influences the shape of the spline, allowing for different types of splines like Bezier or Catmull-Rom.
 *
 * @param {number} alpha - A value between 0 and 1 representing the position along the spline segment.
 * @param {Mat4} matrix - A 4x4 transformation matrix that dictates the blending of the control points.
    (Hint: the Mat4 class has many useful helper getters for you to get specific elements of a Matrix.
    e.g. you can get any column or row of a matrix easily)
 * @param {VectorBase} p0 - The first control point of the spline segment.
 * @param {VectorBase} p1 - The second control point of the spline segment.
 * @param {VectorBase} p2 - The third control point of the spline segment.
 * @param {VectorBase} p3 - The fourth control point of the spline segment.
 *
 * @returns {VectorBase} - The calculated position on the spline at the specified alpha.
 *
 * Example:
 * - For alpha = 0, the function returns the position at p0.
 * - For alpha = 1, the function returns the position at p3.
 * - For values between 0 and 1, the function interpolates between the control points based on the matrix configuration.
 */
export function GetSplineSegmentValueForAlphaAndMatrix(alpha:number, matrix:Mat4, p0:VectorBase, p1:VectorBase, p2:VectorBase, p3:VectorBase):VectorBase{
    //let alphaV = new Vec4(1, alpha, alpha*alpha, alpha*alpha*alpha);
    const Mx = p0.times(matrix.m30)
    .plus(p1.times(matrix.m31))
    .plus(p2.times(matrix.m32))
    .plus(p3.times(matrix.m33));

    const My = p0.times(matrix.m20)
    .plus(p1.times(matrix.m21))
    .plus(p2.times(matrix.m22))
    .plus(p3.times(matrix.m23));

    const Mz = p0.times(matrix.m10)
    .plus(p1.times(matrix.m11))
    .plus(p2.times(matrix.m12))
    .plus(p3.times(matrix.m13));

    const Mw = p0.times(matrix.m00)
    .plus(p1.times(matrix.m01))
    .plus(p2.times(matrix.m02))
    .plus(p3.times(matrix.m03));

    return Mx.times(1)
    .plus(My.times(alpha))
    .plus(Mz.times(alpha*alpha))
    .plus(Mw.times(alpha*alpha*alpha));
    // TODO: Replace the line above with your own code (technically optional, but suggested)
}

/**
 * This function takes in a progress parameter alpha and four points representing the control points of a Bezier spline segment. Return the point corresponding to alpha along the segment.
 * @param alpha
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 * @returns {VectorBase}
 * @constructor
 */
export function GetCubicBezierSplineSegmentValueForAlpha(alpha:number, p0:Vec2, p1:Vec2, p2:Vec2, p3:Vec2):Vec2;
export function GetCubicBezierSplineSegmentValueForAlpha(alpha:number, p0:Color, p1:Color, p2:Color, p3:Color):Color;
export function GetCubicBezierSplineSegmentValueForAlpha(alpha:number, p0:VectorBase, p1:VectorBase, p2:VectorBase, p3:VectorBase):VectorBase{
    //cubic bezier matrix 
    const matrix = new Mat4(
        -1, 3, -3, 1,
        3, -6, 3, 0,
        -3, 3, 0, 0,
        1, 0 , 0, 0
    );
    return GetSplineSegmentValueForAlphaAndMatrix(alpha, matrix, p0, p1, p2, p3);
    // TODO: Replace the line above with your own code
}

/**
 *
 * @param alpha
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 * @constructor
 */
export function GetCubicBezierSplineSegmentDerivativeForAlpha(alpha:number, p0:Vec2, p1:Vec2, p2:Vec2, p3:Vec2):Vec2;
export function GetCubicBezierSplineSegmentDerivativeForAlpha(alpha:number, p0:VectorBase, p1:VectorBase, p2:VectorBase, p3:VectorBase):VectorBase{
    const matrix = new Mat4(
        -1, 3, -3, 1,
        3, -6, 3, 0,
        -3, 3, 0, 0,
        1, 0 , 0, 0
    );
    const My = p0.times(matrix.m20)
    .plus(p1.times(matrix.m21))
    .plus(p2.times(matrix.m22))
    .plus(p3.times(matrix.m23));

    const Mz = p0.times(matrix.m10)
    .plus(p1.times(matrix.m11))
    .plus(p2.times(matrix.m12))
    .plus(p3.times(matrix.m13));

    const Mw = p0.times(matrix.m00)
    .plus(p1.times(matrix.m01))
    .plus(p2.times(matrix.m02))
    .plus(p3.times(matrix.m03));

    return My.times(1).plus(Mz.times(2*alpha)).plus(Mw.times(3*alpha*alpha));
    // TODO: Replace the line above with your own code
}
