#!/usr/bin/env python3
"""SEO técnico local do site Inova Beauty (só biblioteca padrão; pode correr-se as vezes que for preciso).

Lê scripts/seo/site.json e escreve, em todas as páginas:
  • <html lang="pt-PT">, título e descrição (com a localidade) nas páginas listadas em site.json;
  • pré-carregamento das 2 letras principais (evita o «salto» da página quando a letra de reserva é trocada);
  • link canonical e og:url/og:image com o endereço do site (base_url);
  • <meta name="robots" content="noindex,follow"> nas páginas de utilização (conta/, app/home/);
  • (se preenchidos em site.json) os códigos de verificação do Google Search Console e do Bing Webmaster Tools na página inicial;
  • dados estruturados: BeautySalon + FAQPage (a partir das perguntas VISÍVEIS) na página inicial e
    BreadcrumbList (a partir das migalhas VISÍVEIS) nas restantes páginas indexáveis;
  • sitemap.xml (só páginas indexáveis), a linha Sitemap de robots.txt e llms.txt (resumo do site para assistentes de IA).

Uso:
  python3 scripts/seo/aplicar_seo.py                      # aplica
  python3 scripts/seo/aplicar_seo.py --verificar          # não escreve; termina com 1 se algo estiver desatualizado ou mal
  python3 scripts/seo/aplicar_seo.py --base-url https://inovabeauty.pt/   # muda o endereço do site (ver docs/SEO-E-CLIENTES.md)

Regras do projeto respeitadas: nada de preços nem de tempos nas descrições (vêm do catálogo e do painel da Thayana);
nada de «melhor», «garantido», «permanente», «ideal para», «100 %», «certificado»; páginas dos serviços escondidos ficam noindex.
"""
import argparse, html, json, os, re, sys
from urllib.parse import urljoin

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SITE = os.path.join(RAIZ, "scripts", "seo", "site.json")
SKIP = {".git", "node_modules", "vendor", "scripts", "docs", "fonts", "img", "idiomas", "tecnova"}
PROIBIDAS = [r"\bmelhor", r"garantid", r"permanente", r"ideal para", r"100 ?%", r"certificad"]
MAX_TITULO, MIN_DESC, MAX_DESC = 65, 70, 170
# letras usadas logo no primeiro desenho da página: pré-carregadas para não haver «salto» quando a letra de reserva é trocada (CLS)
FONTES_PRELOAD = ("Jost-normal-latin.woff2", "CormorantGaramond-normal-latin.woff2")


def ler(caminho):
    with open(caminho, encoding="utf-8") as f:
        return f.read()


def escrever(caminho, texto):
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(texto)


def esc_attr(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def esc_texto(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")


def limpo(x):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", x))).strip()


def paginas():
    out = []
    for d, dirs, files in os.walk(RAIZ):
        dirs[:] = sorted(x for x in dirs if x not in SKIP and not x.startswith("."))
        for f in sorted(files):
            if f.endswith(".html"):
                out.append(os.path.relpath(os.path.join(d, f), RAIZ).replace(os.sep, "/"))
    return out


def chave(rel):
    """index.html -> ''; a/b/index.html -> 'a/b/'; 404.html -> None (não tem endereço próprio)."""
    if rel == "404.html":
        return None
    return rel[: -len("index.html")]


def sub_meta(s, atributo, valor):
    return re.sub(r"(<meta " + re.escape(atributo) + r' content=")[^"]*(")', lambda m: m.group(1) + esc_attr(valor) + m.group(2), s, count=1)


def e_noindex(s):
    return bool(re.search(r'<meta name="robots" content="[^"]*noindex', s))


# ---------- dados estruturados ----------
def salao(cfg):
    base = cfg["base_url"]
    morada = {"@type": "PostalAddress", "addressLocality": cfg["localidade"], "addressRegion": cfg["concelho"], "addressCountry": "PT"}
    if cfg.get("mostrar_rua_no_google"):
        morada = {"@type": "PostalAddress", "streetAddress": cfg["rua"], "addressLocality": cfg["localidade"],
                  "addressRegion": cfg["concelho"], "postalCode": cfg["codigo_postal"], "addressCountry": "PT"}
    d = {"@context": "https://schema.org", "@type": "BeautySalon", "@id": base + "#salao", "name": cfg["nome"], "url": base,
         "image": base + "img/og-image.jpg", "logo": base + "img/icon-512.png", "telephone": cfg["telefone"],
         "description": cfg["descricao_curta"], "address": morada,
         "areaServed": [{"@type": "City", "name": n} for n in cfg["areas_servidas"]]}
    if cfg.get("redes"):
        d["sameAs"] = cfg["redes"]
    return d


def faq_visivel(s):
    itens = re.findall(r'<details class="faq-item">\s*<summary>(.*?)</summary>\s*<p>(.*?)</p>\s*</details>', s, re.S)
    if not itens:
        return None
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": limpo(q), "acceptedAnswer": {"@type": "Answer", "text": limpo(a)}} for q, a in itens]}


def migalhas(k, s, base):
    m = re.search(r'<ol class="breadcrumb">(.*?)</ol>', s, re.S)
    if not m:
        return None
    url_pag = base + k
    itens = []
    for li in re.findall(r"<li>(.*?)</li>", m.group(1), re.S):
        a = re.match(r'\s*<a href="([^"]*)"[^>]*>(.*?)</a>\s*$', li, re.S)
        nome, alvo = (a.group(2), urljoin(url_pag, a.group(1))) if a else (li, url_pag)
        itens.append((limpo(nome), alvo))
    if len(itens) < 2:
        return None
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(itens)]}


