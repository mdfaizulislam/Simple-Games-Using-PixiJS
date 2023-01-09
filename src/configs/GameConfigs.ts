/**
 * Title: GameConfigs
 * Description: Added here all game related configs
 * Author: Md Faizul Islam
 * Date: 08/01/2023
 *
 */

export class GameConfig {
  public static GAME_REVERSE_STACK_CONFIGS = {
    TOTAL_CARDS: 144,
    DELAY_BETWEEN_CARD_MOVE: 1,
    CARD_MOVE_DURATION: 2,
  };

  public static GAME_PARTICLES = {
    GRAVITY: 0.03,
  };

  public static GAME_RANDOM_TOOL = {
    INTERVAL_MS: 2000,
    PATTERN: "123123123", // 1: text, 2: sprite, 3: texture, so don't add other things to parrten
    TOTAL_COMBS: 83,
    MIN_FONT_SIZE: 24,
    MAX_FONT_SIZE: 60,
  };
}
