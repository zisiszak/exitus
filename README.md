# exitus

Typed error wrapping.

## Usage

### Generic Errors - `GenericExerr`

With no arguments provided, `exerr` will create a `GenericExerr`.

```ts
const ohShucks = newError() satisfies GenericExerr;
```

### Custom Error Codes

```ts
const ohWhat = exerr({
    // Can be a number, symbol or string
    code: 'INESCAPABLE_DOOM',
}) satisfies Exerr<"INESCAPABLE_DOOM">;
```

### Debugging Options

Use these properties for assisting in debugging or internal logging.

```ts
const ohBrother = exerr({
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
isExerr(ohWhat) // true
isExerr(new Error()) // false
```
