ethers.js (Aion-flavored)
=========================

**Features**

- Keep your private keys in your client, **safe** and sound
- Meta-classes create JavaScript objects from any contract ABI, including **ABIv2** and **Human-Readable ABI** for **FVM Contracts** and AVM standard ABI for *8AVM Contracts**.
- Connect to Aion using [JSON-RPC](https://github.com/aionnetwork/aion/wiki/JSON-RPC-API-Docs) or [Nodesmith](https://nodesmith.io).
- Complete functionality for all your **Aion** needs
- Fully **TypeScript** ready, with definition files and full TypeScript source
- **MIT License** (including ALL dependencies); completely open source to do with as you please


Documentation
-------------

Coming soon...


Related Libraries
-----------------

This is


Hacking and Contributing
------------------------

This library is maintained as a TypeScript project, using Lerna and a
handful of custom admin scripts.

To contribute or hack on top of this library, you should modify the TypeScript
source files. To use incremental compilation, to assist while developing, you
can use:

```
/Users/ricmoo/ethers> npm run auto-build
```

A very important part of ethers is its exhaustive test cases, so before making
any bug fix, please add a test case that fails prior to the fix, and succeeds
after the fix. All regression tests must pass.

Pull requests are always welcome, but please keep a few points in mind:

- Compatibility-breaking changes will not be accepted; they may be considered for the next major version
- Security is important; adding dependencies require fairly convincing arguments
- The library aims to be lean, so keep an eye on the dist/ethers.min.js file size before and after your changes
- Add test cases for both expected and unexpected input
- Any new features need to be supported by us (issues, documentation, testing), so anything that is overly complicated or specific may not be accepted

In general, please **start an issue before beginning a pull request**, so we can have a public discussion. :)


Donations
---------

I do this because I love it, but if you want to buy me a coffee, I won't say no. :o)

Ethereum: `0xEA517D5a070e6705Cc5467858681Ed953d285Eb9`


License
-------

Completely MIT Licensed. Including **ALL** dependencies.
