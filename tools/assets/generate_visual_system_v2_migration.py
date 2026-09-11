from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
CHECK = "--check" in __import__("sys").argv
WRITES = {}

def read(rel):
    return (ROOT / rel).read_text()

def read_json(rel):
    return json.loads(read(rel))

def save(rel, value):
    if not value.endswith("\n"):
        value += "\n"
    WRITES[rel] = value

def dump(value):
    return json.dumps(value, indent=2, ensure_ascii=False) + "\n"

MONO = 'font-family="IBM Plex Mono,monospace"'
BODY = 'font-family="Inter,Arial,sans-serif"'
DISPLAY = 'font-family="Inter Tight,Inter,Arial,sans-serif"'

def frame(label, desc, body, w=640, h=360):
    sid = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" aria-labelledby="%s-t %s-d">'
        '<title id="%s-t">%s</title><desc id="%s-d">%s</desc>'
        '<rect width="%d" height="%d" rx="12" fill="#151515" stroke="#4A4A4A"/>'
        '<text x="24" y="34" fill="#A3A3A3" %s font-size="10" letter-spacing="2">%s</text>%s</svg>'
        % (w, h, sid, sid, sid, label, sid, desc, w, h, MONO, label, body)
    )

def grid():
    parts = ['<g stroke="#242424" stroke-width="1" opacity=".7">']
    for x in range(40, 640, 40):
        parts.append('<path d="M%d 54V332"/>' % x)
    for y in range(60, 340, 40):
        parts.append('<path d="M24 %dH616"/>' % y)
    parts.append("</g>")
    return "".join(parts)

def node(kind, x, y, label, accent=False, ghost=False):
    stroke = "#D1132A" if accent else "#F7F4EC"
    dash = ' stroke-dasharray="6 5" opacity=".75"' if ghost else ""
    if kind == "evidence":
        shape = '<path d="M%d %dL%d %dL%d %dL%d %dZ" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/>' % (x,y-28,x+34,y,x,y+28,x-34,y,stroke,dash)
    elif kind == "source":
        shape = '<path d="M%d %dH%dL%d %dV%dH%dZ" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/><path d="M%d %dV%dH%d" fill="none" stroke="%s"/>' % (x-38,y-25,x+20,x+38,y-7,y+25,x-38,stroke,dash,x+20,y-25,y-7,x+38,stroke)
    elif kind == "person":
        shape = '<circle cx="%d" cy="%d" r="28" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/><circle cx="%d" cy="%d" r="18" fill="none" stroke="%s"/>' % (x,y,stroke,dash,x,y,stroke)
    elif kind == "event":
        shape = '<path d="M%d %dH%dL%d %dL%d %dH%dL%d %dZ" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/>' % (x-34,y-24,x+20,x+34,y,x+20,y+24,x-34,x-48,y,stroke,dash)
    elif kind == "story":
        shape = '<rect x="%d" y="%d" width="84" height="48" rx="8" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/><path d="M%d %dH%dM%d %dH%d" stroke="%s"/>' % (x-42,y-24,stroke,dash,x-28,y-8,x+28,x-28,y+2,x+14,stroke)
    elif kind == "text":
        shape = '<path d="M%d %dH%dV%dH%dM%d %dv12m0 24v12m84-48v12m0 24v12" fill="none" stroke="%s" stroke-width="2"%s/>' % (x-42,y-24,x+42,y+24,x-42,x-42,y-24,stroke,dash)
    elif kind == "legal":
        shape = '<path d="M%d %dH%dL%d %dV%dH%dL%d %dZ" fill="#0B0B0B" stroke="#D1132A" stroke-width="3"%s/>' % (x-42,y-24,x+30,x+42,y-12,y+24,x-30,x-42,y+12,dash)
    elif kind == "external":
        shape = '<rect x="%d" y="%d" width="62" height="48" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/><path d="M%d %dh17v17m0-17L%d %d" fill="none" stroke="%s" stroke-width="2"/>' % (x-31,y-24,stroke,dash,x+4,y-13,x-3,y+11,stroke)
    elif kind == "candidate":
        shape = '<circle cx="%d" cy="%d" r="29" fill="#0B0B0B" stroke="%s" stroke-width="2" stroke-dasharray="7 5"/><circle cx="%d" cy="%d" r="36" fill="none" stroke="%s" opacity=".45" stroke-dasharray="2 6"/>' % (x,y,stroke,x,y,stroke)
    elif kind == "missing":
        shape = '<path d="M%d %dL%d %dL%d %dM%d %dL%d %dL%d %d" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="6 5"/>' % (x,y-30,x+34,y,x+7,y+24,x-7,y+24,x-34,y,x-8,y-24,stroke)
    elif kind == "system":
        shape = '<rect x="%d" y="%d" width="76" height="40" rx="2" fill="#0B0B0B" stroke="%s" stroke-width="2"/><rect x="%d" y="%d" width="76" height="40" rx="2" fill="none" stroke="%s" opacity=".45"/>' % (x-38,y-18,stroke,x-31,y-26,stroke)
    else:
        shape = '<rect x="%d" y="%d" width="80" height="48" rx="2" fill="#0B0B0B" stroke="%s" stroke-width="2"%s/>' % (x-40,y-24,stroke,dash)
    return shape + '<text x="%d" y="%d" text-anchor="middle" fill="#A3A3A3" %s font-size="8">%s</text>' % (x,y+48,MONO,label)

