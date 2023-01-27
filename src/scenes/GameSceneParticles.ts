/**
 * Title: Particles - Awesome Fire Tool
 * Description: open challenge there. Particles - make a demo that shows an awesome fire effect. Please keep
 * number of images low (max 10 sprites on screen at once). Feel free to use existing libraries how you would
 *  use them in a real project.
 *
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { Texture } from "pixijs";
import { Vector } from "vecti";
import { Particle } from "../components/Particle";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";
import { Logger } from "../generic/Logger";
import { GenericScene } from "./GenericScene";

export class GameSceneParticles extends GenericScene {
  private mLogger: Logger;
  private mTextures: Texture[] = [];
  private mParticles: Particle[] = [];
  private mCurrentTexture: number;
  constructor() {
    super();
    this.mLogger = new Logger("GameSceneParticles", true);
    this.sceneName = "Particles";
    this.mCurrentTexture = 0;
    this.init();
  }

  public onEnable(): void {}

  private init() {
    this.addBackButtonButton();
    this.addGameTitle();
    this.showFPS();

    this.initTextures();
    this.launchParticle();

    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange.bind(this)
    );
  }

  initTextures(): void {
    for (let i = 1; i < 11; i++) {
      this.mTextures.push(Helper.getSpriteTexture("emoji" + i));
    }
  }

  getParticle(texture: Texture, scale: number): Particle {
    // get the first particle that has been used
    let particle: Particle | null = null;
    // check for a used particle (alpha <= 0)
    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      if (this.mParticles[i].alpha <= 0) {
        particle = this.mParticles[i];
        break;
      }
    }
    // update characteristics of particle
    if (particle) {
      particle.reset(texture, scale);
      return particle;
    }

    // otherwise create a new particle
    particle = new Particle(texture);
    this.mParticles.push(particle);
    particle.setExplodeCallback(this.explode.bind(this));
    this.addChild(particle);
    return particle;
  }

  explode(position: Vector, texture: Texture, scale: number): void {
    const steps = 8 + Math.round(Math.random() * 6);
    const radius = 2 + Math.random() * 4;
    for (let i = 0; i < steps; i++) {
      // get velocity
      const x = radius * Math.cos((2 * Math.PI * i) / steps);
      const y = radius * Math.sin((2 * Math.PI * i) / steps);
      // add particle
      const particle = this.getParticle(texture, scale);
      particle.setFade(true);
      particle.setPosition(position);
      particle.setVelocity(new Vector(x, y));
    }
  }

  launchParticle(): void {
    const particle = this.getParticle(
      this.mTextures[this.mCurrentTexture],
      Math.random() * 0.5
    );

    // update current texture flag
    this.mCurrentTexture++;
    if (this.mCurrentTexture > 9) this.mCurrentTexture = 0;

    // set particle position
    particle.setPosition(
      new Vector(Math.random() * AppController.width, AppController.height)
    );

    // set particle velocity
    const speed = AppController.height * 0.01;
    particle.setVelocity(
      new Vector(
        -speed / 2 + Math.random() * speed,
        -speed + Math.random() * -1
      )
    );

    // update particle as explodable
    particle.setToExplode(true);

    // now launch a new particle after some delay
    if (!this.mIsSceneStopped && AppController.visible) {
      setTimeout(() => {
        this.launchParticle();
      }, 200 + Math.random() * 600);
    }
  }

  override update(framesPassed: number): void {
    if (!AppController.visible) {
      return;
    }
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }

    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      this.mParticles[i].update();
    }
  }

  private onVisibilityChange(): void {
    const isVisible = !document.hidden;
    this.mLogger.Log("GameVisibility: " + (isVisible ? "yes" : "no"));
    this.launchParticle();
  }

  onDisable(): void {
    this.mIsSceneStopped = true;
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.removeAll();
  }

  public removeAll(): void {
    this.removeChild();
    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      if (this.mParticles[i]) {
        this.mParticles[i].removeFromParent();
      }
    }
    this.mParticles.length = 0;
    this.mlabelTitle?.removeFromParent();
    this.mButton?.removeFromParent();
    this.children.forEach((value) => {
      if (value) {
        value.removeFromParent();
      }
    });
  }
}