def blocos_ld(k, cfg, s):
    if k is None or e_noindex(s):
        return []
    if k == "":
        return [b for b in (salao(cfg), faq_visivel(s)) if b]
    b = migalhas(k, s, cfg["base_url"])
    return [b] if b else []


# ---------- uma página ----------
def processar(rel, cfg, s):
    k = chave(rel)
    base = cfg["base_url"]
    s = s.replace('<html lang="pt">', '<html lang="pt-PT">', 1)
    if k in cfg["paginas"]:
        t, d = cfg["paginas"][k]["title"], cfg["paginas"][k]["description"]
        s = re.sub(r"<title>.*?</title>", lambda m: "<title>" + esc_texto(t) + "</title>", s, count=1, flags=re.S)
        for attr, v in (('name="description"', d), ('property="og:description"', d), ('name="twitter:description"', d),
                        ('property="og:title"', t), ('name="twitter:title"', t)):
            s = sub_meta(s, attr, v)
    if k is not None:
        url = base + k
        s = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), s, count=1)
        s = sub_meta(s, 'property="og:url"', url)
    if k is not None:                            # pré-carregar as 2 letras principais (o caminho depende da profundidade da página)
        pref = "./" if k == "" else "../" * k.count("/")
        s = re.sub(r'\n<link rel="preload" href="[^"]*fonts/[^"]*" as="font"[^>]*>', "", s)
        pre = "".join(f'\n<link rel="preload" href="{pref}fonts/{f}" as="font" type="font/woff2" crossorigin>' for f in FONTES_PRELOAD)
        s = re.sub(r'(<link rel="stylesheet" href="[^"]*styles\.css">)', lambda m: m.group(1) + pre, s, count=1)
    for attr in ('property="og:image"', 'name="twitter:image"'):
        s = re.sub(r"(<meta " + re.escape(attr) + r' content=")[^"]*img/og-image\.jpg(")', lambda m: m.group(1) + base + "img/og-image.jpg" + m.group(2), s, count=1)
    for nome_meta, campo in (("google-site-verification", "google_site_verification"), ("msvalidate.01", "bing_site_verification")):
        codigo = cfg.get(campo, "").strip()
        if k == "" and codigo:                   # verificação da propriedade no Google Search Console / Bing Webmaster Tools (só na página inicial)
            tag = '<meta name="' + nome_meta + '" content="' + esc_attr(codigo) + '">'
            if 'name="' + nome_meta + '"' in s:
                s = re.sub(r'<meta name="' + re.escape(nome_meta) + r'" content="[^"]*">', lambda m: tag, s, count=1)
            else:
                s = s.replace('<link rel="canonical"', tag + '\n<link rel="canonical"', 1)
    if k in cfg["nao_indexar"]:
        if re.search(r'<meta name="robots" content="[^"]*">', s):
            s = re.sub(r'(<meta name="robots" content=")[^"]*(">)', r"\1noindex,follow\2", s, count=1)
        else:
            s = s.replace('<link rel="canonical"', '<meta name="robots" content="noindex,follow">\n<link rel="canonical"', 1)
    s = re.sub(r'\s*<script type="application/ld\+json"[^>]*>.*?</script>', "", s, flags=re.S)
    blocos = blocos_ld(k, cfg, s)
    if blocos:
        ins = "".join('\n<script type="application/ld+json" data-seo="auto">\n' + json.dumps(b, ensure_ascii=False, separators=(",", ":")) + "\n</script>" for b in blocos)
        s = s.replace("\n</head>", ins + "\n</head>", 1)
    return s


LLMS_SERVICOS = ["servicos/", "servicos/sobrancelhas/", "servicos/sobrancelhas/threading/", "servicos/sobrancelhas/brow-lamination/",
                 "servicos/sobrancelhas/alisamento/", "servicos/sobrancelhas/coloracao/", "servicos/pestanas/", "servicos/pestanas/lifting/",
                 "servicos/pestanas/tintura/", "servicos/threading/"]
