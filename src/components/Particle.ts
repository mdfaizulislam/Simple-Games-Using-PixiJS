import { Sprite, Texture } from "pixijs";
import { Vector } from "vecti";
import { GameConfig } from "../configs/gameConfigs";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";

export class Particle extends Sprite {
  //   private mTexture: Texture;
  //   private mSprite: Sprite;
  //   private mScale: number;
  private mVelocity: Vector;
  private mExplodeHeight: number;
  private mToExplode: boolean = false;
  private mExploded: boolean = false;
  private mFade: boolean = false;
  private mExplodeCallback: Function | null = null;
  constructor(spriteOrTexture: string | Texture) {
    super();
    // this.mTexture = texture;
    this.texture = Helper.getSpriteTexture(spriteOrTexture);
    // this.mSprite = new Sprite(this.mTexture);
    // this.mScale = scale;
    // this.mSprite.scale.set(this.mScale, this.mScale);
    this.mVelocity = new Vector(0, 0);
    this.mExplodeHeight = 0.4 + Math.random() * 0.5;
  }

  reset(texture: Texture, scale: number) {
    this.alpha = 1;
    this.texture = texture;
    this.scale.set(scale, scale);
    this.mVelocity = new Vector(0, 0);
    this.mToExplode = false;
    this.mExploded = false;
    this.mFade = false;
  }

  setFade(isFade: boolean) {
    this.mFade = isFade;
  }

  setPosition(pos: Vector) {
    this.position.set(pos.x, pos.y);
  }

  setVelocity(velocity: Vector) {
    this.mVelocity = velocity;
  }

  setToExplode(isToExplode: boolean) {
    this.mToExplode = isToExplode;
  }

  setExplodeCallback(callback: Function) {
    this.mExplodeCallback = callback;
  }

  update() {
    if (!AppController.visible) {
      return;
    }
    this.position.x += this.mVelocity.x;
    this.position.y += this.mVelocity.y;
    this.mVelocity.add(new Vector(0, GameConfig.GAME_PARTICLES.GRAVITY));
    if (this.mToExplode && !this.mExploded) {
      // explode
      if (this.position.y < AppController.height * this.mExplodeHeight) {
        this.alpha = 0;
        this.mExploded = true;
        if (this.mExplodeCallback) {
          this.mExplodeCallback(
            new Vector(this.position.x, this.position.y),
            this.texture,
            this.scale.x
          );
        }
      }
    }

    if (this.mFade) {
      this.alpha -= 0.01;
    }
  }
}
