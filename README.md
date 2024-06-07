# exitus

Typed and extensible error wrapping.

## Usage

### Generic Errors

With no arguments provided, `newError` will create a `GenericError`.
You can also call `newError` using the property defined on the `exitus` export.

```ts
const ohShucks = newError() satisfies Exitus.GenericError;
```

### Custom Payloads

An example of a `GenericError` with a custom payload:

```ts
const ohSnap = exitus.newError({
    payload: {
        whyItFailed: 'skill issue',
    },
}) satisfies Exitus.GenericError<{
    whyItFailed: string;
}>;
```

### Pre-Modelled Error Kinds

A few pre-modelled error kinds are included, and come with their own specific payload properties (optional).

To specify a pre-modelled error type, assign the `kind` property to one of the symbols in `exitus.errorKind`.

```ts
const ohNo = exitus.newError({
    kind: exitus.errorKind.fs,
    payload: {
        file: "some/path/to/a/file",
        files: ["some/path/elsewhere", "another/path/elsewhere"]
        // Custom properties can still be included.
        howItFailed: "I dunno",
    }
}) satisfies Exitus.ModelledError<typeof fsErrorKindSym, FsErrorPayload & {
    howItFailed: string;
}>;
```

### Custom Error Kinds

```ts
const ohWhat = exitus.newError({
    // Can be a number, symbol or string
    kind: 'INESCAPABLE_DOOM',
    payload: {
        theEndIsNear: true,
    },
}) satisfies Exitus.ModelledError<"INESCAPABLE_DOOM", {
    theEndIsNear: boolean;
}>;
```

### Debugging Options

Use these properties for assisting in debugging or internal logging.

```ts
const ohBrother = exitus.newError({
    message: "'... I bet <insert framework of choice> doesn't have these issues.'",
    caughtException: new Error(),
    context: {
        someInput: 4124309184571,
        someOutput: "pi == 4",
    },
    stack: true,
});
```

### Guards

```ts
exitus.isError(ohWhat) // true
exitus.isError(new Error()) // false
```
