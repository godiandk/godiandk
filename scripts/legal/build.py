#!/usr/bin/env python3
"""Gera as 4 páginas legais (privacidade, termos, cookies, cancelamento) em PT, com a tradução EN/ES.

Porquê um gerador: o motor de idiomas do site (i18n.js) usa o texto em português, tal como está no HTML,
como chave do dicionário. Se o HTML e o dicionário forem escritos à mão, qualquer diferença de uma vírgula
deixa a frase por traduzir. Aqui cada frase é escrita uma só vez com as 3 línguas.

Uso (na raiz do repositório):   python3 scripts/legal/build.py
Escreve:  privacidade/index.html  termos/index.html  cookies/index.html  cancelamento/index.html
          idiomas/legal-en.js  idiomas/legal-es.js
Os campos «A PREENCHER» (nome, NIF, morada, email…) preenchem-se com scripts/preencher_dados_legais.py
"""
import re, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
os.chdir(ROOT)

def T(pt, en, es): return {"pt": pt, "en": en, "es": es}
class A:
    def __init__(self, href, text, ext=False): self.href, self.text, self.ext = href, text, ext
def _dados():
    f = os.path.join(HERE, "dados_legais.json")      # escrito por scripts/preencher_dados_legais.py
    try: return json.load(open(f, encoding="utf-8"))
    except Exception: return {}
DADOS = _dados()
def PH(campo, rotulo=None):
    """Campo que só o Wesley/a Thayana sabem. Sem valor → «A PREENCHER» bem visível; com valor → o valor."""
    v = DADOS.get(campo)
    if v:
        import html as _h
        return f'<span class="dado-legal" data-campo="{campo}">{_h.escape(v, quote=False)}</span>'
    return f'<span class="a-preencher" data-campo="{campo}">A PREENCHER</span>'
def limpa(s): return re.sub(r"\s+", " ", s).strip()

ENTRIES = {}      # chave PT -> (en, es): só para as 4 páginas legais (idiomas/legal-en.js, legal-es.js)
PARTILHADO = {}   # o mesmo, mas para textos usados em várias páginas (rodapé, formulários…): vai para idiomas/en.js e es.js
CONFLITOS = []
_ATIVO = [ENTRIES]
def usar(balde):
    """usar("legal") ou usar("partilhado"): em que dicionário se registam as traduções a seguir."""
    _ATIVO[0] = PARTILHADO if balde == "partilhado" else ENTRIES
def reg(pt, en, es):
    k = limpa(pt)
    if len(k) < 2: return
    nv = (limpa(en), limpa(es))
    d = _ATIVO[0]
    if k in d and d[k] != nv:
        CONFLITOS.append((k, d[k], nv))
        return
    d[k] = nv

def inline(parts):
    """parts: T | A | str | lista de T/A/str  ->  html PT (e regista as traduções).
    - Com <a> dentro do elemento, o motor de idiomas traduz cada bocado de texto à parte (chave = texto do bocado):
      por isso juntamos os T seguidos (e as strings sem etiquetas) num só bocado antes de registar.
    - Sem <a>, traduz-se o elemento inteiro (chave = HTML interior, com as etiquetas)."""
    if isinstance(parts, dict): parts = [parts]
    has_a = any(isinstance(p, A) for p in parts)
    out_pt, out_en, out_es = [], [], []
    seg = [None]
    def flush():
        if seg[0] is not None and has_a: reg(*seg[0])
        seg[0] = None
    for p in parts:
        if isinstance(p, A):
            flush()
            t = p.text
            ext = ' target="_blank" rel="noopener"' if p.ext else ""
            h = f'<a href="{p.href}"{ext}>{t["pt"]}</a>'
            out_pt.append(h); out_en.append(h); out_es.append(h)
            reg(t["pt"], t["en"], t["es"])
            continue
        if isinstance(p, str) and "<" in p:          # etiqueta HTML crua (<strong>…)
            flush(); out_pt.append(p); out_en.append(p); out_es.append(p)
            continue
        if isinstance(p, dict): pt, en, es = p["pt"], p["en"], p["es"]
        else: pt = en = es = p
        out_pt.append(pt); out_en.append(en); out_es.append(es)
        a = seg[0] or ["", "", ""]
        seg[0] = [a[0] + pt, a[1] + en, a[2] + es]
    flush()
    html = "".join(out_pt)
    if not has_a:
        reg(html, "".join(out_en), "".join(out_es))
    return html

