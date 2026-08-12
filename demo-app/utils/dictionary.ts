export class Dictionary {

  private _words = new Set<string>();
  private _source: string | undefined;
  private _preprocessor: ((word: string) => string) | undefined;

  constructor(source?: string, preprocessor?: (word: string) => string) {
    this._source = source;
    this._preprocessor = preprocessor;
  }

  public async load() {
    if (this._source) {
      const response = await fetch(this._source);
      let text = await response.text();

      if(this._preprocessor) {
        text = text.split(/\r?\n/)
          .map(word => this._preprocessor!(word.trim()))
          .filter(word => word.length > 0)
          .join("\n");
      }

      const words = new Set(text.split(/\r?\n/)
        .map(word => word.trim())
        .filter(word => word.length > 0)
      );
      this._words = words;
    }
    else {
      console.warn("No source provided for dictionary");
      this._words = new Set<string>();
    }
  }

  public set preprocessor(preprocessor: ((word: string) => string) | undefined) {
    this._preprocessor = preprocessor;
  }

  public set source(source: string | undefined) {
    this._source = source;
  }

  public getWords() {
    return this._words as ReadonlySet<string>;
  }
}
