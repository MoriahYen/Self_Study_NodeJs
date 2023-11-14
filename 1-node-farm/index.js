const fs = require('fs');
const http =  require('http')
const url  = require('url')

///////// FILE
// //sync
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn)
// const textOut = `This is: ${textIn}`
// fs.writeFileSync('./starter/txt/output.txt', textOut)

// //async
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8',(err, data3) => {
//             console.log(data3)
//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('OK')
//             })
//         })
//     })
// })

//////// SERVER
// [Moriah] 在這裡只會執行一次
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
    const pathName = req.url
    // Overview Page
    if(pathName ==='/' || pathName === '/overview') {

        
        res.end('This is the OVERVIEW.')
    
    // Product page
    } else if(pathName === '/product') {
        res.end('This is the PRODUCT')
    
    // API 
    } else if(pathName === '/api') {
        // [Moriah] readFile在這裡每次都會被讀取
        // fs.readFile(`${__dirname}/starter/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data)
             res.writeHead(200, {'Content-type': 'application/json'})
             res.end(data)
        // })
    
    // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello-world'
        })
        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000')
})    //local host