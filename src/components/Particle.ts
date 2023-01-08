import { Container, Sprite, Texture } from "pixijs";
import { Vector } from "vecti";
import { GameConfig } from "../configs/gameConfigs";
import { AppController } from "../controllers/AppController";

export class Particle extends Container {
  private mTexture: Texture;
  private mSprite: Sprite;
  private mScale: number;
  private mVelocity: Vector;
  private mExplodeHeight: number;
  private mToExplode: boolean = false;
  private mExploded: boolean = false;
  private mFade: boolean = false;
  constructor(texture: Texture, scale: number) {
    super();
    this.mTexture = texture;
    this.mSprite = new Sprite(this.mTexture);
    this.mScale = scale;
    this.mSprite.scale.set(this.mScale, this.mScale);
    this.mVelocity = new Vector(0, 0);
    this.mExplodeHeight = 0.4 + Math.random() * 0.5;
  }

  reset(texture: Texture, scale: number) {
    this.mSprite.alpha = 1;
    this.mSprite.scale.x = scale;
    this.mSprite.scale.y = scale;
    this.mSprite.texture = texture;
    this.mVelocity = new Vector(0, 0);
    this.mToExplode = false;
    this.mExploded = false;
    this.mFade = false;
  }

  getSprite(): Sprite {
    return this.mSprite;
  }

  setFade(isFade: boolean) {
    this.mFade = isFade;
  }

  setPosition(pos: Vector) {
    this.mSprite.position.x = pos.x;
    this.mSprite.position.y = pos.y;
  }

  setVelocity(velocity: Vector) {
    this.mVelocity = velocity;
  }

  setToExplode(isToExplode: boolean) {
    this.mToExplode = isToExplode;
  }

  update() {
    this.mSprite.position.x += this.mVelocity.x;
    this.mSprite.position.y += this.mVelocity.y;
    //   this.mVelocity.y += GameConfig.GAME_PARTICLES.GRAVITY; //gravity;
    this.mVelocity.add(new Vector(0, GameConfig.GAME_PARTICLES.GRAVITY));
    if (this.mToExplode && !this.mExploded) {
      // explode
      if (
        this.mSprite.position.y <
        AppController.height * this.mExplodeHeight
      ) {
        this.mSprite.alpha = 0;
        this.mExploded = true;
        // explode(
        //   this.mSprite.position,
        //   this.mSprite.texture,
        //   this.mSprite.scale.x
        // );
      }
    }

    if (this.mFade) {
      this.mSprite.alpha -= 0.01;
    }
  }
}
