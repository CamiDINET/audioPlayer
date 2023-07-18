import { HttpClientModule } from '@angular/common/http';
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
  readingTitle: number=0;
  progress: number = 0;
  blobLocalMusic!:any;
  musicTodisplay:any = {path:"", name:""}
  isBreak:boolean = false;
 
  
   @ViewChild('url') myUrlElement!: ElementRef<HTMLInputElement>;
   @ViewChild('file') myFileElement!: ElementRef<HTMLInputElement>;
   @ViewChild('music') myAudioElement!: ElementRef<HTMLAudioElement>;

   constructor(private http: HttpClientModule){}
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
if(!this.isBreak){
  this.musicTodisplay = this.filesArray[this.readingTitle];
  this.myAudioElement.nativeElement.load();
  this.myAudioElement.nativeElement.play();
  this.isBreak=false;
}else{
  this.myAudioElement.nativeElement.play();
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
  this.myAudioElement.nativeElement.play();
}

break(){
  this.musicIsReading = false;
  this.isBreak=true;
  this.myAudioElement.nativeElement.pause();
}

fileSelected(index:number){
  this.stop()
  this.readingTitle = index;
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
    this.playMusic();
  } else if(this.progress >= 100 && this.readingTitle!==(this.filesArray.length - 1)){  
    this.readingTitle++;
    this.playMusic();   
    }
}

interceptPath(e:any){
  let file = e.target.files[0];
  this.blobLocalMusic = URL.createObjectURL(file);
}
selectDurating(event:any){
  this.break();
   console.log(event.target.getBoundingClientRect().x);//début
   console.log(event.target.getBoundingClientRect().x+250);//fin
   console.log(event.clientX);//click
   this.myAudioElement.nativeElement.currentTime = event.clientX-event.target.getBoundingClientRect().x;
   this.playMusic();
    
}
}