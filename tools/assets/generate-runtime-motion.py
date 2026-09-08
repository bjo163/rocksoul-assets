from pathlib import Path
import json, math, shutil, subprocess, tempfile
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[2]
PACK=ROOT/"moonwitness/runtime-motion-pack"
manifest=json.loads((PACK/"manifest.json").read_text())
W=H=256; FPS=24; FRAMES=24
BG=(11,11,11,255)
hex_to_rgb=lambda h: tuple(int(h.lstrip("#")[i:i+2],16) for i in (0,2,4))

def draw_frame(motion, i):
    im=Image.new("RGBA",(W,H),BG); d=ImageDraw.Draw(im)
    col=hex_to_rgb(motion["color"])+(255,)
    t=i/(FRAMES-1)
    kind=motion["kind"]
    if kind=="pulse":
        r=28+int(46*t); a=max(0,int(220*(1-t)))
        d.ellipse((128-r,128-r,128+r,128+r),outline=col[:3]+(a,),width=5)
        d.ellipse((98,98,158,158),fill=col)
    elif kind in ("link",):
        d.ellipse((50,106,94,150),outline=col,width=5); d.ellipse((162,106,206,150),outline=col,width=5)
        x=94+int(68*t); d.line((94,128,x,128),fill=col,width=6)
    elif kind=="check":
        d.ellipse((56,56,200,200),outline=col,width=7)
        pts=[(86,132),(114,160),(172,90)]; n=max(2,int(3*t)+1)
        d.line(pts[:n],fill=col,width=11,joint="curve")
    elif kind in ("orbit","spin"):
        d.ellipse((82,82,174,174),outline=(48,48,48,255),width=5)
        a=t*2*math.pi; x=128+int(math.cos(a)*64); y=128+int(math.sin(a)*64)
        d.ellipse((x-9,y-9,x+9,y+9),fill=col)
    elif kind=="rise":
        y=168-int(76*t); d.line((128,y,128,y-70),fill=col,width=9)
        d.polygon([(108,y-50),(128,y-76),(148,y-50)],fill=col)
    elif kind=="reconnect":
        start=int(t*270); d.arc((62,62,194,194),start=start,end=start+240,fill=col,width=9)
    elif kind=="trace":
        pts=[(44,166),(82,82),(120,180),(164,92),(218,130)]
        upto=max(2,int(1+t*(len(pts)-1))); d.line(pts[:upto],fill=col,width=6,joint="curve")
    else:
        x=28+int(26*t); d.rounded_rectangle((x,84,x+148,172),radius=16,outline=col,width=5,fill=(21,21,21,255))
    return im

def lottie(motion):
    rgb=[v/255 for v in hex_to_rgb(motion["color"])]
    return {
      "v":"5.12.2","fr":FPS,"ip":0,"op":FRAMES,"w":W,"h":H,"nm":motion["id"],
      "meta":{"generator":"MoonWitness v1.3","reducedMotionFallback":"static-first-frame"},
      "layers":[{
        "ty":4,"nm":motion["id"],"ip":0,"op":FRAMES,"st":0,
        "ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[128,128,0]},
              "a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[
                {"t":0,"s":[70,70,100],"e":[115,115,100]},
                {"t":FRAMES-1,"s":[115,115,100]}
              ]}},
        "shapes":[{"ty":"el","p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[72,72]},"nm":"dot"},
                  {"ty":"fl","c":{"a":0,"k":[*rgb,1]},"o":{"a":0,"k":100},"nm":"fill"}]
      }]
    }

png_dir=PACK/"png"; webm_dir=PACK/"webm"; lottie_dir=PACK/"lottie"
for d in (png_dir,webm_dir,lottie_dir): d.mkdir(parents=True,exist_ok=True)
outputs=[]
for motion in manifest["motions"]:
    frames=[draw_frame(motion,i) for i in range(FRAMES)]
    apng=png_dir/(motion["id"]+".png")
    frames[0].save(apng,save_all=True,append_images=frames[1:],duration=int(1000/FPS),loop=0,disposal=2,optimize=False)
    (lottie_dir/(motion["id"]+".json")).write_text(json.dumps(lottie(motion),separators=(",",":"))+"\n")
    with tempfile.TemporaryDirectory() as td:
        td=Path(td)
        for i,fr in enumerate(frames): fr.convert("RGB").save(td/f"{i:03d}.png")
        webm=webm_dir/(motion["id"]+".webm")
        subprocess.run(["ffmpeg","-loglevel","error","-y","-fflags","+bitexact","-framerate",str(FPS),"-i",str(td/"%03d.png"),"-map_metadata","-1","-c:v","libvpx-vp9","-flags:v","+bitexact","-pix_fmt","yuva420p",str(webm)],check=True)
    outputs.append({"id":motion["id"],"source":f"moonwitness/runtime-motion-pack/svg/{motion['id']}.svg",
                    "apng":f"moonwitness/runtime-motion-pack/png/{motion['id']}.png",
                    "webm":f"moonwitness/runtime-motion-pack/webm/{motion['id']}.webm",
                    "lottie":f"moonwitness/runtime-motion-pack/lottie/{motion['id']}.json"})
(PACK/"generated-manifest.json").write_text(json.dumps({"schemaVersion":1,"version":"1.3","reproducibility":{"apng":"byte-stable","lottie":"byte-stable","webm":"semantic-ffprobe"},"outputs":outputs},indent=2)+"\n")
print(json.dumps({"motions":len(outputs),"formats":["animated-svg","apng","webm","lottie"]},indent=2))
