from build import T, A, Page, PH
from common import *

def build():
    pg = Page("privacidade",
        "Política de Privacidade",
        "Como a Inova Beauty trata os seus dados pessoais (RGPD e Lei n.º 58/2019): que dados recolhemos, porquê, por quanto tempo, com quem os partilhamos e os seus direitos.",
        T("Política de Privacidade", "Privacy Policy", "Política de Privacidad"),
        T("Explicamos, em linguagem simples, que dados pessoais recolhemos, porquê, durante quanto tempo os guardamos e quais são os seus direitos.",
          "In plain language: what personal data we collect, why, how long we keep it and what your rights are.",
          "En lenguaje sencillo: qué datos personales recogemos, por qué, cuánto tiempo los conservamos y cuáles son sus derechos."),
        T("Política de Privacidade", "Privacy Policy", "Política de Privacidad"),
        T(f"Última atualização: {ATUALIZADO} (versão {VERSAO}). Aplica-se o Regulamento (UE) 2016/679 (RGPD) e a Lei n.º 58/2019.",
          "Last updated: 4 November 2026 (version 2.0). Regulation (EU) 2016/679 (GDPR) and Portuguese Law 58/2019 apply.",
          "Última actualización: 4 de noviembre de 2026 (versión 2.0). Se aplican el Reglamento (UE) 2016/679 (RGPD) y la Ley portuguesa 58/2019."))

    pg.p(T("Esta página está escrita em português. Em caso de dúvida ou divergência com a tradução, prevalece a versão portuguesa.",
           "This page is written in Portuguese. In case of doubt or difference with the translation, the Portuguese version prevails.",
           "Esta página está escrita en portugués. En caso de duda o divergencia con la traducción, prevalece la versión portuguesa."), "legal-meta")

    pg.note(T("<strong>Em resumo:</strong> pedimos só o que é preciso para tratar da sua marcação e do seu cartão de fidelidade; não vendemos os seus dados; o site não usa cookies de medição nem de publicidade (se um dia usar, só depois de aceitar); pode ver, corrigir ou apagar os seus dados e retirar consentimentos quando quiser; e pode reclamar à CNPD.",
              "<strong>In short:</strong> we only ask for what is needed to handle your appointment and loyalty card; we do not sell your data; the site uses no measurement or advertising cookies (if it ever does, only after you accept); you can see, correct or delete your data and withdraw consent whenever you want; and you can complain to the CNPD.",
              "<strong>En resumen:</strong> solo pedimos lo necesario para gestionar su cita y su tarjeta de fidelidad; no vendemos sus datos; el sitio no usa cookies de medición ni de publicidad (si algún día las usa, solo tras su aceptación); puede ver, corregir o borrar sus datos y retirar consentimientos cuando quiera; y puede reclamar ante la CNPD."))

    # 1 ---------------------------------------------------------------
    pg.h2("s1", T("1. Quem é o responsável pelo tratamento", "1. Who is responsible for the processing", "1. Quién es el responsable del tratamiento"))
    pg.p(T("O responsável pelo tratamento dos seus dados é a pessoa identificada na tabela abaixo, que presta os serviços sob o nome comercial «Inova Beauty».",
           "The controller of your data is the person identified in the table below, who provides the services under the trade name “Inova Beauty”.",
           "El responsable del tratamiento de sus datos es la persona identificada en la tabla siguiente, que presta los servicios con el nombre comercial «Inova Beauty»."))
    pg.idtable(ident_rows(L_RESPONSAVEL, extra=[
        (T("Localização da base de dados (Firebase)", "Location of the database (Firebase)", "Ubicación de la base de datos (Firebase)"), ("RAW", PH("regiao_firestore"))),
    ]), CAP_IDENT)
    pg.p(T("Para qualquer questão sobre privacidade ou para exercer os seus direitos, use os contactos acima. Não designámos um encarregado de proteção de dados, porque o art. 37.º do RGPD não o exige para esta atividade.",
           "For any privacy question or to exercise your rights, use the contacts above. We have not appointed a data protection officer, because Art. 37 GDPR does not require one for this activity.",
           "Para cualquier cuestión sobre privacidad o para ejercer sus derechos, utilice los contactos anteriores. No hemos designado un delegado de protección de datos porque el art. 37 del RGPD no lo exige para esta actividad."))

    # 2 ---------------------------------------------------------------
    pg.h2("s2", T("2. Que dados recolhemos, para quê e com que fundamento", "2. What data we collect, for what purpose and on what legal basis", "2. Qué datos recogemos, para qué y con qué fundamento"))
    pg.p(T("As tabelas seguintes mostram, campo a campo, o que recolhemos em cada situação. «Fundamento» é a razão legal que nos permite tratar o dado (arts. 6.º e 9.º do RGPD).",
           "The tables below show, field by field, what we collect in each situation. “Legal basis” is the legal reason that allows us to process the data (Arts. 6 and 9 GDPR).",
           "Las tablas siguientes muestran, campo por campo, lo que recogemos en cada situación. «Fundamento» es la razón legal que nos permite tratar el dato (arts. 6 y 9 del RGPD)."))

    H4 = [T("Dado", "Data", "Dato"), T("Obrigatório?", "Required?", "¿Obligatorio?"), T("Para que serve", "What it is for", "Para qué sirve"), T("Fundamento", "Legal basis", "Fundamento")]

    pg.h3(T("2.1 Marcação online (no site ou na app)", "2.1 Online appointment (website or app)", "2.1 Cita en línea (sitio web o app)"))
    pg.table(T("Dados da marcação", "Appointment data", "Datos de la cita"), H4, [
        [T("Nome", "Name", "Nombre"), SIM, T("Identificar e tratar a marcação.", "Identify and handle the appointment.", "Identificar y gestionar la cita."), LB_B],
        [T("Telemóvel", "Mobile number", "Móvil"), SIM, T("Contactá-lo sobre a marcação (confirmação, alterações, cancelamento).", "Contact you about the appointment (confirmation, changes, cancellation).", "Contactarle sobre la cita (confirmación, cambios, cancelación)."), LB_B],
        [T("Serviço, dia e hora", "Service, day and time", "Servicio, día y hora"), SIM, T("Reservar o horário.", "Reserve the time slot.", "Reservar el horario."), LB_B],
        [T("Código de cupão ou de prémio", "Coupon or reward code", "Código de cupón o de premio"), NAO, T("Aplicar o desconto ou o prémio.", "Apply the discount or reward.", "Aplicar el descuento o el premio."), LB_B],
        [T("Observações", "Notes", "Observaciones"), NAO, T("Informação que queira dar sobre a marcação. Não escreva aqui dados de saúde: falamos disso presencialmente.", "Information you wish to give about the appointment. Please do not write health data here: we discuss it in person.", "Información que desee dar sobre la cita. No escriba aquí datos de salud: lo hablamos en persona."), LB_A],
        [T("Identificador da conta", "Account identifier", "Identificador de la cuenta"), T("Só se tiver sessão iniciada", "Only if you are signed in", "Solo si ha iniciado sesión"), T("Associar a marcação à sua conta e ao cartão de fidelidade.", "Link the appointment to your account and loyalty card.", "Asociar la cita a su cuenta y a la tarjeta de fidelidad."), LB_B],
        [T("Data e hora do registo; estado da marcação", "Date and time of the booking; appointment status", "Fecha y hora del registro; estado de la cita"), AUTO, T("Gerir a agenda e impedir duas marcações no mesmo horário.", "Manage the diary and prevent two appointments at the same time.", "Gestionar la agenda e impedir dos citas en el mismo horario."), LB_BF],
    ])

    pg.h3(T("2.2 Conta de cliente (opcional)", "2.2 Customer account (optional)", "2.2 Cuenta de cliente (opcional)"))
    pg.table(T("Dados da conta", "Account data", "Datos de la cuenta"), H4, [
        [T("Nome", "Name", "Nombre"), SIM, T("Identificar a conta.", "Identify the account.", "Identificar la cuenta."), LB_B],
        [T("Telemóvel", "Mobile number", "Móvil"), SIM, T("Contacto; uma conta por número.", "Contact; one account per number.", "Contacto; una cuenta por número."), LB_B],
        [T("Email", "Email", "Correo electrónico"), SIM, T("Iniciar sessão e recuperar a palavra-passe.", "Sign in and recover the password.", "Iniciar sesión y recuperar la contraseña."), LB_B],
        [T("Palavra-passe", "Password", "Contraseña"), SIM, T("Proteger a conta. É guardada e protegida pelo serviço Firebase Authentication (Google); nós não a vemos.", "Protect the account. It is stored and protected by the Firebase Authentication service (Google); we cannot see it.", "Proteger la cuenta. La guarda y protege el servicio Firebase Authentication (Google); nosotros no la vemos."), LB_B],
        [T("Dia e mês de aniversário", "Birthday (day and month)", "Día y mes de cumpleaños"), NAO, T("Dar-lhe o cupão de aniversário. Guardamos só o dia e o mês, nunca o ano.", "Give you the birthday coupon. We keep only the day and month, never the year.", "Darle el cupón de cumpleaños. Guardamos solo el día y el mes, nunca el año."), LB_A],
        [T("Foto de perfil ou personagem", "Profile photo or character", "Foto de perfil o personaje"), NAO, T("Mostrar o seu avatar na conta e, se participar, na comunidade.", "Show your avatar on the account and, if you take part, in the community.", "Mostrar su avatar en la cuenta y, si participa, en la comunidad."), LB_A],
        [T("Selos, prémios e respetivas datas", "Stamps, rewards and their dates", "Sellos, premios y sus fechas"), AUTO, T("Gerir o cartão de fidelidade.", "Manage the loyalty card.", "Gestionar la tarjeta de fidelidad."), LB_B],
        [T("Data de criação e de último acesso", "Creation date and last sign-in", "Fecha de creación y de último acceso"), AUTO, T("Segurança da conta e prevenção de abusos.", "Account security and abuse prevention.", "Seguridad de la cuenta y prevención de abusos."), LB_F],
    ])

    pg.h3(T("2.3 Comunidade (app, opcional)", "2.3 Community (app, optional)", "2.3 Comunidad (app, opcional)"))
    pg.table(T("Dados da comunidade", "Community data", "Datos de la comunidad"), H4, [
        [T("Fotografias, descrições, serviço associado, comentários e «gostos»", "Photos, descriptions, associated service, comments and “likes”", "Fotografías, descripciones, servicio asociado, comentarios y «me gusta»"), NAO, T("Participar no mural da comunidade.", "Take part in the community wall.", "Participar en el muro de la comunidad."), LB_A],
        [T("Nome e avatar", "Name and avatar", "Nombre y avatar"), AUTO, T("Mostrar quem publicou.", "Show who posted.", "Mostrar quién ha publicado."), LB_A],
    ])
    pg.p(T("As publicações ficam visíveis para as outras clientes com sessão iniciada na app, não para o público em geral. Não publique fotografias de outras pessoas sem a autorização delas. Pode apagar as suas publicações quando quiser; se apagar a conta, apagamos também as suas publicações e comentários.",
           "Posts are visible to other customers signed in to the app, not to the general public. Do not post photos of other people without their permission. You can delete your posts whenever you want; if you delete your account, we also delete your posts and comments.",
           "Las publicaciones son visibles para otras clientas con sesión iniciada en la app, no para el público en general. No publique fotografías de otras personas sin su permiso. Puede borrar sus publicaciones cuando quiera; si borra la cuenta, borramos también sus publicaciones y comentarios."))

    pg.h3(T("2.4 No atendimento presencial", "2.4 In person at the appointment", "2.4 En la atención presencial"))
    pg.table(T("Dados recolhidos presencialmente", "Data collected in person", "Datos recogidos en persona"), H4, [
        [T("Ficha de anamnese (dados de saúde, como alergias, medicação ou doenças) e termo de responsabilidade, em papel", "Anamnesis form (health data, such as allergies, medication or conditions) and consent form, on paper", "Ficha de anamnesis (datos de salud, como alergias, medicación o enfermedades) y documento de responsabilidad, en papel"),
         T("Só para os procedimentos que o exijam (por exemplo, pigmentação labial)", "Only for procedures that require it (for example, lip pigmentation)", "Solo para los procedimientos que lo exijan (por ejemplo, pigmentación labial)"),
         T("Avaliar se o procedimento é seguro para si e registar o seu consentimento informado.", "Assess whether the procedure is safe for you and record your informed consent.", "Evaluar si el procedimiento es seguro para usted y registrar su consentimiento informado."), LB_9],
        [T("Nome, NIF e valor do serviço (se pedir fatura)", "Name, tax ID and service price (if you ask for an invoice)", "Nombre, NIF e importe del servicio (si solicita factura)"), NAO, T("Emitir a fatura e cumprir as obrigações fiscais.", "Issue the invoice and meet tax obligations.", "Emitir la factura y cumplir las obligaciones fiscales."), LB_C],
    ])
    pg.p(T("Não tiramos nem divulgamos fotografias suas sem autorização expressa, por escrito, e a divulgação (por exemplo, nas redes sociais) exige uma autorização separada, que pode retirar quando quiser.",
           "We do not take or publish photos of you without your express written permission, and publication (for example, on social media) requires a separate permission, which you can withdraw whenever you wish.",
           "No tomamos ni difundimos fotografías suyas sin autorización expresa por escrito, y la difusión (por ejemplo, en redes sociales) exige una autorización aparte, que puede retirar cuando quiera."))

    pg.h3(T("2.5 Contactos por WhatsApp, telefone ou email", "2.5 Contact by WhatsApp, phone or email", "2.5 Contactos por WhatsApp, teléfono o correo electrónico"))
    pg.p(T("Se falar connosco por estes meios, tratamos o número, o nome e a mensagem que nos enviar para lhe responder (art. 6.º, n.º 1, al. b) ou f) do RGPD). No WhatsApp, a conversa é também tratada pela WhatsApp/Meta, segundo a política dessa empresa.",
           "If you contact us by these means, we process the number, name and message you send us in order to reply (Art. 6(1)(b) or (f) GDPR). On WhatsApp, the conversation is also processed by WhatsApp/Meta under that company's policy.",
           "Si nos contacta por estos medios, tratamos el número, el nombre y el mensaje que nos envíe para responderle (art. 6.1.b) o f) del RGPD). En WhatsApp, la conversación la trata también WhatsApp/Meta según la política de esa empresa."))

    pg.h3(T("2.6 Dados técnicos", "2.6 Technical data", "2.6 Datos técnicos"))
    pg.p(T("Quando abre uma página, o seu navegador envia o endereço IP e dados técnicos (navegador, data e hora) aos servidores que entregam o site e a base de dados. Tratamo-los apenas para entregar as páginas, garantir a segurança e prevenir abusos (art. 6.º, n.º 1, al. f) do RGPD). Estes registos ficam nos fornecedores indicados na secção 4. O armazenamento no seu navegador (idioma, sessão) está explicado na Política de Cookies.",
           "When you open a page, your browser sends your IP address and technical data (browser, date and time) to the servers that deliver the site and the database. We process them only to deliver the pages, ensure security and prevent abuse (Art. 6(1)(f) GDPR). These logs are kept by the providers listed in section 4. Storage in your browser (language, session) is explained in the Cookie Policy.",
           "Cuando abre una página, su navegador envía la dirección IP y datos técnicos (navegador, fecha y hora) a los servidores que entregan el sitio y la base de datos. Los tratamos solo para entregar las páginas, garantizar la seguridad y prevenir abusos (art. 6.1.f) del RGPD). Estos registros los conservan los proveedores indicados en la sección 4. El almacenamiento en su navegador (idioma, sesión) se explica en la Política de Cookies."))
    pg.p(T("Não recolhemos categorias especiais de dados através do site. Os dados de saúde só são recolhidos presencialmente, na ficha de anamnese.",
           "We do not collect special categories of data through the website. Health data is only collected in person, on the anamnesis form.",
           "No recogemos categorías especiales de datos a través del sitio web. Los datos de salud solo se recogen en persona, en la ficha de anamnesis."))

    # 3 ---------------------------------------------------------------
    pg.h2("s3", T("3. Decisões automatizadas e chat", "3. Automated decisions and chat", "3. Decisiones automatizadas y chat"))
    pg.p(T("Não tomamos decisões exclusivamente automatizadas nem fazemos definição de perfis (art. 22.º do RGPD). O assistente de chat do site responde com texto pré-definido e não envia as suas mensagens a ninguém.",
           "We do not make decisions based solely on automated processing, nor do we profile you (Art. 22 GDPR). The website chat assistant replies with pre-written text and does not send your messages to anyone.",
           "No tomamos decisiones basadas únicamente en el tratamiento automatizado ni elaboramos perfiles (art. 22 del RGPD). El asistente de chat del sitio responde con texto predefinido y no envía sus mensajes a nadie."))

    # 4 ---------------------------------------------------------------
    pg.h2("s4", T("4. Quem recebe os seus dados", "4. Who receives your data", "4. Quién recibe sus datos"))
    pg.table(T("Destinatários e subcontratantes", "Recipients and processors", "Destinatarios y encargados"),
        [T("Entidade", "Entity", "Entidad"), T("Função", "Role", "Función"), T("Que dados", "What data", "Qué datos"), T("Onde", "Where", "Dónde")], [
        [T("Google Ireland Limited / Google LLC (Firebase Authentication e Cloud Firestore)", "Google Ireland Limited / Google LLC (Firebase Authentication and Cloud Firestore)", "Google Ireland Limited / Google LLC (Firebase Authentication y Cloud Firestore)"),
         T("Subcontratante: guarda a base de dados e trata o início de sessão.", "Processor: stores the database and handles sign-in.", "Encargado: guarda la base de datos y gestiona el inicio de sesión."),
         T("Dados da conta, marcações, agenda, comunidade e dados técnicos.", "Account data, appointments, diary, community and technical data.", "Datos de la cuenta, citas, agenda, comunidad y datos técnicos."),
         T("União Europeia e/ou Estados Unidos (ver secção 5).", "European Union and/or United States (see section 5).", "Unión Europea y/o Estados Unidos (véase la sección 5).")],
        [T("GitHub, Inc. (Microsoft) — GitHub Pages", "GitHub, Inc. (Microsoft) — GitHub Pages", "GitHub, Inc. (Microsoft) — GitHub Pages"),
         T("Subcontratante: aloja os ficheiros do site.", "Processor: hosts the website files.", "Encargado: aloja los archivos del sitio."),
         T("Dados técnicos de acesso (por exemplo, o endereço IP).", "Technical access data (for example, the IP address).", "Datos técnicos de acceso (por ejemplo, la dirección IP)."),
         T("Estados Unidos e rede global de entrega de conteúdos.", "United States and global content delivery network.", "Estados Unidos y red global de entrega de contenidos.")],
        [T("WhatsApp (Meta Platforms Ireland Limited)", "WhatsApp (Meta Platforms Ireland Limited)", "WhatsApp (Meta Platforms Ireland Limited)"),
         T("Serviço de mensagens, só se escolher falar connosco por WhatsApp.", "Messaging service, only if you choose to contact us on WhatsApp.", "Servicio de mensajería, solo si elige hablar con nosotros por WhatsApp."),
         T("O seu número e as mensagens que enviar.", "Your number and the messages you send.", "Su número y los mensajes que envíe."),
         T("União Europeia e Estados Unidos.", "European Union and United States.", "Unión Europea y Estados Unidos.")],
        [T("Google (Google Maps)", "Google (Google Maps)", "Google (Google Maps)"),
         T("Mapa da página «Localização», só se carregar o mapa.", "Map on the “Location” page, only if you load the map.", "Mapa de la página «Localización», solo si carga el mapa."),
         T("Endereço IP e dados de navegação.", "IP address and browsing data.", "Dirección IP y datos de navegación."),
         T("Estados Unidos.", "United States.", "Estados Unidos.")],
        [T("Contabilista e autoridades (por exemplo, a Autoridade Tributária)", "Accountant and authorities (for example, the Tax Authority)", "Contable y autoridades (por ejemplo, la Autoridad Tributaria)"),
         T("Cumprimento de obrigações legais.", "Meeting legal obligations.", "Cumplimiento de obligaciones legales."),
         T("Dados de faturação.", "Invoicing data.", "Datos de facturación."),
         T("Portugal.", "Portugal.", "Portugal.")],
    ])
    pg.p(T("Só o pessoal autorizado da Inova Beauty acede aos seus dados, na medida do necessário. Não vendemos os seus dados nem os cedemos a terceiros para marketing.",
           "Only authorised Inova Beauty staff access your data, as far as necessary. We do not sell your data or give it to third parties for marketing.",
           "Solo el personal autorizado de Inova Beauty accede a sus datos, en la medida necesaria. No vendemos sus datos ni los cedemos a terceros para marketing."))
    pg.p(T("O site não carrega tipos de letra, scripts de medição nem outros recursos de terceiros ao abrir uma página: os tipos de letra e o código do Firebase estão alojados no próprio site. A Google só é contactada quando usa uma função que precisa dela (iniciar sessão, criar conta, ver ou pedir horários, publicar na comunidade) ou se carregar o mapa.",
           "The website does not load fonts, measurement scripts or other third-party resources when you open a page: the fonts and the Firebase code are hosted on the site itself. Google is only contacted when you use a feature that needs it (signing in, creating an account, viewing or requesting appointment times, posting in the community) or if you load the map.",
           "El sitio no carga tipos de letra, scripts de medición ni otros recursos de terceros al abrir una página: los tipos de letra y el código de Firebase están alojados en el propio sitio. Solo se contacta con Google cuando usa una función que la necesita (iniciar sesión, crear cuenta, ver o pedir horarios, publicar en la comunidad) o si carga el mapa."))

    # 5 ---------------------------------------------------------------
    pg.h2("s5", T("5. Transferências para fora da União Europeia", "5. Transfers outside the European Union", "5. Transferencias fuera de la Unión Europea"))
    pg.p(T("A Google LLC e o GitHub, Inc. estão sediados nos Estados Unidos. Quando os seus dados são tratados fora do Espaço Económico Europeu, a transferência apoia-se na decisão de adequação da Comissão Europeia relativa ao Quadro de Privacidade de Dados UE–EUA (Data Privacy Framework), quando o destinatário está certificado, e/ou nas cláusulas contratuais-tipo aprovadas pela Comissão Europeia (art. 46.º do RGPD), incluídas nos termos de tratamento de dados desses fornecedores. A região em que a nossa base de dados está alojada indica-se na tabela de identificação, na secção 1.",
           "Google LLC and GitHub, Inc. are based in the United States. When your data is processed outside the European Economic Area, the transfer relies on the European Commission's adequacy decision for the EU–US Data Privacy Framework, where the recipient is certified, and/or on the standard contractual clauses approved by the European Commission (Art. 46 GDPR), included in those providers' data processing terms. The region where our database is hosted is shown in the identification table in section 1.",
           "Google LLC y GitHub, Inc. tienen su sede en Estados Unidos. Cuando sus datos se tratan fuera del Espacio Económico Europeo, la transferencia se apoya en la decisión de adecuación de la Comisión Europea sobre el Marco de Privacidad de Datos UE-EE. UU. (Data Privacy Framework), cuando el destinatario está certificado, y/o en las cláusulas contractuales tipo aprobadas por la Comisión Europea (art. 46 del RGPD), incluidas en los términos de tratamiento de datos de esos proveedores. La región en la que está alojada nuestra base de datos se indica en la tabla de identificación, en la sección 1."))

    # 6 ---------------------------------------------------------------
    pg.h2("s6", T("6. Durante quanto tempo guardamos os dados", "6. How long we keep your data", "6. Durante cuánto tiempo conservamos los datos"))
    pg.table(T("Prazos de conservação", "Retention periods", "Plazos de conservación"),
        [T("Dados", "Data", "Datos"), T("Prazo", "Period", "Plazo"), T("Porquê", "Why", "Por qué")], [
        [T("Conta de cliente e cartão de fidelidade", "Customer account and loyalty card", "Cuenta de cliente y tarjeta de fidelidad"),
         T("Enquanto a conta existir. Pode apagá-la quando quiser; contas sem atividade há mais de 24 meses podem ser eliminadas.", "While the account exists. You can delete it whenever you want; accounts inactive for more than 24 months may be deleted.", "Mientras exista la cuenta. Puede borrarla cuando quiera; las cuentas sin actividad durante más de 24 meses pueden eliminarse."),
         T("Prestar o serviço que pediu.", "Provide the service you asked for.", "Prestar el servicio que solicitó.")],
        [T("Marcações (nome, telemóvel, serviço, data)", "Appointments (name, phone, service, date)", "Citas (nombre, móvil, servicio, fecha)"),
         T("24 meses após a data do atendimento.", "24 months after the appointment date.", "24 meses después de la fecha de la cita."),
         T("Histórico de atendimento e resolução de dúvidas ou reclamações.", "Appointment history and handling of questions or complaints.", "Historial de atención y resolución de dudas o reclamaciones.")],
        [T("Ficha de anamnese e termo de responsabilidade (papel)", "Anamnesis form and consent form (paper)", "Ficha de anamnesis y documento de responsabilidad (papel)"),
         T("5 anos após o último atendimento.", "5 years after the last appointment.", "5 años después de la última cita."),
         T("Provar o seu consentimento e defender direitos em caso de litígio.", "Prove your consent and defend rights in case of a dispute.", "Probar su consentimiento y defender derechos en caso de litigio.")],
        [T("Documentos de faturação", "Invoicing documents", "Documentos de facturación"),
         T("O prazo fiscal e contabilístico legal (em regra, 10 anos).", "The legal tax and accounting period (as a rule, 10 years).", "El plazo fiscal y contable legal (por regla general, 10 años)."),
         T("Obrigação legal.", "Legal obligation.", "Obligación legal.")],
        [T("Publicações e comentários da comunidade", "Community posts and comments", "Publicaciones y comentarios de la comunidad"),
         T("Até os apagar ou apagar a conta.", "Until you delete them or delete your account.", "Hasta que los borre o borre la cuenta."),
         T("Consentimento.", "Consent.", "Consentimiento.")],
        [T("Registos técnicos (IP, acessos)", "Technical logs (IP, access)", "Registros técnicos (IP, accesos)"),
         T("Os prazos definidos pelos fornecedores (Google e GitHub).", "The periods set by the providers (Google and GitHub).", "Los plazos fijados por los proveedores (Google y GitHub)."),
         T("Segurança e funcionamento.", "Security and operation.", "Seguridad y funcionamiento.")],
    ])
    pg.p(T("Se apagar a conta, o perfil, os selos, os prémios, as publicações e os comentários são eliminados. Se, por razões técnicas, algum comentário seu ficar visível, peça-nos a remoção pelos contactos da secção 1 e apagamo-lo. O registo das marcações já feitas mantém-se pelo prazo acima, porque é um registo do atendimento prestado.",
           "If you delete your account, your profile, stamps, rewards, posts and comments are deleted. If, for technical reasons, any comment of yours remains visible, ask us to remove it using the contacts in section 1 and we will delete it. The record of appointments already made is kept for the period above, because it is a record of the service provided.",
           "Si borra la cuenta, se eliminan el perfil, los sellos, los premios, las publicaciones y los comentarios. Si, por razones técnicas, algún comentario suyo sigue visible, pídanos que lo retiremos por los contactos de la sección 1 y lo borraremos. El registro de las citas ya realizadas se conserva durante el plazo indicado, porque es un registro de la atención prestada."))

    # 7 ---------------------------------------------------------------
    pg.h2("s7", T("7. Os seus direitos", "7. Your rights", "7. Sus derechos"))
    pg.ul([
        T("<strong>Acesso</strong> (art. 15.º): saber se tratamos dados seus e receber uma cópia.", "<strong>Access</strong> (Art. 15): know whether we process your data and receive a copy.", "<strong>Acceso</strong> (art. 15): saber si tratamos datos suyos y recibir una copia."),
        T("<strong>Retificação</strong> (art. 16.º): corrigir dados errados ou incompletos.", "<strong>Rectification</strong> (Art. 16): correct wrong or incomplete data.", "<strong>Rectificación</strong> (art. 16): corregir datos erróneos o incompletos."),
        T("<strong>Apagamento</strong> (art. 17.º): pedir que apaguemos os dados, quando a lei o permitir.", "<strong>Erasure</strong> (Art. 17): ask us to delete your data, where the law allows.", "<strong>Supresión</strong> (art. 17): pedir que borremos los datos, cuando la ley lo permita."),
        T("<strong>Limitação</strong> (art. 18.º): pedir que suspendamos o tratamento em certos casos.", "<strong>Restriction</strong> (Art. 18): ask us to pause processing in certain cases.", "<strong>Limitación</strong> (art. 18): pedir que suspendamos el tratamiento en ciertos casos."),
        T("<strong>Portabilidade</strong> (art. 20.º): receber os dados que nos deu num formato de uso corrente.", "<strong>Portability</strong> (Art. 20): receive the data you gave us in a commonly used format.", "<strong>Portabilidad</strong> (art. 20): recibir los datos que nos dio en un formato de uso común."),
        T("<strong>Oposição</strong> (art. 21.º): opor-se ao tratamento baseado em interesses legítimos.", "<strong>Objection</strong> (Art. 21): object to processing based on legitimate interests.", "<strong>Oposición</strong> (art. 21): oponerse al tratamiento basado en intereses legítimos."),
        T("<strong>Decisões automatizadas</strong> (art. 22.º): não tomamos decisões exclusivamente automatizadas.", "<strong>Automated decisions</strong> (Art. 22): we do not make decisions based solely on automated processing.", "<strong>Decisiones automatizadas</strong> (art. 22): no tomamos decisiones basadas únicamente en el tratamiento automatizado."),
        T("<strong>Retirar o consentimento</strong> (art. 7.º, n.º 3), a qualquer momento, sem afetar o que foi feito antes.", "<strong>Withdraw consent</strong> (Art. 7(3)), at any time, without affecting what was done before.", "<strong>Retirar el consentimiento</strong> (art. 7.3), en cualquier momento, sin afectar a lo hecho antes."),
    ])
    pg.p([T("Como exercer: na sua conta pode corrigir os dados e apagar a conta. Para os restantes pedidos, escreva-nos para o email ou para o WhatsApp indicados na secção 1. Respondemos no prazo de um mês (art. 12.º, n.º 3 do RGPD), prorrogável por mais dois meses em pedidos complexos, e o exercício dos direitos é gratuito. Podemos pedir-lhe um comprovativo de identidade para confirmar que é o titular dos dados.",
            "How to exercise them: in your account you can correct your data and delete the account. For other requests, write to the email or WhatsApp number in section 1. We reply within one month (Art. 12(3) GDPR), extendable by two more months for complex requests, and exercising your rights is free of charge. We may ask for proof of identity to confirm that you are the data subject.",
            "Cómo ejercerlos: en su cuenta puede corregir los datos y borrar la cuenta. Para el resto de las solicitudes, escríbanos al correo electrónico o al WhatsApp indicados en la sección 1. Respondemos en el plazo de un mes (art. 12.3 del RGPD), prorrogable dos meses más en solicitudes complejas, y el ejercicio de los derechos es gratuito. Podemos pedirle un justificante de identidad para confirmar que es el titular de los datos.")])

    # 8 ---------------------------------------------------------------
    pg.h2("s8", T("8. Reclamações", "8. Complaints", "8. Reclamaciones"))
    pg.p([T("Se considerar que tratamos os seus dados em violação do RGPD, tem o direito de apresentar reclamação à autoridade de controlo: a Comissão Nacional de Proteção de Dados (CNPD), em ",
            "If you believe we process your data in breach of the GDPR, you have the right to lodge a complaint with the supervisory authority: the Portuguese Data Protection Authority (CNPD), at ",
            "Si considera que tratamos sus datos incumpliendo el RGPD, tiene derecho a presentar una reclamación ante la autoridad de control: la Comisión Nacional de Protección de Datos (CNPD), en "),
          A("https://www.cnpd.pt", T("www.cnpd.pt", "www.cnpd.pt", "www.cnpd.pt"), ext=True),
          T(". Também pode recorrer aos tribunais. Se residir noutro Estado-Membro, pode reclamar à autoridade de proteção de dados do seu país.",
            ". You may also go to court. If you live in another Member State, you can complain to the data protection authority of your country.",
            ". También puede acudir a los tribunales. Si reside en otro Estado miembro, puede reclamar ante la autoridad de protección de datos de su país.")])

    # 9 ---------------------------------------------------------------
    pg.h2("s9", T("9. Menores", "9. Minors", "9. Menores"))
    pg.p(T("A conta e a comunidade destinam-se a pessoas com 13 ou mais anos (art. 16.º da Lei n.º 58/2019). Abaixo dessa idade, é necessário o consentimento de quem exerce as responsabilidades parentais. Se soubermos que existe uma conta de uma criança com menos de 13 anos sem essa autorização, eliminamo-la.",
           "The account and community are intended for people aged 13 or over (Art. 16 of Law 58/2019). Below that age, the consent of the holder of parental responsibility is required. If we learn that an account belongs to a child under 13 without that authorisation, we delete it.",
           "La cuenta y la comunidad están destinadas a personas de 13 años o más (art. 16 de la Ley 58/2019). Por debajo de esa edad se necesita el consentimiento de quien ejerce la responsabilidad parental. Si sabemos que existe una cuenta de un menor de 13 años sin esa autorización, la eliminamos."))

    # 10 --------------------------------------------------------------
    pg.h2("s10", T("10. Segurança", "10. Security", "10. Seguridad"))
    pg.ul([
        T("A ligação ao site é cifrada (HTTPS).", "The connection to the site is encrypted (HTTPS).", "La conexión al sitio está cifrada (HTTPS)."),
        T("As marcações só podem ser lidas pela administradora do estúdio, com uma conta autenticada; os dados de cada conta só podem ser lidos pelo próprio titular e pela administradora.", "Appointments can only be read by the studio administrator, with an authenticated account; each account's data can only be read by its holder and the administrator.", "Las citas solo puede leerlas la administradora del estudio, con una cuenta autenticada; los datos de cada cuenta solo pueden leerlos su titular y la administradora."),
        T("As palavras-passe são tratadas pelo Firebase Authentication e nunca ficam visíveis para nós.", "Passwords are handled by Firebase Authentication and are never visible to us.", "Las contraseñas las trata Firebase Authentication y nunca son visibles para nosotros."),
        T("Em caso de violação de dados que o possa prejudicar, informamos a CNPD e, quando necessário, a si (arts. 33.º e 34.º do RGPD).", "In the event of a data breach that may harm you, we inform the CNPD and, where necessary, you (Arts. 33 and 34 GDPR).", "En caso de violación de datos que pueda perjudicarle, informamos a la CNPD y, cuando sea necesario, a usted (arts. 33 y 34 del RGPD)."),
    ])

    # 11 --------------------------------------------------------------
    pg.h2("s11", T("11. Cookies e armazenamento no navegador", "11. Cookies and browser storage", "11. Cookies y almacenamiento en el navegador"))
    pg.p([T("O site não define cookies próprios e hoje não usa ferramentas de medição nem de publicidade. Guarda apenas, no seu navegador, o que é necessário para funcionar (por exemplo, o idioma escolhido). A lista completa está na ",
            "The site sets no cookies of its own and currently uses no measurement or advertising tools. It only stores in your browser what is needed to work (for example, the language you chose). The full list is in the ",
            "El sitio no define cookies propias y hoy no usa herramientas de medición ni de publicidad. Solo guarda en su navegador lo necesario para funcionar (por ejemplo, el idioma elegido). La lista completa está en la "),
          A("../cookies/", T("Política de Cookies", "Cookie Policy", "Política de Cookies")),
          T(".", ".", ".")])

    # 12 --------------------------------------------------------------
    pg.h2("s12", T("12. Alterações a esta política", "12. Changes to this policy", "12. Cambios en esta política"))
    pg.p([T("Se mudarmos esta política de forma relevante, avisamos no site e atualizamos a data e a versão no topo. Para consultar uma versão anterior, peça-nos. Veja também os ",
            "If we change this policy in a significant way, we will say so on the site and update the date and version at the top. To see an earlier version, ask us. See also the ",
            "Si modificamos esta política de forma relevante, lo avisaremos en el sitio y actualizaremos la fecha y la versión en la parte superior. Para consultar una versión anterior, pídanosla. Vea también los "),
          A("../termos/", T("Termos e Condições", "Terms and Conditions", "Términos y Condiciones")),
          T(".", ".", ".")])
    return pg
