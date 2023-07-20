import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Music } from './music';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'audioPlayer';
  filePathSelect: string = "url";
  filesArray: Music [] = [{path:"../assets/01. Laid To Rest.mp3", name:"Laid To Rest"},
                          {path:"../assets/01. Wail of the North.mp3", name:"Wail of the North"}];
  musicIsReading: boolean = false;
  readingTitle: number = 0;
  blobLocalMusic!:string;
  musicTodisplay:Music = {path:"", name:""};
  isBreak:boolean = false;
  progress:number = 0;
  
   @ViewChild('url') myUrlElement!: ElementRef<HTMLInputElement>;
   @ViewChild('file') myFileElement!: ElementRef<HTMLInputElement>;
   @ViewChild('music') myAudioElement!: ElementRef<HTMLAudioElement>;

   constructor(){}

selectFilePath({target}: Event){
    if(target instanceof HTMLInputElement){
      this.filePathSelect = target.value
    }
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
if(!this.isBreak){
  this.musicTodisplay = this.filesArray[this.readingTitle];
  this.myAudioElement.nativeElement.load();
  this.myAudioElement.nativeElement.play();
  this.isBreak = false;
}else{
  this.myAudioElement.nativeElement!.play();
  this.isBreak=false;
}
}

next(){
  if(this.readingTitle===this.filesArray.length-1){
    this.stop();
    this.readingTitle=0;
    this.playMusic();
  } else {
  this.stop();
  this.readingTitle++;
  this.musicTodisplay = this.filesArray[this.readingTitle]
  this.playMusic();
}}

stop(){
  this.musicIsReading = false;
  this.myAudioElement.nativeElement.pause();
  this.myAudioElement.nativeElement.currentTime = 0;
}

back(){
  this.stop();
  (this.readingTitle!==0) ? this.readingTitle-- : this.readingTitle = 0;
  this.musicTodisplay = this.filesArray[this.readingTitle]
  this.playMusic();
  this.myAudioElement.nativeElement!.play();
}

break(){
  this.musicIsReading = false;
  this.isBreak=true;
  this.myAudioElement.nativeElement!.pause();
}

fileSelected(index:number){
  this.stop()
  this.readingTitle = index;
  this.playMusic();
}

deleteMusic(index:number){
  this.filesArray.splice(index, 1);
}

updateProgressBar({target}: Event) {
  if(target instanceof HTMLAudioElement){
    const audio = target;
    this.progress = parseFloat(((audio.currentTime / audio.duration) * 100).toFixed(2));
    this.progress = Number.isFinite(this.progress) ? this.progress : 0;
    if(this.progress >= 100 && (this.readingTitle===this.filesArray.length - 1)){
      this.readingTitle = 0;
      this.playMusic();
    } else if(this.progress >= 100 && this.readingTitle!==(this.filesArray.length - 1)){  
      this.readingTitle++;
      this.playMusic();
      }
  }
}

interceptPath({target}:Event){
  if (target instanceof HTMLInputElement) {
  let file = target.files![0];
  this.blobLocalMusic = URL.createObjectURL(file);
}}

selectDurating(event: MouseEvent){
  if (event.target instanceof HTMLElement && this.myAudioElement.nativeElement.currentTime!==0) {
  this.break();
    const rect = event.target.getBoundingClientRect();
    const ratio = (event.x - rect.left) / rect.width;
    this.myAudioElement.nativeElement.currentTime = this.myAudioElement.nativeElement.duration * ratio;
    this.playMusic();
  }
}
}

