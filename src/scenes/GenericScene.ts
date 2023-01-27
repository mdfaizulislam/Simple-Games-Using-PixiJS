import { Container, Text } from "pixijs";
import { Button } from "../components/Button";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";
import { IScene } from "../generic/IScene";
import { LobbyScene } from "./LobbyScene";

export class GenericScene extends Container implements IScene {
  private _name!: string;
  public mlabelTitle: Text | null = null;
  public mButton: Button | null = null;
  public mIsSceneStopped: boolean = false;
  public mTextFPS: Text | null = null;

  public set sceneName(_sceneName: string) {
    this._name = _sceneName;
  }
  public get sceneName(): string {
    return this._name;
  }

  constructor() {
    super();
    this.sceneName = "";
    this.sortableChildren = true;
  }

  protected addGameTitle(): void {
    this.mlabelTitle = Helper.getLabelWithBasicFont(this.sceneName);
    this.mlabelTitle.anchor.set(0.5, 0.5);
    let backButtonWidth: number = this.mButton ? this.mButton.width : 100;
    this.mlabelTitle.x = this.mlabelTitle.width / 2 + backButtonWidth;
    this.mlabelTitle.y = this.mlabelTitle.height / 2;
    this.addChild(this.mlabelTitle);
    this.mlabelTitle.zIndex = 100;
  }

  protected addBackButtonButton(): void {
    this.mButton = Button.createButton("buttonBack");
    this.mButton.setCallback(this.onBackButtonPress.bind(this));
    this.mButton.anchor.set(0.5, 0.5);
    this.mButton.scale.set(0.65, 0.65);
    this.mButton.x = this.mButton.width / 2;
    this.mButton.y = this.mButton.height / 2;
    this.mButton.setButtonText("Back");
    this.addChild(this.mButton);
    this.mButton.zIndex = 100;
  }

  protected onBackButtonPress(): void {
    this.mIsSceneStopped = true;
    AppController.changeScene(new LobbyScene());
  }

  public showFPS(): void {
    this.mTextFPS = Helper.getLabelWithBasicFont("FPS: ");
    this.mTextFPS.anchor.set(0.5, 0.5);
    this.mTextFPS.x = AppController.width - this.mTextFPS.width - 5;
    this.mTextFPS.y = this.mTextFPS.height / 2;
    this.addChild(this.mTextFPS);
    this.mTextFPS.zIndex = 100;
  }

  update(framesPassed: number): void {
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }
  }

  onEnable(): void {}

  onDisable(): void {}
  removeAll(): void {}

  /**
   * remove all listeners, childrens, stop all schedulers etc here;
   */
  public onDestry(): void {
    this.onDisable();
  }
}
