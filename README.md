# Installation

```
yarn
```

# Run & play

We are using `tsc`, so feel free to play and break things with the hot reload benefits.

# How to use it

The "magic" is done by the method `effectiveResult`.

In order to test it, make sure you are wrapping your logic with it. Then, you can throw errors using the native `Error` or `ApplicationError`.
How I see it, we should always use `ApplicationError`, leaving `Error` for the "unexpected".


```
const couldCrash = () => effectiveResult(() => {
  const random = Math.round(Math.random() * 10);
  if(random % 2) {
    throw new Error('Random error');
  }

  return random;
});
```

Following the above example, the greatest part of the `effectiveResult` is the type infer. For instance, `couldCrash` is marked with a return type `PromiseResult<number>`. That's `Promise<Ok<T> | ApplicationError>`.

# Flaws
On my projects, I used two different `effectiveResult`, one for async methods and another one for sync ones. In this demo, everything is thread like an async, not a big deal, but I think it could be greatly improved using `PromiseLike` and `Awaited` and let TS decide what should be returned by `fromAsyncTryCatch` depending on the `ReturnType` of the `fn` parameter.
Anyway, TS type infer can be tricky and bug prone when types are too complex, so maybe the best idea could be do not over-engineer it. 💀