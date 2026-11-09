#!/usr/bin/env python3
"""Troca os «A PREENCHER» do site pelos dados reais do prestador (e pelas regras do estúdio).

Os dados legais (nome, NIF, morada…) não estão escritos no código de propósito: só o Wesley e a Thayana os sabem
e não se inventam. Enquanto faltarem, o site mostra «A PREENCHER» a amarelo, bem visível, no rodapé de todas as páginas
e nos documentos legais.

Uso (na raiz do repositório). Só os campos que indicar são alterados; pode correr várias vezes:

    python3 scripts/preencher_dados_legais.py --listar

    python3 scripts/preencher_dados_legais.py \\
        --nome "Nome completo do titular" \\
        --nif "123456789" \\
        --morada "Rua …, n.º …, 4400-000 Vila Nova de Gaia" \\
        --email "…@…"

    python3 scripts/preencher_dados_legais.py \\
        --iva "Isento de IVA ao abrigo do art. 53.º do CIVA"          # ou "IVA incluído à taxa legal em vigor" \\
        --meios-pagamento "Numerário, MB Way e cartão" \\
        --prazo-cancelamento "24 horas" \\
        --encargos-cancelamento "Sem encargos" \\
        --entidade-ral "Nome da entidade (ou: não aderimos a nenhuma entidade de RAL)" \\
        --regiao-firestore "Europa (…)"

Os valores ficam também em scripts/legal/dados_legais.json, para que `python3 scripts/legal/build_all.py`
(que volta a gerar as 4 páginas legais) não os perca. Depois de preencher, reveja o resultado, faça commit e publique.
"""
import argparse, html, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
JSON_PATH = os.path.join(ROOT, "scripts", "legal", "dados_legais.json")
SKIP = {".git", "node_modules", "vendor", "scripts", "docs", "fonts", "img", "tecnova"}

CAMPOS = {
    "nome": "Nome completo (ou firma) do prestador",
    "nif": "NIF",
    "morada": "Morada (sede ou domicílio profissional)",
    "email": "Email de contacto",
    "iva": "Regime de IVA (texto curto, por exemplo «Isento de IVA ao abrigo do art. 53.º do CIVA»)",
    "meios_pagamento": "Meios de pagamento aceites no estúdio",
    "prazo_cancelamento": "Aviso prévio para cancelar ou remarcar sem encargos (por exemplo «24 horas»)",
    "encargos_cancelamento": "Encargo por cancelamento tardio ou falta (por exemplo «Sem encargos»)",
    "entidade_ral": "Entidade de resolução alternativa de litígios (RAL) a que aderiu, ou a indicação de que não aderiu",
    "regiao_firestore": "Região da base de dados Firestore (vê-se na consola do Firebase → Firestore → Definições)",
}
SPAN = r'<span class="(?:a-preencher|dado-legal)" data-campo="%s">.*?</span>'


def nif_valido(n):
    """Dígito de controlo do NIF português (módulo 11)."""
    if not re.fullmatch(r"\d{9}", n):
        return False
    soma = sum(int(n[i]) * (9 - i) for i in range(8))
    c = 11 - soma % 11
    return int(n[8]) == (0 if c >= 10 else c)


def ficheiros_html():
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in SKIP and not x.startswith(".")]
        for f in files:
            if f.endswith(".html"):
                yield os.path.join(d, f)


def contar_pendentes():
    n = {c: 0 for c in CAMPOS}
    for p in ficheiros_html():
        t = open(p, encoding="utf-8").read()
        for c in CAMPOS:
            n[c] += len(re.findall(r'<span class="a-preencher" data-campo="%s">' % c, t))
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--listar", action="store_true", help="mostra o que falta preencher e sai")
    ap.add_argument("--forcar", action="store_true", help="aceita um NIF cujo dígito de controlo não bate certo")
    for c, d in CAMPOS.items():
        ap.add_argument("--" + c.replace("_", "-"), dest=c, help=d)
    a = ap.parse_args()

    if a.listar or not any(getattr(a, c) for c in CAMPOS):
        pend = contar_pendentes()
        print("Campos ainda «A PREENCHER» (número de sítios no site):")
        for c, d in CAMPOS.items():
            print(f"  {'FALTA' if pend[c] else 'ok   '}  {c:<22} {pend[c]:>3}   {d}")
        return 0

    dados = {}
    if os.path.exists(JSON_PATH):
        dados = json.load(open(JSON_PATH, encoding="utf-8"))
    novos = {}
    for c in CAMPOS:
        v = getattr(a, c)
        if v is None:
            continue
        v = re.sub(r"\s+", " ", v).strip()
        if not v:
            continue
        if c == "nif":
            v = re.sub(r"[\s.-]", "", v).upper().removeprefix("PT")
            if not nif_valido(v) and not a.forcar:
                sys.exit("O NIF «%s» não tem 9 dígitos válidos (o dígito de controlo não bate certo). Confirme, ou use --forcar." % v)
        if c == "email" and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", v):
            sys.exit("O email «%s» não parece um email válido." % v)
        novos[c] = v
    dados.update(novos)
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    json.dump(dados, open(JSON_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2, sort_keys=True)

    alterados = 0
    for p in ficheiros_html():
        t = o = open(p, encoding="utf-8").read()
        for c, v in novos.items():
            novo = '<span class="dado-legal" data-campo="%s">%s</span>' % (c, html.escape(v, quote=False))
            t = re.sub(SPAN % c, lambda m: novo, t, flags=re.S)
        if t != o:
            open(p, "w", encoding="utf-8").write(t)
            alterados += 1
    print("Campos preenchidos:", ", ".join(novos) or "nenhum")
    print("Páginas alteradas:", alterados)
    pend = {c: n for c, n in contar_pendentes().items() if n}
    print("Ainda por preencher:", ", ".join(pend) if pend else "nada — tudo preenchido")
    return 0


if __name__ == "__main__":
    sys.exit(main())
