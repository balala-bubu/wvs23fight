"""Build self-hosted UI fonts from installed OFL Noto CJK. Run from racing/."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.subset import Options, Subsetter
import json
root=Path(__file__).resolve().parents[1]
files=[*root.joinpath('src').rglob('*.ts'),*root.joinpath('src/i18n').glob('*.json'),*root.joinpath('public').glob('*.html'),*root.joinpath('shared/characters').glob('*.js')]
text=''.join(p.read_text() for p in files)
needed={ord(c) for c in text if not c.isspace() and ord(c)>=32}|set(range(32,127))
needed.update(map(ord,'▰ⒶⒷ原版選擇造型更換角色選擇車輛已準備房主玩家連線圈數璿芭樂秉寶'))
coverage={}
covered=set()
for label in ['Regular','Bold']:
 font=TTFont('/usr/share/fonts/opentype/noto/NotoSansCJK-'+label+'.ttc',fontNumber=3)
 cmap=font.getBestCmap();missing={u for u in needed if 0x3400<=u<=0x9fff and u not in cmap}
 if missing:raise RuntimeError('Missing CJK glyphs: '+''.join(chr(n) for n in sorted(missing)))
 opts=Options();opts.flavor='woff';opts.recalc_timestamp=False;opts.ignore_missing_glyphs=True
 subset=Subsetter(options=opts);subset.populate(unicodes=needed);subset.subset(font);font.flavor='woff'
 out=root/'public/fonts'/('WVS-UI-'+label+'.woff');font.save(out)
 covered.update(font.getBestCmap())
 coverage[label]={'glyphs':len(font.getBestCmap()),'cjkRequired':sum(1 for u in needed if 0x3400<=u<=0x9fff),'missingCJK':[],'bytes':out.stat().st_size}
for label,source in [('Symbols','/usr/share/fonts/truetype/noto/NotoSansSymbols-Regular.ttf'),('Symbols2','/usr/share/fonts/truetype/noto/NotoSansSymbols2-Regular.ttf')]:
 font=TTFont(source);glyphs=((needed-covered)&set(font.getBestCmap()))|{32}
 opts=Options();opts.flavor='woff';opts.recalc_timestamp=False
 subset=Subsetter(options=opts);subset.populate(unicodes=glyphs);subset.subset(font);font.flavor='woff';out=root/'public/fonts'/('WVS-UI-'+label+'.woff');font.save(out);covered.update(font.getBestCmap());coverage[label]={'glyphs':len(font.getBestCmap()),'bytes':out.stat().st_size}
coverage['requiredSymbolsMissing']=[chr(u) for u in map(ord,'←→●○▰↑↓◀▶ⒶⒷ×＋・…') if u not in covered]
(root/'public/fonts/WVS-UI-coverage.json').write_text(json.dumps(coverage,indent=2)+'\n')
print(json.dumps(coverage))