class Page:
    def __init__(self, slug, title, desc, h1, lead, crumb, atualizado):
        self.slug, self.title, self.desc, self.h1, self.lead, self.crumb, self.atualizado = slug, title, desc, h1, lead, crumb, atualizado
        self.body, self.toc = [], []
    # --- blocos ---
    def h2(self, id_, t):
        self.toc.append((id_, t)); reg(t["pt"], t["en"], t["es"]); self.body.append(f'<h2 id="{id_}">{t["pt"]}</h2>')
    def h3(self, t):
        reg(t["pt"], t["en"], t["es"]); self.body.append(f'<h3>{t["pt"]}</h3>')
    def p(self, parts, cls=""):
        c = f' class="{cls}"' if cls else ""
        self.body.append(f'<p{c}>{inline(parts)}</p>')
    def note(self, parts):
        self.body.append(f'<div class="legal-note"><p>{inline(parts)}</p></div>')
    def ul(self, items, ordered=False):
        tag = "ol" if ordered else "ul"
        self.body.append(f'<{tag}>' + "".join(f"<li>{inline(i)}</li>" for i in items) + f"</{tag}>")
    def table(self, cap, head, rows, cls="legal-table", rowhead=True):
        """head: lista de T; rows: lista de listas; célula = T | lista de partes | ("RAW", html)"""
        reg(cap["pt"], cap["en"], cap["es"])
        h = "".join(f'<th scope="col">{t["pt"]}</th>' for t in head)
        for t in head: reg(t["pt"], t["en"], t["es"])
        trs = []
        for r in rows:
            cells = []
            for i, c in enumerate(r):
                tag = "th" if (rowhead and i == 0) else "td"
                scope = ' scope="row"' if tag == "th" else ""
                if isinstance(c, tuple) and c[0] == "RAW":
                    cells.append(f'<{tag}{scope} data-sem-traducao>{c[1]}</{tag}>')
                else:
                    cells.append(f'<{tag}{scope}>{inline(c)}</{tag}>')
            trs.append("<tr>" + "".join(cells) + "</tr>")
        self.body.append(f'<div class="legal-table-wrap" tabindex="0" role="region" aria-label="{cap["pt"]}"><table class="{cls}"><caption>{cap["pt"]}</caption><thead><tr>{h}</tr></thead><tbody>' + "".join(trs) + "</tbody></table></div>")
    def idtable(self, rows, cap):
        reg(cap["pt"], cap["en"], cap["es"])
        trs = []
        for lab, val in rows:
            reg(lab["pt"], lab["en"], lab["es"])
            if isinstance(val, tuple) and val[0] == "RAW":
                cell = f'<td data-sem-traducao>{val[1]}</td>'
            else:
                cell = f'<td>{inline(val)}</td>'
            trs.append(f'<tr><th scope="row">{lab["pt"]}</th>{cell}</tr>')
        self.body.append(f'<div class="legal-table-wrap" tabindex="0" role="region" aria-label="{cap["pt"]}"><table class="legal-table legal-id-table"><caption>{cap["pt"]}</caption><tbody>' + "".join(trs) + "</tbody></table></div>")

    def html_main(self):
        toc = "".join(f'<li><a href="#{i}">{t["pt"]}</a></li>' for i, t in self.toc)
        return ('<main id="conteudo">\n<section class="page-hero">\n  <div class="container">\n'
                f'    <ol class="breadcrumb"><li><a href="../">Home</a></li><li>{self.crumb["pt"]}</li></ol>\n'
                '    <span class="eyebrow-label">Inova Beauty</span>\n'
                f'    <h1>{self.h1["pt"]}</h1>\n    <p class="lead">{self.lead["pt"]}</p>\n  </div>\n</section>\n'
                '<section>\n  <div class="container legal-doc">\n'
                f'    <p class="legal-meta">{self.atualizado["pt"]}</p>\n'
                f'    <nav class="legal-toc" aria-label="Índice"><p><strong>Índice</strong></p><ul>{toc}</ul></nav>\n    '
                + "\n    ".join(self.body) + '\n  </div>\n</section>\n</main>')

def registar_pagina(pg):
    for t in (pg.crumb, pg.h1, pg.lead, pg.atualizado): reg(t["pt"], t["en"], t["es"])
    reg("Índice", "Contents", "Índice")
    reg("Esta página está escrita em português. Em caso de dúvida ou divergência com a tradução, prevalece a versão portuguesa.",
        "This page is written in Portuguese. In case of doubt or difference with the translation, the Portuguese version prevails.",
        "Esta página está escrita en portugués. En caso de duda o divergencia con la traducción, prevalece la versión portuguesa.")

