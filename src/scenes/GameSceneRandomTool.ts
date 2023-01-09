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

import { Container, Sprite, Text } from "pixijs";
import { Button } from "../components/Button";
import { RandomTool } from "../components/RandomTool";
import { GameConfig } from "../configs/gameConfigs";
import { AppController } from "../controllers/AppController";
import { Helper } from "../generic/Helper";
import { IScene } from "../generic/IScene";
import { Logger } from "../generic/Logger";
import { LobbyScene } from "./lobbyScene";

export class GameSceneRandomTool extends Container implements IScene {
  private mLogger: Logger;
  private mlabelTitle: Text | null = null;
  private mButton: Button | null = null;
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
    this.addBackButtonButton();
    this.addGameTitle();
    this.showFPS();

    this.startShowingRandomContent();
  }

  private addGameTitle(): void {
    this.mLogger.genericLog("addGameTitle");
    this.mlabelTitle = Helper.getLabelWithBasicFont("Random Tool");
    this.mlabelTitle.anchor.set(0.5, 0.5);
    let backButtonWidth: number = this.mButton ? this.mButton.width : 100;
    this.mlabelTitle.x = this.mlabelTitle.width / 2 + backButtonWidth + 20;
    this.mlabelTitle.y = this.mlabelTitle.height / 2;
    this.mContainer.addChild(this.mlabelTitle);
    this.mlabelTitle.zIndex = 100;
  }

  private addBackButtonButton(): void {
    this.mButton = Button.createButton("buttonBack");
    this.mButton.setCallback(this.onBackButtonPress.bind(this));
    this.mButton.anchor.set(0.5, 0.5);
    this.mButton.scale.set(0.65, 0.65);
    this.mButton.x = this.mButton.width / 2;
    this.mButton.y = this.mButton.height / 2;
    this.mButton.setButtonText("Back");
    this.mContainer.addChild(this.mButton);
    this.mButton.zIndex = 100;
  }

  private onBackButtonPress(): void {
    this.mLogger.Log("onbackButtonPress");
    this.mIsGameStopped = true;
    AppController.changeScene(new LobbyScene());
  }

  startShowingRandomContent(): void {
    setInterval(
      this.generateRandomTool.bind(this),
      GameConfig.GAME_RANDOM_TOOL.INTERVAL_MS
    );
  }

  generateRandomTool(): void {
    if (!AppController.visible) {
      return;
    }
    let contents: any[] = [];
    contents.push("Hello World");
    contents.push(Sprite.from(this.getRandomEmojiName()));
    contents.push(Helper.getSpriteTexture(this.getRandomEmojiName()));
    let randomTool = new RandomTool(contents);
    randomTool.position.set(
      AppController.width * Math.random(),
      AppController.height * Math.random()
    );
    this.mContainer.addChild(randomTool);
  }

  getRandomEmojiName(): string {
    return "emoji" + (Math.floor(Math.random() * 9) + 1);
  }

  update(framesPassed: number): void {
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }
  }

  public get name() {
    return "Random Tool";
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
