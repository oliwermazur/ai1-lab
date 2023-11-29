var map;

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('moveend', function() {
        var center = map.getCenter();
        updateCoordinates(center.lat, center.lng);
    });
});


function updateCoordinates(lat, lng) {
    document.getElementById('coordinates').innerText = 'Aktualne współrzędne: ' + lat.toFixed(5) + ', ' + lng.toFixed(5);
}

function locateMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = new L.LatLng(position.coords.latitude, position.coords.longitude);
            map.setView(userLocation, 13);

            if (window.userMarker) {
                map.removeLayer(window.userMarker);
            }

            window.userMarker = L.marker(userLocation).addTo(map);
        }, function(error) {
            alert("Błąd: " + error.message);
        });
    } else {
        alert("Geolokacja nie jest wspierana przez tę przeglądarkę!");
    }
}


function downloadMap() {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error("Błąd", err);
            return;
        }

        var img = new Image();
        img.src = canvas.toDataURL();

        var imageContainer = document.getElementById('rasterImage');
        imageContainer.src = img.src;
    });
}

function initializePuzzle() {
    var rasterImage = document.getElementById('rasterImage');
    if (!rasterImage.src) {
        alert("Pobierz najpierw mapę!");
        return;
    }

    rasterImage.style.display = 'none';
    var puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    puzzleContainer.style.gridTemplateRows = 'repeat(4, 1fr)';
    puzzleContainer.style.gap = '4px';

    var scrambledArea = document.createElement('div');
    scrambledArea.id = 'scrambled-area';
    document.body.appendChild(scrambledArea);

    var imageWidth = rasterImage.naturalWidth;
    var imageHeight = rasterImage.naturalHeight;
    var pieceWidth = imageWidth / 4;
    var pieceHeight = imageHeight / 4;

    var pieces = [];

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            var canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            var context = canvas.getContext('2d');
            context.drawImage(rasterImage, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);

            var pieceImage = new Image();
            pieceImage.src = canvas.toDataURL();

            var index = y * 4 + x;
            pieceImage.id = 'piece-' + index;
            pieceImage.className = 'puzzle-piece';
            pieceImage.style.width = pieceWidth + 'px';
            pieceImage.style.height = pieceHeight + 'px';
            pieces.push(pieceImage);
        }
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => {
        scrambledArea.appendChild(piece);
        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
    });

    for (let i = 0; i < 16; i++) {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.style.width = pieceWidth + 'px';
        dropZone.style.height = pieceHeight + 'px';
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('dragenter', dragEnter);
        dropZone.addEventListener('dragleave', dragLeave);
        dropZone.addEventListener('drop', drop);
        puzzleContainer.appendChild(dropZone);
    }
}

function dragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.style.background = '#f0f0f0';
}

function dragLeave() {
    this.style.background = '';
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    this.appendChild(draggableElement);
    draggableElement.style.position = 'absolute';
    draggableElement.style.left = '0';
    draggableElement.style.top = '0';


    const correctPosition = 'piece-' + this.dataset.index;
    if (id === correctPosition) {
        console.log('Puzzle został prawidłowo ulokowany!');
    } else {
        console.log('Puzzle nie jest na właściwym miejscu.');
    }

    checkPuzzleCompletion();
}


function checkPuzzleCompletion() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let isCompleted = true;

    dropZones.forEach((zone, index) => {
        const piece = zone.firstChild;
        const correctPosition = 'piece-' + index;
        if (!piece || piece.id !== correctPosition) {
            isCompleted = false;
        }
    });

    if (isCompleted) {
        console.log('Ukonczone');
        alert('Gratulacje! Układanka ukończona!');
    }
}



