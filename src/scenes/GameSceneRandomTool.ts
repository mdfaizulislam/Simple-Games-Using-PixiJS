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

import { Combination } from "js-combinatorics";
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
  private mCombs: Combination<string>;
  private mTotalCombs: number;
  constructor() {
    super();
    this.mLogger = new Logger("GameSceneReverseStack", false);
    this.mIsGameStopped = false;
    this.sortableChildren = true;
    this.mContainer = new Container();
    this.mContainer.sortableChildren = true;
    this.addChild(this.mContainer);
    let str = GameConfig.GAME_RANDOM_TOOL.PATTERN;
    this.mCombs = new Combination(str, 3);
    this.mTotalCombs = GameConfig.GAME_RANDOM_TOOL.TOTAL_COMBS;
    this.mLogger.Log("Pattern: " + str);
    this.mLogger.Log("Nth " + this.mCombs.nth(this.mTotalCombs));
    Math.pow(str.length, 3);
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
    this.generateRandomTool();
    setInterval(
      this.generateRandomTool.bind(this),
      GameConfig.GAME_RANDOM_TOOL.INTERVAL_MS
    );
  }

  generateRandomTool(): void {
    if (!AppController.visible) {
      return;
    }

    let minFontSize: number = GameConfig.GAME_RANDOM_TOOL.MIN_FONT_SIZE;
    let maxFontSize: number = GameConfig.GAME_RANDOM_TOOL.MAX_FONT_SIZE;
    this.mLogger.Log("font size, min: " + minFontSize + " max: " + maxFontSize);
    let randomFontSize: number = Helper.getRandomNumber(
      minFontSize,
      maxFontSize
    );
    let contents = this.getRandomContentArray();
    let randomTool = new RandomTool(randomFontSize, contents);
    // randomTool.scale.set(0.85, 0.85);
    let offset = 10;
    let posMinX = randomTool.width / 2 + offset;
    let posMaxX = AppController.width - randomTool.width / 2 - offset;
    let posMinY = randomTool.height / 2 + offset;
    let posMaxY = AppController.height - randomTool.height / 2 - offset;
    randomTool.position.set(
      Helper.getRandomNumber(posMinX, posMaxX),
      Helper.getRandomNumber(posMinY, posMaxY)
    );
    this.mContainer.addChild(randomTool);
  }

  getRandomContentArray(): any[] {
    let contents: any[] = [];

    // add two random pattern
    let pattern: string =
      this.mCombs.nth(Helper.getRandomInt(this.mTotalCombs)) +
      "," +
      this.mCombs.nth(Helper.getRandomInt(this.mTotalCombs));

    // split into array
    let patternArr = pattern.split(",");

    // choose content array length and pick content
    let totalItems: number = Helper.getRandomNumber(2, 5);
    for (let i = 0; i < totalItems; i++) {
      let num = Number(patternArr.at(i));
      contents.push(this.getRandomContent(num));
    }

    // return
    return contents;
  }

  getRandomContent(flag: number): any {
    let content: any;
    switch (flag) {
      case 1:
        // return string
        content = Helper.getRandomString(Helper.getRandomNumber(2, 5));
        break;
      case 2:
        // return sprite
        content = Sprite.from(this.getRandomEmojiName());
        break;
      case 3:
        // return texture
        content = new Sprite(
          Helper.getSpriteTexture(this.getRandomEmojiName())
        );
        break;
      default:
        // return sprite
        content = Sprite.from(this.getRandomEmojiName());
        break;
    }
    return content;
  }

  getRandomEmojiName(): string {
    return "emoji" + Helper.getRandomNumber(1, 10);
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
