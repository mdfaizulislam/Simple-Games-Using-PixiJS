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
  private mContainsText: boolean;
  constructor(params: any[]) {
    super();
    this.mLogger = new Logger("Random Tool", true);
    this.sortableChildren = true;
    this.mTextHeight = 0;
    this.mContainsText = false;
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
    // this.sortChildren();
    this.updateContentsPosition();
  }

  addTextToContainer(message: string): void {
    let text: Text = Helper.getLabelWithBasicFont(message);
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
    text.zIndex = 100;
    this.addContentToList(text);
    this.mContainsText = true;
    this.mTextHeight = text.height;
  }

  addImageToContainer(sprite: Sprite): void {
    sprite.anchor.set(0.5, 0.5);
    this.addChild(sprite);
    this.addContentToList(sprite);
  }

  addTextureToContainer(texture: Texture): void {
    let sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    this.addChild(sprite);
    this.addContentToList(sprite);
  }

  addContentToList(content: any): void {
    this.mAddedContents.push(content);
  }

  updateContentsPosition(): void {
    this.scaleImages();

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
        this.height
    );

    this.width = totalWidth;
    this.height = totalHeight;

    let currentWidth: number = -totalWidth / 2;
    for (let i = 0, l = this.mAddedContents.length; i < l; i += 1) {
      if (this.mAddedContents[i]) {
        this.mAddedContents[i].position.x =
          currentWidth + this.mAddedContents[i].width / 2;
        currentWidth += this.mAddedContents[i].width;
      }
    }
  }

  scaleImages(): void {
    if (!this.mContainsText || this.mTextHeight == 0) {
      return;
    }

    this.mAddedContents.forEach((content) => {
      if (content && content instanceof Sprite) {
        // this.mLogger.Log("Before Height: " + content.height);
        let scale = this.mTextHeight / content.height;
        content.scale.set(scale, scale);
        // this.mLogger.Log("After Height: " + content.height);
      }
    });
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
