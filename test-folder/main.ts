import unzip from "nxjs-unzip"

console.log("start unzip");
unzip("demo.zip").then(result => {
    if(result){
        console.log("unzip complete!");
    }
    else {
        console.log("unzip error!");
    }
})
console.log("ok")