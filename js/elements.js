var destination;

EditText = function() {
  THREE.Object3D.call(this);

  this.inputElement = document.createElement('div');
  this.inputElement.classList.add("destination");


  this.addEventListener('added', (function() {
    // console.log('added eventlistener called');
    container.appendChild(this.inputElement);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.inputElement);
  }).bind(this));


  // this.inputElement.innerHTML = '<div class="arrow"><input type="text"></div>';

  this.inputElement.innerHTML = '<div id="inputBox" class="ui action input">' +
    '<input id="inputText" type="text" placeholder="Destination">' +
    '<button id="inputButton" class="icon ui icon green inverted basic button">' +
    '<i class="arrow right icon"></i>' +
    '</button>' +
    '</div>';

  this.inputElement.style.display = '';

  this.addEventListener('added', (function() {
    // console.log('added eventlistener called');
    container.appendChild(this.inputElement);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.inputElement);
  }).bind(this));



  function validPlace(place, cb) {
    place = place.replace(/ /g, '+');
    var url = `http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20geo.places%20where%20text=%27${place}%27&format=json`;
    $.getJSON(url, function(data) {
      if (data.query.results === "null") return cb(false);
      return cb(true);
    })
  }
}

EditText.prototype = Object.create(THREE.Object3D.prototype);
EditText.prototype.constructor = EditText;

Title = function() {
  THREE.Object3D.call(this);

  this.inputElement = document.createElement('div');
  this.inputElement.classList.add("destination");
  this.inputElement.innerHTML = '<h1 id="title"> FLY! </h1>';

  this.inputElement.style.display = '';

  $('#inputButton').click(function() {
    $('#title').transition('fade up', 2000);
  });

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}

Title.prototype = Object.create(THREE.Object3D.prototype);
Title.prototype.constructor = Title;

PopUpInformationBox = function(name) {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('infobox');
  this.element.innerHTML = `

      <div class="ui icon message">
        <img id="weatherIcon"></img> &emsp;
        <div class="content">
          <div class="header">
            Wondering where you are?
          </div>
          <p>Lat: <span id="lati"></span> &emsp; Lng: <span id="long"></span> &emsp; Country: <span id="countryName"></p>
        </div>
      </div>

  `;

  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}

PopUpInformationBox.prototype = Object.create(THREE.Object3D.prototype);
PopUpInformationBox.prototype.constructor = PopUpInformationBox;


// PopUpInformationBox = function(name) {
//   THREE.Object3D.call(this);
//
//   this.element = document.createElement('div');
//   this.element.classList.add('aaaa');
//   this.element.innerHTML = `
//     <div class="ui equal width grid">
//       <div class="five wide column">
//           <div class="five wide column">
//             <div class="ui segment container">
//               <center id="cuck">
//                 <p><span id="countryName">? &nbsp;</span><img vspace="5" style="height: 1em;" id="imgFlag"></img></p>
//               </center>
//             </div>
//           </div>
//       </div>
//       <div class="six wide column">
//         <center>
//           <div class="ui segment container">
//             <p>Lat: <span id="lati"></span> &emsp; Lng: <span id="long"></span></p>
//           </div>
//         </center>
//       </div>
//       <div class="two wide column">
//         <center>
//           <div class="ui segment container">
//             <img id="weatherIcon"></img>
//           </div>
//         </center>
//       </div>
//     </div>
//   `;
//
//   this.element.style.display = '';
//
//   this.addEventListener('added', (function() {
//     container.appendChild(this.element);
//   }).bind(this));
//
//   this.addEventListener('removed', (function() {
//     container.removeChild(this.element);
//   }).bind(this));
// }
//
// PopUpInformationBox.prototype = Object.create(THREE.Object3D.prototype);
// PopUpInformationBox.prototype.constructor = PopUpInformationBox;


BackButton = function() {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('backButton');

  this.element.innerHTML = `
    <button class="ui icon red inverted basic button" type="button" onClick="window.location.reload();">
      <i class="refresh icon"></i>
    </button>`;
  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));
}
BackButton.prototype = Object.create(THREE.Object3D.prototype);
BackButton.prototype.constructor = BackButton;



NearbyInfo = function() {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('nearby');

  this.element.innerHTML = `

  <button class="ui orange basic button" id="nearbyButton">
    FIND NEARBY
  </button>

  <div class="ui hidden message" id="nearbyInfo">
    <i class="close icon"></i>
    <p><b>Places near you: &emsp;</b></p>
    <p><span id="places"></span></p>
  </div>
  `;

  this.visible = false;
  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));

}

NearbyInfo.prototype = Object.create(THREE.Object3D.prototype);
NearbyInfo.prototype.constructor = NearbyInfo;


ToggleButton = function() {
  THREE.Object3D.call(this);

  this.element = document.createElement('div');
  this.element.classList.add('toggle');

  this.element.innerHTML = `

  <button class="ui orange basic button" id="toggleButton">
    TOGGLE
  </button>

  `;

  this.toggled = false;
  this.element.style.display = '';

  this.addEventListener('added', (function() {
    container.appendChild(this.element);
  }).bind(this));

  this.addEventListener('removed', (function() {
    container.removeChild(this.element);
  }).bind(this));

}

ToggleButton.prototype = Object.create(THREE.Object3D.prototype);
ToggleButton.prototype.constructor = ToggleButton;
