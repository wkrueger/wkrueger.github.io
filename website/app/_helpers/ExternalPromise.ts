export class ExternalPromise<T> {
  private _resolve: any
  private _reject: any

  resolve = (arg: T) => {
    this._resolve(arg)
  }

  reject = (err: any) => {
    this._reject(err)
  }

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  promise: Promise<T>
}
