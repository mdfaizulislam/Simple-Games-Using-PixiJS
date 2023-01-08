/**
 * Title: AssetsControlller
 * Description: This file is responsible for laoding all assets using this file
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { AssetInitOptions, Assets, ResolverManifest, Sprite } from "pixijs";
import { AssetsConfig } from "../configs/AssetsConfig";
export class AssetsController {
  private static instance: AssetsController;

  private mAssetsManifest: ResolverManifest;
  private mAssetInitOpt: AssetInitOptions;
  private mProgressCallback?: Function;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.mAssetInitOpt = AssetsConfig;
    this.mAssetsManifest = AssetsConfig.manifest;
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): AssetsController {
    if (!AssetsController.instance) {
      AssetsController.instance = new AssetsController();
    }

    return AssetsController.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  public loadAppAssets(
    completeCallback: Function,
    progressCallback?: Function
  ) {
    this.mProgressCallback = progressCallback;
    this.initBundles().then(() => {
      // all items are loaded now
      if (completeCallback) {
        completeCallback();
      }
    });
  }

  private async initBundles(): Promise<void> {
    await Assets.init(this.mAssetInitOpt);
    // let's extract the bundle ids. This is a bit of js black magic
    const bundleIds = this.mAssetsManifest.bundles.map((bundle) => bundle.name);
    console.log("bundleIds: " + bundleIds);

    // we download ALL our bundles and wait for them
    await Assets.loadBundle(bundleIds, this.assetDownloadProgress.bind(this));
  }

  private assetDownloadProgress(progressRatio: number): void {
    // progressRatio goes from 0 to 1, so set it to scale
    // console.log("loaded assets percentage: " + progressRatio);
    if (this.mProgressCallback) {
      this.mProgressCallback(progressRatio);
    }
    // this.loaderBarFill.scale.x = progressRatio;
  }

  public loadSpriteOptionOne(
    spritePath: string,
    callback: (s: Sprite) => any
  ): void {
    Assets.load(spritePath).then((texture) => {
      const sprite = Sprite.from(texture);
      callback(sprite);
    });
    // Be careful, `clampySprite` doesn't exist out here, only inside those brackets!
  }

  public async loadSpriteOptionTwo(spritePath: string): Promise<Sprite> {
    const texture = await Assets.load(spritePath);
    return Sprite.from(texture);
    // now calling `loadClampy()` will yield a Clampy sprite promise!
  }
}
