#!/usr/bin/env python3
"""
Injeta SEO tecnico em todas as paginas do Inova Beauty.

  canonical + Open Graph + Twitter Card + JSON-LD

Idempotente: corre as vezes que quiser, nao duplica nada. Tudo o que escreve
fica entre marcas <!-- seo:inicio --> e <!-- seo:fim -->, por isso basta voltar
a correr para refazer com dados novos.

O dominio vem de BASE. Quando o site passar a ter dominio proprio, muda-se
ali numa linha e corre-se outra vez.
"""
import re, json, glob, os, sys

BASE = os.environ.get('INOVA_BASE', 'https://godiandk.github.io').rstrip('/')

TEL   = '+351919277205'
NOME  = 'Inova Beauty'
IMG   = '/img/thayana.jpg'

# Paginas que nao devem aparecer no Google
NOINDEX = {'conta/index.html', 'painel/index.html', 'app/home/index.html', '404.html'}

INICIO, FIM = '<!-- seo:inicio -->', '<!-- seo:fim -->'


def url_de(f):
    return '/' if f == 'index.html' else '/' + f.replace('/index.html', '/')


def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;')
             .replace('>', '&gt;').replace('"', '&quot;'))


def negocio():
    """O cartao de identidade do negocio. Sem morada: o site nao a publica,
    e inventar uma morada no Google e pior do que nao ter nenhuma."""
    return {
        '@type': 'BeautySalon',
        '@id': BASE + '/#negocio',
        'name': NOME,
        'url': BASE + '/',
        'image': BASE + IMG,
        'telephone': TEL,
        'priceRange': '€€',
        'currenciesAccepted': 'EUR',
        'areaServed': {'@type': 'Country', 'name': 'Portugal'},
        'description': ('Estudio de sobrancelhas, pestanas, micropigmentacao e '
                        'depilacao a laser. Threading, brow lamination, henna, '
                        'lifting e extensao de pestanas.'),
        'openingHoursSpecification': [{
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday',
                          'Thursday', 'Friday', 'Saturday'],
            'opens': '09:00', 'closes': '19:00',
        }],
        'sameAs': ['https://wa.me/351919277205'],
    }


def migalhas(f):
    """BreadcrumbList a partir do caminho da pasta."""
    if f == 'index.html':
        return None
    partes = f.replace('/index.html', '').split('/')
    itens, caminho = [{'@type': 'ListItem', 'position': 1,
                       'name': 'Inicio', 'item': BASE + '/'}], ''
    for i, p in enumerate(partes, start=2):
        caminho += '/' + p
        itens.append({'@type': 'ListItem', 'position': i,
                      'name': p.replace('-', ' ').title(),
                      'item': BASE + caminho + '/'})
    return {'@type': 'BreadcrumbList', 'itemListElement': itens}


def servico(f, titulo, desc):
    """Service para cada pagina de servico ou processo."""
    if not (f.startswith('servicos/') or f.startswith('processos/')):
        return None
    if f in ('servicos/index.html', 'processos/index.html'):
        return None
    nome = re.split(r'\s+—\s+', titulo)[0].replace('Como é feito: ', '').strip()
    return {
        '@type': 'Service', 'name': nome, 'description': desc,
        'url': BASE + url_de(f),
        'serviceType': nome,
        'provider': {'@id': BASE + '/#negocio'},
        'areaServed': {'@type': 'Country', 'name': 'Portugal'},
    }


def bloco(f, titulo, desc, noindex):
    u = BASE + url_de(f)
    L = [INICIO]
    if noindex:
        L.append('<meta name="robots" content="noindex, follow">')
    else:
        L.append(f'<link rel="canonical" href="{u}">')
    L += [
        f'<meta property="og:type" content="{"website" if f == "index.html" else "article"}">',
        f'<meta property="og:site_name" content="{NOME}">',
        '<meta property="og:locale" content="pt_PT">',
        f'<meta property="og:title" content="{esc(titulo)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{u}">',
        f'<meta property="og:image" content="{BASE}{IMG}">',
        '<meta property="og:image:width" content="1000">',
        '<meta property="og:image:height" content="1000">',
        f'<meta property="og:image:alt" content="{esc(NOME)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(titulo)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{BASE}{IMG}">',
    ]
    if not noindex:
        grafo = [negocio()] if f == 'index.html' else []
        for x in (migalhas(f), servico(f, titulo, desc)):
            if x:
                grafo.append(x)
        if f == 'index.html':
            grafo.append({'@type': 'WebSite', 'url': BASE + '/', 'name': NOME,
                          'inLanguage': 'pt-PT',
                          'publisher': {'@id': BASE + '/#negocio'}})
        if grafo:
            L.append('<script type="application/ld+json">' +
                     json.dumps({'@context': 'https://schema.org',
                                 '@graph': grafo},
                                ensure_ascii=False, separators=(',', ':')) +
                     '</script>')
    L.append(FIM)
    return '\n'.join(L)


def main():
    fs = sorted(f for f in glob.glob('**/*.html', recursive=True)
                if not f.startswith('tecnova/'))
    n = 0
    for f in fs:
        s = open(f, encoding='utf-8').read()
        t = re.search(r'<title>(.*?)</title>', s, re.S)
        d = re.search(r'<meta\s+name="description"\s+content="(.*?)"', s, re.S)
        if not t:
            print('  ! sem <title>, ignorado:', f)
            continue
        titulo = re.sub(r'\s+', ' ', t.group(1)).strip()
        desc = re.sub(r'\s+', ' ', d.group(1)).strip() if d else ''
        if not desc:
            print('  ! sem description:', f)

        novo = bloco(f, titulo, desc, f in NOINDEX)

        # refazer se ja existe, senao inserir antes de </head>
        if INICIO in s:
            s = re.sub(re.escape(INICIO) + r'.*?' + re.escape(FIM), lambda _: novo,
                       s, flags=re.S)
        else:
            s = s.replace('</head>', novo + '\n</head>', 1)
        open(f, 'w', encoding='utf-8').write(s)
        n += 1
    print(f'SEO aplicado a {n} paginas. Base: {BASE}')


if __name__ == '__main__':
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
    main()