def edge(kind, x1, y1, x2, y2, label=""):
    stroke, sw, dash = "#F7F4EC", 2, ""
    if kind == "references":
        stroke, sw = "#A3A3A3", 1
    elif kind == "temporal":
        stroke, sw = "#A3A3A3", 3
    elif kind == "legal":
        stroke, sw = "#D1132A", 3
    elif kind == "provenance":
        dash = ' stroke-dasharray="1 7" stroke-linecap="round"'
    elif kind == "unresolved":
        stroke, sw, dash = "#767676", 1, ' stroke-dasharray="5 7"'
    if kind == "identity":
        base = '<path d="M%d %dL%d %dM%d %dL%d %d" stroke="%s" stroke-width="%d" fill="none"%s/>' % (x1,y1-3,x2,y2-3,x1,y1+3,x2,y2+3,stroke,sw,dash)
    else:
        base = '<path d="M%d %dL%d %d" stroke="%s" stroke-width="%d" fill="none"%s/>' % (x1,y1,x2,y2,stroke,sw,dash)
    arrow = ""
    if kind in {"supports","references","temporal","legal","dependency","routes-to"}:
        arrow = '<path d="M%d %dL%d %dL%d %d" fill="none" stroke="%s" stroke-width="2"/>' % (x2-9,y2-5,x2,y2,x2-9,y2+5,stroke)
    extra = ""
    if kind == "contradicts":
        mx, my = (x1+x2)//2, (y1+y2)//2
        extra = '<path d="M%d %dl16 16m0-16-16 16" stroke="#D1132A" stroke-width="2"/>' % (mx-8,my-8)
    lab = '<text x="%d" y="%d" text-anchor="middle" fill="#A3A3A3" %s font-size="7">%s</text>' % ((x1+x2)//2,(y1+y2)//2-8,MONO,label) if label else ""
    return base + arrow + extra + lab

def chart(label, body, desc):
    return frame(label.upper().replace("-"," / "), desc, grid() + body)

def chart_svg(asset):
    if asset in {"line-chart","confidence-trend"}:
        return chart(asset, '<path d="M72 292H594M72 78V292" stroke="#A3A3A3"/><path d="M84 250C150 208 192 236 250 176S356 158 412 118 492 132 566 92" fill="none" stroke="#F7F4EC" stroke-width="2"/><path d="M412 82V292" stroke="#D1132A" stroke-width="3"/><path d="M84 270C150 226 194 250 250 190S356 174 412 132 492 146 566 108" fill="none" stroke="#A3A3A3" stroke-width="1" stroke-dasharray="5 5"/>', "Line/confidence grammar with separate uncertainty and semantic boundary.")
    if asset in {"area-chart","historicity-band"}:
        return chart(asset, '<path d="M82 266C152 224 190 248 246 188S350 162 420 126 500 142 566 104V278H82Z" fill="#A3A3A3" opacity=".2"/><path d="M82 266C152 224 190 248 246 188S350 162 420 126 500 142 566 104" fill="none" stroke="#F7F4EC" stroke-width="2"/><path d="M430 90V282" stroke="#D1132A" stroke-width="3"/><text x="72" y="316" fill="#A3A3A3" %s font-size="8">SOLID = CONFIDENCE · BAND/DASH = UNCERTAINTY</text>' % MONO, "Area/uncertainty grammar with explicit boundary.")
    if asset in {"bar-chart","event-frequency","repository-health"}:
        bars = "".join('<rect x="%d" y="%d" width="44" height="%d" fill="#F7F4EC"/>' % (100+i*74,292-h,h) for i,h in enumerate([68,104,146,120,180,154]))
        return chart(asset, '<path d="M72 292H594M72 78V292" stroke="#A3A3A3"/><g>%s</g><path d="M536 84V292" stroke="#D1132A" stroke-width="3"/><text x="526" y="72" fill="#D1132A" %s font-size="8">THRESHOLD</text>' % (bars,MONO), "Magnitude is neutral; crimson marks semantic exception or threshold.")
    if asset in {"stacked-bar-chart","event-type-distribution"}:
        blocks = "".join('<rect x="%d" y="132" width="54" height="70" fill="#F7F4EC"/><rect x="%d" y="202" width="54" height="46" fill="#A3A3A3"/><rect x="%d" y="248" width="54" height="24" fill="#4A4A4A"/>' % (x,x,x) for x in [110,198,286,374,462])
        return chart(asset, blocks + '<text x="74" y="316" fill="#A3A3A3" %s font-size="8">STABLE SEGMENT ORDER · GRAYSCALE SAFE</text>' % MONO, "Stacked/category grammar remains readable without hue.")
    if asset in {"donut-chart","status-ring"}:
        body = '<circle cx="220" cy="188" r="82" fill="none" stroke="#242424" stroke-width="24"/><circle cx="220" cy="188" r="82" fill="none" stroke="#F7F4EC" stroke-width="24" stroke-dasharray="350 516" transform="rotate(-90 220 188)"/><path d="M220 94A94 94 0 0 1 314 188" fill="none" stroke="#D1132A" stroke-width="3" stroke-dasharray="5 5"/><text x="220" y="190" text-anchor="middle" fill="#F7F4EC" %s font-size="40">68%%</text><text x="220" y="216" text-anchor="middle" fill="#A3A3A3" %s font-size="9">VERIFIED</text>' % (DISPLAY,MONO)
        return chart(asset, body, "Ring/donut state is backed by line treatment and text.")
    if asset in {"heat-strip","geographic-heatmap","place-material-context"}:
        fills=["#242424","#4A4A4A","#666666","#A3A3A3","#F7F4EC"]
        cells=[]
        for r in range(6):
            for c in range(10):
                cells.append('<rect x="%d" y="%d" width="38" height="26" rx="2" fill="%s"/>' % (92+c*44,94+r*32,fills[(r*7+c*3)%5]))
        return chart(asset, "".join(cells) + '<path d="M520 94V286" stroke="#D1132A" stroke-width="3"/>', "Heat/context grammar uses grayscale intensity and explicit semantic boundary.")
    if asset in {"evidence-timeline"}:
        body='<path d="M70 184H574" stroke="#A3A3A3" stroke-width="3"/>'+node("source",112,184,"SOURCE")+node("evidence",244,184,"EVIDENCE")+node("event",386,184,"EVENT")+node("candidate",530,184,"CANDIDATE",False,True)
        return chart(asset,body,"Temporal ribbon carries semantic node geometry.")
    if asset in {"provenance-chain"}:
        body=edge("provenance",118,182,226,182,"TRACE")+edge("provenance",278,182,386,182,"VERIFY")+edge("provenance",438,182,546,182,"PUBLISH")+node("source",92,182,"SOURCE")+node("evidence",252,182,"EVIDENCE")+node("canonical",412,182,"CANONICAL")+node("external",572,182,"PUBLIC")
        return chart(asset,body,"Provenance is a trace path rather than a generic connector.")
    if asset in {"node-link-correlation","correlation-network","event-topology","cross-domain-relations"}:
        body=edge("supports",294,172,178,104,"SUPPORTS")+edge("contradicts",346,172,488,104,"CONTRADICTS")+edge("references",294,194,170,270,"REFERENCES")+edge("provenance",346,194,492,270,"PROVENANCE")+edge("unresolved",320,154,320,88,"UNRESOLVED")+node("event",320,182,"EVENT")+node("evidence",150,96,"EVIDENCE")+node("legal",518,96,"LEGAL",True)+node("source",150,272,"SOURCE")+node("person",520,272,"PERSON")+node("candidate",320,76,"CANDIDATE",False,True)
        return chart(asset,body,"Relationship grammar uses geometry, line rhythm, direction and fragmentation.")
    if asset in {"graph-nodes","legend-styles"}:
        defs=[("canonical",84,112,"CANONICAL"),("evidence",208,112,"EVIDENCE"),("source",332,112,"SOURCE"),("person",456,112,"PERSON"),("event",568,112,"EVENT"),("story",96,250,"STORY"),("text",220,250,"RGBL"),("legal",344,250,"LEGAL"),("external",468,250,"EXTERNAL"),("candidate",576,250,"CANDIDATE")]
        return chart(asset,"".join(node(t,x,y,l,t=="legal",t=="candidate") for t,x,y,l in defs),"Canonical V2 graph node grammar.")
    if asset == "edge-styles":
        types=["supports","contradicts","references","temporal","identity","legal","provenance","dependency","routes-to","unresolved"]
        body="".join(edge(t,350 if i>=5 else 62,88+(i%5)*50,(350 if i>=5 else 62)+150,88+(i%5)*50,t.upper()) for i,t in enumerate(types))
        return chart(asset,body,"Canonical V2 graph edge grammar.")
    if asset in {"evidence-matrix"}:
        body='<g stroke="#4A4A4A">'+"".join('<path d="M%d 82V292"/>'%x for x in [150,250,350,450,550])+"".join('<path d="M74 %dH586"/>'%y for y in [118,160,202,244,286])+'</g><path d="M186 139l8-8 8 8-8 8Z" fill="none" stroke="#F7F4EC" stroke-width="2"/><circle cx="294" cy="181" r="7" fill="none" stroke="#F7F4EC" stroke-width="2"/><rect x="390" y="216" width="14" height="14" fill="none" stroke="#F7F4EC" stroke-width="2"/><circle cx="394" cy="139" r="8" fill="none" stroke="#767676" stroke-dasharray="3 3"/>'
        return chart(asset,body,"Evidence matrix uses shape and line pattern as semantic backstops.")
    if asset in {"activity-sparkline"}:
        return chart(asset,'<path d="M58 264L104 218L146 236L192 176L238 198L286 154L334 174L382 122L430 144L480 98L526 118L582 76" fill="none" stroke="#F7F4EC" stroke-width="2"/><path d="M430 72V284" stroke="#D1132A" stroke-width="3"/><text x="58" y="316" fill="#F7F4EC" %s font-size="28">+32%%</text>' % DISPLAY,"Sparkline uses neutral trend and semantic annotation.")
    if asset in {"metric-counters","kpi-cards"}:
        cards=[]
        vals=[("RECORDS","12,482","#F7F4EC"),("UNRESOLVED","184","#A3A3A3"),("CRITICAL","7","#D1132A")]
        for i,(lab,val,color) in enumerate(vals):
            x=74+i*180
            cards.append('<rect x="%d" y="108" width="156" height="136" rx="4" fill="#0B0B0B" stroke="#4A4A4A"/><text x="%d" y="142" fill="#A3A3A3" %s font-size="8">%s</text><text x="%d" y="204" fill="%s" %s font-size="34">%s</text>'%(x,x+18,MONO,lab,x+18,color,DISPLAY,val))
        return chart(asset,"".join(cards),"Metrics reserve crimson for critical exception.")
    if asset == "annotation-tools":
        return chart(asset,'<path d="M88 260L238 174" stroke="#D1132A" stroke-width="3"/><rect x="250" y="120" width="256" height="104" rx="4" fill="#F7F4EC"/><text x="270" y="150" fill="#0B0B0B" %s font-size="8">ROCKSOUL INTERVENTION</text><text x="270" y="182" fill="#0B0B0B" %s font-size="14">Deliberate annotation, not decorative noise.</text>'%(MONO,BODY),"ROCKSOUL intervention stays separate from MoonWitness base.")
    if asset == "radar-chart":
        return chart(asset,'<g transform="translate(320 184)" fill="none" stroke="#4A4A4A"><circle r="40"/><circle r="70"/><circle r="100"/></g><path d="M320 92L390 144L374 226L320 264L258 220L250 142Z" fill="#F7F4EC" opacity=".12" stroke="#F7F4EC" stroke-width="2"/><text x="72" y="316" fill="#A3A3A3" %s font-size="8">MULTI-AXIS PROFILE ONLY</text>'%MONO,"Radar retained only for multi-axis profile.")
    return chart(asset,'<text x="72" y="186" fill="#F7F4EC" %s font-size="30">%s</text>'%(DISPLAY,asset.replace("-"," ").upper()),"Visual System 2.0 measurement specimen.")

def correlation_svg(asset):
    nodes={"node-story":"story","node-event":"event","node-person":"person","node-text":"text","node-law":"legal","node-case":"canonical","node-source":"source","node-location":"external","node-claim":"canonical","node-evidence":"evidence"}
    if asset in nodes:
        return frame(asset.upper(),"V2 semantic node specimen.",node(nodes[asset],160,82,asset.replace("node-","").upper(),nodes[asset]=="legal"),320,180)
    edges={"edge-supports":"supports","edge-contradicts":"contradicts","edge-references":"references","edge-derived-from":"provenance","edge-same-identity":"identity","edge-temporal-before":"temporal","edge-temporal-after":"temporal","edge-located-at":"references","edge-legal-basis":"legal","edge-reviewed-by":"dependency","edge-submitted-by":"provenance","edge-inferred":"unresolved","edge-uncertain":"unresolved","edge-unresolved":"unresolved"}
    kind=edges.get(asset,"references")
    return frame(asset.upper(),"V2 semantic edge specimen.",node("canonical",58,84,"A")+edge(kind,90,84,230,84,kind.upper())+node("legal" if kind=="legal" else "candidate" if kind=="unresolved" else "canonical",262,84,"B",kind=="legal",kind=="unresolved"),320,180)

def architecture_svg(asset):
    node_ids={"service-node","database-node","repository-node","api-node","queue-node","user-node","decision-node","external-node"}
    if asset in node_ids:
        kind="person" if asset=="user-node" else "external" if asset=="external-node" else "evidence" if asset=="decision-node" else "system"
        return frame(asset.upper(),"Architecture node using system/provider/resource grammar.",node(kind,160,100,asset.replace("-node","").upper()),320,220)
    if asset.startswith("arrow-"):
        kind="contradicts" if asset=="arrow-error" else "temporal" if asset=="arrow-event" else "unresolved" if asset=="arrow-dashed" else "routes-to"
        return frame(asset.upper(),"Architecture edge grammar.",edge(kind,58,110,260,110,kind.upper()),320,220)
    if asset=="trust-zone":
        return frame("TRUST / ZONE","Trust zone with legal boundary.",'<path d="M52 58H268V180H52Z" fill="#0B0B0B" stroke="#D1132A" stroke-width="3"/><path d="M80 86H240V154H80Z" fill="none" stroke="#F7F4EC"/><text x="160" y="124" text-anchor="middle" fill="#F7F4EC" %s font-size="10">VERIFIED ZONE</text>'%MONO,320,220)
    if asset=="sequence-lifeline":
        return frame("SEQUENCE / LIFELINE","Temporal lifeline.",'<path d="M88 64V178M160 64V178M232 64V178" stroke="#A3A3A3" stroke-dasharray="4 5"/>'+edge("temporal",88,92,160,92,"EVENT")+edge("temporal",160,140,232,140,"EVENT"),320,220)
    return frame(asset.upper(),"Architecture boundary/cluster grammar.",'<path d="M40 56H280V182H40Z" fill="#0B0B0B" stroke="#F7F4EC" stroke-width="2"/>'+node("system",104,120,"API")+node("system",216,120,"DB")+edge("dependency",136,120,184,120,"DEP"),320,220)

def cinematic_svg(asset, index):
    family=["observatory-grid","archive-dossier","trace-map","film-negative-space"][index%4]
    serif=asset in {"archive-room","evidence-desk","legal-archive"}
    title_font='font-family="Georgia,Times New Roman,serif"' if serif else DISPLAY
    if family=="archive-dossier":
        visual='<path d="M920 120H1460V718H920Z" fill="#F7F4EC"/><path d="M960 184H1350M960 222H1390M960 260H1280M960 412H1370" stroke="#151515" stroke-width="4"/><rect x="960" y="304" width="350" height="74" fill="#151515"/><text x="978" y="350" fill="#F7F4EC" %s font-size="20">EVIDENCE / 04 · VERIFIED</text>'%MONO
    elif family=="trace-map":
        visual='<path d="M920 170C1080 110 1240 210 1400 126M890 320C1080 270 1250 350 1450 270M960 500C1120 450 1260 530 1430 470" fill="none" stroke="#A3A3A3" stroke-width="2"/><path d="M1110 110V640M1320 100V640" stroke="#4A4A4A"/><circle cx="1110" cy="320" r="18" fill="#0B0B0B" stroke="#F7F4EC" stroke-width="3"/><path d="M1320 270h40" stroke="#D1132A" stroke-width="6"/>'
    elif family=="film-negative-space":
        visual='<circle cx="1180" cy="360" r="210" fill="none" stroke="#F7F4EC" stroke-width="2"/><circle cx="1180" cy="360" r="120" fill="none" stroke="#A3A3A3" stroke-dasharray="5 9"/><path d="M1010 140l180 520M1090 80l130 600M1280 120l90 470" stroke="#F7F4EC" opacity=".12"/>'
    else:
        visual='<path d="M980 520L1370 160" stroke="#D1132A" stroke-width="5"/><circle cx="1180" cy="350" r="180" fill="none" stroke="#F7F4EC" stroke-width="2"/><path d="M980 170H1420M980 250H1420M980 330H1420M980 410H1420M1040 110V600M1200 110V600M1360 110V600" stroke="#4A4A4A" opacity=".45"/>'
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img"><title>%s</title><desc>MoonWitness %s cinematic composition with deliberate ROCKSOUL intervention.</desc><rect width="1600" height="900" fill="#0B0B0B"/><rect x="52" y="52" width="1496" height="796" fill="#151515" stroke="#4A4A4A" stroke-width="2"/><text x="108" y="128" fill="#A3A3A3" %s font-size="18">MOONWITNESS / %s</text><text x="108" y="320" fill="#F7F4EC" %s font-size="74">%s</text><text x="110" y="370" fill="#A3A3A3" %s font-size="16">EVIDENCE FIRST · HUMAN INTERVENTION DELIBERATE</text>%s<path d="M88 742H780" stroke="#F7F4EC" stroke-width="2"/><path d="M88 760H520" stroke="#9F1022" stroke-width="6"/></svg>'%(asset,family,MONO,asset.upper(),title_font,asset.replace("-"," ").upper(),MONO,visual)

def editorial_svg(asset, index):
    paper="#EEEAE0" if index%2 else "#F7F4EC"
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img"><title>%s</title><desc>Editorial composition balancing archival paper, evidence structure and ROCKSOUL intervention.</desc><rect width="1200" height="800" fill="#151515"/><path d="M90 70H930V730H90Z" fill="%s"/><path d="M125 120H820M125 154H760M125 188H850" stroke="#151515" stroke-width="3"/><text x="126" y="270" fill="#151515" %s font-size="52">%s</text><text x="128" y="314" fill="#4A4A4A" %s font-size="12">ARCHIVE / VERIFIED / EDITORIAL</text><rect x="124" y="382" width="610" height="92" fill="#151515"/><text x="150" y="435" fill="#F7F4EC" %s font-size="18">PROVENANCE REMAINS VISIBLE</text><path d="M860 138L1090 86L1110 520L880 548Z" fill="#242424" stroke="#A3A3A3" stroke-width="2"/><path d="M866 164L1104 490" stroke="#D1132A" stroke-width="6"/><path d="M984 92v520" stroke="#9F1022" stroke-width="2" stroke-dasharray="8 7"/></svg>'%(asset,paper,DISPLAY,asset.replace("-"," ").upper(),MONO,MONO)

data=read_json("moonwitness/data-viz/data-viz.json")
for asset in data["charts"]:
    save("moonwitness/data-viz/charts/%s.svg"%asset,chart_svg(asset))
graph=read_json("moonwitness/graph-pack/manifest.json")
for asset in graph["assets"]:
    save("moonwitness/graph-pack/svg/%s.svg"%asset,chart_svg(asset))
corr=read_json("moonwitness/correlation-semantics-pack/manifest.json")
for asset in corr["assets"]:
    save("moonwitness/correlation-semantics-pack/svg/%s.svg"%asset,correlation_svg(asset))
arch=read_json("moonwitness/architecture-diagram-pack/manifest.json")
for asset in arch["assets"]:
    save("moonwitness/architecture-diagram-pack/svg/%s.svg"%asset,architecture_svg(asset))

meta_updates=[
 ("moonwitness/data-viz/data-viz.json",{"surfacePersonalities":["operator","forensic","editorial"],"grammarFamily":"data-viz-v2","semanticRole":"measurement","typographyRoles":["body","mono"],"paletteBehavior":"semantic-status-plus-neutral"}),
 ("moonwitness/graph-pack/manifest.json",{"surfacePersonalities":["operator","forensic","editorial"],"grammarFamily":"graph-v2","semanticRole":"relationship","typographyRoles":["body","mono"],"paletteBehavior":"semantic-boundary-plus-neutral"}),
 ("moonwitness/correlation-semantics-pack/manifest.json",{"surfacePersonalities":["operator","forensic"],"grammarFamily":"graph-v2","semanticRole":"relationship-semantic","typographyRoles":["mono"],"paletteBehavior":"semantic-boundary-plus-neutral"}),
 ("moonwitness/architecture-diagram-pack/manifest.json",{"surfacePersonalities":["operator","forensic"],"grammarFamily":"graph-v2","semanticRole":"system-topology","typographyRoles":["mono"],"paletteBehavior":"semantic-boundary-plus-neutral"}),
 ("moonwitness/dashboard-pack/dashboard-pack.json",{"surfacePersonalities":["operator","forensic"],"grammarFamily":"operator-v2","semanticRole":"operator-dashboard","typographyRoles":["body","mono"],"paletteBehavior":"neutral-first"})
]
for rel,meta in meta_updates:
    obj=read_json(rel)
    obj.update({"visualSystemVersion":2,"lifecycle":"canonical"})
    obj.update(meta)
    save(rel,dump(obj))

cin=read_json("moonwitness/cinematic-hero-pack/manifest.json")
cin.update({"visualSystemVersion":2,"lifecycle":"canonical","surfacePersonalities":["cinematic","editorial"],"grammarFamily":"cinematic-v2","semanticRole":"cinematic-composition","typographyRoles":["display","mono","archive-serif"],"paletteBehavior":"canonical-neutral-plus-semantic-crimson","compositionFamilies":["observatory-grid","archive-dossier","trace-map","film-negative-space"]})
save("moonwitness/cinematic-hero-pack/manifest.json",dump(cin))
for i,asset in enumerate(cin["assets"]):
    save("moonwitness/cinematic-hero-pack/svg/%s.svg"%asset,cinematic_svg(asset,i))

ed=read_json("moonwitness/editorial-pack/manifest.json")
ed.update({"visualSystemVersion":2,"lifecycle":"canonical","surfacePersonalities":["editorial","archive"],"grammarFamily":"editorial-v2","semanticRole":"editorial-document","typographyRoles":["display","body","mono","archive-serif"],"paletteBehavior":"canonical-neutral-plus-semantic-crimson"})
save("moonwitness/editorial-pack/manifest.json",dump(ed))
for i,asset in enumerate(ed["assets"]):
    save("moonwitness/editorial-pack/svg/%s.svg"%asset,editorial_svg(asset,i))

icons=read_json("moonwitness/icons/icons.json")
icons.update({"visualSystemVersion":2,"lifecycle":"canonical","strokeWidth":2,"sizes":[16,20,24,32,48,96],"opticalReviewSizes":[16,20,24,32],"surfacePersonalities":["operator","forensic","community"],"grammarFamily":"primitive-v2","semanticRole":"product-icon","paletteBehavior":"currentColor"})
save("moonwitness/icons/icons.json",dump(icons))
sem=read_json("moonwitness/semantic-primitives-pack/manifest.json")
sem.update({"visualSystemVersion":2,"lifecycle":"canonical","strokeWidth":2,"opticalReviewSizes":[16,20,24,32],"surfacePersonalities":["operator","forensic","community"],"grammarFamily":"primitive-v2","semanticRole":"semantic-mark","paletteBehavior":"currentColor"})
save("moonwitness/semantic-primitives-pack/manifest.json",dump(sem))

primitive_files=[]
for folder in ["moonwitness/icons/svg","moonwitness/semantic-primitives-pack/svg"]:
    for file in sorted((ROOT/folder).rglob("*.svg")):
        rel=file.relative_to(ROOT).as_posix()
        src=read(rel).replace('stroke-width="1.75"','stroke-width="2"')
        src=re.sub(r"stroke-width:\s*1\.75\b","stroke-width:2",src)
        save(rel,src)
        primitive_files.append(rel)

# Normalize historical production drift across mutable V2 sources.
# Immutable baseline-v1 screen references remain untouched.
for file in sorted((ROOT / "moonwitness").rglob("*.svg")):
    rel=file.relative_to(ROOT).as_posix()
    if rel.startswith("moonwitness/ui/v1/screens/"):
        continue
    src=WRITES.get(rel, read(rel))
    normalized=re.sub(r"#FF2A3D", "#D1132A", src, flags=re.I)
    if not (rel.startswith("moonwitness/cinematic-hero-pack/") or rel.startswith("moonwitness/editorial-pack/")):
        normalized=re.sub(r'font-family="Georgia,[^"]*"', 'font-family="Inter Tight,Inter,Arial,sans-serif"', normalized, flags=re.I)
        normalized=re.sub(r'font-family\s*:\s*Georgia\s*,\s*[^;"\']+', 'font-family:Inter Tight,Inter,Arial,sans-serif', normalized, flags=re.I)
    if normalized != src:
        save(rel, normalized)

tokens=read_json("penpot/tokens/moonwitness.tokens.json")
tokens["VisualSystemV2"]={
 "paletteRoles":{"brand-crimson":{"$value":"#D1132A","$type":"color"},"signal-crimson":{"$value":"#9F1022","$type":"color"},"critical-crimson":{"$value":"#B20F23","$type":"color"}},
 "density":{"compact":{"$value":"4/8/12/16","$type":"string"},"comfortable":{"$value":"8/12/16/24/32","$type":"string"},"editorial":{"$value":"16/24/32/48/64/80","$type":"string"}},
 "personality":{p:{"$value":p,"$type":"string"} for p in ["operator","forensic","editorial","archive","cinematic","community"]}
}
save("penpot/tokens/moonwitness.tokens.json",dump(tokens))

components=read_json("penpot/components/components.json")
components["visualSystemVersion"]=2
cl=components.get("components",[])
def upsert(items,name,value):
    for i,item in enumerate(items):
        if item.get("name")==name:
            items[i]={**item,**value}
            return
    items.append({"name":name,**value})
upsert(cl,"Graph Node",{"variants":["canonical-record","evidence","source","person","event","story","rgbl-text","legal-state","external-reference","unresolved-record","inferred-candidate-record","missing-record","system-provider-resource"],"states":["default","selected","dimmed","unresolved"],"visualSystemVersion":2,"grammarFamily":"graph-v2"})
upsert(cl,"Graph Edge",{"variants":["supports","contradicts","references","temporal","identity","legal","provenance","dependency","routes-to","unresolved-candidate"],"states":["default","highlighted","dimmed"],"visualSystemVersion":2,"grammarFamily":"graph-v2"})
upsert(cl,"ROCKSOUL Intervention Overlay",{"variants":["annotation","tape","xerox","redaction","film-scratch"],"surface":["editorial","archive","cinematic","community"],"visualSystemVersion":2})
upsert(cl,"Surface Personality Frame",{"variants":["operator","forensic","editorial","archive","cinematic","community"],"visualSystemVersion":2})
components["components"]=cl
save("penpot/components/components.json",dump(components))

patterns=read_json("penpot/patterns/patterns.json")
patterns["visualSystemVersion"]=2
pl=patterns.get("patterns",[])
upsert(pl,"Visual System V2 Graph Grammar",{"composition":["Graph Node[]","Graph Edge[]","accessible legend","grayscale proof"],"visualSystemVersion":2})
upsert(pl,"Visual System V2 Data Viz",{"composition":["line","area","bar","stacked-bar","heat-strip","donut","time-series","threshold-boundary","confidence-uncertainty"],"visualSystemVersion":2})
for p in ["operator","forensic","editorial","archive","cinematic","community"]:
    upsert(pl,"Surface Personality / "+p,{"composition":["Surface Personality Frame","typography roles","density rhythm","allowed visual grammar"],"visualSystemVersion":2})
upsert(pl,"Cinematic Editorial Composition",{"composition":["MoonWitness rigorous base","ROCKSOUL Intervention Overlay","live-text boundary","negative-space composition"],"visualSystemVersion":2})
patterns["patterns"]=pl
save("penpot/patterns/patterns.json",dump(patterns))

optical=[]
for rel in primitive_files:
    src=WRITES.get(rel,read(rel))
    optical.append({"file":rel,"viewBox24":'viewBox="0 0 24 24"' in src,"currentColor":"currentColor" in src,"containsText":bool(re.search(r"<text\b",src,re.I)),"strokeWidths":re.findall(r'stroke-width="([^"]+)"',src)})
save("docs/generated/visual-system-v2/primitive-optical-review.json",dump({"schemaVersion":1,"sizes":[16,20,24,32],"themes":["light","dark"],"assets":optical}))

cards=[]
for rel in primitive_files:
    cells=[]
    for theme in ["light","dark"]:
        for size in [16,20,24,32]:
            cells.append('<span class="cell %s"><img src="../../../%s" width="%d" alt=""></span>'%(theme,rel,size))
    cards.append('<article><code>%s</code><div class="row">%s</div></article>'%(rel,"".join(cells)))
save("docs/generated/visual-system-v2/primitive-optical-review.html",'<!doctype html><html><head><meta charset="utf-8"><title>Primitive Optical Review V2</title><style>body{font:13px system-ui;background:#151515;color:#f7f4ec;padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}article{border:1px solid #4a4a4a;padding:12px}.row{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}.cell{height:52px;display:grid;place-items:center}.light{background:#f7f4ec;color:#0b0b0b}.dark{background:#0b0b0b;color:#f7f4ec}code{font-size:9px}</style></head><body><h1>Primitive Optical Review V2</h1><p>All production primitives at 16/20/24/32 in light and dark.</p><div class="grid">'+''.join(cards)+'</div></body></html>')

gallery_css='body{margin:0;background:#0b0b0b;color:#f7f4ec;font:14px/1.6 Inter,Arial,sans-serif}main{max-width:1200px;margin:auto;padding:32px}a{color:#f7f4ec}header{padding:64px 0;border-bottom:1px solid #4a4a4a}header p,code{font-family:"IBM Plex Mono",monospace;color:#a3a3a3}h1{font:600 clamp(42px,7vw,92px)/.95 "Inter Tight",Inter,sans-serif}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;padding:32px 0}.gallery article{border:1px solid #4a4a4a;background:#151515;padding:16px}.gallery img{width:100%;display:block;background:#0b0b0b}.gallery code{display:block;padding:10px;overflow-wrap:anywhere}'
save("showcase/v2/visual-system-v2.css",gallery_css)

galleries=[
 ("graph-grammar","Graph Grammar V2","Semantic nodes, edges, uncertainty and provenance that survive grayscale.",["moonwitness/data-viz/charts/graph-nodes.svg","moonwitness/data-viz/charts/edge-styles.svg","moonwitness/data-viz/charts/event-topology.svg","moonwitness/data-viz/charts/node-link-correlation.svg"]),
 ("data-viz","Data Visualization V2","Measurement grammar distinct from relationship graphs.",["moonwitness/graph-pack/svg/line-chart.svg","moonwitness/graph-pack/svg/area-chart.svg","moonwitness/graph-pack/svg/bar-chart.svg","moonwitness/data-viz/charts/historicity-band.svg"]),
 ("typography","Typography V2","Display, body, mono and restricted Archive Serif roles.",["moonwitness/editorial-pack/svg/archive-dossier.svg","moonwitness/cinematic-hero-pack/svg/archive-room.svg"]),
 ("color","Color Semantics V2","Neutral-first system with Brand, Signal and Critical Crimson.",["moonwitness/data-viz/charts/repository-health.svg","moonwitness/data-viz/charts/status-ring.svg"]),
 ("personalities","Surface Personalities V2","Operator, forensic, editorial, archive, cinematic and community personalities.",["moonwitness/dashboard-pack/widgets/kpi-stat.svg","moonwitness/editorial-pack/svg/source-signal.svg","moonwitness/cinematic-hero-pack/svg/observatory-night.svg"]),
 ("cinematic-editorial","Cinematic & Editorial V2","Rigorous MoonWitness composition with selective ROCKSOUL intervention.",["moonwitness/cinematic-hero-pack/svg/evidence-desk.svg","moonwitness/cinematic-hero-pack/svg/correlation-sky.svg","moonwitness/editorial-pack/svg/legal-boundary.svg"]),
 ("semantic-primitives","Semantic Primitives V2","Optically reviewed currentColor production marks.",["moonwitness/semantic-primitives-pack/svg/graph-node.svg","moonwitness/semantic-primitives-pack/svg/edge-supports.svg","moonwitness/icons/svg/domain/evidence.svg"])
]
def page(title,copy,assets):
    entries=''.join('<article><img src="/%s" alt=""><code>%s</code></article>'%(a,a) for a in assets)
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title><link rel="stylesheet" href="/showcase/v2/visual-system-v2.css"></head><body><main><a href="/showcase/v2/">← Visual System 2.0</a><header><p>ROCKSOUL / MOONWITNESS</p><h1>%s</h1><p>%s</p></header><section class="gallery">%s</section></main></body></html>'%(title,title,copy,entries)
index_cards=''.join('<article><h2><a href="/showcase/v2/%s.html">%s</a></h2><p>%s</p></article>'%(slug,title,copy) for slug,title,copy,_ in galleries)
save("showcase/v2/index.html",'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Visual System 2.0</title><link rel="stylesheet" href="/showcase/v2/visual-system-v2.css"></head><body><main><a href="/">← Asset Explorer</a><header><p>MOONWITNESS × ROCKSOUL</p><h1>Visual System 2.0</h1><p>Canonical galleries teach the visual language rather than only listing files.</p></header><section class="gallery">'+index_cards+'</section></main></body></html>')
for slug,title,copy,assets in galleries:
    save("showcase/v2/%s.html"%slug,page(title,copy,assets))

save("docs/VISUAL-SYSTEM-V2-MIGRATION.md","""# Visual System 2.0 Migration

Visual System 2.0 upgrades canonical assets inside existing packs instead of creating parallel pack sprawl.

## Replaced in place
- data-viz canonical charts and graph specimens
- graph-vector charts
- correlation semantic nodes and edges
- architecture topology specimens
- cinematic-hero compositions
- editorial compositions
- production primitive stroke normalization

## Deprecated with replacement
- cursor-interaction/crosshair -> geospatial/crosshair

## Frozen reference
- baseline-v1 remains immutable and non-runtime.

## Production rules
Deprecated assets remain browseable for migration but are not production-eligible. Specimen/reference assets may be distributed as documentation but never enter the production primitive sprite. Graph meaning survives grayscale. Charts use neutral magnitude with semantic crimson boundaries only. Archive Serif is limited to approved archive/editorial/cinematic work. Product icons and semantic primitives are reviewed at 16/20/24/32 in light and dark.

## Regeneration
Run the V2 migration generator, render-packs, build-dist and visual audit before validation.
""")

if CHECK:
    stale=[]
    for rel,expected in WRITES.items():
        try:
            actual=read(rel)
        except FileNotFoundError:
            actual=None
        if actual != expected:
            stale.append(rel)
    if stale:
        raise SystemExit("Visual System V2 migration outputs are stale:\n"+"\n".join(" - "+x for x in stale))
else:
    for rel,value in WRITES.items():
        target=ROOT/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(value)

print(json.dumps({"status":"fresh" if CHECK else "written","files":len(WRITES),"dataViz":len(data["charts"]),"graph":len(graph["assets"]),"correlation":len(corr["assets"]),"architecture":len(arch["assets"]),"cinematic":len(cin["assets"]),"editorial":len(ed["assets"]),"primitives":len(primitive_files),"galleries":len(galleries)},indent=2))