LLMS_PROCESSOS = ["processos/", "processos/threading/", "processos/brow-lamination/", "processos/lifting-pestanas/", "processos/coloracao/"]
LLMS_INFO = ["precario/", "localizacao/", "sobre/", "contato/", "app/"]
LLMS_LEGAL = ["privacidade/", "termos/", "cookies/", "cancelamento/"]


def gerar_llms(cfg, textos):
    """llms.txt (llmstxt.org): resumo do site para assistentes de IA. Só factos que já estão públicos; sem preços nem tempos (mudam e vêm do catálogo/painel)."""
    base = cfg["base_url"]
    tel = cfg["telefone"]
    tel_bonito = f"{tel[:4]} {tel[4:7]} {tel[7:10]} {tel[10:]}" if tel.startswith("+351") and len(tel) == 13 else tel

    def linha(k):
        rel = (k + "index.html")
        s = textos.get(rel)
        if s is None or e_noindex(s):
            return None
        t = re.search(r"<title>(.*?)</title>", s, re.S)
        d = re.search(r'<meta name="description" content="([^"]*)"', s)
        nome = html.unescape(t.group(1)).split(" — ")[0].strip() if t else k
        return f"- [{nome}]({base}{k}): {html.unescape(d.group(1))}" if d else f"- [{nome}]({base}{k})"

    def secao(titulo, chaves):
        ls = [l for l in (linha(k) for k in chaves) if l]
        return [f"## {titulo}", *ls, ""] if ls else []

    out = [f"# {cfg['nome']}", "", f"> {cfg['descricao_curta']}", "",
           "Resumo para assistentes de inteligência artificial e motores de pesquisa. O site está em português de Portugal, com tradução para inglês e espanhol. "
           "Os preços e a duração de cada serviço estão sempre no site e podem mudar: por isso não se repetem aqui.", "",
           "## Marcar",
           f"- [Marcação online]({base}agendar/): escolha o serviço, o dia e a hora e confirme o horário.",
           f"- WhatsApp: {tel_bonito} (dúvidas e conversa antes de marcar).",
           f"- Zona: {cfg['localidade']}, {cfg['concelho']} (Portugal). Atendimento por marcação; a morada exata é enviada ao confirmar o horário.", ""]
    out += secao("Serviços", LLMS_SERVICOS) + secao("Como é feito cada procedimento", LLMS_PROCESSOS) + secao("Informação", LLMS_INFO)
    out += secao("Condições, privacidade e cancelamento", LLMS_LEGAL)
    return "\n".join(out).rstrip() + "\n"


def gerar_sitemap(cfg, textos):
    base = cfg["base_url"]
    urls = []
    for rel, s in textos.items():
        k = chave(rel)
        if k is None or e_noindex(s):
            continue
        urls.append(base + k)
    urls += [base + e for e in cfg.get("urls_extra", [])]      # outros projetos alojados no mesmo repositório (ex.: tecnova/)
    urls.sort(key=lambda u: (u != base, u))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n")


