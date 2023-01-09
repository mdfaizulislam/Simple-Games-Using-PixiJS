/**
 * Title: Random Tool
 * Description: It is a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or
 *  prices with money icon). It should come up every 2 seconds a random text with images in random configuration
 * (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size
 * Author: Md Faizul Islam
 * Date: 09/01/2023
 *
 */

import { Container, Sprite, Text, Texture } from "pixijs";
import { Helper } from "../generic/Helper";
import { Logger } from "../generic/Logger";

export class RandomTool extends Container {
  private mAddedContents: any[] = [];
  private mLogger: Logger;
  private mTextHeight: number;
  constructor(textHeight: number, params: any[]) {
    super();
    this.mLogger = new Logger("Random Tool", false);
    this.sortableChildren = true;
    this.mTextHeight = 0;
    this.mTextHeight = textHeight;
    this.processContents(params);
  }

  processContents(params: any[]): void {
    params.forEach((content) => {
      if (typeof content === "string") {
        // create text and add to container
        this.addTextToContainer(content);
      } else if (content instanceof Sprite) {
        // add to container
        this.addImageToContainer(content);
      } else if (content instanceof Texture) {
        // create sprite and add to container
        this.addTextureToContainer(content);
      } else {
        // do nothing
      }
    });
    this.updateContentsPosition();
  }

  addTextToContainer(message: string): void {
    let text: Text = Helper.getLabelWithFontSize(message, this.mTextHeight);
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
    text.zIndex = 100;
    this.addContentToList(text);
  }

  addImageToContainer(sprite: Sprite): void {
    sprite.anchor.set(0.5, 0.5);
    let scale = this.mTextHeight / sprite.height;
    sprite.scale.set(scale, scale);
    this.addChild(sprite);
    this.addContentToList(sprite);
  }

  addTextureToContainer(texture: Texture): void {
    let sprite = new Sprite(texture);
    this.addImageToContainer(sprite);
  }

  addContentToList(content: any): void {
    this.mAddedContents.push(content);
  }

  updateContentsPosition(): void {
    let totalWidth: number = 0;
    let totalHeight: number = 0;

    this.mAddedContents.forEach((content) => {
      if (content) {
        totalWidth += content.width;
        totalHeight += content.height;
      }
    });
    this.mLogger.Log(
      "content: w: " +
        totalWidth +
        " h: " +
        totalHeight +
        " this: w:" +
        this.width +
        " h: " +
        this.height +
        " maxH: " +
        this.mTextHeight
    );

    let currentWidth: number = -totalWidth / 2;
    for (let i = 0, l = this.mAddedContents.length; i < l; i += 1) {
      if (this.mAddedContents[i]) {
        this.mAddedContents[i].position.x =
          currentWidth + this.mAddedContents[i].width / 2;
        currentWidth += this.mAddedContents[i].width;
      }
    }
  }

  update(delta: number) {
    delta;
  }

  onEnable(): void {}

  onDisable(): void {}

  removeAllChildren(): void {
    this.children.forEach((child) => {
      if (child) {
        child.removeAllListeners();
        child.removeFromParent();
      }
    });
    this.removeChild();
    this.mAddedContents.forEach((content) => {
      if (content) {
        content.removeFromParent();
      }
    });
    this.removeFromParent();
  }
}
