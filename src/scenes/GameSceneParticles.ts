/**
 * Title: Random Tool
 * Description: technical challenge random tool, it is  a tool that will allow mixed text and images in an easy way (for example * displaying text with emoticons or prices with money icon). It should come up every 2 seconds a random text with images in
 * random configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random
 * font size.
 *
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { Container, Text, Texture } from "pixijs";
import { Vector } from "vecti";
import { Button } from "../components/Button";
import { Particle } from "../components/Particle";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";
import { IScene } from "../generic/IScene";
import { Logger } from "../generic/Logger";
import { LobbyScene } from "./lobbyScene";

export class GameSceneParticles extends Container implements IScene {
  private mLogger: Logger;
  private mlabelTitle: Text | null = null;
  private mTextFPS: Text | null = null;
  private mIsGameStopped: boolean;
  private mContainer: Container;
  private mTextures: Texture[] = [];
  private mParticles: Particle[] = [];
  private mCurrentTexture: number;
  constructor() {
    super();
    this.mLogger = new Logger("GameSceneParticles", true);
    this.mIsGameStopped = false;
    this.sortableChildren = true;
    this.mContainer = new Container();
    this.mContainer.sortableChildren = true;
    this.addChild(this.mContainer);
    this.mCurrentTexture = 0;

    this.init();
  }

  public onEnable(): void {}

  private init() {
    this.addGameTitle();
    this.addBackButtonButton();
    this.showFPS();

    this.initTextures();
    this.launchParticle();

    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange.bind(this)
    );
  }

  private addGameTitle(): void {
    this.mLogger.genericLog("addGameTitle");
    this.mlabelTitle = Helper.getLabelWithBasicFont("Particles");
    this.mlabelTitle.anchor.set(0.5, 0.5);
    this.mlabelTitle.x = AppController.width / 2;
    this.mlabelTitle.y = this.mlabelTitle.height / 2;
    this.mContainer.addChild(this.mlabelTitle);
  }

  private addBackButtonButton(): void {
    let button: Button = Button.createButton("buttonBack");
    button.setCallback(this.onBackButtonPress.bind(this));
    button.anchor.set(0.5, 0.5);
    button.scale.set(0.65, 0.65);
    button.x = button.width / 2;
    button.y = button.height / 2;
    button.setButtonText("Back");
    this.mContainer.addChild(button);
    button.sortableChildren = true;
    button.zIndex = 100;
  }

  private onBackButtonPress(): void {
    this.mLogger.Log("onbackButtonPress");
    this.mIsGameStopped = true;
    AppController.changeScene(new LobbyScene());
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
    this.mContainer.addChild(particle);
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
    if (!this.mIsGameStopped && AppController.visible) {
      setTimeout(() => {
        this.launchParticle();
      }, 200 + Math.random() * 600);
    }
  }

  update(framesPassed: number): void {
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

  public get name() {
    return "GameSceneParticles";
  }

  public showFPS(): void {
    this.mTextFPS = Helper.getLabelWithBasicFont("FPS: ");
    this.mTextFPS.anchor.set(0.5, 0.5);
    this.mTextFPS.x = AppController.width - this.mTextFPS.width - 20;
    this.mTextFPS.y = this.mTextFPS.height / 2;
    this.mContainer.addChild(this.mTextFPS);
    this.mTextFPS.zIndex = 100;
  }

  public onDestry(): void {
    this.mIsGameStopped = true;
    this.mIsGameStopped;
    this.removeAllListeners();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.removeAllChildren();
  }
  public removeAllChildren(): void {
    this.removeChild();
    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      if (this.mParticles[i]) {
        this.mParticles[i].removeFromParent();
      }
    }
    this.mContainer.removeChild();
    this.mContainer.removeFromParent();
    this.mParticles.length = 0;
    this.mlabelTitle?.removeFromParent();
    this.children.forEach((value) => {
      if (value) {
        value.removeFromParent();
      }
    });
  }
}