def verificar_regras(cfg, textos):
    """Regras de qualidade das páginas indexáveis. Devolve a lista de problemas."""
    erros, titulos, descricoes = [], {}, {}
    for rel, s in textos.items():
        k = chave(rel)
        if k is None or e_noindex(s) or rel.startswith("painel/"):
            continue
        t = re.search(r"<title>(.*?)</title>", s, re.S)
        d = re.search(r'<meta name="description" content="([^"]*)"', s)
        c = re.search(r'<link rel="canonical" href="([^"]*)"', s)
        t, d, c = (t.group(1).strip() if t else ""), (html.unescape(d.group(1)) if d else ""), (c.group(1) if c else "")
        if not t: erros.append(f"{rel}: sem <title>")
        elif len(t) > MAX_TITULO: erros.append(f"{rel}: título com {len(t)} caracteres (máx. {MAX_TITULO}): {t}")
        if not d: erros.append(f"{rel}: sem meta description")
        elif not (MIN_DESC <= len(d) <= MAX_DESC): erros.append(f"{rel}: descrição com {len(d)} caracteres (entre {MIN_DESC} e {MAX_DESC})")
        if c != cfg["base_url"] + k: erros.append(f"{rel}: canonical «{c}» devia ser «{cfg['base_url'] + k}»")
        if 'lang="pt-PT"' not in s[:300]: erros.append(f"{rel}: <html> sem lang=\"pt-PT\"")
        if t: titulos.setdefault(t, []).append(rel)
        if d: descricoes.setdefault(d, []).append(rel)
        ld = " ".join(re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', s, re.S))
        if k == "":
            for tipo in ("BeautySalon", "FAQPage"):
                if '"@type":"' + tipo + '"' not in ld:
                    erros.append(f"{rel}: faltam os dados estruturados {tipo} (a pergunta frequente tem de estar em <details class=\"faq-item\">)")
        elif re.search(r'<ol class="breadcrumb">', s) and "BreadcrumbList" not in ld:
            erros.append(f"{rel}: tem migalhas visíveis mas não tem BreadcrumbList")
        for padrao in PROIBIDAS:
            for texto, onde in ((t, "título"), (d, "descrição"), (ld, "dados estruturados")):
                m = re.search(padrao, texto, re.I)
                if m: erros.append(f"{rel}: palavra a evitar «{m.group(0)}» no(a) {onde}")
    for t, rels in titulos.items():
        if len(rels) > 1: erros.append("título repetido «" + t + "»: " + ", ".join(rels))
    for d, rels in descricoes.items():
        if len(rels) > 1: erros.append("descrição repetida em: " + ", ".join(rels))
    return erros


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--verificar", action="store_true", help="não escreve nada; sai com 1 se algo estiver desatualizado")
    ap.add_argument("--base-url", help="novo endereço do site, com https:// e a terminar em /")
    args = ap.parse_args()
    cfg = json.loads(ler(SITE))
    alvos = [p for p in paginas()]
    textos = {rel: ler(os.path.join(RAIZ, rel)) for rel in alvos}
    def ler_ou_vazio(c):
        return ler(c) if os.path.exists(c) else ""
    extras = {"sitemap.xml": ler(os.path.join(RAIZ, "sitemap.xml")), "robots.txt": ler(os.path.join(RAIZ, "robots.txt")),
              "llms.txt": ler_ou_vazio(os.path.join(RAIZ, "llms.txt"))}

    if args.base_url:
        novo = args.base_url
        if not (novo.startswith("https://") and novo.endswith("/")):
            sys.exit("--base-url tem de começar por https:// e acabar em /  (ex.: https://inovabeauty.pt/)")
        antigo = cfg["base_url"]
        if novo != antigo:
            textos = {r: t.replace(antigo, novo) for r, t in textos.items()}
            extras = {r: t.replace(antigo, novo) for r, t in extras.items()}
            cfg["base_url"] = novo
            if not args.verificar:
                escrever(SITE, json.dumps(cfg, ensure_ascii=False, indent=2) + "\n")
                # tecnova/ é outro projeto no mesmo repositório (não é processado); só se troca o endereço do site no que lá existe
                for outro in ("tecnova/index.html",):
                    caminho = os.path.join(RAIZ, outro)
                    if os.path.exists(caminho):
                        t = ler(caminho)
                        if antigo in t:
                            escrever(caminho, t.replace(antigo, novo))
            print(f"endereço do site: {antigo} -> {novo}")

    novos = {rel: processar(rel, cfg, t) for rel, t in textos.items()}
    sm = gerar_sitemap(cfg, novos)
    rb = re.sub(r"Sitemap: .*", "Sitemap: " + cfg["base_url"] + "sitemap.xml", extras["robots.txt"])
    extras_novos = {"sitemap.xml": sm, "robots.txt": rb, "llms.txt": gerar_llms(cfg, novos)}

    antigas = set(re.findall(r"<loc>(.*?)</loc>", ler(os.path.join(RAIZ, "sitemap.xml"))))
    novas = set(re.findall(r"<loc>(.*?)</loc>", sm))
    mudadas = [rel for rel in alvos if novos[rel] != ler(os.path.join(RAIZ, rel))]
    mudadas_extra = [n for n in extras_novos if extras_novos[n] != ler_ou_vazio(os.path.join(RAIZ, n))]

    problemas = verificar_regras(cfg, novos)
    if args.verificar:
        for rel in mudadas + mudadas_extra:
            print("DESATUALIZADO:", rel)
        for p in problemas:
            print("PROBLEMA:", p)
        print(f"{len(mudadas) + len(mudadas_extra)} ficheiros desatualizados, {len(problemas)} problemas")
        sys.exit(1 if (mudadas or mudadas_extra or problemas) else 0)

    for rel in mudadas:
        escrever(os.path.join(RAIZ, rel), novos[rel])
    for n in mudadas_extra:
        escrever(os.path.join(RAIZ, n), extras_novos[n])
    print(f"páginas atualizadas: {len(mudadas)} de {len(alvos)} | sitemap: {len(novas)} endereços")
    for u in sorted(antigas - novas): print("  sai do sitemap:", u)
    for u in sorted(novas - antigas): print("  entra no sitemap:", u)
    for p in problemas: print("PROBLEMA:", p)
    sys.exit(1 if problemas else 0)


if __name__ == "__main__":
    main()
