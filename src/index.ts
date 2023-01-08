/**
 * Title: Index
 * Description: This file is loaded in the first place in our game
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

// dependencies
import { AppController } from "./controllers/AppController";
import { LoadingScene } from "./scenes/LoadingScene";

const screenWidth = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);
const screenHeight = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);

AppController.initialize(screenWidth, screenHeight, 0x6495ed);

// pass in the screen size to avoid "asking up"
const loadingScene: LoadingScene = new LoadingScene();
AppController.changeScene(loadingScene);
