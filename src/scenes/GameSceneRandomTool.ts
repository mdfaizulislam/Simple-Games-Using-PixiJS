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

import { Container, Text } from "pixijs";
import { Button } from "../components/Button";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";
import { IScene } from "../generic/IScene";
import { Logger } from "../generic/Logger";
import { LobbyScene } from "./lobbyScene";

export class GameSceneRandomTool extends Container implements IScene {
  private mLogger: Logger;
  private mlabelTitle: Text | null = null;
  private mTextFPS: Text | null = null;
  private mIsGameStopped: boolean;
  private mContainer: Container;
  constructor() {
    super();
    this.mLogger = new Logger("GameSceneReverseStack", true);
    this.mIsGameStopped = false;
    this.sortableChildren = true;
    this.mContainer = new Container();
    this.mContainer.sortableChildren = true;
    this.addChild(this.mContainer);

    this.init();
  }

  public onEnable(): void {
    // GameController.getInstance().onGameSceneLoadComplete();
  }

  private init() {
    this.addGameTitle();
    this.addBackButtonButton();
    this.showFPS();
  }

  private addGameTitle(): void {
    this.mLogger.genericLog("addGameTitle");
    this.mlabelTitle = Helper.getLabelWithBasicFont("Random Tool");
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

  update(framesPassed: number): void {
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }
  }

  public get name() {
    return "GameScene";
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
