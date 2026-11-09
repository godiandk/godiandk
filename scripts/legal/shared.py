"""Traduções (EN/ES) dos textos novos ou alterados nesta revisão jurídica e que aparecem em várias páginas:
rodapé, ligação «Saltar para o conteúdo», chat, mapa, carrossel, aviso de cookies, rótulos dos formulários…
Vão para idiomas/en.js e idiomas/es.js (bloco «GERADO»), pelo build_all.py. Ver forms.py para os avisos dos formulários.
"""
import json, os
from build import reg, usar, HERE


def S(pt, en, es):
    reg(pt, en, es)


# Textos que só mudaram de palavra (senha → palavra-passe, cupom → cupão, Contato → Contacto): herdam a tradução antiga.
# (antes, depois) — o «antes» já existe em idiomas/en.js e es.js.
HERDADAS = [
    ("A sua senha", "A sua palavra-passe"),
    ("Alterar senha", "Alterar palavra-passe"),
    ("Alterar senha (por email)", "Alterar palavra-passe (por email)"),
    ("Confirmar senha*", "Confirmar palavra-passe*"),
    ("Contato", "Contacto"),
    ("Cupom (opcional)", "Cupão (opcional)"),
    ("Cupom de desconto (opcional)", "Cupão de desconto (opcional)"),
    ("Esqueci a minha senha", "Esqueci a minha palavra-passe"),
    ("Senha", "Palavra-passe"),
    ("Senha* (mín. 6 caracteres)", "Palavra-passe* (mín. 6 caracteres)"),
    ("Senha* (mín. 6)", "Palavra-passe* (mín. 6)"),
    ("Crie a sua conta gratuita e receba automaticamente um cupom de 10% na semana do seu aniversário. É o nosso mimo para si.",
     "Crie a sua conta gratuita e receba automaticamente um cupão de 10% na semana do seu aniversário. É o nosso mimo para si."),
]


def herdar(base):
    """base = {'en': {...}, 'es': {...}} (dicionários já existentes). Devolve quantas heranças fez."""
    n = 0
    for antes, depois in HERDADAS:
        en, es = base["en"].get(antes), base["es"].get(antes)
        if en is None and es is None:
            continue
        reg(depois, en if en is not None else antes, es if es is not None else antes)
        n += 1
    return n


