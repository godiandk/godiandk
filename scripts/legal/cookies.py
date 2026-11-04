from build import T, A, Page, PH
from common import *

def code(n): return ("RAW", f"<code>{n}</code>")

def build():
    pg = Page("cookies",
        "Política de Cookies",
        "A lista real do que o site da Inova Beauty guarda no seu dispositivo (cookies, armazenamento local, IndexedDB e cache), para que serve, quanto tempo dura e como o apagar.",
        T("Política de Cookies", "Cookie Policy", "Política de Cookies"),
        T("A lista real do que este site guarda no seu dispositivo, para que serve e quanto tempo dura.",
          "The real list of what this website stores on your device, what it is for and how long it lasts.",
          "La lista real de lo que este sitio web guarda en su dispositivo, para qué sirve y cuánto dura."),
        T("Política de Cookies", "Cookie Policy", "Política de Cookies"),
        T(f"Última atualização: {ATUALIZADO} (versão {VERSAO}). Verificação técnica feita nessa data, abrindo todas as páginas do site num navegador limpo.",
          "Last updated: 4 November 2026 (version 2.0). Technical check done on that date, opening every page of the site in a clean browser.",
          "Última actualización: 4 de noviembre de 2026 (versión 2.0). Comprobación técnica hecha en esa fecha, abriendo todas las páginas del sitio en un navegador limpio."))

    pg.p(T("Esta página está escrita em português. Em caso de dúvida ou divergência com a tradução, prevalece a versão portuguesa.",
           "This page is written in Portuguese. In case of doubt or difference with the translation, the Portuguese version prevails.",
           "Esta página está escrita en portugués. En caso de duda o divergencia con la traducción, prevalece la versión portuguesa."), "legal-meta")
    pg.note(T("<strong>Em resumo:</strong> este site não grava nenhum cookie e não usa cookies de medição, de publicidade nem de redes sociais. Guarda no seu dispositivo apenas pequenos itens necessários ao funcionamento (por exemplo, o idioma que escolheu e a cópia da agenda), todos listados abaixo. Por isso não mostramos um aviso de cookies. O mapa da Google só é carregado se o pedir.",
              "<strong>In short:</strong> this site does not set any cookie and does not use measurement, advertising or social-media cookies. It only stores on your device small items needed for it to work (for example, the language you chose and the copy of the diary), all listed below. That is why we do not show a cookie banner. The Google map is only loaded if you ask for it.",
              "<strong>En resumen:</strong> este sitio no graba ninguna cookie y no usa cookies de medición, de publicidad ni de redes sociales. Solo guarda en su dispositivo pequeños elementos necesarios para su funcionamiento (por ejemplo, el idioma que eligió y la copia de la agenda), todos listados abajo. Por eso no mostramos un aviso de cookies. El mapa de Google solo se carga si lo pide."))

    # 1 ---------------------------------------------------------------
    pg.h2("s1", T("1. O que são cookies e tecnologias semelhantes", "1. What cookies and similar technologies are", "1. Qué son las cookies y las tecnologías similares"))
    pg.p([T("Os cookies são pequenos ficheiros de texto que um site grava no seu dispositivo. Existem outras formas de guardar informação no navegador (armazenamento local, IndexedDB, cache), com o mesmo efeito. Tratamos todas da mesma maneira. A lei (artigo 5.º da Lei n.º 41/2004, que transpõe a Diretiva ePrivacy) exige o seu consentimento prévio para guardar ou aceder a informação no seu dispositivo, exceto quando for estritamente necessário para prestar um serviço que pediu expressamente. O tratamento de dados pessoais que daí resulte segue o RGPD: veja a ",
            "Cookies are small text files that a website saves on your device. There are other ways of storing information in the browser (local storage, IndexedDB, cache) with the same effect. We treat them all the same way. The law (Article 5 of Law 41/2004, which implements the ePrivacy Directive) requires your prior consent to store or access information on your device, except where strictly necessary to provide a service you expressly asked for. Any personal data processing that results follows the GDPR: see our ",
            "Las cookies son pequeños archivos de texto que un sitio web graba en su dispositivo. Existen otras formas de guardar información en el navegador (almacenamiento local, IndexedDB, caché), con el mismo efecto. Las tratamos todas igual. La ley (artículo 5 de la Ley 41/2004, que transpone la Directiva ePrivacy) exige su consentimiento previo para guardar o acceder a información en su dispositivo, salvo cuando sea estrictamente necesario para prestar un servicio que usted pidió expresamente. El tratamiento de datos personales que de ello resulte sigue el RGPD: vea nuestra "),
          A("../privacidade/", T("Política de Privacidade", "Privacy Policy", "Política de Privacidad")),
          T(".", ".", ".")])

    # 2 ---------------------------------------------------------------
    pg.h2("s2", T("2. O que este site guarda no seu dispositivo", "2. What this site stores on your device", "2. Qué guarda este sitio en su dispositivo"))
    pg.h3(T("2.1 Cookies", "2.1 Cookies", "2.1 Cookies"))
    pg.p(T("Este site não grava nenhum cookie. Confirmámos, em 4 de novembro de 2026, que nenhuma das páginas do site grava cookies quando se abre pela primeira vez.",
           "This site does not set any cookie. We checked on 4 November 2026 that none of the pages of the site sets cookies when opened for the first time.",
           "Este sitio no graba ninguna cookie. Comprobamos, el 4 de noviembre de 2026, que ninguna de las páginas del sitio graba cookies al abrirse por primera vez."))

    H = [T("Nome", "Name", "Nombre"), T("Para que serve", "What it is for", "Para qué sirve"),
         T("Quando é criado", "When it is created", "Cuándo se crea"), T("Quanto tempo dura", "How long it lasts", "Cuánto dura"),
         T("Precisa de consentimento?", "Needs consent?", "¿Necesita consentimiento?")]
    NAO_PREC_PEDIU = T("Não: guarda uma escolha que fez.", "No: it stores a choice you made.", "No: guarda una elección que usted hizo.")
    NAO_PREC_SERV = T("Não: é necessário para o serviço que pediu.", "No: it is needed for the service you asked for.", "No: es necesario para el servicio que pidió.")
    ATE_APAGAR = T("Até o apagar (não expira sozinho).", "Until you delete it (it does not expire by itself).", "Hasta que lo borre (no caduca solo).")

    pg.h3(T("2.2 Armazenamento local (localStorage) e sessionStorage", "2.2 Local storage (localStorage) and sessionStorage", "2.2 Almacenamiento local (localStorage) y sessionStorage"))
    pg.p(T("O site não usa sessionStorage. Usa o localStorage, só do próprio site (nenhum item é de terceiros), para os seguintes itens. Nenhum contém dados de saúde.",
           "The site does not use sessionStorage. It uses localStorage, only from the site itself (no item belongs to third parties), for the following items. None contains health data.",
           "El sitio no usa sessionStorage. Usa localStorage, solo del propio sitio (ningún elemento es de terceros), para los siguientes elementos. Ninguno contiene datos de salud."))
    pg.table(T("Itens guardados em localStorage", "Items stored in localStorage", "Elementos guardados en localStorage"), H, [
        [code("inova-idioma"),
         T("Lembra o idioma (português, inglês ou espanhol) que escolheu no seletor de idiomas.", "Remembers the language (Portuguese, English or Spanish) you chose in the language selector.", "Recuerda el idioma (portugués, inglés o español) que eligió en el selector de idiomas."),
         T("Só quando escolhe um idioma no seletor. Se não escolher, não se guarda nada.", "Only when you choose a language in the selector. If you do not choose, nothing is stored.", "Solo cuando elige un idioma en el selector. Si no elige, no se guarda nada."),
         ATE_APAGAR, NAO_PREC_PEDIU],
        [code("inova_agenda_cache"),
         T("Guarda uma cópia da agenda (dias, horas e serviços disponíveis; informação pública do site, sem dados pessoais) para a marcação abrir depressa e mostrar a última versão conhecida se a ligação falhar.", "Stores a copy of the diary (days, hours and services available; public information from the site, no personal data) so that booking opens quickly and shows the last known version if the connection fails.", "Guarda una copia de la agenda (días, horas y servicios disponibles; información pública del sitio, sin datos personales) para que la reserva abra rápido y muestre la última versión conocida si falla la conexión."),
         T("Ao abrir a marcação online, no site ou na app.", "When you open online booking, on the site or in the app.", "Al abrir la reserva en línea, en el sitio o en la app."),
         T("Substituída em cada visita à marcação; fica até a apagar.", "Replaced on each visit to booking; stays until you delete it.", "Se sustituye en cada visita a la reserva; permanece hasta que la borre."),
         NAO_PREC_SERV],
        [code("inova_generated_coupons"),
         T("Lista, neste dispositivo, dos códigos de cupão ou de selo que foram gerados (código, tipo, percentagem e validade). Não tem dados pessoais.", "List, on this device, of the coupon or stamp codes that were generated (code, type, percentage and expiry). It holds no personal data.", "Lista, en este dispositivo, de los códigos de cupón o de sello que se generaron (código, tipo, porcentaje y validez). No contiene datos personales."),
         T("Só quando um código é gerado (na prática, no painel do estúdio).", "Only when a code is generated (in practice, in the studio panel).", "Solo cuando se genera un código (en la práctica, en el panel del estudio)."),
         T("Até o apagar. Guarda no máximo os últimos 300.", "Until you delete it. It keeps at most the last 300.", "Hasta que lo borre. Guarda como máximo los últimos 300."),
         NAO_PREC_SERV],
        [code("inova_used_coupons"),
         T("Regista, neste dispositivo, os códigos de cupão ou de selo já usados (código e data), para não serem aceites duas vezes. Não tem dados pessoais.", "Records, on this device, the coupon or stamp codes already used (code and date), so that they are not accepted twice. It holds no personal data.", "Registra, en este dispositivo, los códigos de cupón o de sello ya usados (código y fecha), para que no se acepten dos veces. No contiene datos personales."),
         T("Só quando junta um selo à sua conta ou quando o estúdio valida um cupão.", "Only when you add a stamp to your account or when the studio validates a coupon.", "Solo cuando suma un sello a su cuenta o cuando el estudio valida un cupón."),
         ATE_APAGAR, NAO_PREC_SERV],
        [("RAW", "<code>inova_accounts_v2</code>, <code>inova_session</code>, <code>inova_marcacoes</code>, <code>inova_posts_local</code>, <code>inova_admins_local</code>, <code>inova_agenda_cfg</code>"),
         T("«Modo local»: só se o serviço online (Firebase) não estiver disponível, o site guarda neste dispositivo a conta (a palavra-passe só em forma de «hash»), a sessão, as marcações e as publicações. Nestes casos os dados não saem do dispositivo.", "“Local mode”: only if the online service (Firebase) is not available, the site stores on this device the account (the password only as a hash), the session, the appointments and the posts. In these cases the data does not leave the device.", "«Modo local»: solo si el servicio en línea (Firebase) no está disponible, el sitio guarda en este dispositivo la cuenta (la contraseña solo en forma de «hash»), la sesión, las citas y las publicaciones. En estos casos los datos no salen del dispositivo."),
         T("Só se criar conta, iniciar sessão, marcar ou publicar enquanto o serviço online não está disponível.", "Only if you create an account, sign in, book or post while the online service is unavailable.", "Solo si crea una cuenta, inicia sesión, reserva o publica mientras el servicio en línea no está disponible."),
         ATE_APAGAR, NAO_PREC_SERV],
    ])

    pg.h3(T("2.3 IndexedDB e cache", "2.3 IndexedDB and cache", "2.3 IndexedDB y caché"))
    pg.table(T("Outros itens guardados no navegador", "Other items stored in the browser", "Otros elementos guardados en el navegador"), H, [
        [code("firebaseLocalStorageDb"),
         T("Base de dados (IndexedDB) criada pela biblioteca Firebase Authentication, da Google, que o site usa para as contas. Mantém a sessão iniciada. Está vazia se não iniciar sessão.", "Database (IndexedDB) created by the Firebase Authentication library, from Google, which the site uses for accounts. It keeps you signed in. It is empty if you do not sign in.", "Base de datos (IndexedDB) creada por la biblioteca Firebase Authentication, de Google, que el sitio usa para las cuentas. Mantiene la sesión iniciada. Está vacía si no inicia sesión."),
         T("Quando uma página do site que usa contas é aberta (a base de dados é criada vazia, mesmo sem iniciar sessão).", "When a page of the site that uses accounts is opened (the database is created empty, even if you do not sign in).", "Cuando se abre una página del sitio que usa cuentas (la base de datos se crea vacía, incluso sin iniciar sesión)."),
         T("Até terminar a sessão ou apagar os dados do site.", "Until you sign out or delete the site data.", "Hasta cerrar la sesión o borrar los datos del sitio."),
         NAO_PREC_SERV],
        [code("inova-beauty-v1"),
         T("Cache do «service worker» da app: guarda cópias das páginas do próprio site para a app abrir sem rede. Não tem dados pessoais.", "Cache of the app's “service worker”: it keeps copies of the site's own pages so that the app opens without a network. It holds no personal data.", "Caché del «service worker» de la app: guarda copias de las páginas del propio sitio para que la app abra sin red. No contiene datos personales."),
         T("Quando abre a app (páginas /app/). Quem visitou o site antes de 4 de novembro de 2026 pode tê-lo noutras páginas.", "When you open the app (/app/ pages). Anyone who visited the site before 4 November 2026 may have it from other pages.", "Cuando abre la app (páginas /app/). Quien visitó el sitio antes del 4 de noviembre de 2026 puede tenerlo desde otras páginas."),
         T("Até o apagar ou desinstalar a app.", "Until you delete it or uninstall the app.", "Hasta que lo borre o desinstale la app."),
         NAO_PREC_SERV],
    ])

    # 3 ---------------------------------------------------------------
    pg.h2("s3", T("3. Ligações a serviços de terceiros", "3. Connections to third-party services", "3. Conexiones a servicios de terceros"))
    pg.p(T("Estas ligações não são cookies, mas fazem o seu navegador contactar outros servidores, que recebem o seu endereço IP. Por isso as indicamos aqui.",
           "These connections are not cookies, but they make your browser contact other servers, which receive your IP address. That is why we list them here.",
           "Estas conexiones no son cookies, pero hacen que su navegador contacte con otros servidores, que reciben su dirección IP. Por eso las indicamos aquí."))
    pg.table(T("Serviços de terceiros", "Third-party services", "Servicios de terceros"),
        [T("Serviço", "Service", "Servicio"), T("Quando acontece", "When it happens", "Cuándo ocurre"), T("O que acontece", "What happens", "Qué ocurre")], [
        [T("Firebase (Google): Firestore e Authentication", "Firebase (Google): Firestore and Authentication", "Firebase (Google): Firestore y Authentication"),
         T("Ao abrir a marcação online (site ou app) e as páginas da conta e da app. Nas outras páginas não há ligação ao abrir.", "When you open online booking (site or app) and the account and app pages. On the other pages there is no connection on opening.", "Al abrir la reserva en línea (sitio o app) y las páginas de la cuenta y de la app. En las demás páginas no hay conexión al abrir."),
         T("O seu navegador liga-se a servidores da Google para ler a agenda e, se tiver conta, para iniciar sessão e guardar os dados. Não grava cookies.", "Your browser connects to Google servers to read the diary and, if you have an account, to sign in and store the data. It does not set cookies.", "Su navegador se conecta a servidores de Google para leer la agenda y, si tiene cuenta, para iniciar sesión y guardar los datos. No graba cookies.")],
        [T("Google Maps", "Google Maps", "Google Maps"),
         T("Só se carregar em «Mostrar o mapa» na página Localização.", "Only if you press “Show the map” on the Location page.", "Solo si pulsa «Mostrar el mapa» en la página Localización."),
         T("A Google recebe o seu endereço IP e pode guardar cookies, segundo as suas próprias regras (que não controlamos). Sem este clique, nada é carregado.", "Google receives your IP address and may store cookies, under its own rules (which we do not control). Without this click, nothing is loaded.", "Google recibe su dirección IP y puede guardar cookies, según sus propias reglas (que no controlamos). Sin este clic, no se carga nada.")],
        [T("WhatsApp (Meta)", "WhatsApp (Meta)", "WhatsApp (Meta)"),
         T("Só se carregar numa ligação ou botão de WhatsApp.", "Only if you click a WhatsApp link or button.", "Solo si pulsa un enlace o botón de WhatsApp."),
         T("Abre-se o WhatsApp (aplicação ou site), que passa a tratar os dados segundo a sua própria política.", "WhatsApp (app or website) opens and then handles the data under its own policy.", "Se abre WhatsApp (aplicación o sitio), que pasa a tratar los datos según su propia política.")],
        [T("GitHub Pages (alojamento)", "GitHub Pages (hosting)", "GitHub Pages (alojamiento)"),
         T("Sempre que abre uma página do site.", "Whenever you open a page of the site.", "Siempre que abre una página del sitio."),
         T("O GitHub entrega-lhe as páginas e, para isso, recebe o seu endereço IP e dados técnicos do navegador. Este site não define cookies no GitHub Pages, mas não controlamos os registos técnicos do alojamento.", "GitHub delivers the pages to you and, to do so, receives your IP address and technical browser data. This site does not set cookies on GitHub Pages, but we do not control the hosting's technical logs.", "GitHub le entrega las páginas y, para ello, recibe su dirección IP y datos técnicos del navegador. Este sitio no define cookies en GitHub Pages, pero no controlamos los registros técnicos del alojamiento.")],
    ])
    pg.p(T("Os tipos de letra do site estão alojados no próprio site (não usamos o Google Fonts), pelo que abrir as páginas não envia o seu endereço IP à Google por esse motivo. O site também não incorpora vídeos, botões de redes sociais nem anúncios.",
           "The site's fonts are hosted on the site itself (we do not use Google Fonts), so opening the pages does not send your IP address to Google for that reason. The site also does not embed videos, social-media buttons or ads.",
           "Las fuentes del sitio están alojadas en el propio sitio (no usamos Google Fonts), por lo que abrir las páginas no envía su dirección IP a Google por ese motivo. El sitio tampoco incorpora vídeos, botones de redes sociales ni anuncios."))

    # 4 ---------------------------------------------------------------
    pg.h2("s4", T("4. Medição de audiência e publicidade", "4. Audience measurement and advertising", "4. Medición de audiencia y publicidad"))
    pg.p(T("Hoje não usamos Google Analytics, Meta Pixel nem nenhuma outra ferramenta de medição ou de publicidade. O código para as ligar no futuro existe no site, mas está desligado e não carrega nada.",
           "Today we do not use Google Analytics, Meta Pixel or any other measurement or advertising tool. The code to switch them on in the future exists on the site, but it is switched off and loads nothing.",
           "Hoy no usamos Google Analytics, Meta Pixel ni ninguna otra herramienta de medición o de publicidad. El código para activarlas en el futuro existe en el sitio, pero está desactivado y no carga nada."))
    pg.p(T("Se um dia as ligarmos, só o faremos depois de a pessoa aceitar num aviso com os botões «Aceitar» e «Recusar» com o mesmo destaque. Antes disso, nenhuma ferramenta é carregada. A escolha fica guardada neste navegador (no item inova-consent) e pode ser mudada a qualquer momento em «Preferências de cookies», no fim das páginas. Atualizaremos esta política antes de o fazer.",
           "If we ever switch them on, we will only do so after the person accepts in a notice with “Accept” and “Refuse” buttons of equal prominence. Before that, no tool is loaded. The choice is stored in this browser (in the inova-consent item) and can be changed at any time in “Cookie preferences”, at the bottom of the pages. We will update this policy before doing so.",
           "Si algún día las activamos, solo lo haremos después de que la persona acepte en un aviso con botones «Aceptar» y «Rechazar» con la misma prominencia. Antes de eso no se carga ninguna herramienta. La elección se guarda en este navegador (en el elemento inova-consent) y se puede cambiar en cualquier momento en «Preferencias de cookies», al final de las páginas. Actualizaremos esta política antes de hacerlo."))

    # 5 ---------------------------------------------------------------
    pg.h2("s5", T("5. Como apagar ou bloquear", "5. How to delete or block", "5. Cómo borrar o bloquear"))
    pg.ul([
        T("Nas definições do navegador (Privacidade ou Segurança → Dados de sites), procure este site e apague os dados. Isto remove todos os itens listados acima.", "In your browser settings (Privacy or Security → Site data), find this site and delete its data. This removes all the items listed above.", "En los ajustes del navegador (Privacidad o Seguridad → Datos de sitios), busque este sitio y borre sus datos. Esto elimina todos los elementos listados arriba."),
        T("Se os apagar, o site continua a funcionar. Perde apenas as preferências (o idioma volta ao do seu navegador) e, se tinha sessão iniciada, terá de a iniciar de novo.", "If you delete them, the site keeps working. You only lose the preferences (the language goes back to your browser's) and, if you were signed in, you will have to sign in again.", "Si los borra, el sitio sigue funcionando. Solo pierde las preferencias (el idioma vuelve al de su navegador) y, si tenía la sesión iniciada, tendrá que iniciarla de nuevo."),
        T("Pode configurar o navegador para bloquear cookies e dados de sites. A conta e a marcação online podem deixar de funcionar.", "You can set the browser to block cookies and site data. Accounts and online booking may stop working.", "Puede configurar el navegador para bloquear cookies y datos de sitios. La cuenta y la reserva en línea pueden dejar de funcionar."),
        T("Para apagar também a cache da app, desinstale-a ou apague os dados do site.", "To also delete the app's cache, uninstall it or delete the site data.", "Para borrar también la caché de la app, desinstálela o borre los datos del sitio."),
    ])

    # 6 ---------------------------------------------------------------
    pg.h2("s6", T("6. Dúvidas e reclamações", "6. Questions and complaints", "6. Dudas y reclamaciones"))
    pg.p([T("Para dúvidas, use os contactos da ", "For questions, use the contacts in the ", "Para dudas, use los contactos de la "),
          A("../privacidade/#s1", T("Política de Privacidade", "Privacy Policy", "Política de Privacidad")),
          T(". Tem o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), em www.cnpd.pt. Esta política pode ser atualizada: a data e a versão no topo indicam a última revisão.",
            ". You have the right to lodge a complaint with the Portuguese data protection authority, the Comissão Nacional de Proteção de Dados (CNPD), at www.cnpd.pt. This policy may be updated: the date and version at the top show the last revision.",
            ". Tiene derecho a presentar una reclamación ante la autoridad portuguesa de protección de datos, la Comissão Nacional de Proteção de Dados (CNPD), en www.cnpd.pt. Esta política puede actualizarse: la fecha y la versión en la parte superior indican la última revisión.")])
    return pg
