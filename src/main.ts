import * as jsZip from 'jszip'
import { erase } from "sisteransi";
console.log('Unzip with nxjs');
sleep(3000). then(main)

async function unzip(buffer: ArrayBuffer) {
    return await jsZip.loadAsync(buffer).then(async function (zip: any) {
        console.log("Unzip start");
        var list_file: any[] = []
        var list_folder: any[] = []
        Object.keys(zip.files).forEach(function (filename) {
            if (filename.indexOf('.') !== -1) {
                list_file.push(filename)
            } else {
                list_folder.push(filename)
            }
        })
        var out_dir = "sdmc:/switch/out_zip/"
        //step 1: create folder before file
        for await (var f of list_folder) {
            Switch.mkdirSync(`${out_dir}${f}`);
            console.log(`Create folder: ${f}`);
        }
        //step 2: copy file to folder
        for await (var file of list_file) {
            await zip.files[file].async('arraybuffer').then(async function (fileData: ArrayBuffer) {
                await Switch.writeFileSync(`${out_dir}${file}`, fileData);
                console.log(`Copy file: ${file}`);
                return true
            })
        }
        console.log("Unzip complete!");
        console.log("");
        console.log("Thank you TooTallNate and mklan!");
    })
}
//This code from https://github.com/mklan/nx-archive-browser
async function readFile(url: string) {
    // Step 1: start the fetch and obtain a reader
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    const reader = response.body!.getReader();

    // Step 2: get total length
    const contentLength = +response.headers.get("Content-Length")!;

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment

    let last = { time: 0, value: 0 };
    let counter = 0;
    let speed = 0;
    const stream = new ReadableStream({
        start(controller) {
            return pump();
            function pump(): Promise<
                ReadableStreamReadResult<Uint8Array> | undefined
            > {
                return reader.read().then(({ done, value }) => {
                    // When no more data needs to be consumed, close the stream
                    if (done) {
                        controller.close();
                        return;
                    }
                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);

                    receivedLength += value.length;

                    const progress = receivedLength / (contentLength / 100) / 100;

                    const current = { time: Date.now(), value: receivedLength };

                    if (counter % 50 === 0) {
                        if (last.time) {
                            const time = current.time - last.time;
                            const val = current.value - last.value;

                            speed = byteToMB(val / (time / 1000));
                        }

                        last = { ...current };
                    }
                    console.log(erase.screen);
                    console.log("Download: " + Math.round(progress * 100) + " - speed:" + speed);
                    counter += 1;
                    return pump();
                });
            }
        },
    });
    return new Response(stream);
}
function byteToMB(value: number) {
    return value / 1024 / 1024;
}

async function main() {
    //url can https 
    var url = "demo.zip"
    try {
        var blob = await readFile(url).then((res) => res.blob())
        const buffer = await new Response(blob).arrayBuffer();
        console.log("Unzip start after 3 seconds");
        await sleep(1000)
        console.log("Unzip start after 2 seconds");
        await sleep(1000)
        console.log("Unzip start after 1 seconds");
        await sleep(1000)
        unzip(buffer)
    } catch (error) {
        console.log(error);
    }
}
function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}