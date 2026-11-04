"""Avisos de proteção de dados junto ao botão de envio de cada formulário (RGPD, art. 13.º).

Cada aviso está em `<!--legal:nome-->…<!--/legal:nome-->` dentro da página; o build_all.py reescreve o que está
entre as marcas e regista as traduções EN/ES em idiomas/en.js e es.js (balde «partilhado»).
Primeira camada = o essencial (quem, para quê, fundamento, o que não escrever); o resto (prazos, destinatários,
direitos) está na Política de Privacidade, para onde cada aviso tem ligação.
"""
import os, re
from build import T, A, inline, usar, ROOT

RESP = T("Responsável: Inova Beauty.", "Controller: Inova Beauty.", "Responsable: Inova Beauty.")
POL = lambda p: A(p + "privacidade/", T("Política de Privacidade", "Privacy Policy", "Política de Privacidad"))
TERMOS = lambda p: A(p + "termos/", T("Termos e Condições", "Terms and Conditions", "Términos y Condiciones"))
CANC = lambda p: A(p + "cancelamento/", T("Cancelamento e reembolso", "Cancellation and refunds", "Cancelación y reembolso"))
PREC = lambda p: A(p + "precario/", T("Preçário", "Price list", "Listado de precios"))


def box(*paragrafos):
    return '<div class="form-legal">' + "".join(f"<p>{inline(p)}</p>" for p in paragrafos) + "</div>"


