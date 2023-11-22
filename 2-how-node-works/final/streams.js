const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  // read whole file
  // fs.readFile("./starter/test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2: Streams
  // read piece of file
  // back cracher
  // response發送data的速度與從文件接收data的速度幾乎一樣快時，會發生back cracher(?)
  // const readable = fs.createReadStream("./starter/test-file.txt");
  // readable.on("data", chunk => {
  //   res.write(chunk); // [Moriah] writeable stream: response
  // });
  // readable.on("end", () => {
  //   res.end();
  // });
  // readable.on("error", err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found!");
  // });

  // Solution 3
  // 自動處理data I/O 速度的問題
  const readable = fs.createReadStream("./starter/test-file.txt");
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
