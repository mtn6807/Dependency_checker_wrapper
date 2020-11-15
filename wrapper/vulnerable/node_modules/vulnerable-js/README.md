# vulnerable-js

Is your js project too clean? Has dependabot never sent you a security alert? Do tacobell employees use your project as an ingredient in their mild sauce?

Well no longer, thanks to vulnerable-js!

## Overview

`vulnerable-js` introduces the following vulnerabilities into your project:

Severity | Type | Source
---|---|---
Low | Prototype Pollution | `lodash`
Low | Prototype Pollution | `lodash`
Moderate | Improper Verification of Cryptographic Signature | `jsrasign`
Moderate | Prototype Pollution | `hoek`
High | Prototype Pollution | `lodash`
High | Prototype Pollution | `lodash`
High | Timing Attack | `jsrasign`
Critical | Command Injection | `bestzip`
Critical | Command Injection | `git-tags-remote`

Note that none of these are actually run - they're included as transitive dependencies in your package-lock and are downloaded in your node_modules folder.

## Installation

```
$ npm install vulnerable-js
```

That's it. Your project is now **spicy**.

## Basic use

Wanna see the fireworks?

```
$ npm audit
```

## License

MIT
