// @ts-check
const { test, expect } = require("@playwright/test");
const { resolve } = require("path");
const { fetchChat, fetchAndConvertImage, matchKaro } = require('../utils/fetchkaro');
const { find, findUniquePhotoIndex, findOddWordIndex } = require("../utils/findMatch");
const { webkit } = require('playwright');
const { solveTrue, getLinkBtnListElements } = require("../utils/solve");
const svg2png = require('svg2png');
const { bigcaptchasolve } = require("../utils/BigCaptcha");


let isFirstCall = true;
function checkCall() {
  if (isFirstCall) {
    isFirstCall = false;
    setTimeout(() => {
      isFirstCall = true;
    }, 4000)
    return true;
  } else {
    return false;
  }
}

test("has title", async ({ request, page, context }) => {

  await context.addCookies([
    {
      name: "cf_clearance",
      value:
        "STSbmUpn1ky_enXp1U3aY2L5FkDZQThX0Y5_Z21wvcU-1726801860-1.2.1.1-3vtvcUu1HEB7LYaZUR_ScL2CAFXAV_POBxL4l0nVELogdcRbpXct_uiNibeSnCU2Y1z.rJvkShHIDlbWL0EXmZpdA22OQylsyc3sqvcmAFhpWzvFWxKQU8pz8usvaxSLZ5dBStOBenCSP7hb_muTVzli8CgsFinngFxqo4aGpJraOWBQiFKdiR1v6kwmIgsM3_dn28pdpyFskOuVv3BL7RLzBtd9NJOk6JKTjrzQ1B8vdsfwja4snxIurWHNxWPkfL8UFyCoirMNaTSNx4Kwc23YZ5nh8v.S7b5SgJqoVFULawuQclPwrjB7YtSUUdXpAf_9ceyWQyZvy0YpEOGkF9zj5nUv_NLK4VUN5pmy4uKhX_aZN5Xbk3pWOM3655CC",
      path: "/",
      domain: ".skylom.com",
    },
    {
      name: "sklioue.seoidd01",
      value:
        "s%3A3s_gs4kDKEqEfP2ykXNtZoX1_EzjEIbN.Lles3uIBzK7F91wnU0QC3bJ2pS972mnOw1THY4Etj84",
      path: "/",
      domain: "www.skylom.com",
    },
  ]);
  await page.goto("https://www.skylom.com/videos");

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 50000);
  });

  const frame = page.frameLocator(
    'div[class="video-poster video-width"] youtube-player iframe'
  );

  //If Main Page Opens
  const frameCount = await frame.getByTitle("Play").isVisible();
  if (frame && frameCount) {
    await frame.locator(".ytp-large-play-button").click();
  }


  //If Captcha Page Opens
  const isCaptchaPage = await page.locator(".shaareblocckk svg").isVisible();
  if (isCaptchaPage) {
    console.log("inflowDAta");
    setTimeout(async () => {
      await bigcaptchasolve(page);
    }, 5000);
  }

  let imagesArrary = ["", "", "", ""];
  let ArrayOfBase64 = ["", "", "", ""];

  let captchaArray = ["", "", "", "", ""];
  let captchaPhotos = [];

  let lastExecutionTime = Date.now();
  function hasStatementNotExecutedRecently() {
    return Date.now() - lastExecutionTime > 200000;
  }


  page.on("response", async (request) => {

    //if video paused then reload the page
    if (hasStatementNotExecutedRecently()) {
      console.log("Reloading Page - [Freezed].....");
      throw new Error('Intentional failure');
    }

    //click play button
    async function clickButton() {
      try {
        const ishidden = await frame.locator(".ytp-large-play-button").isHidden();
        if (!ishidden && checkCall()) {
          await frame.locator(".ytp-large-play-button").click();
        }
      } catch (error) {
        console.error("Error clicking button:", error);
      }
    }

    if (request.url() === "https://www.skylom.com/videos" || request.url() === "https://www.skylom.com/videos/retention/track") {
      let count = 0;
      const intervalId = setInterval(() => {
        clickButton();
        count++;
        if (count >= 3) {
          clearInterval(intervalId);
        }
      }, 5000);
    }


    //selecting one photo from catogary
    for (let i = 0; i < imagesArrary.length; i++) {
      if (imagesArrary[i] == "") continue;

      if (request.url() == `https://www.skylom.com/videos/a/${imagesArrary[i]}`) {
        const ans = await request.body();
        const buffer = Buffer.from(ans);
        const base64String = buffer.toString('base64');
        ArrayOfBase64[i] = `data:image/png;base64,${base64String}`;
      }
    }

    if (request.url() == "https://www.skylom.com/videos/load") {
      const res = await request.json();
      if (!res?.videoCategories[1]?.img) {
        await page.reload();
      }
      for (let index = 0; index < imagesArrary.length; index++) {
        imagesArrary[index] = res.videoCategories[index].img;
      }

      setTimeout(async () => {
        try {
          let imageContentArray = ArrayOfBase64.map(async (e) => {
            if (e.length < 5) {
              await page.reload();
            }
            const ans = await fetchChat("what is written in this image, give a very short answer", e);
            let newAns = ans.replace("$@$v=undefined-rv1$@$", "");
            let newAnss = newAns.replace("$@$v=v1.10-rv1$@$", "");
            return newAnss.trim();
          });
          const allKeywords = await Promise.all(imageContentArray);
          const title = await frame.locator(".ytp-title-link").innerHTML();
          const ans = await matchKaro(`Remember this you have to answer this question in one word, so my question is - i m giving you a youtube video title and a set of comma seprated values you have to choose one value from these = ${allKeywords.toString()} and title is = "${title}",  give answer in one word only, anyhow you don't need to reply more than one word`);
          console.log("------------------------");
          console.log(ans + "  " + ((find(allKeywords, ans)) + 1) + "   " + `${allKeywords.toString()}`);
          console.log("------------------------");
          const ishidden = await page.locator(`.pre-answering .video-categ .link-btn-list li:nth-child(${((find(allKeywords, ans)) + 1)}) a`).isHidden();
          if (!ishidden) {
            await page.locator(`.pre-answering .video-categ .link-btn-list li:nth-child(${((find(allKeywords, ans)) + 1)}) a`).click();
          } else {
            await page.reload();
          }
        } catch (error) {
          console.log(error);
        }
      }, 6000);
    }


    //For click of Next Video
    async function clickNextButton() {
      try {
        const ishidden = await page.locator("#nextvideo").isHidden();
        if (!ishidden) {
          await page.locator(`#nextvideo`).click();
        }
      } catch (error) {
        console.error("Error clicking button:", error);
      }
    }
    if (request.url() == "https://www.skylom.com/video/evaluate-option") {
      let count = 0;
      const intervalId = setInterval(() => {
        clickNextButton();
        count++;
        if (count >= 3) {
          clearInterval(intervalId);
        }
      }, 2000);
    }



    // when Redirect happens
    if (request.url().match(/^https:\/\/www\.skylom\.com\/inflowdata\/.*/)) {
      console.log("inflowDAta");
      setTimeout(async () => {
        await bigcaptchasolve(page);
      }, 5000);
    }


    //If big captcha fails try again
    if (request.url() == "https://www.skylom.com/submitinflowdata") {
      console.log("submitting data")
      try {
        const res = await request.json();
        if (!res.correctOrNot) {
          console.log("wrong data")
          await page.locator(`.try_again`).click();
        }
      } catch (error) {
      }
    }


    // Main page Captcha   Small captcha
    if (request.url() == "https://www.skylom.com/video/dataForIcons") {
      try {
        const res = await request.json();
        for (let index = 0; index < res.length; index++) {
          captchaArray[index] = res[index];
        }
        setTimeout(async () => {
          const oddWordIndex = findOddWordIndex(captchaPhotos);
          console.log("------------------------");
          console.log(captchaPhotos + "   " + oddWordIndex);
          console.log("------------------------");
          await page.locator(`.captcha-modal__icons div:nth-child(${oddWordIndex})`).click();
        }, 6000);
      } catch (error) {
        console.log(error);
      }
    }

    for (let i = 0; i < captchaArray.length; i++) {
      if (captchaArray[i] == "") continue;
      if (request.url() == `https://www.skylom.com/video/dataForIcons?cid=0&hash=${captchaArray[i]}`) {
        const ans = await request.body();
        captchaPhotos[i] = await findUniquePhotoIndex(ans);
      }
    }


    //consloing all urls
    if (request.url().match(/^https:\/\/www\.skylom\.com\/.*/)) {
      const date = new Date();
      const timeZone = 'Asia/Kolkata';
      const formatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', timeZone });
      console.log(`${request.url()}   ${formatter.format(date)}`);
      lastExecutionTime = Date.now();
    }

  });


  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 10000000);
  });
});
