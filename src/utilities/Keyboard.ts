export class Keyboard {
  public static readonly state: Map<string, boolean> = new Map<
    string,
    boolean
  >();
  public static initialize() {
    // The `.bind(this)` here isn't necesary as these functions won't use `this`!
    document.addEventListener("keydown", Keyboard.keyDown);
    document.addEventListener("keyup", Keyboard.keyUp);
  }
  private static keyDown(e: KeyboardEvent): void {
    console.log("Pressedkey Down: " + e.code);
    Keyboard.state.set(e.code, true);
  }
  private static keyUp(e: KeyboardEvent): void {
    console.log("Pressedkey Up: " + e.code);
    Keyboard.state.set(e.code, false);
  }

  public static removeKeyboardListener(): void {
    document.removeEventListener("keydown", Keyboard.keyDown);
    document.removeEventListener("keyup", Keyboard.keyUp);
  }
}
