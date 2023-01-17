import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading = document.querySelector('.loading-bar');
    this._startLoading();

    this._load().then(planets => {
      this._create(planets);
      this._stopLoading();
    });
  }

  async _load(page = 1) {
    let planets = [];
    let response = await (`https://swapi.boom.dev/api/planets?page=${page}`);
    let data = await response.json();
    planets = planets.concat(data.results);
    while (data.next != null) {
      response = await (data.next);
      data = await response.json();
      planets = planets.concat(data.results);
    }
    return planets;
  }

  _create(planets) {
    const main = document.body.querySelector(".main");
    planets.forEach(planet => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML = this._render(planet);
      main.appendChild(box);
    });
  }

  _render(planet) {
    return `
    <article class="media">
    <div class="media-left">
        <figure class="image is-64x64">
        <img src="${image}" alt="planet">
        </figure>
    </div>
    <div class="media-content">
        <div class="content">
        <h4>${planet.name}</h4>
        <p>
            <span class="tag">${planet.terrain}</span> <span class="tag">${planet.population}</span>
            <br>
        </p>
        </div>
    </div>
    </article>
    `;
  }

  _startLoading() {
    this._loading.style.display = 'block';
  }

  _stopLoading() {
    this._loading.style.display = 'none';
  }
}