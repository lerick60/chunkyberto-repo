const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const wavEncoder = `
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1): Blob {
  const dataLen = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buffer);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLen, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLen, true);
  
  new Uint8Array(buffer, 44).set(pcmData);
  
  return new Blob([buffer], { type: 'audio/wav' });
}
`;

const target = "async function decodeAudioData(";
code = code.replace(target, wavEncoder + "\n" + target);
fs.writeFileSync('App.tsx', code);
