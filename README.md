# Umai

A delicious new outlook on command line argument handling.

---
![License](https://flat.badgen.net/github/license/tcarrio/umai)
![Open Issues](https://flat.badgen.net/github/open-issues/tcarrio/umai)
![Github Stars](https://flat.badgen.net/github/stars/tcarrio/umai)

*A note from the developer: Umai is an early access package, if you have features you would like to see, please open an issue, I will work to implement all of the features within the scope of this project, and fix issues with current features as I go.*

> This project is only tested and developed for [Bun](https://bun.sh), any support for NodeJS, or Deno is coincidental and not intentional, please do not submit bug reports for those runtimes (at this time). Support for these runtimes is planned, but not in progress at this time.

## Getting Started

To install, firstly ensure you have the [Bun](https://bun.sh) runtime installed on your system. Then, you can use the following command to add to your project.

```sh
bun add @0xc/umai
```

## Basic application

### Importing

To import Umai into your project, simply include the following line to your project.

```ts
import umai from "umai";
```

Umai currently provides two argument types, `FlagArgument`, which returns a boolean value, and `StringArgument`, which returns a string value, or `null` if not present.

All of our argument types use "builder patterns" to provide a consistent API across all types.

---

**Example Flag Argument:**

```ts
// Generate a new Flag argument.
let help = new umai.FlagArgument()
                .withName("help")          // Call it "help"
                .withIdentifier("help")    // make it capture "--help"
                .withShortIdentifier("h"); // make it caputre "-h"
```

This results in a `FlagArgument`, which can be passed to the `Umai Client`, or you can use it completely independant of this library, on your own data inputs.

---

**Example String Argument:**

```ts
// Generate a new String argument.
let file = new umai.StringArgument()
                .withName("file")          // Call it "file"
                .withIdentifier("file")    // make it capture "--file <text>"
                .withShortIdentifier("f"); // make it caputre "-f <text>"
```

This results in a `StringArgument`

---

In order to process your arguments into something you can use, we can take our example arguments from before, and carry them into the following code.

```ts
// Create our client.
let client = new umai.Umai([help, file]);

// Run our arguments through the processor.
client.parse();
```

It is as simple as that, now you can access your command flags using `client.values`, an example of this field can be seen below:

```
bun src/app.ts -- --file "/path/to/file.png" -h
```

would result in

```ts
{
    help: true,
    file: "/path/to/file.png"
}
```

## Roadmap

TODO
