"""Blocos partilhados pelos documentos legais."""
from build import T, A, PH

WA = "+351 919 277 205"

# --- datas / versão (alterar aqui quando os documentos mudarem) ---
ATUALIZADO = "4 de novembro de 2026"
VERSAO = "2.0"

L_PRESTADOR = T("Prestador de serviços", "Service provider", "Prestador de servicios")
L_RESPONSAVEL = T("Responsável pelo tratamento dos dados", "Data controller", "Responsable del tratamiento de los datos")
L_NOME = T("Nome", "Name", "Nombre")
L_NIF = T("NIF", "Tax ID (NIF)", "NIF")
L_MORADA = T("Morada", "Address", "Dirección")
L_EMAIL = T("Email", "Email", "Correo electrónico")
L_TEL = T("Telemóvel e WhatsApp", "Mobile and WhatsApp", "Móvil y WhatsApp")
L_ATIV = T("Atividade", "Activity", "Actividad")

V_ATIV = T("Serviços de estética (sobrancelhas, pestanas e lábios), prestados por marcação em Canidelo, Vila Nova de Gaia.",
           "Beauty services (eyebrows, lashes and lips), provided by appointment in Canidelo, Vila Nova de Gaia, Portugal.",
           "Servicios de estética (cejas, pestañas y labios), prestados con cita previa en Canidelo, Vila Nova de Gaia (Portugal).")

def ident_rows(primeira=L_PRESTADOR, extra=None):
    rows = [
        (primeira, ("RAW", "Inova Beauty — " + PH("nome"))),
        (L_NIF, ("RAW", PH("nif"))),
        (L_MORADA, ("RAW", PH("morada"))),
        (L_EMAIL, ("RAW", PH("email"))),
        (L_TEL, ("RAW", WA)),
        (L_ATIV, V_ATIV),
    ]
    if extra: rows += extra
    return rows

CAP_IDENT = T("Identificação", "Identification", "Identificación")

# --- fundamentos de licitude (RGPD) ---
LB_B = T("Execução de um contrato ou diligências pré-contratuais a seu pedido (art. 6.º, n.º 1, al. b) do RGPD)",
         "Performance of a contract or steps taken at your request before a contract (Art. 6(1)(b) GDPR)",
         "Ejecución de un contrato o medidas precontractuales a petición suya (art. 6.1.b) RGPD)")
LB_A = T("Consentimento (art. 6.º, n.º 1, al. a))", "Consent (Art. 6(1)(a))", "Consentimiento (art. 6.1.a))")
LB_C = T("Obrigação legal (art. 6.º, n.º 1, al. c))", "Legal obligation (Art. 6(1)(c))", "Obligación legal (art. 6.1.c))")
LB_F = T("Interesses legítimos (art. 6.º, n.º 1, al. f))", "Legitimate interests (Art. 6(1)(f))", "Intereses legítimos (art. 6.1.f))")
LB_BF = T("Execução do contrato (al. b)) e interesse legítimo em manter a agenda correta (al. f))",
          "Performance of the contract (point (b)) and legitimate interest in keeping the diary correct (point (f))",
          "Ejecución del contrato (letra b)) e interés legítimo en mantener la agenda correcta (letra f))")
LB_9 = T("Consentimento explícito (art. 9.º, n.º 2, al. a)) e execução do contrato (art. 6.º, n.º 1, al. b))",
         "Explicit consent (Art. 9(2)(a)) and performance of the contract (Art. 6(1)(b))",
         "Consentimiento explícito (art. 9.2.a)) y ejecución del contrato (art. 6.1.b))")

SIM = T("Sim", "Yes", "Sí")
NAO = T("Não", "No", "No")
AUTO = T("Automático", "Automatic", "Automático")

def cmd(pt, en, es): return T(pt, en, es)
