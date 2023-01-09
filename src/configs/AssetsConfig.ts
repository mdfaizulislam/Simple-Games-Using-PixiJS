/**
 * Title: Assets Cofig
 * Description: Configs for all assets i.e. sprite, sound etc
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { AssetInitOptions, ResolverManifest } from "pixijs";

export class AssetsConfig implements AssetInitOptions {
  public static manifest: ResolverManifest = {
    bundles: [
      {
        name: "sprites",
        assets: {
          card: "./sprites/card.png",
          emoji1: "./sprites/emoji1.png",
          emoji2: "./sprites/emoji2.png",
          emoji3: "./sprites/emoji3.png",
          emoji4: "./sprites/emoji4.png",
          emoji5: "./sprites/emoji5.png",
          emoji6: "./sprites/emoji6.png",
          emoji7: "./sprites/emoji7.png",
          emoji8: "./sprites/emoji8.png",
          emoji9: "./sprites/emoji9.png",
          emoji10: "./sprites/emoji10.png",
          circle: "./sprites/circle.png",
          ghost: "./sprites/ghost.png",
          buttonBack: "./sprites/buttons/buttonBack.png",
          buttonGreenNormal: "./sprites/buttons/buttonGreenNormal.png",
          buttonGreenHover: "./sprites/buttons/buttonGreenHover.png",
          buttonGreenPressed: "./sprites/buttons/buttonGreenPressed.png",
          buttonGreenDisabled: "./sprites/buttons/buttonGreenDisabled.png",
        },
      },
    ],
  };
}
