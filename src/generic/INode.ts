/**
 * Title: Interface Node
 * Description: Added node related methods here to have easy controls
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

import { IScene } from "./IScene";

export interface INode extends IScene {
  get name(): string;
}
