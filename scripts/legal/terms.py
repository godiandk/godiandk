from build import T, A, Page, PH
from common import *

def build():
    pg = Page("termos",
        "Termos e Condições",
        "Termos e Condições da Inova Beauty: como fazer uma marcação, preços e pagamento, cancelamentos, cartão de fidelidade, conta, comunidade, responsabilidade, resolução de litígios, lei aplicável e foro.",
        T("Termos e Condições", "Terms and Conditions", "Términos y Condiciones"),
        T("As regras de utilização do site e da app e da marcação dos serviços da Inova Beauty.",
          "The rules for using the website and app and for booking Inova Beauty's services.",
          "Las reglas de uso del sitio web y de la app y de la reserva de los servicios de Inova Beauty."),
        T("Termos e Condições", "Terms and Conditions", "Términos y Condiciones"),
        T(f"Última atualização: {ATUALIZADO} (versão {VERSAO}).",
          "Last updated: 4 November 2026 (version 2.0).",
          "Última actualización: 4 de noviembre de 2026 (versión 2.0)."))

    pg.p(T("Esta página está escrita em português. Em caso de dúvida ou divergência com a tradução, prevalece a versão portuguesa.",
           "This page is written in Portuguese. In case of doubt or difference with the translation, the Portuguese version prevails.",
           "Esta página está escrita en portugués. En caso de duda o divergencia con la traducción, prevalece la versión portuguesa."), "legal-meta")
    pg.note(T("<strong>Em resumo:</strong> o site serve para conhecer os serviços e pedir uma marcação. Não vendemos produtos nem recebemos pagamentos pelo site: o serviço é prestado e pago no estúdio. A marcação só fica confirmada depois de a confirmarmos. Tem direitos de consumidor que estes termos não afastam.",
              "<strong>In short:</strong> the site is for finding out about the services and requesting an appointment. We do not sell products or take payments through the site: the service is provided and paid for at the studio. An appointment is only confirmed once we confirm it. You have consumer rights that these terms do not remove.",
              "<strong>En resumen:</strong> el sitio sirve para conocer los servicios y pedir una cita. No vendemos productos ni recibimos pagos por el sitio: el servicio se presta y se paga en el estudio. La cita solo queda confirmada cuando la confirmamos. Usted tiene derechos de consumidor que estos términos no excluyen."))

    pg.h2("s1", T("1. Quem presta o serviço", "1. Who provides the service", "1. Quién presta el servicio"))
    pg.idtable(ident_rows(L_PRESTADOR, extra=[
        (T("Regime de IVA", "VAT regime", "Régimen de IVA"), ("RAW", PH("iva"))),
    ]), CAP_IDENT)

    pg.h2("s2", T("2. O que oferecemos", "2. What we offer", "2. Qué ofrecemos"))
    pg.p(T("O site e a app apresentam os serviços e os preços da Inova Beauty e permitem pedir uma marcação. O que prestamos são serviços de estética, presencialmente e por marcação, em Canidelo, Vila Nova de Gaia. Não vendemos produtos nem recebemos pagamentos através do site. A descrição dos serviços e as imagens são informativas; os resultados variam de pessoa para pessoa.",
           "The website and app present Inova Beauty's services and prices and let you request an appointment. What we provide are beauty services, in person and by appointment, in Canidelo, Vila Nova de Gaia. We do not sell products or take payments through the site. Service descriptions and images are for information; results vary from person to person.",
           "El sitio web y la app presentan los servicios y precios de Inova Beauty y permiten pedir una cita. Lo que prestamos son servicios de estética, de forma presencial y con cita previa, en Canidelo, Vila Nova de Gaia. No vendemos productos ni recibimos pagos a través del sitio. La descripción de los servicios y las imágenes son informativas; los resultados varían de una persona a otra."))

    pg.h2("s3", T("3. Como se faz uma marcação", "3. How to book an appointment", "3. Cómo se reserva una cita"))
    pg.ul([
        T("Escolha o serviço, o dia e a hora entre os horários livres que o site mostra.", "Choose the service, day and time from the free slots the site shows.", "Elija el servicio, el día y la hora entre los horarios libres que muestra el sitio."),
        T("Indique o nome e o telemóvel e, se quiser, um cupão e observações.", "Enter your name and mobile number and, if you wish, a coupon and notes.", "Indique su nombre y su móvil y, si lo desea, un cupón y observaciones."),
        T("Reveja os dados e carregue em «Confirmar marcação». Pode corrigir os dados antes de confirmar. O pedido fica registado como pendente.", "Review the details and press “Confirm appointment”. You can correct the details before confirming. The request is saved as pending.", "Revise los datos y pulse «Confirmar cita». Puede corregir los datos antes de confirmar. La solicitud queda registrada como pendiente."),
        T("A marcação só fica confirmada depois de a confirmarmos consigo, por WhatsApp ou por telefone. É nesse momento que se considera celebrado o contrato de prestação do serviço.", "The appointment is only confirmed once we confirm it with you, by WhatsApp or phone. That is when the service contract is considered concluded.", "La cita solo queda confirmada cuando la confirmamos con usted, por WhatsApp o por teléfono. En ese momento se considera celebrado el contrato de prestación del servicio."),
        T("Ao confirmarmos, enviamos-lhe a morada exata do estúdio.", "When we confirm, we send you the exact address of the studio.", "Al confirmar, le enviamos la dirección exacta del estudio."),
    ], ordered=True)
    pg.p(T("Os horários mostrados são os que definimos como disponíveis e podem mudar. A duração indicada para cada serviço é uma estimativa. O contrato é celebrado em português.",
           "The times shown are those we have set as available and may change. The duration given for each service is an estimate. The contract is concluded in Portuguese.",
           "Los horarios mostrados son los que hemos definido como disponibles y pueden cambiar. La duración indicada para cada servicio es una estimación. El contrato se celebra en portugués."))

    pg.h2("s4", T("4. Preços e pagamento", "4. Prices and payment", "4. Precios y pago"))
    pg.p([T("Os preços estão no ", "Prices are in the ", "Los precios están en el "), A("../precario/", T("Preçário", "Price list", "Listado de precios")),
          T(", em euros (€). São os preços finais, já com os impostos aplicáveis, de acordo com o regime de IVA indicado na tabela da secção 1. O preço aplicável é o que consta do Preçário quando faz a marcação, salvo erro manifesto. Alguns serviços são orçamentados na hora («sob consulta»), conforme a zona ou a opção escolhida: nesse caso o preço é combinado consigo antes de começarmos.",
            ", in euros (€). They are final prices, including the applicable taxes, according to the VAT regime stated in the table in section 1. The applicable price is the one in the Price list when you make the appointment, barring a manifest error. Some services are quoted on the spot (“on request”), depending on the area or option chosen: in that case the price is agreed with you before we start.",
            ", en euros (€). Son precios finales, con los impuestos aplicables, de acuerdo con el régimen de IVA indicado en la tabla de la sección 1. El precio aplicable es el que figura en el listado cuando hace la cita, salvo error manifiesto. Algunos servicios se presupuestan en el momento («bajo consulta»), según la zona o la opción elegida: en ese caso el precio se acuerda con usted antes de empezar.")])
    pg.table(T("Condições de pagamento", "Payment terms", "Condiciones de pago"),
        [T("Assunto", "Subject", "Asunto"), T("Condição", "Term", "Condición")], [
        [T("Quando se paga", "When you pay", "Cuándo se paga"), T("No estúdio, no fim do atendimento. O site não recebe pagamentos nem pede dados de cartão.", "At the studio, at the end of the appointment. The site does not take payments or ask for card details.", "En el estudio, al final de la atención. El sitio no recibe pagos ni pide datos de tarjeta.")],
        [T("Meios de pagamento aceites", "Accepted payment methods", "Medios de pago aceptados"), ("RAW", PH("meios_pagamento"))],
        [T("Fatura", "Invoice", "Factura"), T("Emitimos fatura (ou fatura-recibo) dos serviços, nos termos da lei. Se a quiser com NIF, diga-o no atendimento.", "We issue an invoice (or invoice-receipt) for the services, as required by law. If you want it with your tax ID, say so at the appointment.", "Emitimos factura (o factura-recibo) de los servicios, según la ley. Si la quiere con NIF, dígalo en la atención.")],
    ])

    pg.h2("s5", T("5. Cancelamentos, remarcações e faltas", "5. Cancellations, rescheduling and no-shows", "5. Cancelaciones, cambios y ausencias"))
    pg.p([T("Pedimos que nos avise com a maior antecedência possível, para libertarmos o horário para outra pessoa. As regras completas estão na página ",
            "We ask you to let us know as early as possible, so that we can free the slot for someone else. The full rules are on the ",
            "Le pedimos que nos avise con la mayor antelación posible, para liberar el horario para otra persona. Las reglas completas están en la página "),
          A("../cancelamento/", T("Cancelamento e reembolso", "Cancellation and refunds", "Cancelación y reembolso")),
          T(", incluindo o direito de livre resolução.", " page, including the right of withdrawal.", ", incluido el derecho de desistimiento.")])

    pg.h2("s6", T("6. Cartão de fidelidade, cupões e prémios", "6. Loyalty card, coupons and rewards", "6. Tarjeta de fidelidad, cupones y premios"))
    pg.ul([
        T("Cada procedimento vale 1 selo; ao 10.º selo recebe um Threading de Sobrancelhas grátis.", "Each procedure earns 1 stamp; at the 10th stamp you receive a free Eyebrow Threading.", "Cada procedimiento vale 1 sello; con el 10.º sello recibe un Threading de Cejas gratis."),
        T("A caderneta é válida de janeiro a dezembro: os selos não completados recomeçam a 1 de janeiro.", "The stamp card is valid from January to December: incomplete stamps restart on 1 January.", "La cartilla es válida de enero a diciembre: los sellos no completados empiezan de nuevo el 1 de enero."),
        T("Os cupões de desconto e o prémio de fidelidade são de uso único e pessoais, não têm valor em dinheiro e não podem ser transmitidos a outra pessoa.", "Discount coupons and the loyalty reward are single-use and personal, have no cash value and cannot be passed on to another person.", "Los cupones de descuento y el premio de fidelidad son de un solo uso y personales, no tienen valor en dinero y no pueden transmitirse a otra persona."),
        T("O cupão de aniversário é de 10% e vale durante a semana do seu aniversário. Só o recebe se nos indicar o dia e o mês do seu aniversário.", "The birthday coupon is 10% and is valid during the week of your birthday. You only receive it if you give us the day and month of your birthday.", "El cupón de cumpleaños es del 10 % y vale durante la semana de su cumpleaños. Solo lo recibe si nos indica el día y el mes de su cumpleaños."),
        T("Se alterarmos ou terminarmos o programa, avisamos no site. Os selos e prémios já conquistados mantêm-se até ao fim da respetiva validade.", "If we change or end the programme, we will tell you on the site. Stamps and rewards already earned remain until their expiry.", "Si modificamos o terminamos el programa, lo avisaremos en el sitio. Los sellos y premios ya conseguidos se mantienen hasta el final de su validez."),
    ])

    pg.h2("s7", T("7. A sua conta", "7. Your account", "7. Su cuenta"))
    pg.ul([
        T("A conta é opcional: pode marcar sem conta. Com conta, junta selos e recebe o cupão de aniversário.", "An account is optional: you can book without one. With an account, you collect stamps and get the birthday coupon.", "La cuenta es opcional: puede reservar sin cuenta. Con cuenta, acumula sellos y recibe el cupón de cumpleaños."),
        T("Dê-nos dados verdadeiros e mantenha-os atualizados. Há uma conta por número de telemóvel.", "Give us true details and keep them up to date. There is one account per mobile number.", "Facilítenos datos veraces y manténgalos actualizados. Hay una cuenta por número de móvil."),
        T("Guarde a sua palavra-passe em segurança. É responsável pelo que for feito com a sua conta.", "Keep your password safe. You are responsible for what is done with your account.", "Guarde su contraseña en un lugar seguro. Es responsable de lo que se haga con su cuenta."),
        T("É preciso ter 13 anos ou mais para criar conta (art. 16.º da Lei n.º 58/2019).", "You must be 13 or over to create an account (Art. 16 of Law 58/2019).", "Hay que tener 13 años o más para crear una cuenta (art. 16 de la Ley 58/2019)."),
        T("Pode apagar a conta a qualquer momento, em «A minha conta». Podemos suspender ou eliminar contas que usem o site de forma abusiva ou ilegal.", "You can delete your account at any time, under “My account”. We may suspend or delete accounts that use the site abusively or unlawfully.", "Puede borrar la cuenta en cualquier momento, en «Mi cuenta». Podemos suspender o eliminar cuentas que usen el sitio de forma abusiva o ilegal."),
    ])

    pg.h2("s8", T("8. Comunidade (publicações na app)", "8. Community (posts in the app)", "8. Comunidad (publicaciones en la app)"))
    pg.ul([
        T("As publicações são visíveis para as outras clientes com sessão iniciada na app, e para a administradora.", "Posts are visible to other customers signed in to the app, and to the administrator.", "Las publicaciones son visibles para otras clientas con sesión iniciada en la app y para la administradora."),
        T("Só publique fotografias e textos que lhe pertencem ou que tem direito de usar. Não publique imagens de outras pessoas sem a autorização delas.", "Only post photos and text that belong to you or that you have the right to use. Do not post images of other people without their permission.", "Publique solo fotografías y textos que le pertenezcan o que tenga derecho a usar. No publique imágenes de otras personas sin su permiso."),
        T("Não é permitido publicar conteúdo ilegal, ofensivo, enganoso, publicitário ou que viole direitos de terceiros.", "It is not allowed to post content that is unlawful, offensive, misleading, advertising or that infringes third-party rights.", "No está permitido publicar contenido ilegal, ofensivo, engañoso, publicitario o que vulnere derechos de terceros."),
        T("Ao publicar, dá-nos uma licença gratuita, não exclusiva e limitada para mostrar a publicação na app enquanto ela existir. Continua a ser o autor.", "By posting, you give us a free, non-exclusive, limited licence to show the post in the app while it exists. You remain the author.", "Al publicar, nos concede una licencia gratuita, no exclusiva y limitada para mostrar la publicación en la app mientras exista. Sigue siendo el autor."),
        T("A administradora pode remover publicações que violem estes termos ou a lei. Para denunciar um conteúdo, contacte-nos pelos meios da secção 1: analisamos e, se for caso disso, removemos.", "The administrator may remove posts that breach these terms or the law. To report content, contact us using the details in section 1: we review it and, where appropriate, remove it.", "La administradora puede retirar publicaciones que incumplan estos términos o la ley. Para denunciar un contenido, contáctenos por los medios de la sección 1: lo analizamos y, en su caso, lo retiramos."),
        T("Pode apagar as suas publicações e comentários quando quiser.", "You can delete your posts and comments whenever you want.", "Puede borrar sus publicaciones y comentarios cuando quiera."),
    ])

    pg.h2("s9", T("9. Saúde, segurança e resultados", "9. Health, safety and results", "9. Salud, seguridad y resultados"))
    pg.p(T("Antes de alguns procedimentos preenchemos consigo uma ficha de anamnese. Diga-nos tudo o que for relevante: alergias, medicação (por exemplo, isotretinoína ou tratamento de acne), doenças (por exemplo, lúpus), gravidez, herpes, tendência para cicatrizes anormais. Algumas situações contraindicam o procedimento. Podemos recusar ou adiar um procedimento por razões de segurança. Os resultados variam de pessoa para pessoa e dependem também dos cuidados que tiver depois do atendimento.",
           "Before some procedures we fill in an anamnesis form with you. Tell us everything that is relevant: allergies, medication (for example, isotretinoin or acne treatment), conditions (for example, lupus), pregnancy, herpes, a tendency to abnormal scarring. Some situations rule out the procedure. We may refuse or postpone a procedure for safety reasons. Results vary from person to person and also depend on the care you take after the appointment.",
           "Antes de algunos procedimientos rellenamos con usted una ficha de anamnesis. Cuéntenos todo lo relevante: alergias, medicación (por ejemplo, isotretinoína o tratamiento del acné), enfermedades (por ejemplo, lupus), embarazo, herpes, tendencia a cicatrices anormales. Algunas situaciones contraindican el procedimiento. Podemos rechazar o aplazar un procedimiento por razones de seguridad. Los resultados varían de una persona a otra y dependen también de los cuidados que tenga después de la atención."))

    pg.h2("s10", T("10. Qualidade do serviço e garantia", "10. Quality of the service and guarantee", "10. Calidad del servicio y garantía"))
    pg.p(T("O serviço deve ser prestado com a qualidade devida e de acordo com o que combinámos consigo (Lei de Defesa do Consumidor, Lei n.º 24/96). Como os resultados variam de pessoa para pessoa e dependem também dos seus cuidados depois do atendimento, não podemos garantir um resultado específico. Isto não afeta os seus direitos legais como consumidor. Se não ficar satisfeita, diga-nos o mais cedo possível, para podermos avaliar a situação e, se for o caso, corrigi-la.",
           "The service must be provided with due quality and in accordance with what we agreed with you (Consumer Protection Law, Law 24/96). As results vary from person to person and also depend on your care after the appointment, we cannot guarantee a specific result. This does not affect your legal rights as a consumer. If you are not satisfied, tell us as soon as possible, so that we can assess the situation and, where appropriate, put it right.",
           "El servicio debe prestarse con la calidad debida y de acuerdo con lo que acordamos con usted (Ley de Defensa del Consumidor, Ley 24/96). Como los resultados varían de una persona a otra y dependen también de sus cuidados después de la atención, no podemos garantizar un resultado específico. Esto no afecta a sus derechos legales como consumidor. Si no queda satisfecha, díganoslo lo antes posible, para que podamos evaluar la situación y, en su caso, corregirla."))

    pg.h2("s11", T("11. Propriedade intelectual", "11. Intellectual property", "11. Propiedad intelectual"))
    pg.p([T("Os textos, o logótipo, as imagens e o código do site pertencem à Inova Beauty ou são usados com autorização ou licença. A origem de cada imagem está indicada no ficheiro de créditos do site. Não pode copiá-los nem usá-los para outros fins sem autorização.",
            "The texts, logo, images and code of the site belong to Inova Beauty or are used with permission or licence. The origin of each image is stated in the site's credits file. You may not copy or use them for other purposes without permission.",
            "Los textos, el logotipo, las imágenes y el código del sitio pertenecen a Inova Beauty o se usan con autorización o licencia. El origen de cada imagen se indica en el archivo de créditos del sitio. No puede copiarlos ni usarlos para otros fines sin autorización.")])

    pg.h2("s12", T("12. Responsabilidade", "12. Liability", "12. Responsabilidad"))
    pg.p(T("Esforçamo-nos para que a informação do site esteja correta e atualizada, mas o site é fornecido tal como está e pode ficar indisponível por razões técnicas. Não excluímos nem limitamos a nossa responsabilidade por dolo ou negligência grave, por danos a pessoas, nem os direitos que a lei lhe reconhece como consumidor.",
           "We try to keep the information on the site correct and up to date, but the site is provided as is and may be unavailable for technical reasons. We do not exclude or limit our liability for wilful misconduct or gross negligence, for harm to persons, or the rights the law gives you as a consumer.",
           "Nos esforzamos por que la información del sitio sea correcta y esté actualizada, pero el sitio se ofrece tal cual y puede no estar disponible por razones técnicas. No excluimos ni limitamos nuestra responsabilidad por dolo o negligencia grave, por daños a personas, ni los derechos que la ley le reconoce como consumidor."))

    pg.h2("s13", T("13. Reclamações e resolução de litígios", "13. Complaints and dispute resolution", "13. Reclamaciones y resolución de litigios"))
    pg.table(T("Onde reclamar", "Where to complain", "Dónde reclamar"),
        [T("Meio", "Channel", "Medio"), T("Como", "How", "Cómo")], [
        [T("Livro de Reclamações eletrónico", "Electronic Complaints Book", "Libro de Reclamaciones electrónico"),
         [T("Pode apresentar uma reclamação em ", "You can submit a complaint at ", "Puede presentar una reclamación en "), A("https://www.livroreclamacoes.pt/", T("www.livroreclamacoes.pt", "www.livroreclamacoes.pt", "www.livroreclamacoes.pt"), ext=True), T(".", ".", ".")]],
        [T("Resolução alternativa de litígios (RAL)", "Alternative dispute resolution (ADR)", "Resolución alternativa de litigios (RAL)"),
         [T("Em caso de litígio de consumo, pode recorrer a uma entidade de RAL. A lista está no Portal do Consumidor: ", "In a consumer dispute, you may turn to an ADR body. The list is on the Consumer Portal: ", "En caso de litigio de consumo, puede acudir a una entidad de RAL. La lista está en el Portal del Consumidor: "), A("https://www.consumidor.gov.pt", T("www.consumidor.gov.pt", "www.consumidor.gov.pt", "www.consumidor.gov.pt"), ext=True), T(".", ".", ".")]],
        [T("Entidade de RAL a que aderimos", "ADR body we have joined", "Entidad de RAL a la que nos hemos adherido"), ("RAW", PH("entidade_ral"))],
    ])

    pg.h2("s14", T("14. Lei aplicável e foro", "14. Governing law and jurisdiction", "14. Ley aplicable y foro"))
    pg.p(T("Estes termos regem-se pela lei portuguesa. Quaisquer litígios serão resolvidos pelos tribunais portugueses competentes, designadamente os da área de Vila Nova de Gaia, sem prejuízo de, como consumidor, poder propor a ação no tribunal do seu domicílio, nos termos da lei e do Regulamento (UE) n.º 1215/2012. Se reside noutro Estado-Membro, mantêm-se as normas imperativas de proteção do consumidor do seu país.",
           "These terms are governed by Portuguese law. Any disputes will be resolved by the competent Portuguese courts, namely those of the Vila Nova de Gaia area, without prejudice to your right, as a consumer, to bring proceedings in the court of your domicile, under the law and Regulation (EU) No 1215/2012. If you live in another Member State, the mandatory consumer protection rules of your country remain applicable.",
           "Estos términos se rigen por la ley portuguesa. Cualquier litigio será resuelto por los tribunales portugueses competentes, en particular los de la zona de Vila Nova de Gaia, sin perjuicio de que, como consumidor, pueda demandar ante el tribunal de su domicilio, según la ley y el Reglamento (UE) n.º 1215/2012. Si reside en otro Estado miembro, se mantienen las normas imperativas de protección del consumidor de su país."))

    pg.h2("s15", T("15. Alterações aos termos", "15. Changes to the terms", "15. Cambios en los términos"))
    pg.p([T("Podemos atualizar estes termos. A data e a versão no topo indicam a última revisão; as alterações não afetam marcações já confirmadas. Veja também a ",
            "We may update these terms. The date and version at the top show the last revision; changes do not affect appointments already confirmed. See also the ",
            "Podemos actualizar estos términos. La fecha y la versión en la parte superior indican la última revisión; los cambios no afectan a citas ya confirmadas. Vea también la "),
          A("../privacidade/", T("Política de Privacidade", "Privacy Policy", "Política de Privacidad")), T(" e a ", " and the ", " y la "),
          A("../cookies/", T("Política de Cookies", "Cookie Policy", "Política de Cookies")), T(".", ".", ".")])
    return pg
