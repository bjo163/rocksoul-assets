from pathlib import Path
import math, struct, wave, json, subprocess

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"moonwitness"/"sfx"/"generated"
OUT.mkdir(parents=True,exist_ok=True)
SR=44100
SOUNDS=[
 ("ui-click-soft",[660,990],0.08,0.12,20),
 ("command-open",[330,440,660],0.14,0.14,12),
 ("notification",[880,1174],0.18,0.14,9),
 ("notification-critical",[220,330],0.28,0.18,5),
 ("success",[523,659,784],0.26,0.16,7),
 ("warning",[440,349],0.24,0.16,6),
 ("error",[196,147],0.26,0.17,5),
 ("evidence-linked",[392,523,659,784],0.32,0.14,7),
 ("trace-found",[740,988,1318],0.30,0.13,8),
 ("ai-complete",[466,622,932],0.28,0.13,8),
]
manifest={"schemaVersion":1,"sampleRate":SR,"canonicalGenerator":"tools/assets/generate-sfx.py","sounds":[]}
for name,freqs,dur,amp,decay in SOUNDS:
    n=int(SR*dur); frames=[]
    for i in range(n):
        t=i/SR; env=math.exp(-decay*t)
        s=sum(math.sin(2*math.pi*f*t) for f in freqs)/len(freqs)
        v=max(-1,min(1,s*env*amp))
        frames.append(struct.pack("<h",int(v*32767)))
    wav=OUT/f"{name}.wav"
    with wave.open(str(wav),"wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b"".join(frames))
    ogg=OUT/f"{name}.ogg"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",str(wav),"-fflags","+bitexact","-flags:a","+bitexact","-map_metadata","-1","-serial_offset","0","-c:a","libvorbis","-q:a","4",str(ogg)],check=True)
    manifest["sounds"].append({"id":name,"wav":f"generated/{name}.wav","ogg":f"generated/{name}.ogg","durationMs":round(dur*1000)})
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
print(json.dumps(manifest,indent=2))
