// need proper import and link to the compiler
import { Particle } from './Particle';

export class Spring {
    particleA: Particle;
    particleB: Particle;
    restLength: number;
    stiffness: number;

    constructor(particleA: Particle, particleB: Particle, restLength: number, stiffness: number) {
        this.particleA = particleA;
        this.particleB = particleB;
        this.restLength = restLength;
        this.stiffness = stiffness;
    }

    update() {
        const dx = this.particleB.position.x - this.particleA.position.x;
        const dy = this.particleB.position.y - this.particleA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceMagnitude = this.stiffness * (distance - this.restLength);

        const fx = (dx / distance) * forceMagnitude;
        const fy = (dy / distance) * forceMagnitude;

        this.particleA.applyForce({ x: fx, y: fy });
        this.particleB.applyForce({ x: -fx, y: -fy });
    }
}
