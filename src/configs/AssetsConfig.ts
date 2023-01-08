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
          player: "./sprites/player.png",
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