def registar(base=None):
    usar("partilhado")
    if base:
        herdar(base)

    # ---- navegação, rodapé, acessibilidade ----
    S("Saltar para o conteúdo", "Skip to content", "Saltar al contenido")
    S("Contacto", "Contact", "Contacto")
    S("Beleza, precisão e cuidado em cada detalhe. Sobrancelhas, pestanas e lábios em Canidelo, Vila Nova de Gaia.",
      "Beauty, precision and care in every detail. Eyebrows, lashes and lips in Canidelo, Vila Nova de Gaia.",
      "Belleza, precisión y cuidado en cada detalle. Cejas, pestañas y labios en Canidelo, Vila Nova de Gaia.")
    S("Política de Cookies", "Cookie Policy", "Política de Cookies")
    S("Política de Privacidade", "Privacy Policy", "Política de Privacidad")
    S("Termos e Condições", "Terms and Conditions", "Términos y Condiciones")
    S("Cancelamento e reembolso", "Cancellation and refunds", "Cancelación y reembolso")
    S("Livro de Reclamações", "Complaints Book", "Libro de Reclamaciones")
    S("Prestador de serviços", "Service provider", "Prestador de servicios")
    S("NIF", "Tax ID (NIF)", "NIF")
    S("Preferências de cookies", "Cookie preferences", "Preferencias de cookies")

    # ---- carrossel ----
    S("Pausar a rotação automática", "Pause automatic rotation", "Pausar la rotación automática")
    S("Retomar a rotação automática", "Resume automatic rotation", "Reanudar la rotación automática")

    # ---- chat (assistente automático) ----
    S("Abrir assistente automático", "Open automatic assistant", "Abrir asistente automático")
    S("Assistente", "Assistant", "Asistente")
    S("Assistente automático", "Automatic assistant", "Asistente automático")
    S("Fechar assistente", "Close assistant", "Cerrar asistente")
    S("A sua pergunta", "Your question", "Su pregunta")
    S("Escreva a sua pergunta…", "Type your question…", "Escriba su pregunta…")
    S("Assistente automático: o que escrever aqui não é guardado nem enviado a ninguém.",
      "Automatic assistant: what you type here is not stored or sent to anyone.",
      "Asistente automático: lo que escriba aquí no se guarda ni se envía a nadie.")
    S("Olá! 👋 Sou o assistente automático da Inova Beauty e dou respostas rápidas sobre preços, serviços, localização e marcações. As mensagens escritas aqui não são enviadas ao estúdio: para falar com uma pessoa, use o WhatsApp.",
      "Hello! 👋 I'm Inova Beauty's automatic assistant and I give quick answers about prices, services, location and appointments. Messages written here are not sent to the studio: to talk to a person, use WhatsApp.",
      "¡Hola! 👋 Soy el asistente automático de Inova Beauty y doy respuestas rápidas sobre precios, servicios, ubicación y citas. Los mensajes escritos aquí no se envían al estudio: para hablar con una persona, use WhatsApp.")
    S("Os nossos preços estão todos no", "Our prices are all in the", "Nuestros precios están todos en el")
    S("preçário online", "online price list", "listado de precios en línea")
    S("💛 Por exemplo: Threading de sobrancelhas 10,00€, Brow Lamination 20,00€, Lifting de pestanas 25,00€, Tintura de pestanas 15,00€.",
      "💛 For example: Eyebrow threading €10.00, Brow Lamination €20.00, Lash lifting €25.00, Lash tint €15.00.",
      "💛 Por ejemplo: Threading de cejas 10,00 €, Brow Lamination 20,00 €, Lifting de pestañas 25,00 €, Tinte de pestañas 15,00 €.")
    S("Fazemos threading (depilação com linha), coloração e tratamentos de sobrancelhas (brow lamination, alisamento) e lifting e tintura de pestanas. Veja tudo em",
      "We do threading (hair removal with thread), eyebrow tinting and treatments (brow lamination, smoothing) and lash lifting and tinting. See everything in",
      "Hacemos threading (depilación con hilo), coloración y tratamientos de cejas (brow lamination, alisado) y lifting y tinte de pestañas. Véalo todo en")
    S("Não consegui perceber a sua pergunta. Este chat é automático e não envia mensagens ao estúdio. Para uma resposta personalizada, fale connosco no",
      "I could not understand your question. This chat is automatic and does not send messages to the studio. For a personal reply, talk to us on",
      "No he podido entender su pregunta. Este chat es automático y no envía mensajes al estudio. Para una respuesta personalizada, hable con nosotros por")
    S("Atendemos só por marcação, nos dias e horas que aparecem disponíveis na",
      "We only see clients by appointment, on the days and times shown as available in the",
      "Atendemos solo con cita previa, en los días y horas que aparecen disponibles en la")
    S("marcação online", "online booking", "reserva en línea")
    S("(os dias mudam ao longo do mês) 😊", "(the days change throughout the month) 😊", "(los días cambian a lo largo del mes) 😊")
    S("Envie-nos mensagem no WhatsApp e partilhamos logo a localização exata 📍", "Send us a WhatsApp message and we will share the exact location right away 📍", "Envíenos un mensaje por WhatsApp y le compartimos enseguida la ubicación exacta 📍")
    S("Perfeito! Pode marcar já:", "Great! You can book right now:", "¡Perfecto! Puede reservar ya:")
    S("clique aqui para agendar no WhatsApp", "click here to book on WhatsApp", "haga clic aquí para reservar por WhatsApp")
    S("ou use a nossa", "or use our", "o use nuestra")

    # ---- mapa (carrega só a pedido) ----
    S("Mostrar o mapa", "Show the map", "Mostrar el mapa")
    S("O mapa é fornecido pela Google. Ao carregá-lo, o seu navegador liga-se aos servidores da Google, que recebem o seu endereço IP e podem guardar cookies. Só o carregamos se o pedir.",
      "The map is provided by Google. When you load it, your browser connects to Google's servers, which receive your IP address and may store cookies. We only load it if you ask.",
      "El mapa lo proporciona Google. Al cargarlo, su navegador se conecta a los servidores de Google, que reciben su dirección IP y pueden guardar cookies. Solo lo cargamos si lo pide.")

    # ---- aviso de cookies/medição (só aparece se a medição for ativada) ----
    S("Cookies e medição", "Cookies and measurement", "Cookies y medición")
    S("Queremos perceber como o site é usado e medir os nossos anúncios, com ferramentas da Google e da Meta. Estas ferramentas guardam identificadores no seu dispositivo e enviam dados para essas empresas, que os podem tratar fora da União Europeia. Só as ativamos se aceitar. O site funciona na mesma se recusar.",
      "We would like to understand how the site is used and measure our ads, with tools from Google and Meta. These tools store identifiers on your device and send data to those companies, which may process it outside the European Union. We only switch them on if you accept. The site works just the same if you refuse.",
      "Queremos entender cómo se usa el sitio y medir nuestros anuncios, con herramientas de Google y de Meta. Estas herramientas guardan identificadores en su dispositivo y envían datos a esas empresas, que pueden tratarlos fuera de la Unión Europea. Solo las activamos si acepta. El sitio funciona igual si rechaza.")
    S("Aceitar", "Accept", "Aceptar")
    S("Recusar", "Refuse", "Rechazar")

    # ---- formulários: rótulos, dicas e mensagens novos ----
    S("Aniversário (opcional)", "Birthday (optional)", "Cumpleaños (opcional)")
    S("Só o dia e o mês, para o seu cupão de aniversário 🎁", "Only the day and month, for your birthday coupon 🎁", "Solo el día y el mes, para su cupón de cumpleaños 🎁")
    S("Dia", "Day", "Día")
    S("Mês", "Month", "Mes")
    for pt, en, es in [("janeiro", "January", "enero"), ("fevereiro", "February", "febrero"), ("março", "March", "marzo"), ("abril", "April", "abril"),
                       ("maio", "May", "mayo"), ("junho", "June", "junio"), ("julho", "July", "julio"), ("agosto", "August", "agosto"),
                       ("setembro", "September", "septiembre"), ("outubro", "October", "octubre"), ("novembro", "November", "noviembre"), ("dezembro", "December", "diciembre")]:
        S(pt, en, es)
    S("Alguma informação que devamos saber? (não escreva dados de saúde)", "Anything we should know? (please do not write health data)", "¿Alguna información que debamos saber? (no escriba datos de salud)")
    S("Escolha o dia e o mês do aniversário, ou deixe os dois em branco.", "Choose the day and month of your birthday, or leave both blank.", "Elija el día y el mes del cumpleaños, o deje ambos en blanco.")
    S("O dia e o mês de aniversário não são válidos.", "The birthday day and month are not valid.", "El día y el mes de cumpleaños no son válidos.")
    S("A palavra-passe deve ter pelo menos 6 caracteres.", "The password must have at least 6 characters.", "La contraseña debe tener al menos 6 caracteres.")
    S("As palavras-passe não coincidem — verifique a confirmação.", "The passwords do not match — please check the confirmation.", "Las contraseñas no coinciden — compruebe la confirmación.")
    S("Palavra-passe incorreta.", "Incorrect password.", "Contraseña incorrecta.")
    S("Email ou palavra-passe incorretos.", "Incorrect email or password.", "Correo electrónico o contraseña incorrectos.")
    S("Apagar a conta? Os selos, os prémios e as suas publicações e comentários serão apagados definitivamente.",
      "Delete the account? Stamps, rewards and your posts and comments will be permanently deleted.",
      "¿Borrar la cuenta? Los sellos, los premios y sus publicaciones y comentarios se borrarán definitivamente.")
    S("Apagar a sua conta? Os selos, os prémios e as suas publicações e comentários serão apagados definitivamente.",
      "Delete your account? Stamps, rewards and your posts and comments will be permanently deleted.",
      "¿Borrar su cuenta? Los sellos, los premios y sus publicaciones y comentarios se borrarán definitivamente.")
    S("Por segurança, só pode apagar a conta logo a seguir a iniciar sessão. Saia, volte a entrar e tente de novo.",
      "For security, you can only delete the account right after signing in. Sign out, sign in again and try again.",
      "Por seguridad, solo puede borrar la cuenta justo después de iniciar sesión. Salga, vuelva a entrar e inténtelo de nuevo.")

    # ---- textos de publicidade reescritos (pontos 16 e 17) ----
    S("Profissionais especializadas", "Specialised professionals", "Profesionales especializadas")
    S("Junte 10 selos e ganhe um Threading de Sobrancelhas grátis. E ainda 10% de desconto na semana do seu aniversário (se nos der o dia e o mês).",
      "Collect 10 stamps and win a free Eyebrow Threading. Plus 10% off in your birthday week (if you give us the day and month).",
      "Junte 10 sellos y gane un Threading de Cejas gratis. Y además 10 % de descuento en la semana de su cumpleaños (si nos da el día y el mes).")
    S("Ao criar a sua conta gratuita, junta selos a cada visita. Com 10 selos ganha um Threading de Sobrancelhas grátis. E, se nos indicar o dia e o mês do seu aniversário, recebe um cupão de 10% de desconto nessa semana. 🎂 Veja as regras nos",
      "When you create your free account, you collect stamps on every visit. With 10 stamps you win a free Eyebrow Threading. And, if you tell us the day and month of your birthday, you get a 10% discount coupon that week. 🎂 See the rules in the",
      "Al crear su cuenta gratuita, acumula sellos en cada visita. Con 10 sellos gana un Threading de Cejas gratis. Y, si nos indica el día y el mes de su cumpleaños, recibe un cupón de 10 % de descuento esa semana. 🎂 Vea las reglas en los")
    S("para libertarmos o horário para outra cliente. Veja", "so that we can free the slot for another client. See", "para que podamos liberar el horario para otra clienta. Vea")
    S("Protegemos os seus dados e tratamo-los ao abrigo do RGPD, só para o que é preciso (marcações e cartão de fidelidade). Não os vendemos. Usamos prestadores de serviços, como a Google (base de dados) e o GitHub (alojamento do site), para os guardar. Os detalhes, os prazos e os seus direitos estão na nossa",
      "We protect your data and process it under the GDPR, only for what is needed (appointments and loyalty card). We do not sell it. We use service providers, such as Google (database) and GitHub (site hosting), to store it. The details, retention periods and your rights are in our",
      "Protegemos sus datos y los tratamos conforme al RGPD, solo para lo necesario (citas y tarjeta de fidelidad). No los vendemos. Usamos proveedores de servicios, como Google (base de datos) y GitHub (alojamiento del sitio), para guardarlos. Los detalles, los plazos y sus derechos están en nuestra")
    S("Cartão de fidelidade digital: junte 10 selos e ganhe um Threading de Sobrancelhas GRÁTIS. E ainda: 10% na semana do seu aniversário. 🎂",
      "Digital loyalty card: collect 10 stamps and win a FREE Eyebrow Threading. Plus: 10% off in your birthday week. 🎂",
      "Tarjeta de fidelidad digital: junte 10 sellos y gane un Threading de Cejas GRATIS. Y además: 10 % de descuento en la semana de su cumpleaños. 🎂")
    S("Por trás da Inova Beauty está a <strong>Thayana</strong> — apaixonada por realçar a beleza natural de cada pessoa. Especializada em técnicas de embelezamento do olhar — threading, laminação de sobrancelhas e lifting de pestanas — procura sempre resultados precisos e naturais.",
      "Behind Inova Beauty is <strong>Thayana</strong> — passionate about enhancing each person's natural beauty. Specialised in eye-area beauty techniques — threading, brow lamination and lash lifting — she always aims for precise, natural results.",
      "Detrás de Inova Beauty está <strong>Thayana</strong> — apasionada por realzar la belleza natural de cada persona. Especializada en técnicas de embellecimiento de la mirada — threading, laminación de cejas y lifting de pestañas — busca siempre resultados precisos y naturales.")
    S("Cada cliente é única. Por isso, todos os nossos serviços começam com uma avaliação personalizada do seu rosto, tom de pele e estilo — para chegarmos ao resultado certo para si.",
      "Every client is unique. That is why all our services start with a personal assessment of your face, skin tone and style — so that we reach the right result for you.",
      "Cada clienta es única. Por eso, todos nuestros servicios empiezan con una evaluación personalizada de su rostro, tono de piel y estilo — para llegar al resultado adecuado para usted.")
    S("Atalhos: app e WhatsApp", "Shortcuts: app and WhatsApp", "Atajos: app y WhatsApp")
    S("Informação legal", "Legal information", "Información legal")

    # ---- serviços indisponíveis (aviso nas páginas escondidas) ----
    S("Este serviço está de momento indisponível.", "This service is currently unavailable.", "Este servicio no está disponible de momento.")
    S("para saber quando volta.", "to find out when it is back.", "para saber cuándo vuelve.")
