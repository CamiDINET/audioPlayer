import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'audioPlayer';
  filePathSelect: string = "url";
  filesArray: any []=[{path:"../assets/01. Laid To Rest.mp3", name:"Laid To Rest"},
                      {path:"../assets/01. Wail of the North.mp3", name:"Wail of the North"}];
  musicIsReading: boolean = false;
  readingTitle: number = 0;
  progress: number = 0;
  blobLocalMusic!:any;
 
  
   @ViewChild('url') myUrlElement!: ElementRef<HTMLInputElement>;
   @ViewChild('file') myFileElement!: ElementRef<HTMLInputElement>;
   //@ViewChild(this.filePathSelect,{static: false}) myMusicElement!: ElementRef<HTMLAudioElement>;

  selectFilePath(e: any){
    this.filePathSelect = e.target.value;
  }

  sendMusicToThePlaylist(){
    if(this.filePathSelect==="url"){
      if(this.myUrlElement.nativeElement.value===""){return}
      this.filesArray.push({path:this.myUrlElement.nativeElement.value, name: this.myUrlElement.nativeElement.value.substring(this.myUrlElement.nativeElement.value.lastIndexOf("/")+1, this.myUrlElement.nativeElement.value.length)});
    } else{
  if(this.myFileElement.nativeElement.value===""){return}
  this.filesArray.push({path:this.blobLocalMusic, name: this.myFileElement.nativeElement.value.substring(this.myFileElement.nativeElement.value.lastIndexOf("\\")+1, this.myFileElement.nativeElement.value.length)});
  }
}

playMusic(){
this.musicIsReading = true;
let music = document.getElementById("myAudio" + this.readingTitle) as HTMLAudioElement;
music.play();
}

next(){
  if(this.readingTitle===this.filesArray.length-1){
    this.stop();
    this.readingTitle=0;
    this.playMusic();
  } else {
  this.stop();
  this.readingTitle++;
  this.playMusic();
}}

stop(){
  this.musicIsReading = false;
  let music = document.getElementById('myAudio' + this.readingTitle) as HTMLAudioElement;
  music.pause();
  music.currentTime = 0;
}

back(){
  this.stop();
  (this.readingTitle!==0) ? this.readingTitle-- : this.readingTitle=0;
  this.playMusic();
}

break(){
  this.musicIsReading = false;
  let music = document.getElementById('myAudio' + this.readingTitle) as HTMLAudioElement;
  music.pause();
}

fileSelected(e:any){
  this.stop()
  this.readingTitle = e;
  this.playMusic();
}

deleteMusic(i:any){
  this.filesArray.splice(i,1);
}

updateProgressBar(event: Event) {
  const audio = event.target as HTMLAudioElement;
  this.progress = (audio.currentTime / audio.duration) * 100;
  if(this.progress >= 100 && (this.readingTitle===this.filesArray.length - 1)) {
    this.readingTitle=0;
    this.playMusic() 
  } else if(this.progress >= 100 && this.readingTitle!==(this.filesArray.length - 1)){  
    this.readingTitle++;
    this.playMusic();   
    }
}

interceptPath(e:any){
  let file = e.target.files[0];
  this.blobLocalMusic = URL.createObjectURL(file);
}
}