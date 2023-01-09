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

export class RandomTool extends Container {
  private mAddedContents: any[] = [];
  constructor(params: any[]) {
    super();
    this.sortableChildren = true;
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
  }

  addTextToContainer(message: string): void {
    let labelTitle: Text = Helper.getLabelWithBasicFont(message);
    labelTitle.anchor.set(0.5, 0.5);
    this.addChild(labelTitle);
    labelTitle.zIndex = 100;
    this.addContentToList(labelTitle);
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
