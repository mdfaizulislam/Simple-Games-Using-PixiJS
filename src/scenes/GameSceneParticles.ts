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

  public onEnable(): void {
    // GameController.getInstance().onGameSceneLoadComplete();
  }

  private init() {
    this.addGameTitle();
    this.addBackButtonButton();
    this.showFPS();

    this.initTextures();
    this.launchParticle();
    // this.loop();

    // this.addParticles();
  }

  private addGameTitle(): void {
    this.mLogger.genericLog("addGameTitle");
    this.mlabelTitle = Helper.getLabelWithBasicFont("Particles");
    this.mlabelTitle.anchor.set(0.5, 0.5);
    this.mlabelTitle.x = AppController.width / 2;
    this.mlabelTitle.y = this.mlabelTitle.height / 2;
    this.addChild(this.mlabelTitle);
  }

  private addBackButtonButton(): void {
    let button: Button = Button.createButton("buttonBack");
    button.setCallback(this.onBackButtonPress.bind(this));
    button.anchor.set(0.5, 0.5);
    button.scale.set(0.65, 0.65);
    button.x = button.width / 2;
    button.y = button.height / 2;
    button.setButtonText("Back");
    this.addChild(button);
  }

  private onBackButtonPress(): void {
    this.mLogger.Log("onbackButtonPress");
    this.mIsGameStopped = true;
    AppController.changeScene(new LobbyScene());
  }

  async initTextures(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      this.mTextures.push(
        await Texture.fromURL(
          `https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-${i}.png?123`
        )
      );
    }
  }

  getParticle(texture: Texture, scale: number): Particle {
    // get the first particle that has been used
    let particle: Particle | null = null;
    // check for a used particle (alpha <= 0)
    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      if (this.mParticles[i].getSprite().alpha <= 0) {
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
    particle = new Particle(texture, scale);
    this.mParticles.push(particle);
    this.mContainer.addChild(particle.getSprite());
    return particle;
  }

  explode = (position: Vector, texture: Texture, scale: number) => {
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
  };

  launchParticle(): void {
    const particle = this.getParticle(
      this.mTextures[this.mCurrentTexture],
      Math.random() * 0.5
    );
    this.mCurrentTexture++;
    if (this.mCurrentTexture > 9) this.mCurrentTexture = 0;
    particle.setPosition(
      new Vector(Math.random() * AppController.width, AppController.height)
    );
    const speed = AppController.height * 0.01;
    particle.setVelocity(
      new Vector(
        -speed / 2 + Math.random() * speed,
        -speed + Math.random() * -1
      )
    );
    particle.setToExplode(true);

    // launch a new particle
    // setTimeout(this.launchParticle, 200 + Math.random() * 600);
    if (!this.mIsGameStopped) {
      setTimeout(() => {
        this.launchParticle();
      }, 200 + Math.random() * 600);
    }
  }

  // loop(): void {
  //   requestAnimationFrame(this.loop.bind(this));
  //   for (let i = 0, l = this.mParticles.length; i < l; i++) {
  //     this.mParticles[i].update();
  //   }
  //   AppController.getApp().renderer.render(this.mContainer);
  // }

  update(framesPassed: number): void {
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }

    for (let i = 0, l = this.mParticles.length; i < l; i++) {
      this.mParticles[i].update();
    }
  }

  public get name() {
    return "GameSceneParticles";
  }

  public showFPS(): void {
    this.mTextFPS = Helper.getLabelWithBasicFont("FPS: ");
    this.mTextFPS.anchor.set(0.5, 0.5);
    this.mTextFPS.x = AppController.width - this.mTextFPS.width - 20;
    this.mTextFPS.y = this.mTextFPS.height / 2;
    this.addChild(this.mTextFPS);
    this.mTextFPS.zIndex = 100;
  }

  public onDestry(): void {
    this.mIsGameStopped = true;
    this.mIsGameStopped;
    this.removeAllListeners();
    this.removeAllChildren();
  }
  public removeAllChildren(): void {
    this.removeChild();
    this.mlabelTitle?.removeFromParent();
    this.children.forEach((value) => {
      if (value) {
        value.removeFromParent();
      }
    });
  }
}
