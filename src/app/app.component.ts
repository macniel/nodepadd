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
  utterance:SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
  voiceIndex = 0;
  selectedFile = '';

  @ViewChild('saveDialog') saveDialog;
  @ViewChild('openDialog') openDialog;
  @ViewChild('playback') playbackButton;
  @ViewChild('textPadd') textPadd;

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

  public getSelectionOfText() {
    const textArea = this.textPadd.nativeElement;
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
  }

  public menuPlayback() {
    if ( this.getSelectionOfText() !== '' ) {
      this.utterance.text = this.getSelectionOfText();
    } else if ( this.padd.trim() !== '' ) {
      
        this.utterance.text = this.padd;  
      
    } else {
      this.utterance.text = 'No Log specified';
    }
    this.utterance.voice = this.currentVoice;
    window.speechSynthesis.speak(this.utterance);
    
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
