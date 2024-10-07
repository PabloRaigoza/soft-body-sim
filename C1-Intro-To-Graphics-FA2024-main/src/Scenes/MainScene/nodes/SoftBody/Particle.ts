// need proper import and link to the compiler
export class Particle {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass: number;

    constructor(x: number, y: number, mass: number) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.mass = mass;
    }

    applyForce(force: { x: number; y: number }) {
        const acceleration = {
            x: force.x / this.mass,
            y: force.y / this.mass,
        };
        this.velocity.x += acceleration.x;
        this.velocity.y += acceleration.y;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= 0.99; // Damping
        this.velocity.y *= 0.99; // Damping
    }
}
