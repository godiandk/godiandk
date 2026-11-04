from build import T, A, Page, PH
from common import *

def build():
    pg = Page("cancelamento",
        "Cancelamento e Reembolso",
        "Como cancelar ou remarcar uma marcação na Inova Beauty, o seu direito de desistir em 14 dias nas marcações feitas à distância (DL 24/2014), quando esse direito não se aplica e como pedir um reembolso.",
        T("Cancelamento e Reembolso", "Cancellation and Refunds", "Cancelación y Reembolso"),
        T("Como cancelar ou remarcar, em que casos pode desistir no prazo de 14 dias e como pedir um reembolso.",
          "How to cancel or reschedule, when you can withdraw within 14 days and how to ask for a refund.",
          "Cómo cancelar o cambiar una cita, en qué casos puede desistir en 14 días y cómo pedir un reembolso."),
        T("Cancelamento e Reembolso", "Cancellation and Refunds", "Cancelación y Reembolso"),
        T(f"Última atualização: {ATUALIZADO} (versão {VERSAO}).",
          "Last updated: 4 November 2026 (version 2.0).",
          "Última actualización: 4 de noviembre de 2026 (versión 2.0)."))

    pg.p(T("Esta página está escrita em português. Em caso de dúvida ou divergência com a tradução, prevalece a versão portuguesa.",
           "This page is written in Portuguese. In case of doubt or difference with the translation, the Portuguese version prevails.",
           "Esta página está escrita en portugués. En caso de duda o divergencia con la traducción, prevalece la versión portuguesa."), "legal-meta")
    pg.note(T("<strong>Em resumo:</strong> pode cancelar ou remarcar avisando-nos o mais cedo possível, por WhatsApp ou por telefone. Se marcou à distância (no site, na app, por WhatsApp, por telefone ou por email), tem 14 dias para desistir sem dar razões, salvo nos casos explicados abaixo. O pagamento faz-se no estúdio, no fim do atendimento, por isso normalmente não há nada a reembolsar.",
              "<strong>In short:</strong> you can cancel or reschedule by letting us know as early as possible, by WhatsApp or phone. If you booked at a distance (on the site, in the app, by WhatsApp, phone or email), you have 14 days to withdraw without giving a reason, except in the cases explained below. Payment is made at the studio, at the end of the appointment, so normally there is nothing to refund.",
              "<strong>En resumen:</strong> puede cancelar o cambiar la cita avisándonos lo antes posible, por WhatsApp o por teléfono. Si reservó a distancia (en el sitio, en la app, por WhatsApp, por teléfono o por correo electrónico), tiene 14 días para desistir sin dar razones, salvo en los casos explicados abajo. El pago se hace en el estudio, al final de la atención, por lo que normalmente no hay nada que reembolsar."))

    # 1 ---------------------------------------------------------------
    pg.h2("s1", T("1. Como nos contactar", "1. How to contact us", "1. Cómo contactarnos"))
    pg.idtable(ident_rows(L_PRESTADOR), CAP_IDENT)

    # 2 ---------------------------------------------------------------
    pg.h2("s2", T("2. Cancelar ou remarcar uma marcação", "2. Cancelling or rescheduling an appointment", "2. Cancelar o cambiar una cita"))
    pg.p(T("Para cancelar ou remarcar, fale connosco por WhatsApp ou por telefone (contactos acima) e diga o seu nome, o serviço e o dia e hora marcados. Quanto mais cedo nos avisar, mais fácil é oferecer o horário a outra pessoa.",
           "To cancel or reschedule, talk to us by WhatsApp or phone (contacts above) and tell us your name, the service and the day and time booked. The earlier you let us know, the easier it is to offer the slot to someone else.",
           "Para cancelar o cambiar la cita, hable con nosotros por WhatsApp o por teléfono (contactos arriba) e indique su nombre, el servicio y el día y la hora reservados. Cuanto antes nos avise, más fácil es ofrecer el horario a otra persona."))
    pg.table(T("Regras do estúdio para cancelar ou remarcar", "Studio rules for cancelling or rescheduling", "Reglas del estudio para cancelar o cambiar"),
        [T("Situação", "Situation", "Situación"), T("Regra", "Rule", "Regla")], [
        [T("Aviso prévio para cancelar ou remarcar sem encargos", "Notice needed to cancel or reschedule at no charge", "Preaviso para cancelar o cambiar sin cargo"),
         ("RAW", PH("prazo_cancelamento"))],
        [T("Cancelamento tardio ou falta sem aviso", "Late cancellation or no-show", "Cancelación tardía o ausencia sin aviso"),
         ("RAW", PH("encargos_cancelamento"))],
        [T("Se formos nós a cancelar ou a remarcar", "If we cancel or reschedule", "Si somos nosotros quienes cancelamos o cambiamos"),
         T("Avisamos assim que possível, propomos uma nova data e, se já tiver pago algum valor, devolvemo-lo na totalidade.", "We tell you as soon as possible, propose a new date and, if you have already paid something, refund it in full.", "Avisamos lo antes posible, proponemos una nueva fecha y, si ya ha pagado algún importe, lo devolvemos íntegramente.")],
    ])
    pg.p(T("Só cobramos um encargo se o tivermos comunicado antes da marcação e dentro do que a lei permite. Nas marcações feitas à distância, enquanto puder exercer o direito de livre resolução (secção 3), não paga nada por desistir, exceto o valor proporcional do que já tiver sido prestado, se o serviço tiver começado a seu pedido.",
           "We only charge a fee if we told you before the booking and within what the law allows. For appointments booked at a distance, while you can exercise the right of withdrawal (section 3), you pay nothing for withdrawing, except the proportional amount for what has already been provided, if the service started at your request.",
           "Solo cobramos un cargo si lo comunicamos antes de la reserva y dentro de lo que permite la ley. En las citas reservadas a distancia, mientras pueda ejercer el derecho de desistimiento (sección 3), no paga nada por desistir, salvo el importe proporcional de lo ya prestado, si el servicio empezó a petición suya."))

    # 3 ---------------------------------------------------------------
    pg.h2("s3", T("3. Direito de desistir em 14 dias (livre resolução)", "3. Right to withdraw within 14 days", "3. Derecho a desistir en 14 días"))
    pg.p([T("Quando faz uma marcação à distância, isto é, sem estar presencialmente no estúdio (no site, na app, por WhatsApp, por telefone ou por email), a lei dá-lhe o direito de desistir do contrato sem dar qualquer razão, no prazo de 14 dias. Está previsto no Decreto-Lei n.º 24/2014, que regula os contratos celebrados à distância e fora do estabelecimento comercial.",
            "When you make a booking at a distance, that is, without being physically at the studio (on the site, in the app, by WhatsApp, phone or email), the law gives you the right to withdraw from the contract without giving any reason within 14 days. This is provided for in Decree-Law 24/2014, which regulates contracts concluded at a distance and away from business premises.",
            "Cuando hace una reserva a distancia, es decir, sin estar presencialmente en el estudio (en el sitio, en la app, por WhatsApp, por teléfono o por correo electrónico), la ley le da derecho a desistir del contrato sin dar ninguna razón en un plazo de 14 días. Está previsto en el Decreto-Ley 24/2014, que regula los contratos celebrados a distancia y fuera del establecimiento comercial.")])
    pg.table(T("Como funciona a livre resolução", "How withdrawal works", "Cómo funciona el desistimiento"),
        [T("Aspeto", "Aspect", "Aspecto"), T("O que diz a regra", "The rule", "La regla")], [
        [T("Prazo para desistir", "Time limit to withdraw", "Plazo para desistir"),
         T("14 dias, a contar do dia em que a marcação é confirmada (data em que o contrato é celebrado).", "14 days, counted from the day the appointment is confirmed (the date the contract is concluded).", "14 días, a contar desde el día en que se confirma la cita (fecha en que se celebra el contrato).")],
        [T("Como desistir", "How to withdraw", "Cómo desistir"),
         T("Basta uma declaração clara, por WhatsApp, email ou carta, enviada antes de acabar o prazo. Pode usar o modelo da secção 6, mas não é obrigatório.", "A clear statement is enough, by WhatsApp, email or letter, sent before the time limit ends. You can use the model in section 6, but it is not compulsory.", "Basta una declaración clara, por WhatsApp, correo electrónico o carta, enviada antes de que acabe el plazo. Puede usar el modelo de la sección 6, pero no es obligatorio.")],
        [T("Custos", "Costs", "Costes"),
         T("Não paga nada por desistir. Se o serviço já tiver começado a seu pedido dentro do prazo, paga apenas a parte proporcional ao que foi prestado até ao momento em que nos comunicou a decisão.", "You pay nothing for withdrawing. If the service has already started at your request within the time limit, you only pay the part proportional to what was provided up to the moment you told us your decision.", "No paga nada por desistir. Si el servicio ya empezó a petición suya dentro del plazo, solo paga la parte proporcional a lo prestado hasta el momento en que nos comunicó la decisión.")],
        [T("Reembolso", "Refund", "Reembolso"),
         T("Devolvemos qualquer valor já pago no prazo máximo de 14 dias depois de sabermos da sua decisão, pelo mesmo meio de pagamento que usou.", "We refund any amount already paid within 14 days at most after learning of your decision, by the same payment method you used.", "Devolvemos cualquier importe ya pagado en un plazo máximo de 14 días tras conocer su decisión, por el mismo medio de pago que usó.")],
    ])

    pg.h3(T("Quando NÃO se aplica o direito de desistir", "When the right to withdraw does NOT apply", "Cuándo NO se aplica el derecho a desistir"))
    pg.ul([
        T("<strong>Serviço já totalmente prestado.</strong> Se o serviço começou a seu pedido expresso dentro dos 14 dias e reconheceu que perderia o direito de desistir quando o serviço estivesse totalmente prestado, já não pode desistir depois de ele estar completo (artigo 17.º do Decreto-Lei n.º 24/2014).",
          "<strong>Service already fully provided.</strong> If the service started at your express request within the 14 days and you acknowledged that you would lose the right to withdraw once the service was fully provided, you can no longer withdraw once it is complete (Article 17 of Decree-Law 24/2014).",
          "<strong>Servicio ya prestado por completo.</strong> Si el servicio empezó a petición expresa suya dentro de los 14 días y reconoció que perdería el derecho a desistir cuando el servicio estuviera totalmente prestado, ya no puede desistir una vez completado (artículo 17 del Decreto-Ley 24/2014)."),
        T("<strong>Marcação feita presencialmente no estúdio.</strong> Se combinou a marcação connosco estando as duas partes presentes no estúdio, o contrato não é celebrado à distância e este direito legal não se aplica. Aplicam-se, porém, as regras do estúdio da secção 2.",
          "<strong>Appointment made in person at the studio.</strong> If you arranged the appointment with us with both parties present at the studio, the contract is not concluded at a distance and this legal right does not apply. The studio rules in section 2 do, however, apply.",
          "<strong>Cita acordada presencialmente en el estudio.</strong> Si acordó la cita con nosotros estando ambas partes presentes en el estudio, el contrato no se celebra a distancia y este derecho legal no se aplica. Se aplican, no obstante, las reglas del estudio de la sección 2."),
    ])
    pg.p(T("Para o serviço poder começar dentro dos 14 dias, precisamos do seu pedido expresso e do seu reconhecimento de que perde o direito de desistir quando o serviço estiver totalmente prestado. Pedimos essa declaração por escrito (por exemplo, por WhatsApp) quando confirmamos a marcação, para ficar registada. Se não a der, o serviço só começa depois de passados os 14 dias.",
           "For the service to begin within the 14 days we need your express request and your acknowledgement that you lose the right to withdraw once the service is fully provided. We ask for that statement in writing (for example, by WhatsApp) when we confirm the appointment, so that it is recorded. If you do not give it, the service only starts after the 14 days have passed.",
           "Para que el servicio pueda empezar dentro de los 14 días necesitamos su petición expresa y su reconocimiento de que pierde el derecho a desistir cuando el servicio esté totalmente prestado. Pedimos esa declaración por escrito (por ejemplo, por WhatsApp) cuando confirmamos la cita, para que quede registrada. Si no la da, el servicio solo empieza una vez pasados los 14 días."))

    # 4 ---------------------------------------------------------------
    pg.h2("s4", T("4. Reembolsos", "4. Refunds", "4. Reembolsos"))
    pg.p(T("Como o pagamento é feito no estúdio, no fim do atendimento, normalmente não há nada a reembolsar. Se tiver pago algum valor adiantado (por exemplo, um sinal combinado consigo), devolvemo-lo, sem encargos, quando:",
           "As payment is made at the studio, at the end of the appointment, there is normally nothing to refund. If you paid some amount in advance (for example, a deposit agreed with you), we refund it, at no charge, when:",
           "Como el pago se hace en el estudio, al final de la atención, normalmente no hay nada que reembolsar. Si pagó algún importe por adelantado (por ejemplo, una señal acordada con usted), lo devolvemos, sin cargos, cuando:"))
    pg.ul([
        T("desiste no prazo de livre resolução (secção 3);", "you withdraw within the withdrawal period (section 3);", "desiste dentro del plazo de desistimiento (sección 3);"),
        T("cancela dentro do aviso prévio indicado na secção 2;", "you cancel within the notice period stated in section 2;", "cancela dentro del preaviso indicado en la sección 2;"),
        T("somos nós a cancelar, ou não conseguimos prestar o serviço.", "we cancel, or we are unable to provide the service.", "somos nosotros quienes cancelamos, o no podemos prestar el servicio."),
    ])
    pg.p(T("O reembolso faz-se pelo mesmo meio de pagamento que usou, no prazo máximo de 14 dias. Os cupões, os selos e os prémios de fidelidade não são reembolsáveis em dinheiro. Se não ficar satisfeita com o resultado, fale connosco: queremos resolver. Os seus direitos legais como consumidor mantêm-se sempre.",
           "The refund is made by the same payment method you used, within 14 days at most. Coupons, stamps and loyalty rewards are not refundable in cash. If you are not happy with the result, talk to us: we want to put it right. Your legal rights as a consumer always remain.",
           "El reembolso se hace por el mismo medio de pago que usó, en un plazo máximo de 14 días. Los cupones, los sellos y los premios de fidelidad no son reembolsables en dinero. Si no queda satisfecha con el resultado, hable con nosotros: queremos resolverlo. Sus derechos legales como consumidor se mantienen siempre."))

    # 5 ---------------------------------------------------------------
    pg.h2("s5", T("5. Reclamações", "5. Complaints", "5. Reclamaciones"))
    pg.p([T("Se tiver uma reclamação, fale connosco primeiro. Pode também apresentá-la no Livro de Reclamações eletrónico, em ", "If you have a complaint, talk to us first. You can also submit it in the electronic Complaints Book, at ", "Si tiene una reclamación, hable primero con nosotros. También puede presentarla en el Libro de Reclamaciones electrónico, en "),
          A("https://www.livroreclamacoes.pt/", T("www.livroreclamacoes.pt", "www.livroreclamacoes.pt", "www.livroreclamacoes.pt"), ext=True),
          T(". Mais informação sobre a resolução de litígios de consumo nos ", ". More information on resolving consumer disputes in the ", ". Más información sobre la resolución de litigios de consumo en los "),
          A("../termos/#s13", T("Termos e Condições", "Terms and Conditions", "Términos y Condiciones")), T(".", ".", ".")])

    # 6 ---------------------------------------------------------------
    pg.h2("s6", T("6. Modelo para desistir (opcional)", "6. Withdrawal template (optional)", "6. Modelo para desistir (opcional)"))
    pg.p(T("Pode copiar o texto abaixo e enviá-lo para os contactos da secção 1. Não é obrigatório usar este modelo.",
           "You can copy the text below and send it to the contacts in section 1. Using this template is not compulsory.",
           "Puede copiar el texto de abajo y enviarlo a los contactos de la sección 1. No es obligatorio usar este modelo."))
    pg.note(T("À Inova Beauty: comunico que desisto do contrato de prestação do serviço [indicar o serviço], marcado para o dia [data], que confirmei em [data da confirmação]. Nome: [o seu nome]. Telemóvel: [o seu telemóvel]. Data: [data de hoje].",
              "To Inova Beauty: I hereby give notice that I withdraw from my contract for the provision of the service [state the service], booked for [date], which I confirmed on [date of confirmation]. Name: [your name]. Mobile: [your mobile]. Date: [today's date].",
              "A Inova Beauty: comunico que desisto del contrato de prestación del servicio [indicar el servicio], reservado para el día [fecha], que confirmé el [fecha de confirmación]. Nombre: [su nombre]. Móvil: [su móvil]. Fecha: [fecha de hoy]."))
    return pg
