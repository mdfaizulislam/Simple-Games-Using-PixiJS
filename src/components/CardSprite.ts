/**
 * Title: CardSprite
 * Description: It will be used in stack swap game as a card
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import gsap from "gsap";
import { FederatedPointerEvent, Sprite, Texture, Ticker } from "pixijs";
import { Vector } from "vecti";
import { GameConfig } from "../configs/gameConfigs";
import { INode } from "../generic/INode";
import { Logger } from "../generic/Logger";

export class CardSprite extends Sprite implements INode {
  private _name: string = "";

  private mNewPositionOnStack: Vector = new Vector(0, 0);
  private mTicker: Ticker | null = null;
  private mLogger: Logger;
  private mNewZIndex: number;

  private mCardMoveCallback: Function | null = null;

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }
  constructor(spriteOrTexture: string | Texture) {
    super();
    if (typeof spriteOrTexture === "string" && spriteOrTexture.length > 0) {
      this.texture = Sprite.from(spriteOrTexture).texture;
    } else if (spriteOrTexture instanceof Texture) {
      this.texture = spriteOrTexture;
    } else {
      this.texture = Texture.WHITE;
    }
    this.mLogger = new Logger("Card", true);
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.mNewZIndex = this.zIndex;
    this.init();
  }

  public onEnable(): void {}

  public init(): void {
    // this.addTouchEvents();
  }

  setNewZIndex(index: number) {
    this.mNewZIndex = index;
  }

  startSwitchStack(newPositionOnStack: Vector, callback: Function): void {
    this.mNewPositionOnStack = newPositionOnStack;
    this.mCardMoveCallback = callback;
    this.switchStack();
  }

  switchStack() {
    let tween = gsap.to(this, {
      x: this.mNewPositionOnStack.x,
      y: this.mNewPositionOnStack.y,
      duration: GameConfig.GAME_REVERSE_STACK_CONFIGS.CARD_MOVE_DURATION,
    });
    tween.eventCallback("onComplete", this.onSwitchStackEnd.bind(this));
    setTimeout(() => {
      this.zIndex = this.mNewZIndex;
    }, (GameConfig.GAME_REVERSE_STACK_CONFIGS.CARD_MOVE_DURATION * 1000) / 3);
  }

  onSwitchStackEnd(): void {
    this.mLogger.genericLog("onSwitchStackEnd");
    this.mTicker?.remove(this.switchStack, this);
    if (this.mCardMoveCallback) {
      this.mCardMoveCallback(this);
      this.mCardMoveCallback = null;
    }
  }

  /**
   * .on(...): Adds an event listener.
   * .once(...): Adds an event listener that will remove itself after it gets called once.
   * .off(...): Removes an event listener. (Tricky to use if you use .bind!)
   * .emit(...): Emits an event, all listeners for that event will get called.
   * .removeAllListeners(): Removes all event listeners.
   */
  public addTouchEvents(): void {
    this.on("pointerdown", this.onTouchBegin, this);
    this.on("pointermove", this.onTouchMove, this);
    this.on("pointerup", this.onTouchEnd, this);
    // this.on("pointerupoutside", this.onTouchEnd, this);
    this.interactive = true;
  }

  private onTouchBegin(e: FederatedPointerEvent): void {
    console.log("onTouchBegin You interacted with Clampy!", e);
    this.alpha = 0.5;
  }

  private onTouchMove(e: FederatedPointerEvent): void {
    this.parent.toLocal(e.global, undefined, this.position);
  }

  private onTouchEnd(e: FederatedPointerEvent): void {
    console.log("onTouchEnd You interacted with Clampy!", e);
    this.alpha = 1.0;
  }

  public removeTouchEvents(): void {
    this.off("pointerdown", this.onTouchBegin, this);
    this.off("pointerup", this.onTouchEnd, this);
    this.off("pointermove", this.onTouchMove, this);
    this.off("pointerupoutside", this.onTouchEnd, this);

    this.interactive = false;
  }

  public onDestry(): void {
    // this.removeTouchEvents();
  }
  public removeAllChildren(): void {
    this.onDestry();
    this.children.forEach((child) => {
      child.removeFromParent();
      child.destroy();
    });
  }

  public update(framesPassed: number): void {
    framesPassed;
  }

  onDisable(): void {}
}
