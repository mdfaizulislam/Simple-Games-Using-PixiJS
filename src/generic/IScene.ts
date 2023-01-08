/**
 * Title: Interface Scene
 * Description: Interface Scene
 * Author: Md Faizul Islam
 * Date: 06/01/2023
 *
 */

import { DisplayObject } from "pixijs";

// Also, this could be in its own file...
export interface IScene extends DisplayObject {
  update(framesPassed: number): void;
  get name(): string;

  onEnable(): void;

  /**
   * remove all listeners, childrens, stop all schedulers etc here;
   */
  onDestry(): void;
  removeAllChildren(): void;
}
