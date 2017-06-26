import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  padd = '';

  files = [];
  voices:SpeechSynthesisVoice[] = [];
  currentVoice:SpeechSynthesisVoice = null;
  voiceIndex = 0;
  selectedFile = '';

  @ViewChild('saveDialog') saveDialog;
  @ViewChild('openDialog') openDialog;
  @ViewChild('playback') playbackButton;

  ngOnInit() {
    if ( localStorage.getItem('padd-index') == null ) {
      localStorage.setItem('padd-index', 'untitled');
    }
    this.files = localStorage.getItem('padd-index').split(';');
    this.actionCancel();
  }
  ngAfterViewInit() {
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.currentVoice = this.voices[this.voiceIndex];
    }
  }

  public menuFileOpen() {
    this.saveDialog.nativeElement.hidden = true;
    this.openDialog.nativeElement.hidden = false;
    this.files = localStorage.getItem('padd-index').split(';');
    
  }

  public actionCancel() {
    this.openDialog.nativeElement.hidden = true;
    this.saveDialog.nativeElement.hidden = true;
  }

  public menuFileSaveAs() {
    this.openDialog.nativeElement.hidden = true;
    this.saveDialog.nativeElement.hidden = false;
  }



  public menuNextVoice() {
    this.voiceIndex++;
    this.voiceIndex = this.voiceIndex % this.voices.length;
    this.currentVoice = this.voices[this.voiceIndex];
  }

  public menuFileSave() {
    if ( this.selectedFile ) {
      localStorage.setItem(this.selectedFile, this.padd);
    
    } else {
      this.openDialog.nativeElement.hidden = true;
      this.saveDialog.nativeElement.hidden = false;
    }
    
  }

  timeoutResumeInfinity = null;

  resumeInfinity() {
    window.speechSynthesis.resume();
    this.timeoutResumeInfinity = setTimeout(this.resumeInfinity, 1000);
}

  public menuPlayback() {
    if ( this.padd.trim() !== '' ) {
      let utterance = new SpeechSynthesisUtterance(this.padd);
      
utterance.onstart = (event) => {
    this.resumeInfinity();
};

utterance.onend = (event) => {
    clearTimeout(this.timeoutResumeInfinity);
};
      utterance.voice = this.currentVoice;
      window.speechSynthesis.speak(utterance);
    }
  }

  public save(paddFile) {
    if ( localStorage.getItem('padd-index').indexOf(paddFile) === -1 ) {
      localStorage.setItem('padd-index', localStorage.getItem('padd-index') + ';' + paddFile);
    } 
    localStorage.setItem(paddFile, this.padd);
    this.saveDialog.nativeElement.hidden = true;
  }

  public load(paddFile) {
    this.padd = localStorage.getItem(paddFile);
    this.openDialog.nativeElement.hidden = true;
  }
}
