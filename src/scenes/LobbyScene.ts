/**
 * Title: Lobby Scene
 * Description: Lobby Scene
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

// depenedencies
import { Container, Text } from "pixijs";
import { Button } from "../components/Button";
import { Constants } from "../constants";
import { AppController } from "../controllers/AppController";
import { GameController } from "../controllers/GameController";
import { SoundController } from "../controllers/SoundController";
import { Helper } from "../generic/Helper";
import { IScene } from "../generic/IScene";
import { Logger } from "../generic/Logger";
import { GameSceneReverseStack } from "./GameSceneReverseStack";

export class LobbyScene extends Container implements IScene {
  private mLogger: Logger;
  private mLobbyButtons: Button[] = [];
  private mTextFPS: Text | null = null;
  constructor() {
    super(); // Mandatory! This calls the superclass constructor.
    this.mLogger = new Logger("LobbyScene", true);
    this.init();
  }

  public onEnable(): void {}

  private init() {
    SoundController.getInstance().playBackgroundMusic();
    this.addLobbyTitle();
    this.addLobbyButtons();
    this.showFPS();
  }

  private addLobbyTitle(): void {
    let labelTitle: Text = Helper.getLabelWithBasicFont("LobbyScene");
    labelTitle.anchor.set(0.5, 0.5);
    labelTitle.x = AppController.width / 2;
    labelTitle.y = labelTitle.height / 2;
    this.addChild(labelTitle);
  }

  private addLobbyButtons(): void {
    let totalGames: number = Object.keys(Constants.GAME_IDS).length;
    this.mLogger.Log("Total Games: " + totalGames);
    for (let i = totalGames - 1; i > -1; i -= 1) {
      let gameid = Constants.GAME_IDS[totalGames - i - 1];
      this.mLogger.Log("Game id: " + gameid);
      let button: Button = Button.createButton(
        "buttonGreenNormal",
        "buttonGreenPressed",
        "buttonGreenHover",
        "buttonGreenDisabled"
      );
      button.name = gameid;
      button.anchor.set(0.5, 0.5);
      button.x = AppController.width / 2;
      button.y = AppController.height - (i + 1) * (button.height + 50);
      button.setButtonText(gameid);
      button.setCallback(this.onGameButtonPress.bind(this));
      this.addChild(button);
      this.mLobbyButtons.push(button);
    }
  }

  onGameButtonPress(gameId: string): void {
    this.mLogger.Log("onLobbyButtonPress: " + gameId);
    // buttonRef.setCallback(null);
    Constants.GAME_IDS;
    if (gameId == Constants.GAME_IDS[0]) {
      this.playChallengeOne();
    } else if (gameId == Constants.GAME_IDS[1]) {
      this.playChallengeTwo();
    } else if (gameId == Constants.GAME_IDS[2]) {
      this.playChallengeThree();
    } else {
      this.mLogger.Log(
        "something went wrong on lobby game button press, gameId: " + gameId,
        2
      );
    }
  }

  public playChallengeOne(): void {
    let gameScene = new GameSceneReverseStack();
    GameController.getInstance().setGameScene(gameScene);
    AppController.changeScene(gameScene);
  }

  public playChallengeTwo(): void {}

  public playChallengeThree(): void {}

  public update(framesPassed: number): void {
    framesPassed;
    if (this.mTextFPS) {
      this.mTextFPS.text =
        "FPS: " + AppController.getApp().ticker.FPS.toFixed(2);
    }
  }

  public get name() {
    return "LobbyScene";
  }

  public showFPS(): void {
    // ticker.shared.FPS
    this.mTextFPS = Helper.getLabelWithBasicFont("FPS: ");
    this.mTextFPS.anchor.set(0.5, 0.5);
    this.mTextFPS.x = AppController.width - this.mTextFPS.width - 20;
    this.mTextFPS.y = this.mTextFPS.height / 2;
    this.addChild(this.mTextFPS);
    this.mTextFPS.zIndex = 100;
  }

  public onDestry(): void {
    this.removeAllListeners();
    this.removeAllChildren();
  }
  public removeAllChildren(): void {
    console.log("LobbyScene: ", this.removeChild());
    this.mTextFPS?.removeFromParent();
    this.children.forEach((child) => {
      if (child) {
        child.removeFromParent();
      }
    });
  }
}
