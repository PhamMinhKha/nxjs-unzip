import unzip from "nxjs-unzip"

type myState = "unzip" | "download"
interface callback_return {
    state: myState,
    msg: number
}

console.log("start unzip");

function callback(status:callback_return)
{
    return console.log(status);
}
unzip("demo.zip", "sdmc:/test/", callback).then(result => {
    if(result){
        console.log("unzip complete!");
    }
    else {
        console.log("unzip error!");
    }
})