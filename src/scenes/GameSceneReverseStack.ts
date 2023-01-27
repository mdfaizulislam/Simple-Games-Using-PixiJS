/**
 * Title: Game Scene
 * Description: Game Scene
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { Container } from "pixijs";
import { Vector } from "vecti";
import { CardSprite } from "../components/CardSprite";
import { GameConfig } from "../configs/gameConfigs";
import { AppController } from "../controllers/AppController";
import { Logger } from "../generic/Logger";
import { GenericScene } from "./GenericScene";

export class GameSceneReverseStack extends GenericScene {
  private mLogger: Logger;
  private mLeftStackCards: CardSprite[] = [];
  private mRightStackCards: CardSprite[] = [];
  private mStackPositions: Vector[] = [];
  private mCardSize: Vector;
  private mIsProcessingLeftStack: boolean;
  private mCurrentCardZIndex: number;
  private mContainer: Container;
  constructor() {
    super();
    this.sceneName = "ReverseStack";
    this.mLogger = new Logger("GameSceneReverseStack", true);
    this.mCardSize = new Vector(
      CardSprite.from("card").width,
      CardSprite.from("card").height
    );
    this.mContainer = new Container();
    this.mContainer.sortableChildren = true;
    this.addChild(this.mContainer);
    this.mIsProcessingLeftStack = false;
    this.mIsSceneStopped = false;
    this.mCurrentCardZIndex = 0;
    this.sortableChildren = true;
    this.init();
  }

  public init() {
    this.addBackButtonButton();
    this.addGameTitle();
    this.showFPS();

    this.mStackPositions.push(
      new Vector(
        AppController.width / 3,
        AppController.height - CardSprite.from("card").height / 2 - 5
      )
    );
    this.mStackPositions.push(
      new Vector(
        (2 * AppController.width) / 3,
        AppController.height - CardSprite.from("card").height / 2 - 5
      )
    );

    this.addCardStack();
    this.mIsProcessingLeftStack = this.getStackCurrentSize(true) != 0;
    this.startGame();
  }

  public getCardSize(): Vector {
    return this.mCardSize;
  }

  public addCardStack(callback?: Function): void {
    let totalCard: number = GameConfig.GAME_REVERSE_STACK_CONFIGS.TOTAL_CARDS;
    // this.mLogger.Log("TotalCards: " + totalCard);
    for (let i = 0; i < totalCard; i += 1) {
      let card: CardSprite = new CardSprite("card");
      card.anchor.set(0.5, 0.5);
      card.position.set(
        this.mStackPositions[0].x,
        this.mStackPositions[0].y - i * (card.height * 0.1)
      );
      card.sortableChildren = true;
      this.mContainer.addChild(card);
      card.zIndex = this.mCurrentCardZIndex;
      this.incrementZIndexOfCards();
      this.mLeftStackCards.push(card);

      if (callback) {
        callback();
      }
    }
    this.mLogger.Log("addCardStack end- " + this.sceneName);
  }

  public addCardToStack(isLeftStack: boolean, card: CardSprite): void {
    if (isLeftStack) {
      this.mLeftStackCards.push(card);
    } else {
      this.mRightStackCards.push(card);
    }
  }

  public popupCardFromStack(isLeftStack: boolean): CardSprite | undefined {
    if (isLeftStack) {
      let card = this.mLeftStackCards.pop();
      return card;
    } else {
      let card = this.mRightStackCards.pop();
      return card;
    }
  }

  startGame() {
    let card = this.popupCardFromStack(this.mIsProcessingLeftStack);
    if (card) {
      card.setNewZIndex(this.mCurrentCardZIndex);
      this.incrementZIndexOfCards();
      card.startSwitchStack(
        this.getNewCardPositionOnStack(!this.mIsProcessingLeftStack),
        this.onCardMovementEnd.bind(this)
      );
    }
  }

  onCardMovementEnd(card: CardSprite): void {
    this.addCardToStack(!this.mIsProcessingLeftStack, card);

    if (!this.mIsSceneStopped) {
      setTimeout(() => {
        if (
          this.mIsProcessingLeftStack &&
          this.getStackCurrentSize(true) == 0
        ) {
          this.mIsProcessingLeftStack = false;
        } else if (
          !this.mIsProcessingLeftStack &&
          this.getStackCurrentSize(false) == 0
        ) {
          this.mIsProcessingLeftStack = true;
        } else {
          // do nothing
        }
        this.startGame();
      }, GameConfig.GAME_REVERSE_STACK_CONFIGS.DELAY_BETWEEN_CARD_MOVE);
    }
  }

  getNewCardPositionOnStack(isOnLeftStack: boolean): Vector {
    let cardHeight = this.getCardSize().y;
    let newPositionOnStack = new Vector(
      AppController.width / 2,
      AppController.height / 2
    );
    let basePosition = this.getStackBasePosition(isOnLeftStack);
    newPositionOnStack = new Vector(
      basePosition.x,
      basePosition.y -
        this.getStackCurrentSize(isOnLeftStack) * cardHeight * 0.1
    );
    return newPositionOnStack;
  }

  public getStackCurrentSize(isLeftStack: boolean): number {
    return isLeftStack
      ? this.mLeftStackCards.length
      : this.mRightStackCards.length;
  }

  public getStackBasePosition(isLeftStack: boolean): Vector {
    return isLeftStack ? this.mStackPositions[0] : this.mStackPositions[1];
  }

  private incrementZIndexOfCards(): void {
    this.mCurrentCardZIndex += 1;
  }

  onEnable(): void {}

  onDisable(): void {
    this.mIsSceneStopped = true;
    this.removeAllListeners();
    this.removeAll();
  }

  public removeAll(): void {
    this.removeChild();

    this.children.forEach((value) => {
      if (value) {
        value.removeFromParent();
      }
    });
  }
}
