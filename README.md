# nxjs-unzip

Unzip file from internet or sd card

<img src="https://github.com/PhamMinhKha/nxjs-unzip/raw/master/screenshot.jpg" width="800" />

## Require
nxjs-runtime > 0.0.36

## Install

```
npm i nxjs-unzip
```

## Use

```
import unzip from "nxjs-unzip";
unzip("https://domain/file.zip", "sdmc:/", true)

\\or

import unzip from "nxjs-unzip"

unzip("demo.zip", "sdmc:/", true).then(result => {
    if(result){
        console.log("unzip complete!");
    }
    else {
        console.log("unzip error!");
    }
})
```

## Credits

- [TooTallNate - nxjs](https://github.com/TooTallNate/nx.js) - JS runtime for the Switch.
- [mklan - nx-archive-browser ](https://github.com/mklan/nx-archive-browser) - Download file from url or sd card.
- [Stuk - jszip ](https://github.com/Stuk/jszip) - Unzip with javascript

## Feature

- [x] download from url or sd card
- [x] unzip after download

## LICENSE

MIT License

Copyright (c) 2024 Pham Kha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
