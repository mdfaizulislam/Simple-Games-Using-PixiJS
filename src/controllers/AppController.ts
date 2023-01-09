/**
 * Title: AppController
 * Description: It will server as a persistant node for the entire game so that we can have accessibility of controllers from each game scene easily
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { Application } from "pixijs";
import { IScene } from "../generic/IScene";
import { Logger } from "../generic/Logger";

export class AppController {
  private constructor() {
    /*this class is purely static. No constructor to see here*/
  }

  // Safely store variables for our game
  private static app: Application;
  private static currentScene: IScene;
  public static visible: boolean;

  // Width and Height are read-only after creation (for now)
  private static _width: number;
  private static _height: number;

  // With getters but not setters, these variables become read-only
  public static get width(): number {
    return AppController._width;
  }
  public static get height(): number {
    return AppController._height;
  }

  public static getApp(): Application {
    return AppController.app;
  }

  private static mLogger = new Logger("AppController", true);

  // Use this function ONCE to start the entire machiner
  public static initialize(
    width: number,
    height: number,
    background: number
  ): void {
    // store our width and height
    AppController._width = width;
    AppController._height = height;

    // Create our pixi app
    AppController.app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
      width: width,
      height: height,
    });

    AppController.visible = true;
    // Add the ticker
    AppController.app.ticker.add(AppController.update);
    // AppController.app.ticker.

    // listen for the browser telling us that the screen size changed
    window.addEventListener("resize", AppController.resize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);

    // call it manually once so we are sure we are the correct size after starting
    AppController.resize();
  }

  private static onVisibilityChange(): void {
    const isVisible = !document.hidden;
    AppController.mLogger.Log("AppVisibility: " + (isVisible ? "yes" : "no"));
    AppController.visible = isVisible;
  }

  public static resize(): void {
    AppController.mLogger.Log("Resizing window....");
    // current screen size
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    // uniform scale for our game
    const scale = Math.min(
      screenWidth / AppController.width,
      screenHeight / AppController.height
    );

    // the "uniformly englarged" size for our game
    const enlargedWidth = Math.floor(scale * AppController.width);
    const enlargedHeight = Math.floor(scale * AppController.height);

    // margins for centering our game
    // const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    // const verticalMargin = (screenHeight - enlargedHeight) / 2;

    // now we use css trickery to set the sizes and margins
    if (AppController.app.view.style) {
      AppController.app.view.style.width = `${enlargedWidth}px`;
      AppController.app.view.style.height = `${enlargedHeight}px`;

      // @TODO marginLeft, marginRight, marginTop, marginBotton is missing in current
      // style of pixijs 7.0.0,
      // @FIXME fix this later
      // AppController.app.view.style.marginLeft =
      //   AppController.app.view.style.marginRight = `${horizontalMargin}px`;
      // AppController.app.view.style.marginTop =
      //   AppController.app.view.style.marginBottom = `${verticalMargin}px`;
      // AppController.app.
    }
  }

  // Call this function when you want to go to a new scene
  public static changeScene(newScene: IScene): void {
    // Remove and destroy old scene... if we had one..
    if (AppController.currentScene) {
      AppController.app.stage.removeChild(AppController.currentScene);
      AppController.currentScene.onDestry();
      AppController.currentScene.destroy();
    }

    // Add the new one
    AppController.currentScene = newScene;
    AppController.app.stage.addChild(AppController.currentScene);
    AppController.mLogger.Log(newScene.name);
    // AppController.currentScene.onEnable();
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number): void {
    if (AppController.currentScene) {
      AppController.currentScene.update(framesPassed);
    }
  }
}
