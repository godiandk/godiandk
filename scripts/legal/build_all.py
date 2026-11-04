#!/usr/bin/env python3
"""Gera as 4 páginas legais e os dicionários EN/ES.   Uso (na raiz do repositório):

    python3 scripts/legal/build_all.py

Depois, para trocar os «A PREENCHER» pelos dados reais (nome, NIF, morada…):

    python3 scripts/preencher_dados_legais.py --nome "…" --nif "…" --morada "…" --email "…"
"""
import os, sys, json, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build                                    # noqa: E402  (muda para a raiz do repositório)
from build import escrever, ENTRIES              # noqa: E402
import privacy, terms, cookies, cancel, forms, shared    # noqa: E402


def dicionarios_base():
    """Lê idiomas/en.js e idiomas/es.js (sem o bloco gerado) para não contradizer traduções já existentes."""
    out = {}
    for lang in ("en", "es"):
        txt = build.texto_sem_bloco(f"idiomas/{lang}.js")
        js = ("const vm=require('vm');const w={};vm.runInNewContext(process.argv[1],{window:w});"
              "console.log(JSON.stringify(w.INOVA_DIC['" + lang + "']))")
        r = subprocess.run(["node", "-e", js, txt], capture_output=True, text=True, cwd=build.ROOT)
        if r.returncode != 0:
            raise SystemExit("node falhou: " + r.stderr[:400])
        out[lang] = json.loads(r.stdout)
    return out


def main():
    paginas = []
    for mod in (privacy, terms, cookies, cancel):
        pg = mod.build()
        escrever(pg)
        paginas.append(pg.slug)
    base = dicionarios_base()
    forms.aplicar()                      # avisos junto dos formulários (agendar, conta, app/home)
    shared.registar(base)                # textos partilhados (rodapé, chat, mapa…)
    conflitos = []
    for k in list(ENTRIES):
        en, es = ENTRIES[k]
        c_en, c_es = base["en"].get(k), base["es"].get(k)
        if (c_en is not None and c_en != en) or (c_es is not None and c_es != es):
            conflitos.append((k, (c_en, en), (c_es, es)))
    if conflitos:
        print("AVISO — chaves que já existem nos dicionários base com tradução diferente (prevalece a do site):")
        for k, a, b in conflitos:
            print("  •", k[:70], "| EN base:", a[0], "→ legal:", a[1], "| ES base:", b[0], "→ legal:", b[1])
    build.escrever_dicionarios(base)
    build.escrever_partilhado()
    cruzados = [k for k in build.PARTILHADO if k in build.ENTRIES and build.PARTILHADO[k] != build.ENTRIES[k]]
    if cruzados:
        print("AVISO — mesma chave com traduções diferentes entre os dicionários partilhado e legal:", cruzados[:5])
    print("páginas:", ", ".join(paginas))


if __name__ == "__main__":
    main()
