export function speakText(
  text: string,
  lang: string = 'en',
  onEnd?: () => void,
  onStart?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting characters for cleaner audio
  const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (lang === 'ko') {
    utterance.lang = 'ko-KR';
  } else if (lang === 'ur') {
    utterance.lang = 'ur-PK';
  } else if (lang === 'ar') {
    utterance.lang = 'ar-SA';
  } else {
    utterance.lang = 'en-US';
  }

  if (onStart) {
    utterance.onstart = () => onStart();
  }
  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Plays a subtle, pleasant martial arts notification chime
 * using the browser's Web Audio API when the AI Coach responds to a voice question.
 */
export function playCoachResponseChime() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Harmonic Chord Tone 1: 523.25 Hz (C5) softly ramping to 659.25 Hz (E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Harmonic Chord Tone 2: 783.99 Hz (G5 bell chime) with gentle shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.04);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.07, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.4);

    osc2.start(now + 0.04);
    osc2.stop(now + 0.48);

    // Safely close context after sound decay
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 600);
  } catch (err) {
    console.warn('Audio chime cue skipped:', err);
  }
}

export interface VoiceRecorderSession {
  stop: () => void;
}

export interface VoiceRecorderCallbacks {
  onAudioLevel?: (level: number) => void; // 0 to 100
  onResult: (transcript: string) => void;
  onError: (errorMessage: string) => void;
  onStatusChange: (status: 'idle' | 'requesting' | 'listening' | 'transcribing' | 'error') => void;
}

// Convert audio Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // strip data:audio/...;base64,
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Checks and starts microphone capture.
 * Uses MediaRecorder with live AudioContext volume metering,
 * and falls back to Gemini 3.5 Transcribe if Web Speech API is unavailable or silent.
 */
export async function startVoiceRecording(
  language: string,
  callbacks: VoiceRecorderCallbacks
): Promise<VoiceRecorderSession | null> {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    callbacks.onError('Microphone access is not supported by your browser.');
    callbacks.onStatusChange('error');
    return null;
  }

  callbacks.onStatusChange('requesting');

  let mediaStream: MediaStream;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err: any) {
    console.error('Microphone permission error:', err);
    let message = 'Could not access microphone.';
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      message =
        'Microphone permission was denied. Please allow microphone access in your browser settings (click the lock/camera icon next to the URL) and try again.';
    } else if (err.name === 'NotFoundError') {
      message = 'No microphone device was detected on your computer or mobile device.';
    } else if (err.name === 'NotReadableError') {
      message = 'Microphone is already in use by another application.';
    }
    callbacks.onError(message);
    callbacks.onStatusChange('error');
    return null;
  }

  callbacks.onStatusChange('listening');

  // Set up AudioContext for real-time visual sound level meter
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let animFrameId: number | null = null;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        callbacks.onAudioLevel?.(normalized);
        animFrameId = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    }
  } catch (e) {
    console.warn('AudioContext volume meter initialization skipped:', e);
  }

  // Set up MediaRecorder
  let mediaRecorder: MediaRecorder | null = null;
  const audioChunks: Blob[] = [];
  const supportedMimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
  ];
  let chosenMimeType = '';
  for (const mime of supportedMimeTypes) {
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime)) {
      chosenMimeType = mime;
      break;
    }
  }

  try {
    mediaRecorder = chosenMimeType
      ? new MediaRecorder(mediaStream, { mimeType: chosenMimeType })
      : new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
  } catch (e) {
    console.warn('MediaRecorder init error, will rely on speech recognition:', e);
  }

  // Also initialize Web Speech API if present for instant speech recognition
  // @ts-expect-error browser vendor prefix
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition: any = null;
  let webSpeechTranscript = '';

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      if (language === 'ur') {
        recognition.lang = 'ur-PK';
      } else if (language === 'ar') {
        recognition.lang = 'ar-SA';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            webSpeechTranscript += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const currentText = (webSpeechTranscript + ' ' + interim).trim();
        if (currentText) {
          callbacks.onResult(currentText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('WebSpeech error:', event.error);
      };

      recognition.start();
    } catch (e) {
      console.warn('Web Speech recognition start error:', e);
    }
  }

  if (mediaRecorder && mediaRecorder.state === 'inactive') {
    mediaRecorder.start(250); // Record in 250ms chunks
  }

  let isStopped = false;

  const stop = async () => {
    if (isStopped) return;
    isStopped = true;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    callbacks.onAudioLevel?.(0);

    // Stop recognition
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    // Stop AudioContext & MediaStream tracks
    if (audioContext && audioContext.state !== 'closed') {
      try {
        audioContext.close();
      } catch (e) {
        // ignore
      }
    }
    mediaStream.getTracks().forEach((track) => track.stop());

    // If we already have a solid transcript from Web Speech API, finalize it!
    const finalWebSpeech = webSpeechTranscript.trim();
    if (finalWebSpeech.length > 2) {
      callbacks.onResult(finalWebSpeech);
      callbacks.onStatusChange('idle');
      return;
    }

    // Otherwise, send recorded audio blob to Gemini 3.5 Transcribe
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      callbacks.onStatusChange('transcribing');
      mediaRecorder.onstop = async () => {
        try {
          const finalMime = mediaRecorder?.mimeType || chosenMimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunks, { type: finalMime });

          if (audioBlob.size < 500) {
            callbacks.onError('No audio detected. Please speak louder into your microphone.');
            callbacks.onStatusChange('idle');
            return;
          }

          const base64Audio = await blobToBase64(audioBlob);

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Audio,
              mimeType: finalMime,
              language,
            }),
          });

          const data = await res.json();
          const transcribedText = (data.text || '').trim();

          if (transcribedText) {
            callbacks.onResult(transcribedText);
          } else {
            callbacks.onError('Could not detect clear speech. Please try speaking again.');
          }
        } catch (transcribeErr) {
          console.error('Transcription error:', transcribeErr);
          callbacks.onError('Failed to transcribe voice audio. You can also type directly in the box.');
        } finally {
          callbacks.onStatusChange('idle');
        }
      };
      mediaRecorder.stop();
    } else {
      callbacks.onStatusChange('idle');
    }
  };

  return { stop };
}