def escrever(pg, template_path="privacidade/index.html", baseline=None):
    """Escreve a página a partir do molde (cabeçalho, rodapé e scripts iguais aos das outras páginas)."""
    registar_pagina(pg)
    tpl = open(baseline or template_path, encoding="utf-8").read()
    # 1) <main>
    a = tpl.index('<main id="conteudo">'); b = tpl.index("</main>") + len("</main>")
    main = pg.html_main()
    main = main.replace('<p class="legal-meta">', '<p class="legal-meta">', 1)
    tpl = tpl[:a] + main + tpl[b:]
    # 2) <head>: título, descrições, canonical
    base = json.load(open("scripts/seo/site.json", encoding="utf-8"))["base_url"]   # o endereço do site fica num só sítio (scripts/seo/site.json)
    url = f"{base}{pg.slug}/"
    tpl = re.sub(r"<title>.*?</title>", f"<title>{pg.title} — Inova Beauty</title>", tpl, count=1, flags=re.S)
    tpl = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + pg.desc + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + pg.desc + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', lambda m: m.group(1) + pg.desc + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + pg.title + " — Inova Beauty" + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<meta name="twitter:title" content=")[^"]*(")', lambda m: m.group(1) + pg.title + " — Inova Beauty" + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), tpl, count=1)
    tpl = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), tpl, count=1)
    # 3) dicionários legais
    if "legal-en.js" not in tpl:
        # as páginas públicas carregam os scripts com «defer»; o molde pode ou não tê-lo
        for lang in ("en", "es"):
            tpl = re.sub(rf'(<script(?: defer)? src="\.\./idiomas/{lang}\.js"></script>)',
                         lambda m, lang=lang: m.group(1) + f'\n<script defer src="../idiomas/legal-{lang}.js"></script>', tpl, count=1)
    os.makedirs(pg.slug, exist_ok=True)
    open(f"{pg.slug}/index.html", "w", encoding="utf-8").write(tpl)

MARCA_I, MARCA_F = "/* >>> GERADO por scripts/legal/build_all.py (não editar à mão) */", "/* <<< FIM GERADO */"
def texto_sem_bloco(f):
    txt = open(f, encoding="utf-8").read()
    if MARCA_I in txt:
        a = txt.index(MARCA_I); b = txt.index(MARCA_F) + len(MARCA_F)
        txt = txt[:a].rstrip() + "\n" + txt[b:].lstrip("\n")
    return txt

def escrever_partilhado():
    """Põe as traduções partilhadas dentro de idiomas/en.js e idiomas/es.js, entre marcas (pode correr-se muitas vezes)."""
    import subprocess
    out = {}
    for i, lang in enumerate(("en", "es")):
        f = f"idiomas/{lang}.js"
        txt = open(f, encoding="utf-8").read()
        if MARCA_I in txt:                                   # tira o bloco antigo
            a = txt.index(MARCA_I); b = txt.index(MARCA_F) + len(MARCA_F)
            txt = txt[:a].rstrip() + "\n" + txt[b:].lstrip("\n")
        # chaves que já existem fora do bloco gerado
        js = ("const vm=require('vm');const w={};vm.runInNewContext(process.argv[1],{window:w});"
              "console.log(JSON.stringify(Object.keys(w.INOVA_DIC['" + lang + "'])))")
        r = subprocess.run(["node", "-e", js, txt], capture_output=True, text=True)
        if r.returncode: raise SystemExit("node falhou ao ler " + f + ": " + r.stderr[:300])
        existentes = set(json.loads(r.stdout))
        novas = [(k, v[i]) for k, v in sorted(PARTILHADO.items()) if k not in existentes]
        bloco = MARCA_I + "\n" + "\n".join(f"{json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}," for k, v in novas) + "\n" + MARCA_F + "\n"
        fim = txt.rstrip().rfind("};")
        if fim < 0: raise SystemExit("não encontrei o fecho do dicionário em " + f)
        antes = txt[:fim].rstrip()
        if not antes.endswith(",") and not antes.endswith("{"): antes += ","     # a última entrada do dicionário pode não ter vírgula
        txt = antes + "\n\n" + bloco + txt[fim:]
        open(f, "w", encoding="utf-8").write(txt)
        out[lang] = len(novas)
    print("traduções partilhadas escritas em en.js/es.js:", out)

def escrever_dicionarios(base=None):
    """base: dicionários já existentes (idiomas/en.js, idiomas/es.js). O que lá existe não se repete aqui,
    para as palavras comuns do site (Email, Telemóvel…) continuarem a ter uma só tradução em todas as páginas."""
    if CONFLITOS:
        for k, a, b in CONFLITOS:
            print("CHAVE REPETIDA COM TRADUÇÕES DIFERENTES:", k[:90], "\n    1.ª:", a, "\n    2.ª:", b)
        raise SystemExit("Corrija as chaves repetidas (mesmo texto português, traduções diferentes).")
    for i, lang in enumerate(("en", "es")):
        linhas = [f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},'
                  for k, v in sorted(ENTRIES.items()) if not (base and k in base[lang])]
        txt = ("/* GERADO por scripts/legal/build.py — não editar à mão.\n"
               "   Traduções dos documentos legais (privacidade, termos, cookies, cancelamento). */\n"
               f"Object.assign(window.INOVA_DIC.{lang}, {{\n" + "\n".join(linhas) + "\n});\n")
        open(f"idiomas/legal-{lang}.js", "w", encoding="utf-8").write(txt)
    print("entradas de tradução (total):", len(ENTRIES), "| novas em EN:", sum(1 for k in ENTRIES if not (base and k in base["en"])), "| novas em ES:", sum(1 for k in ENTRIES if not (base and k in base["es"])))