def avisos(p):
    """p = prefixo relativo até à raiz do site: «../» (agendar, conta) ou «../../» (app/home)."""
    usar("partilhado")
    N = {}
    N["marcacao"] = box(
        ["<strong>", T("Para que usamos os seus dados:", "What we use your data for:", "Para qué usamos sus datos:"), "</strong>",
         T(" o nome e o telemóvel servem só para tratar desta marcação e para o contactar sobre ela (execução do contrato; art. 6.º, n.º 1, al. b) do RGPD). Não escreva dados de saúde nas observações. ",
           " your name and mobile number are used only to handle this appointment and to contact you about it (performance of a contract; Art. 6(1)(b) GDPR). Please do not write health data in the notes. ",
           " el nombre y el móvil se usan solo para gestionar esta cita y para contactarle sobre ella (ejecución del contrato; art. 6.1.b) del RGPD). No escriba datos de salud en las observaciones. "),
         RESP,
         T(" Prazos, destinatários e direitos: ", " Retention, recipients and rights: ", " Plazos, destinatarios y derechos: "), POL(p), T(".", ".", ".")],
        [T("Isto é um pedido de marcação: só fica confirmada quando lhe respondermos. Antes de marcar, veja o ",
           "This is an appointment request: it is only confirmed once we reply to you. Before booking, see the ",
           "Esto es una solicitud de cita: solo queda confirmada cuando le respondamos. Antes de reservar, vea el "),
         PREC(p), T(", os ", ", the ", ", los "), TERMOS(p), T(" e o ", " and ", " y el "), CANC(p),
         T(" (inclui o direito de desistir em 14 dias).", " (it includes the right to withdraw within 14 days).", " (incluye el derecho a desistir en 14 días).")])

    N["entrar"] = box(
        [T("Usamos o email e a palavra-passe só para iniciar a sua sessão (execução do contrato; art. 6.º, n.º 1, al. b) do RGPD). ",
           "We use your email and password only to sign you in (performance of a contract; Art. 6(1)(b) GDPR). ",
           "Usamos el correo electrónico y la contraseña solo para iniciar su sesión (ejecución del contrato; art. 6.1.b) del RGPD). "),
         RESP, T(" Mais informação: ", " More information: ", " Más información: "), POL(p), T(".", ".", ".")])

    N["registo"] = box(
        ["<strong>", T("Para que usamos os seus dados:", "What we use your data for:", "Para qué usamos sus datos:"), "</strong>",
         T(" o nome, o telemóvel e o email servem para criar e gerir a sua conta e o cartão de fidelidade (execução do contrato; art. 6.º, n.º 1, al. b) do RGPD). A palavra-passe é tratada pelo serviço Firebase Authentication, da Google; nós não a vemos.",
           " your name, mobile number and email are used to create and manage your account and loyalty card (performance of a contract; Art. 6(1)(b) GDPR). The password is handled by the Firebase Authentication service, from Google; we cannot see it.",
           " el nombre, el móvil y el correo electrónico sirven para crear y gestionar su cuenta y la tarjeta de fidelidad (ejecución del contrato; art. 6.1.b) del RGPD). La contraseña la trata el servicio Firebase Authentication, de Google; nosotros no la vemos.")],
        [T("O aniversário (só o dia e o mês) e a foto são opcionais. Só os usamos para lhe dar o cupão de aniversário e para mostrar o seu avatar; ao preenchê-los, dá-nos o seu consentimento, que pode retirar quando quiser (art. 6.º, n.º 1, al. a) do RGPD).",
           "Your birthday (day and month only) and photo are optional. We only use them to give you the birthday coupon and to show your avatar; by filling them in, you give us your consent, which you can withdraw at any time (Art. 6(1)(a) GDPR).",
           "El cumpleaños (solo día y mes) y la foto son opcionales. Solo los usamos para darle el cupón de cumpleaños y para mostrar su avatar; al rellenarlos, nos da su consentimiento, que puede retirar cuando quiera (art. 6.1.a) del RGPD).")],
        [RESP, T(" É preciso ter 13 anos ou mais. Prazos, destinatários e direitos: ", " You must be 13 or over. Retention, recipients and rights: ", " Hay que tener 13 años o más. Plazos, destinatarios y derechos: "), POL(p), T(".", ".", ".")])

    N["conta"] = box(
        [T("As alterações ficam guardadas na sua conta. Pode corrigir aqui os seus dados ou apagá-los em «Apagar conta». ",
           "Changes are saved to your account. You can correct your details here or delete them with “Delete account”. ",
           "Los cambios se guardan en su cuenta. Puede corregir aquí sus datos o borrarlos en «Borrar cuenta». "),
         RESP, T(" Direitos e prazos: ", " Rights and retention: ", " Derechos y plazos: "), POL(p), T(".", ".", ".")])

    N["publicar"] = box(
        ["<strong>", T("Antes de publicar:", "Before posting:", "Antes de publicar:"), "</strong>",
         T(" a publicação (foto, descrição, o seu nome e o seu avatar) e os seus comentários ficam visíveis para as outras clientes com sessão iniciada na app (consentimento; art. 6.º, n.º 1, al. a) do RGPD), até os apagar. Não publique fotografias de outras pessoas sem a autorização delas, nem dados de saúde. ",
           " the post (photo, description, your name and your avatar) and your comments are visible to other customers signed in to the app (consent; Art. 6(1)(a) GDPR) until you delete them. Do not post photos of other people without their permission, or health data. ",
           " la publicación (foto, descripción, su nombre y su avatar) y sus comentarios son visibles para otras clientas con sesión iniciada en la app (consentimiento; art. 6.1.a) del RGPD) hasta que los borre. No publique fotografías de otras personas sin su permiso, ni datos de salud. "),
         RESP, " ", POL(p), T(" · ", " · ", " · "), TERMOS(p), T(".", ".", ".")])
    return N


def injetar(pagina, nome, html):
    f = os.path.join(ROOT, pagina)
    s = open(f, encoding="utf-8").read()
    ini, fim = f"<!--legal:{nome}-->", f"<!--/legal:{nome}-->"
    if ini not in s:
        raise SystemExit(f"{pagina}: falta a marca {ini}")
    a = s.index(ini) + len(ini); b = s.index(fim)
    open(f, "w", encoding="utf-8").write(s[:a] + html + s[b:])


# onde vai cada aviso (página, nome da marca, aviso)
LUGARES = [
    ("agendar/index.html", "marcacao", "marcacao", "../"),
    ("app/home/index.html", "marcacao", "marcacao", "../../"),
    ("conta/index.html", "entrar", "entrar", "../"),
    ("app/home/index.html", "entrar", "entrar", "../../"),
    ("conta/index.html", "registo", "registo", "../"),
    ("app/home/index.html", "registo", "registo", "../../"),
    ("conta/index.html", "conta", "conta", "../"),
    ("app/home/index.html", "conta", "conta", "../../"),
    ("app/home/index.html", "publicar", "publicar", "../../"),
]


def aplicar():
    for pagina, marca, aviso, pref in LUGARES:
        injetar(pagina, marca, avisos(pref)[aviso])
