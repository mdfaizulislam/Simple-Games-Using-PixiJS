/**
 * Title: Helper
 * Description: helper methods are added here to support in any other places
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

// dependencies
import { Sprite, Text, TextStyle, Texture } from "pixijs";
import { Vector } from "vecti";
import { AppController } from "../controllers/AppController";
import { Logger } from "./Logger";

export class Helper {
  private static mLogger = new Logger("Helper", true);
  public static parseJSON(str: string): JSON {
    let jsonObject;
    try {
      jsonObject = JSON.parse(str);
    } catch (error) {
      Helper.mLogger.Log("Error on Parsing " + str, 3);
    }
    return jsonObject;
  }

  public static getLabelWithBasicFont(text: string): Text {
    const style: TextStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      // fill: 0xff1010,
      align: "center",
    });
    const basicText: Text = new Text(text, style);
    return basicText;
  }

  public static getSpriteTexture(spriteOrTexture: string | Texture): Texture {
    let texture;
    if (typeof spriteOrTexture === "string" && spriteOrTexture.length > 0) {
      texture = Sprite.from(spriteOrTexture).texture;
    } else if (spriteOrTexture instanceof Texture) {
      texture = spriteOrTexture;
    } else {
      texture = Texture.WHITE;
    }
    return texture;
  }

  public static getRandomOutScreenPoint(): Vector {
    const edge = Math.floor(Math.random() * 4);
    Helper.mLogger.Log("getRandomOutScreenPoint -> Random: " + edge);
    let point: Vector;
    switch (edge) {
      case 0: // top
        point = new Vector(AppController.width * Math.random(), 0);
        break;
      case 1: // right
        point = new Vector(
          AppController.width,
          AppController.height * Math.random()
        );
        break;
      case 2: // left
        point = new Vector(
          AppController.width,
          AppController.height * Math.random()
        );
        break;
      case 3: // bottom
        point = new Vector(
          AppController.width * Math.random(),
          AppController.height
        );
        break;
      default:
        point = new Vector(AppController.width * Math.random(), 0);
        break;
    }
    return point;
  }

  public static getVectorDistance(p1: Vector, p2: Vector): number {
    // Calculate the distance between two given points
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
  }

  public static getRandomString(length: number): string {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Defining a custom function which returns a random number between min and max, including min and max
   * @param min
   * @param max
   * @returns number
   */
  public static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * generates random number 0 to max-1,
   * @param max
   * @returns number
   */
  public static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  /*
  private isOverlapped(a: Rectangle, b: Rectangle): boolean {
    // assume `a` and `b` are instances of Rectangle
    const rightmostLeft = a.left < b.left ? b.left : a.left;
    const leftmostRight = a.right > b.right ? b.right : a.right;

    if (leftmostRight <= rightmostLeft) {
      return false;
    }

    const bottommostTop = a.top < b.top ? b.top : a.top;
    const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

    return topmostBottom > bottommostTop;
  }

  private update(deltaTime: number): void {
    this.clampy.x = this.clampy.x + this.clampyVelocity * deltaTime;
    if (this.clampy.x > this.screenWidth + this.clampy.width / 2) {
      // Woah there clampy, come back inside the screen!
      this.clampy.x = 0 - this.clampy.width / 2;
    }
  }
  */
}
