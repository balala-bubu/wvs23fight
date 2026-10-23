"""Build a self-contained volleyball HTML preview, without a server or CDN.
Usage: python3 tools/build_volleyball_preview.py OUTPUT_DIRECTORY
"""
import pathlib,re,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def build(destination):
 destination=pathlib.Path(destination);destination.mkdir(parents=True,exist_ok=True)
 html=(ROOT/'volleyball.html').read_text()
 css=(ROOT/'css/volleyball.css').read_text()
 html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda _: '<style>'+css+'</style>',html)
 html=re.sub(r'<link rel="icon"[^>]+>','',html)
 html=html.replace('href="index.html"','href="#" onclick="location.reload();return false"').replace('← 遊戲俱樂部','← 排球選單').replace('返回模式首頁','返回排球選單')
 order=['js/vendor/three-r128.min.js','js/volleyball-rules.js','js/volleyball-replay.js','js/volleyball.js','js/volleyball-models.js','js/volleyball-court.js','js/volleyball-motion.js','js/volleyball-network.js']
 order+=['characters/'+name+'.js' for name in ['waffle','tommy','karl','seafood','bear','serene','kiafes','newton','kattisbbb','jackson','janice','masterogway','kelsey','wxinyy','jennie','pudding','xuan','ichung']]
 scripts='\n'.join('<script>\n'+re.sub(r'</script',r'<\\/script',(ROOT/f).read_text(),flags=re.I)+'\n</script>' for f in order)
 scripts+='\n<script>Volleyball.boot();for(const id of [\"roomOpen\",\"hostRoom\",\"joinRoom\",\"pauseRoom\"])document.getElementById(id).hidden=true;</script>'
 html=re.sub(r'<script src="js/volleyball-loader[^>]+></script>',lambda _:scripts,html)
 target=destination/'世志排球-離線試玩.html';target.write_text(html)
 (destination/'three-LICENSE.txt').write_bytes((ROOT/'js/vendor/three-LICENSE.txt').read_bytes())
 print(target)
 return target
if __name__=='__main__':build(sys.argv[1])
