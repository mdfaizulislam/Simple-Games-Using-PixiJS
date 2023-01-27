/**
 * Title: Button class
 * Description: Button
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */
import { FederatedPointerEvent, Sprite, Text, Texture } from "pixijs";
import { Helper } from "../generic/Helper";
import { INode } from "../generic/INode";
import { Logger } from "../generic/Logger";

export class Button extends Sprite implements INode {
  public static createButton(
    normalSpriteOrTexture: string | Texture,
    pressedSpriteOrTexture?: string | Texture,
    hoverSpriteOrTexture?: string | Texture,
    disabledSpriteOrTexture?: string | Texture
  ): Button {
    const button: Button = new Button();
    button.constructorWithAssets(
      normalSpriteOrTexture,
      pressedSpriteOrTexture,
      hoverSpriteOrTexture,
      disabledSpriteOrTexture
    );
    return button;
  }

  private mButtonNormalTexture: Texture;
  private mButtonPressedTexture: Texture;
  private mButtonDisabledTexture: Texture;
  private mButtonHoverTexture: Texture;

  private mButtonDisabled: boolean = false;
  private mIsDown: boolean = false;
  private mIsHover: boolean = false;
  private mIsHoverEnabled: boolean = true;
  protected mLogger: Logger;
  private mCallback: Function | null = null;
  private _name: string = "";
  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }
  private mbuttonText: Text | null = null;
  constructor() {
    super();
    this.texture = Texture.WHITE;
    this.mButtonNormalTexture = this.texture;
    this.mButtonPressedTexture = this.texture;
    this.mButtonDisabledTexture = this.texture;
    this.mButtonHoverTexture = this.texture;

    this.mLogger = new Logger("Button", true);
  }

  private constructorWithAssets(
    normalSpriteOrTexture: string | Texture,
    pressedSpriteOrTexture?: string | Texture,
    hoverSpriteOrTexture?: string | Texture,
    disabledSpriteOrTexture?: string | Texture
  ): void {
    if (!pressedSpriteOrTexture) {
      pressedSpriteOrTexture = normalSpriteOrTexture;
    }
    if (!hoverSpriteOrTexture) {
      hoverSpriteOrTexture = normalSpriteOrTexture;
    }
    if (!disabledSpriteOrTexture) {
      disabledSpriteOrTexture = normalSpriteOrTexture;
    }
    this.mButtonNormalTexture = Helper.getSpriteTexture(normalSpriteOrTexture);
    this.mButtonPressedTexture = Helper.getSpriteTexture(
      pressedSpriteOrTexture
    );
    this.mButtonHoverTexture = Helper.getSpriteTexture(hoverSpriteOrTexture);
    this.mButtonDisabledTexture = Helper.getSpriteTexture(
      disabledSpriteOrTexture
    );

    this.onButtonDisablilityChange();
    this.init();
  }

  public setButtonText(message: string): void {
    if (!this.mbuttonText) {
      this.mbuttonText = Helper.getLabelWithBasicFont(message);
      this.mbuttonText.anchor.set(0.5, 0.5);
      this.mbuttonText.x = 0;
      this.mbuttonText.y = 0;
      this.addChild(this.mbuttonText);
      return;
    }

    this.mbuttonText.text = message;
  }

  public setCallback(callback: Function | null) {
    this.mCallback = callback;
  }

  public onEnable(): void {}

  private init(): void {
    this.width = this.mButtonNormalTexture.width;
    this.height = this.mButtonNormalTexture.height;
    this.addTouchEvents();
  }

  private onButtonDisablilityChange() {
    this.texture = this.mButtonDisabled
      ? this.mButtonDisabledTexture
      : this.mButtonNormalTexture;
  }

  public setButtonStatus(isDisabled: boolean) {
    this.mButtonDisabled = isDisabled;
    this.onButtonDisablilityChange();
  }

  /**
   * .on(...): Adds an event listener.
   * .once(...): Adds an event listener that will remove itself after it gets called once.
   * .off(...): Removes an event listener. (Tricky to use if you use .bind!)
   * .emit(...): Emits an event, all listeners for that event will get called.
   * .removeAllListeners(): Removes all event listeners.
   */
  private addTouchEvents(): void {
    // events that begin with "pointer" are touch + mouse
    // this.on("pointertap", this.onTap, this);
    this.on("pointerover", this.onButtonHoverStart, this)
      .on("pointerout", this.onButtonHoverEnd, this)
      .on("pointerdown", this.onButtonDown, this)
      .on("pointerup", this.onButtonUp, this)
      .on("pointerupoutside", this.onButtonUp, this);

    this.interactive = true;
    this.cursor = "pointer";
  }

  //   private onTap(e: FederatedPointerEvent): void {
  //     console.log("You interacted with Button!");
  //     console.log("The data of your interaction is super interesting", e);
  //   }

  protected onButtonDown(e: FederatedPointerEvent): void {
    this.mLogger.genericLog("onButtonDown: ", e);
    if (this.mButtonDisabled) return;

    this.mIsDown = true;
    this.mIsHover = false;
    this.texture = this.mButtonPressedTexture;
    // this.alpha = 1;
  }

  protected onButtonUp(e: FederatedPointerEvent): void {
    this.mLogger.genericLog("onButtonUp: ", e);
    if (this.mButtonDisabled) return;

    this.mIsDown = false;
    if (this.mIsHover && this.mIsHoverEnabled) {
      // this.mLogger.Log("onButtonUp -> settingHover");
      // this.texture = this.mButtonHoverTexture;
      this.texture = this.mButtonNormalTexture;
    } else {
      this.texture = this.mButtonNormalTexture;
      if (this.mCallback) {
        // this.mLogger.Log("Pressing button");
        this.mCallback(this.name);
      } else {
        this.mLogger.Log("callback is not set", 2);
      }
    }
  }

  protected onButtonHoverStart(e: FederatedPointerEvent): void {
    this.mLogger.genericLog("onButtonHoverStart: ", e);
    this.mLogger.Log("onButtonHoverStart");
    if (this.mButtonDisabled) return;

    if (this.mIsHoverEnabled) {
      if (this.mIsDown) {
        return;
      }
      this.mIsHover = true;
      this.texture = this.mButtonHoverTexture;
      this.mLogger.Log("onButtonHoverStart -> settingHover");
    }
  }

  protected onButtonHoverEnd(e: FederatedPointerEvent): void {
    this.mLogger.genericLog("onButtonHoverEnd: ", e);
    this.mLogger.Log("onButtonHoverEnd");
    if (this.mButtonDisabled) return;
    if (this.mIsHoverEnabled) {
      if (this.mIsDown) {
        return;
      }
      this.mIsHover = false;
      this.texture = this.mButtonNormalTexture;
    }
  }

  removeTouchEvents(): void {
    // this.off("pointertap", this.onTap, this);
    this.off("pointerdown", this.onButtonDown, this)
      .off("pointerup", this.onButtonUp, this)
      .off("pointerupoutside", this.onButtonUp, this)
      .off("pointerover", this.onButtonHoverStart, this)
      .off("pointerout", this.onButtonHoverEnd, this);

    this.interactive = false;
    this.removeAllListeners();
  }

  public onDestry(): void {
    this.removeTouchEvents();
  }
  public removeAllChildren(): void {
    this.onDestry();
    this.mbuttonText?.removeFromParent();
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
