const axios = require('axios');

async function fetchChat(messages, base64) {
  const trykro = async () => {
    try {
      const response = await axios.post('https://www.blackbox.ai/api/chat', {
        "messages": [{
          "role": "user",
          "content": messages,
          "data": {
            "imageBase64": base64,
            "fileText": ""
          }
        }],
        "id": "m1PsVcZ",
        "previewToken": null,
        "userId": null,
        "codeModelMode": true,
        "agentMode": {},
        "trendingAgentMode": {},
        "isMicMode": false,
        "maxTokens": 1024,
        "isChromeExt": false,
        "githubToken": null,
        "clickedAnswer2": false,
        "clickedAnswer3": false,
        "clickedForceWebSearch": false,
        "visitFromDelta": false,
        "mobileClient": false
      }, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.8",
          "content-type": "application/json",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Brave\";v=\"128\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "Referer": "https://www.blackbox.ai/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });
      return response.data;
    } catch (error) {
      return trykro();
    }
  }
  return trykro();
}

async function fetchAndConvertImage(id, request) {
  try {
    const response = await request.get(`https://www.skylom.com/videos/a/${id}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    const base64Image = buffer.toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error(error);
  }
}

async function matchKaro(messages) {
  const trykro = async () => {
    try {
      const response = await axios.post('https://www.blackbox.ai/api/chat', {
        "messages": [{
          "role": "user",
          "content": messages,
          "data": {
            "imageBase64": "",
            "fileText": ""
          }
        }],
        "id": "m1PsVcZ",
        "previewToken": null,
        "userId": null,
        "codeModelMode": true,
        "agentMode": {},
        "trendingAgentMode": {},
        "isMicMode": false,
        "maxTokens": 1024,
        "isChromeExt": false,
        "githubToken": null,
        "clickedAnswer2": false,
        "clickedAnswer3": false,
        "clickedForceWebSearch": false,
        "visitFromDelta": false,
        "mobileClient": false
      }, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.8",
          "content-type": "application/json",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Brave\";v=\"128\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "Referer": "https://www.blackbox.ai/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });
      const ans = response.data;
      let newAns = ans.replace("$@$v=undefined-rv1$@$", "");
      let newAnss = newAns.replace("$@$v=v1.10-rv1$@$", "");
      return newAnss.trim();
    } catch (error) {
      return trykro();
    }
  }
  return trykro();
}

module.exports = { fetchChat, fetchAndConvertImage, matchKaro };