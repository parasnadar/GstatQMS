import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaSpeechService {
  speak(text: string): void {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}