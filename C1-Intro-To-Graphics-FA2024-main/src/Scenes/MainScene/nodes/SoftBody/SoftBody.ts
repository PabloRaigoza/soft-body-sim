// need proper import and link to the compiler
import { Particle } from './Particle';
import { Spring } from './Spring';

export class SoftBody {
    particles: Particle[];
    springs: Spring[];

    constructor(numParticles: number, spacing: number) {
        this.particles = [];
        this.springs = [];

        // Create a grid of particles
        for (let i = 0; i < numParticles; i++) {
            for (let j = 0; j < numParticles; j++) {
                const particle = new Particle(i * spacing, j * spacing, 1);
                this.particles.push(particle);

                // Create springs to adjacent particles
                if (i < numParticles - 1) {
                    this.springs.push(new Spring(particle, this.particles[i + numParticles + j], spacing, 0.1));
                }
                if (j < numParticles - 1) {
                    this.springs.push(new Spring(particle, this.particles[i + numParticles + 1], spacing, 0.1));
                }
            }
        }
    }

    update() {
        // Update springs first
        for (const spring of this.springs) {
            spring.update();
        }

        // Update particles
        for (const particle of this.particles) {
            particle.update();
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        for (const spring of this.springs) {
            ctx.moveTo(spring.particleA.position.x, spring.particleA.position.y);
            ctx.lineTo(spring.particleB.position.x, spring.particleB.position.y);
        }
        ctx.stroke();
    }
}
