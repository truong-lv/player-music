// Lấy thuộc tính data-theme
const root = document.querySelector(':root');

const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const PLAY_STORAGE='MY MUSIC';

const playList=$('.playlist');
const audioEle=$('#audio');
const thumb=$(".cd-thumb");
const progress=$('#progress');

let app={
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    listRandom:[],
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAY_STORAGE))||{},
    setConfig:function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAY_STORAGE,JSON.stringify(this.config))
    },  
    loadConfig:function(){
        root.setAttribute('data-theme', this.config.mode);
        this.isRandom=this.config.isRandom;
        $(".btn-random").classList.toggle("active",this.isRandom);
        this.isRepeat=this.config.isRepeat;
        $(".btn-repeat").classList.toggle("active",this.isRepeat);
        audio.volume=this.config.volume;
        $(".btn-volume .volume").value=this.config.volume;

    }, 
    songs:[
        {
            name:"Than more you know",
            singer:"Axwell /\ Ingrosso",
            path:"./src/music/More-Than-You-Know.mp3",
            image:"https://images-na.ssl-images-amazon.com/images/I/71rZmTc6bTL._SX425_.jpg"
        },
        {
            name:"Start",
            singer:"Gaho",
            path:"./src/music/Start.mp3",
            image:"https://avatar-nct.nixcdn.com/song/2020/02/04/2/a/4/0/1580799231699_640.jpg"
        },
        {
            name:"Giày cao gót màu đỏ",
            singer:"Trần Kỳ Danh",
            path:"./src/music/Giày-Cao-Gót-Màu-Đỏ.mp3",
            image:"https://i.ytimg.com/vi/7ryUNlAcCr4/maxresdefault.jpg"
        },
        {
            name:"Hymn For The Weekend",
            singer:"Cosplay",
            path:"./src/music/Hymn-For-The-Weekend.mp3",
            image:"https://i.ytimg.com/vi/mOivOlP9GRk/maxresdefault.jpg"
        },
        {
            name:"Demon",
            singer:"Imagine Dragons",
            path:"./src/music/Demons.mp3",
            image:"https://i1.sndcdn.com/artworks-000241938427-nscbv9-t500x500.jpg"
        },
        {
            name:"Summertime",
            singer:"K-391",
            path:"./src/music/Summertime.mp3",
            image:"https://i1.sndcdn.com/artworks-1zOsj4PW7vW4Fkwu-0Ri2Ng-t500x500.jpg"
        },
        {
            name:"Không sợ",
            singer:"Mã Địch",
            path:"./src/music/Lấy-danh-nghĩa-người-nhà.mp3",
            image:"https://i.pinimg.com/564x/96/c9/e1/96c9e1ad58d710c8d3d10c8bdbd21348.jpg"
        },
        {
            name:"Wait Another Day",
            singer:"Mike Williams x Mesto",
            path:"./src/music/Wait-Another-Day.mp3",
            image:"https://i.pinimg.com/originals/9b/5d/e7/9b5de7d44714bac27412decba30269b0.jpg"
        },
        {
            name:"Monsters",
            singer:"Katie Sky - MushrooM Remix",
            path:"./src/music/Monsters.mp3",
            image:"https://i.ytimg.com/vi/xX7i4TYTG-U/maxresdefault.jpg"
        },
        {
            name:"Counting Stars",
            singer:"OneRepublic",
            path:"./src/music/Counting-Stars.mp3",
            image:"https://i.ytimg.com/vi/hT_nvWreIhg/maxresdefault.jpg"
        }
    ],
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    run: function (){
       
        this.defineProperties();
        this.renderSongs();
        this.loadCurrentSong();
        this.handleEvent();
        this.loadConfig();
    },

    renderSongs: function() {
        let htmls=this.songs.map((song,index)=>{
            return `
            <div class="song" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</hh3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
        })

        playList.innerHTML=htmls.join('');
    },

    loadCurrentSong: function(){
        $('.dashboard h2').textContent=this.currentSong.name
        $('.dashboard h4').textContent=this.currentSong.singer
        thumb.style.backgroundImage="url("+this.currentSong.image+")"
        // audio.src=this.currentSong.path
        audio.src=this.currentSong.path
        

        if($(".song.active")){
            $(".song.active").classList.remove("active");
        }
        $(`div[data-index="${this.currentIndex}"]`).classList.add("active")
    },

    handleEvent: function(){
        const _this=this;

        // Handle mouse/touch scroll events
        const cdWidth=$('.cd').offsetWidth;
        document.onscroll=function(){
            const scrollTop = window.scrollY|| document.documentElement.scrollTop;
            const currentScroll=cdWidth-scrollTop;
            $('.cd').style.width=(currentScroll>0?currentScroll:0 )+'px';
        }

        //Rotate CD
        const cdthumbAnimate=thumb.animate([
                {transform: 'rotate(360deg'}
            ],{
                duration:10000,
                iterations:Infinity
            })
        cdthumbAnimate.pause();

        //Scroll into view


        // Handle click button play/pause event
        $(".btn-toggle-play").onclick=function(){
            if(_this.isPlaying==false){
                $(".player").classList.add("playing");
                audio.src=_this.currentSong.path;
                _this.isPlaying=true;
                audio.play();
                cdthumbAnimate.play();
            }
            else{
                $(".player").classList.remove("playing");
                audio.src=''
                _this.isPlaying=false;
                audio.pause();
                cdthumbAnimate.pause();
            }
        }

        //Click to play song
        $(".playlist").onclick=function(e){
            const songTarget=e.target.closest(".song:not(.active)");
            if(e.target.closest(".option > .fas")){

            }
            else if(songTarget){
                _this.currentIndex=Number(songTarget.dataset.index);
                _this.loadCurrentSong();
                _this.isPlaying=false;
                $(".btn-toggle-play").onclick()
            }
        }


        // Next song
        $(".btn-next").onclick=function(){
            if(_this.isRandom){
                randomSongs();
            }
            else{
                _this.currentIndex=(_this.currentIndex+1>_this.songs.length-1)?0:(_this.currentIndex+1);
            }
            _this.loadCurrentSong();
            _this.isPlaying=false;
            $(".btn-toggle-play").onclick()
            $(".song.active").scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
        }

        // Prev song
        $(".btn-prev").onclick=function(){
            if(_this.isRandom){
                randomSongs();
            }
            else{
                _this.currentIndex=(_this.currentIndex-1<0)?(_this.songs.length-1):(_this.currentIndex-1);
            }
            _this.loadCurrentSong();
            _this.isPlaying=false;
            $(".btn-toggle-play").onclick()
            $(".song.active").scrollIntoView({behavior: "smooth", block: "nearest"});
        }

        //Random song
        function randomSongs(){
            let songRandom;
            do{
                if(_this.listRandom.length===_this.songs.length){
                    _this.listRandom.length=0;
                }
                songRandom=Math.floor(Math.random()*(_this.songs.length))
                
            }while(songRandom===_this.currentIndex || _this.listRandom.some(song=>song===songRandom))
            _this.currentIndex=songRandom;
            _this.listRandom.push(songRandom)
               
        }
        $(".btn-random").onclick=function(){
            this.classList.toggle("active");
            _this.isRandom=!_this.isRandom;
            _this.listRandom.length=0
            _this.listRandom.push(_this.currentIndex)

            _this.setConfig('isRandom',_this.isRandom)
        }

        //Repeat song
        $(".btn-repeat").onclick=function(){
            this.classList.toggle("active");
            _this.isRepeat=!_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat)
        }
        //Volume
        $(".btn-volume .fa-volume-up").onclick=function(){
            $(".btn-volume .volume").classList.toggle("active");
            
        }
        $(".btn-volume .volume").onchange=function(){
            audio.volume=this.value;
            _this.setConfig('volume',audio.volume);
        }

        //Seek audio
        audio.ontimeupdate=function(){
            if(_this.isPlaying==true && audio.duration){
                const progressPercent=Math.floor((audio.currentTime*100)/audio.duration);
                progress.value=progressPercent;
            }
            
        }
        //Seek progress
        progress.onmousedown=function(){
            _this.isPlaying=false;
        }
        progress.onmouseup=function(){
            _this.isPlaying=true;
        }
        progress.onchange=function(){
            const timeUpdate=Math.floor((audio.duration*progress.value)/100);
            audio.currentTime=timeUpdate;
        }

        audio.onended=function(){
            if(_this.isRepeat){
                _this.loadCurrentSong();
                _this.isPlaying=false;
                $(".btn-toggle-play").onclick()
            }else{
                $(".btn-next").onclick();
            }
            
        }

    }
}

app.run();

//EVENT CLICK CHANGE MODE
window.onload = function () {
    const themeBtn = document.getElementById('toggleBtn');
    themeBtn.addEventListener('click', function () {
      
      const isLightMode =
        root.getAttribute('data-theme') === 'dark' ? false : true;
      // toggle theme mode
      if (isLightMode) {
        root.setAttribute('data-theme', 'dark');
        app.setConfig('mode','dark')
      } else {
        root.setAttribute('data-theme', 'light');
        app.setConfig('mode','light')
      }
      // thay đổi vị trí của button
      this.classList.toggle('active');
    });
  };