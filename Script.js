const API =
"https://manish-jiosaavn-api.manishjai9527.workers.dev/api/search/songs?query=";

const songsContainer =
document.getElementById("songsContainer");

const audio =
document.getElementById("audio");

const playerTitle =
document.getElementById("playerTitle");

const playerArtist =
document.getElementById("playerArtist");

const playerImg =
document.getElementById("playerImg");

const seekbar =
document.getElementById("seekbar");

const searchInput =
document.getElementById("searchInput");

let isPlaying = false;

let playlists =
JSON.parse(localStorage.getItem("shivay_playlists")) || [];

// ===== SEARCH SONGS =====

async function searchSongs(){

const query = searchInput.value.trim();

if(!query) return;

songsContainer.innerHTML =
"<h2>Loading...</h2>";

try{

const res =
await fetch(API + encodeURIComponent(query));

const data =
await res.json();

songsContainer.innerHTML = "";

const songs =
data.data.results;

songs.forEach(song=>{

const image =
song.image?.[2]?.url || "";

const download =
song.downloadUrl?.[4]?.url ||
song.downloadUrl?.[3]?.url ||
song.downloadUrl?.[2]?.url ||
"";

const card =
document.createElement("div");

card.className = "song-card";

card.innerHTML = `

<img src="${image}">

<div class="song-info">

<h2>${song.name}</h2>

<p>${song.primaryArtists}</p>

</div>

<div class="song-buttons">

<button class="play-btn">
▶ Play
</button>

<a class="download-btn"
href="${download}"
download>
⬇ Download
</a>

<button class="playlist-btn">
＋ Playlist
</button>

</div>

`;

const playBtn =
card.querySelector(".play-btn");

playBtn.addEventListener("click",()=>{

playSong(
download,
song.name,
song.primaryArtists,
image
);

});

const playlistBtn =
card.querySelector(".playlist-btn");

playlistBtn.addEventListener("click",()=>{

addToPlaylist({
name:song.name,
artist:song.primaryArtists,
url:download,
image:image
});

});

songsContainer.appendChild(card);

});

}catch(err){

songsContainer.innerHTML =
"<h2>API Error 😭</h2>";

}

}

// ===== PLAYER =====

function playSong(url,title,artist,image){

audio.src = url;

audio.play();

isPlaying = true;

playerTitle.innerText = title;

playerArtist.innerText = artist;

playerImg.src = image;

}

function togglePlay(){

if(!audio.src) return;

if(isPlaying){

audio.pause();

isPlaying = false;

}else{

audio.play();

isPlaying = true;

}

}

audio.addEventListener("timeupdate",()=>{

seekbar.max = audio.duration || 0;

seekbar.value = audio.currentTime;

});

seekbar.addEventListener("input",()=>{

audio.currentTime = seekbar.value;

});

// ===== PLAYLIST SYSTEM =====

function savePlaylists(){

localStorage.setItem(
"shivay_playlists",
JSON.stringify(playlists)
);

}

function createPlaylist(){

const name =
prompt("Playlist Name");

if(!name || name.trim()==="") return;

playlists.push({
name:name,
songs:[]
});

savePlaylists();

renderPlaylists();

}

function addToPlaylist(song){

if(playlists.length===0){

alert("Create Playlist First");

return;

}

let options = "";

playlists.forEach((p,index)=>{

options += `${index+1}. ${p.name}\n`;

});

const selected =
prompt(
`Select Playlist:\n\n${options}`
);

if(!selected) return;

const playlist =
playlists[selected-1];

if(!playlist){

alert("Invalid Playlist");

return;

}

playlist.songs.push(song);

savePlaylists();

renderPlaylists();

alert("Song Added ✅");

}

function deletePlaylist(index){

playlists.splice(index,1);

savePlaylists();

renderPlaylists();

}

function renderPlaylists(){

const playlistContainer =
document.getElementById("userPlaylists");

playlistContainer.innerHTML = "";

playlists.forEach((playlist,index)=>{

const box =
document.createElement("div");

box.className = "playlist-box";

let songsHTML = "";

playlist.songs.forEach(song=>{

songsHTML += `

<div class="playlist-song">

<img src="${song.image}">

<div>

<h4>${song.name}</h4>

<p>${song.artist}</p>

</div>

<button class="playlist-play-btn">
▶
</button>

</div>

`;

});

box.innerHTML = `

<div class="playlist-head">

<h3>${playlist.name}</h3>

<button class="delete-btn">
🗑
</button>

</div>

${songsHTML}

`;

const deleteBtn =
box.querySelector(".delete-btn");

deleteBtn.addEventListener("click",()=>{

deletePlaylist(index);

});

const playBtns =
box.querySelectorAll(".playlist-play-btn");

playBtns.forEach((btn,i)=>{

btn.addEventListener("click",()=>{

const song =
playlist.songs[i];

playSong(
song.url,
song.name,
song.artist,
song.image
);

});

});

playlistContainer.appendChild(box);

});

}

// ===== EVENTS =====

document
.querySelector(".controls button")
.addEventListener("click",togglePlay);

document
.querySelector(".playlist-create button")
.addEventListener("click",createPlaylist);

// ===== LOAD =====

window.onload = ()=>{

searchInput.value = "Arijit Singh";

searchSongs();

renderPlaylists();

};