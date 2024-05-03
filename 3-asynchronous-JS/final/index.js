const fs = require('fs');
const superagent = require('superagent');

// [Moriah] 解決callback hell是用promise?

const readFilePro = (file) => {
  // [Moriah] 這個promise constructor接受了一個executor函數，
  // 當promise創建時會立刻被調用，
  // 此函數接受兩個參數(resolve, reject)
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 😢');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file.');
      resolve('success');
    });
  });
};

// [Moriah] async會返回一個promise
// async: 一個在執行其中的代碼時保持後台運行的代碼，而其餘的代碼在event loop中運行
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    // [Moriah] 不使用async，讓這三個resPro同時執行
    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    // [Moriah] 三個resxPro會同時進行
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);

    throw err;
    //[Moriah] 拋出錯誤，promise才會顯示reject，否則在then接收都是success
  }
  return '2: READY 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log('ERROR 💥');
  }
})();

// console.log('1: Will get dog pics!');
// getDogPic()
//   .then(x => {
//     console.log(x);
//     console.log('3: Done getting dog pics!');
//   })
//   .catch(err => {
//     console.log('ERROR 💥');
//   });

// [Moriah] 連接所有的then就是利用promise
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     // [Moriah] then: 在promise完成工作並返回數據時被調用，
//     // 否則原本的.get()已經返回一個promise(pending)，但沒被調用(resolved)
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
