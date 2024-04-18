console.log("hello world")
let currentsong=new Audio();
let songs;
let currFolder;
async function getsongs(folder){
    currFolder=folder;
    let a=await fetch(`/${folder}/`)
    let response=await a.text();
    console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    } 
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML =  songUL.innerHTML + `<li>
                            <img src="music.svg" alt=""> 
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Beyonce</div>
                            </div> 
                            <div class="playnow">
                                <span>Playnow</span>
                                <img src="play.svg" alt="">
                            </div>  
                        </li>`;
        
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click",elements=>{
        playmusic(e.querySelector(".info").firstElementChild.innerHTML)
       })
        
    })  
    return songs
     
     
}   
const playmusic=(track,pause=false)=>{
    currentsong.src=`/${currFolder}/`+track
    if(!pause){
        currentsong.play();
        play.src="pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML=decodeURI( track)
    document.querySelector(".songduration").innerHTML="00:00/00:00"
}
function convertSecondsToMinutesSeconds(seconds) {
    // Get the whole number part of the minutes
    var minutes = Math.floor(seconds / 60);
    
    // Get the remaining seconds after converting to minutes
    var remainingSeconds = Math.floor(seconds % 60);
    
    // Pad the minutes and seconds with leading zeros if they are less than 10
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    // Concatenate the minutes and seconds with a colon
    var formattedTime = formattedMinutes + ':' + formattedSeconds;
    
    return formattedTime;
}
async function displayAlbums(){
    let a=await fetch(`/songs/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let cardcontainer=document.querySelector(".cardContainer")
    let anchors=div.getElementsByTagName("a")
   let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e= array[index];
        
    
     if(e.href.includes("/songs"))
     {
        let folder=e.href.split("/").slice(-2)[0]
        let a=await fetch(`/songs/${folder}/info.json`)
        let response=await a.json();
        cardcontainer.innerHTML=cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
        <div class="play">

            <div
                style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #1fdf64; border-radius: 50%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50%" height="50%">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        fill="" stroke-linejoin="round" />
                </svg>
            </div>


        </div>
        <img src="/songs/${folder}/spot.jpeg" alt="">
        <h4>${response.title}</h4>
        <p>${response.description}</p>

    </div>`
        
     }
   }
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
    })
})
}

async function main(){
    await getsongs("songs/angry")
    console.log(songs)
    playmusic(songs[0],true)
    displayAlbums();
   
    
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songduration").innerHTML=`${convertSecondsToMinutesSeconds(currentsong.currentTime)}/${convertSecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration)*100 +"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent+"%"
        currentsong.currentTime=(percent*currentsong.duration)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])  
        if((index-1)>=0)
        {
          playmusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
      let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])  
      if((index+1)<songs.length)
      {
        playmusic(songs[index+1])
      }
    })
    
}
main(); 
