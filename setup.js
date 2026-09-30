const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

function carregarApp() {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const js = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

  const dom = new JSDOM(html.replace(/<script src="app.js"><\/script>/, ""), {
    runScripts: "dangerously",
  });
  const { window } = dom;

  Object.defineProperty(window.HTMLElement.prototype, "innerText", {
    get() { return this.textContent; },
    set(v) { this.textContent = v; },
  });

  window.alert = jest.fn();
  const intervalos = [];
  window.setInterval = (fn, ms) => { intervalos.push({ fn, ms }); return intervalos.length; };

  const script = window.document.createElement("script");
  script.textContent = js;
  window.document.body.appendChild(script);
  window.__intervalos = intervalos;
  return window;
}

module.exports = { carregarApp };
