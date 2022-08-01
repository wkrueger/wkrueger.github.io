export class ExternalPromise<T> {
  private _resolve: any
  private _reject: any
  isResolved = false

  resolve = (arg: T) => {
    if (this.isResolved) return
    this.isResolved = true
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
