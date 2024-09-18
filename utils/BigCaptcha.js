const svg2png = require('svg2png');
const { solveTrue, getLinkBtnListElements } = require('./solve');
const { find } = require('./findMatch');


async function bigcaptchasolve(page) {
    try{
        const anss = await page.$(`.shaareblocckk svg`);
        const htmlString = await anss?.evaluate(element => element.outerHTML);
        const svgBuffer = Buffer.from(`${htmlString}`, 'utf8');
        const pngBuffer = await svg2png(svgBuffer, { width: 200, height: 50 });
        const base64Image = pngBuffer.toString('base64');
        const ans = await page.$(`.shaareblocckk .link-btn-list li:nth-child(4) a`);
    
        if(ans) {
          //choose one
          const result = await solveTrue("give one word answer please. check this image and give me answer of this equation, and remember this you have to answer in whole numbers only like 1, 54, 885",`data:image/png;base64,${base64Image}`)
          console.log(result);
          const array = await getLinkBtnListElements(page);
          const index = find(array, `${result}`);
          await page.locator(`.shaareblocckk .link-btn-list li:nth-child(${((index) + 1)}) a`).click();
        }
        else {
          //choose true and false
          const result = await solveTrue("check this image and answer me in true and false,   remember this you have to answer in true and false,   what is answer true and false",`data:image/png;base64,${base64Image}`)
          console.log(result);
          const index = find(["true", "false"], result);
          await page.locator(`.shaareblocckk .link-btn-list li:nth-child(${((index) + 1)}) a`).click();
        }
      } catch (error) {
        console.log(error);
      }
}

module.exports = {bigcaptchasolve};