import * as jsZip from 'jszip'
import { erase } from "sisteransi";
/**
 * 
 * @param buffer read from zip file
 * @param outDir path to unzip, default is = "sdmc:/"
 * @returns boolean
 */
async function js_unzip(buffer: ArrayBuffer, outDir: string = "sdmc:/"): Promise<boolean> {
    try {
        return await jsZip.loadAsync(buffer).then(async function (zip: any) {
            if (is_show_log) {
                console.log("Unzip start");
            }
            var list_file: any[] = []
            var list_folder: any[] = []
            Object.keys(zip.files).forEach(function (filename) {
                if (filename.indexOf('.') !== -1) {
                    list_file.push(filename)
                } else {
                    list_folder.push(filename)
                }
            })
            //step 1: create folder before file
            for await (var f of list_folder) {
                Switch.mkdirSync(`${outDir}${f}`);
                if (is_show_log) {
                    console.log(`Create folder: ${f}`);
                }
            }
            //step 2: copy file to folder
            for await (var file of list_file) {
                await zip.files[file].async('arraybuffer').then(async function (fileData: ArrayBuffer) {
                    try {
                        await Switch.writeFileSync(`${outDir}${file}`, fileData);
                        if (is_show_log) {
                            console.log(`Copy file: ${file}`);
                        }
                        return true
                    } catch (error) {
                        //Nếu bị lỗi thì tập tin có thể là một folder
                        Switch.mkdirSync(`${outDir}${file}`);
                    }
                   
                })
            }
            if (is_show_log) {
                console.log("Unzip complete!");
            }
            return true
        })


    } catch (error) {
        console.log(error);
        return false
    }
}
//This code from https://github.com/mklan/nx-archive-browser
/**
 * 
 * @param url can is path of file or https link to file
 * @returns ReadableStream
 */
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
                    if (is_show_log) {
                        console.log(erase.screen);
                        console.log("Download: " + Math.round(progress * 100) + " - speed:" + speed);

                    }
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
/**
 * Unzip file 
 * @param path can url or path of file
 * @param outDir out folder
 * @param log show log if you want
 * @default 
 * outDir= "sdmc:/"
 * log = false
 * @example 
 * ```
 * unzip("https://domain/file.zip", "sdmc:/switch", true)
 * ```
 */
var is_show_log = false
async function unzip(path: string, outDir: string = "sdmc:/", log: boolean = false) {
    var blob = await readFile(path).then((res) => res.blob());
    is_show_log = log;
    const buffer = await new Response(blob).arrayBuffer();
    var unzip_complete = await js_unzip(buffer, outDir);
    if (unzip_complete) {
        return true
    } else {
        return false
    }
}
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default unzip