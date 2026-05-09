const API =
"https://manish-jiosaavn-api.manishjai9527.workers.dev/api/search/songs?query=";

const searchInput =
document.querySelector(".search input");

const cardsContainer =
document.querySelector(".cards");

const heroSection =
document.querySelector(".hero");

const playerTitle =
document.querySelector(".now-playing h4");

const playerArtist =
document.querySelector(".now-playing p");

const playerImage =
document.querySelector(".now-playing img");

const playBtn =
document.getElementById("playBtn");

const audio = new Audio();

let currentSong = null;

let typingTimer;


// ===== SUPPORT =====

function openSupport(){

    document.getElementById(
        "supportPopup"
    ).style.display = "flex";

}

function closeSupport(){

    document.getElementById(
        "supportPopup"
    ).style.display = "none";

}

function copyUPI(){

    navigator.clipboard.writeText(
        "8395979644@fam"
    );

    alert("UPI Copied ❤️");

}


// ===== SEARCH SONGS =====

async function searchSongs(query){

    try{

        heroSection.style.display = "none";

        cardsContainer.innerHTML =
        `<h2>Searching...</h2>`;

        const response = await fetch(
            API + encodeURIComponent(query)
        );

        const data = await response.json();

        const songs =
        data?.data?.results || [];

        cardsContainer.innerHTML = "";


        songs.forEach(song => {

            const image =
            song.image?.[2]?.url || "";

            const audioUrl =
            song.downloadUrl?.[4]?.url || "";

            const artist =
            song.artists?.primary?.[0]?.name ||
            "Unknown Artist";


            const card =
            document.createElement("div");

            card.className = "card";


            card.innerHTML = `

            <img src="${image}">

            <h3>${song.name}</h3>

            <p>${artist}</p>

            <button class="download-btn">
            ⬇ Download Song
            </button>

            `;


            card.addEventListener("click",(e)=>{

                if(
                    e.target.classList.contains(
                        "download-btn"
                    )
                ) return;

                playSong(
                    song.name,
                    artist,
                    image,
                    audioUrl
                );

            });


            const downloadBtn =
            card.querySelector(".download-btn");

            downloadBtn.addEventListener("click",()=>{

                const a =
                document.createElement("a");

                a.href = audioUrl;

                a.download =
                song.name + ".mp3";

                a.click();

            });


            cardsContainer.appendChild(card);

        });

    }

    catch(error){

        console.log(error);

    }

}


// ===== PLAY SONG =====

function playSong(title,artist,image,url){

    currentSong = url;

    audio.src = url;

    audio.play();

    playerTitle.innerText = title;

    playerArtist.innerText = artist;

    playerImage.src = image;

    playBtn.innerText = "⏸";

}


// ===== PLAY/PAUSE =====

playBtn.addEventListener("click",()=>{

    if(!currentSong) return;

    if(audio.paused){

        audio.play();

        playBtn.innerText = "⏸";

    }

    else{

        audio.pause();

        playBtn.innerText = "▶";

    }

});


// ===== LIVE SEARCH =====

searchInput.addEventListener("input",()=>{

    clearTimeout(typingTimer);

    const query =
    searchInput.value.trim();

    if(query === ""){

        heroSection.style.display = "flex";

        cardsContainer.innerHTML = "";

        return;
    }

    typingTimer = setTimeout(()=>{

        searchSongs(query);

    },250);

});