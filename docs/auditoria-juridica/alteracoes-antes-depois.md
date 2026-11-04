# Alterações: o que foi apagado ou reescrito (antes → depois)

O Wesley pediu: «não apagues conteúdo sem me mostrares primeiro o que vais apagar». Como esta sessão corre sem conversa em direto, tudo o que foi apagado ou reescrito fica aqui, **antes de publicar**: nada vai para o site até o pedido de alterações (PR) ser aceite.

- Os textos completos da Política de Privacidade e dos Termos que foram **substituídos** estão em `texto-antigo-privacidade.md` e `texto-antigo-termos.md`.
- Esta tabela cobre os **textos visíveis**. As alterações só de código (JavaScript, CSS) estão resumidas no fim, sem o código.
- Cada linha mostra o texto como estava (antes), como ficou (depois) e porquê.


## Ponto 16 — promessas não provadas (antes → depois)

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `app/index.html` | Cupão de aniversário — 10% automático no seu mês | Cupão de aniversário — 10% na semana do seu aniversário (se nos der o dia e o mês) | Afirmação inexata: o cupão vale na SEMANA do aniversário (não «no seu mês») e só existe se a pessoa indicar o aniversário (campo agora opcional). |
| `app/index.html` | Marcação em 1 minuto — pedido direto para o WhatsApp | Marcação em 1 minuto — escolha o serviço, o dia e a hora e o pedido fica registado no estúdio | Afirmação desatualizada: a marcação na app não é enviada por WhatsApp; fica registada na base de dados do estúdio e é confirmada por nós. |
| `index.html` | Profissionais especializadas e certificadas | Profissionais especializadas | «certificadas»: não há certificados indicados no site nem mostrados; só se pode afirmar o que se prova. (Se houver certificados, indicar entidade e ano.) |
| `index.html` | Junte 10 selos e ganhe um serviço grátis. E ainda 10% de desconto na semana do seu aniversário. | Junte 10 selos e ganhe um Threading de Sobrancelhas grátis. E ainda 10% de desconto na semana do seu aniversário (se nos der o dia e o mês). | «um serviço grátis» era vago: o prémio é sempre o Threading de Sobrancelhas (Termos, secção 6). O desconto de aniversário só existe se a pessoa indicar o dia e o mês. |
| `index.html` | Com 10 selos ganha um serviço grátis. E recebe automaticamente um cupão de 10% de desconto na semana do seu aniversário. 🎂 | Com 10 selos ganha um Threading de Sobrancelhas grátis. E, se nos indicar o dia e o mês do seu aniversário, recebe um cupão de 10% de desconto nessa semana. 🎂 Veja as regras nos Termos e Condições . | Prémio concreto e condição do cupão de aniversário (publicidade clara); ligação às regras. |
| `index.html` | Ao criar a sua conta gratuita, junta selos a cada visita. Com 10 selos ganha um serviço grátis. E recebe um cupão de 10% de desconto na semana do seu aniversário. | Ao criar a sua conta gratuita, junta selos a cada visita. Com 10 selos ganha um Threading de Sobrancelhas grátis. E, se nos indicar o dia e o mês do seu aniversário, recebe um cupão de 10% de desconto nessa semana. | O mesmo texto nos dados estruturados da FAQ (têm de coincidir com o que se vê). |
| `index.html` | Sim. Tratamos os seus dados ao abrigo do RGPD e não os vendemos nem cedemos a terceiros. Saiba mais na nossa Política de Privacidade . | Protegemos os seus dados e tratamo-los ao abrigo do RGPD, só para o que é preciso (marcações e cartão de fidelidade). Não os vendemos. Usamos prestadores de serviços, como a Google (base de dados) e o GitHub (alojamento do site), para os guardar. Os detalhes, os prazos e os seus direitos estão na nossa Política de Privacidade . | «Sim… e não os vendemos nem cedemos a terceiros»: afirmação absoluta e inexata (usamos subcontratantes: Google/Firebase, GitHub). Texto passa a dizer o que acontece de facto. |
| `index.html` | Sim. Tratamos os seus dados ao abrigo do RGPD e não os vendemos nem cedemos a terceiros. Saiba mais na nossa Política de Privacidade. | Protegemos os seus dados e tratamo-los ao abrigo do RGPD, só para o que é preciso (marcações e cartão de fidelidade). Não os vendemos. Usamos prestadores de serviços, como a Google (base de dados) e o GitHub (alojamento do site), para os guardar. Os detalhes, os prazos e os seus direitos estão na nossa Política de Privacidade. | O mesmo texto nos dados estruturados da FAQ. |
| `index.html` | avise-nos com antecedência pelo WhatsApp para libertarmos o horário para outra cliente. | avise-nos com antecedência pelo WhatsApp para libertarmos o horário para outra cliente. Veja Cancelamento e reembolso . | Ligação à política de cancelamento e reembolso. |
| `sobre/index.html` | Especializada nas técnicas mais atuais de embelezamento do olhar | Especializada em técnicas de embelezamento do olhar | Superlativo não provado («as mais atuais»). |
| `sobre/index.html` | entrega resultados precisos, naturais e duradouros. | procura sempre resultados precisos e naturais. | Promessa de resultado («duradouros») que depende de cada pessoa; passa a compromisso de método. |
| `sobre/index.html` | para que o resultado seja perfeito para si. | para chegarmos ao resultado certo para si. | «perfeito» é uma promessa de resultado. |
| `processos/brow-lamination/index.html` | garantindo semanas de duração. | para o efeito durar semanas. | «garantindo» é uma garantia de resultado que o estúdio não dá (Termos, secção 10). |
| `processos/brow-lamination/index.html` | deixando os pelos saudáveis e brilhantes. | deixando os pelos hidratados e com brilho. | «saudáveis» é uma alegação de saúde não demonstrada. |
| `processos/lifting-pestanas/index.html` | O segundo produto sela a curvatura, garantindo 6 a 8 semanas de efeito. | O segundo produto sela a curvatura; o efeito dura, em média, 6 a 8 semanas. | «garantindo» → valor médio, como já se faz noutras páginas. |
| `processos/threading/index.html` | capturando os pelos pela raiz — sem químicos, sem cera, sem agressão. | capturando os pelos pela raiz — sem cera e sem químicos na remoção do pelo. | «sem agressão» é subjetivo (o threading pode irritar a pele). |
| `processos/threading/index.html` | garantindo higiene e conforto. | para maior higiene e conforto. | «garantindo» → sem promessa absoluta. |
| `servicos/index.html` | precisão total, sem químicos e ideal para peles sensíveis. | sem cera nem químicos na remoção do pelo. | «precisão total» (absoluto) e «ideal para peles sensíveis» (alegação de adequação: há contraindicações, ver Termos, secção 9). |
| `servicos/sobrancelhas/threading/index.html` | Sem químicos nem produtos agressivos | Sem cera nem químicos na remoção do pelo | «produtos agressivos» é subjetivo. |
| `servicos/sobrancelhas/threading/index.html` | Ideal para peles sensíveis e com tendência a irritação | Tem pele sensível ou está em tratamento dermatológico? Diga-nos antes de marcar | «Ideal para peles sensíveis» é uma alegação de adequação/saúde que contradiz as contraindicações (Termos, secção 9). Passa a precaução. |
| `servicos/sobrancelhas/threading/index.html` | Resultado mais duradouro do que a pinça | Remove o pelo pela raiz, fio a fio | Comparação com outro método não provada. |
| `servicos/sobrancelhas/threading/index.html` | com um acabamento impecável — incluindo peles sensíveis, reativas ou em tratamento dermatológico. | com um acabamento cuidado. Se tem pele sensível ou está em tratamento dermatológico, fale connosco antes de marcar: em alguns casos o threading não é aconselhado. | Dizia que serve peles «em tratamento dermatológico» (por exemplo, isotretinoína), o que é perigoso e contradiz os Termos. «impecável» é absoluto. |
| `servicos/pestanas/index.html` | com um efeito de máscara permanente — sem extensões. | com um efeito de máscara de pestanas — sem extensões. | «permanente»: o lifting dura semanas, não é permanente (publicidade enganosa). |
| `processos/extensao-pestanas/index.html` | para o efeito ficar sempre perfeito. | para manter o efeito. | «sempre perfeito» é uma promessa absoluta. |
| `servicos/pestanas/extensao/index.html` | Manutenções regulares para um resultado sempre perfeito | Manutenções regulares para manter o resultado | «sempre perfeito» é uma promessa absoluta. |
| `servicos/pestanas/extensao/index.html` | Remoção (não aplicadas na clínica) | Remoção (extensões não aplicadas no estúdio) | «clínica»: o estúdio não é uma clínica (termo que sugere um estabelecimento de saúde registado). |
| `servicos/micropigmentacao/index.html` | com um resultado extremamente natural. | com um resultado natural. | Superlativo. |
| `servicos/micropigmentacao/index.html` | com resultado natural e duradouro | com pigmentos semi-permanentes e resultado natural | «duradouro» é uma promessa de duração sem base; «semi-permanente» descreve o produto. |
| `processos/micropigmentacao-sobrancelhas/index.html` | para um procedimento praticamente indolor. | para maior conforto durante o procedimento. | «praticamente indolor» é uma promessa sobre a dor que varia de pessoa para pessoa. |
| `processos/micropigmentacao-sobrancelhas/index.html` | com um resultado ultra natural. | com um resultado natural. | Superlativo. |
| `servicos/micropigmentacao/sobrancelhas/index.html` | uma definição duradoura sem maquilhagem. | uma definição semi-permanente sem maquilhagem. | «duradoura» sem base. |
| `processos/depilacao-laser/index.html` | — resultados progressivos e duradouros. | — resultados progressivos, que variam de pessoa para pessoa. | «duradouros» é uma promessa de resultado não provada (alegação de eficácia). |
| `processos/depilacao-laser/index.html` | para uma redução progressiva e duradoura do pelo. | para uma redução progressiva do pelo. | «duradoura»: idem. |
| `servicos/depilacao-laser/index.html` | com resultados progressivos e duradouros. | com resultados progressivos, que variam de pessoa para pessoa. | «duradouros»: idem. |
| `img/og-image.jpg` | Imagem de partilha com o texto «Sobrancelhas · Pestanas / Micropigmentação · Laser» (serviços que ainda não se fazem) | Nova imagem: «Sobrancelhas · Pestanas · Lábios» (letra Cormorant Garamond, logótipo igual) | Publicidade a serviços indisponíveis (aparece ao partilhar o site no WhatsApp/redes sociais). |

## Ponto 6 — minimização de dados (campos removidos ou alterados)

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `conta/index.html` | Senha | Palavra-passe | Português de Portugal. |
| `conta/index.html` | placeholder="A sua senha" | placeholder="A sua palavra-passe" | Português de Portugal. |
| `conta/index.html` | Sexo* Masculino Feminino | **(removido)** | REMOVIDO o campo «Sexo*» (obrigatório): não é necessário para nenhuma finalidade do serviço (minimização, art. 5.º, n.º 1, al. c) RGPD). Servia só para escolher um avatar «masculino/feminino». |
| `conta/index.html` | Data de nascimento* Para o seu cupom de aniversário 🎁 | Aniversário (opcional) Dia 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 Mês janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro Só o dia e o mês, para o seu cupão de aniversário 🎁 | «Data de nascimento*» (completa e obrigatória) passa a «Aniversário (opcional)», só dia e mês: o ano nunca foi usado. |
| `conta/index.html` | Sexo Masculino Feminino | Aniversário (opcional) Dia 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 Mês janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro | REMOVIDO o campo «Sexo» das configurações; acrescentado «Aniversário (opcional)» (dia e mês) para poder juntar ou retirar o aniversário. |
| `conta/index.html` | /* Foto de perfil / personagem e sexo no registo */ var sPhoto = null, sChar = null; function updateAvatarPreview() { var checked = document.querySelector('input[name="sGender"]:checked'); var gender = checked ? checked.value : ""; var url = sPhoto \|\| (sChar ? ((window.INOVA_PREFIX \|\| "") + sChar) : window.InovaAuth.defaultAvatar(gender, document.getElementById("sName").value)); document.getElementById("sAvatarP… | /* Foto de perfil / personagem no registo */ var sPhoto = null, sChar = null; function updateAvatarPreview() { var url = sPhoto \|\| (sChar ? ((window.INOVA_PREFIX \|\| "") + sChar) : window.InovaAuth.defaultAvatar("", document.getElementById("sName").value)); document.getElementById("sAvatarPreview").src = url; } document.getElementById("sName").addEventListener("input", function () { if (!sPhoto && !sChar) updateA… | Sem sexo: o avatar por omissão usa a inicial do nome. |
| `conta/index.html` | var b = new Date(acc.birth + "T12:00:00"); document.getElementById("profileInfo").textContent = "Telemóvel: " + acc.phone + " · Email: " + acc.email + " · Aniversário: " + String(b.getDate()).padStart(2, "0") + "/" + String(b.getMonth() + 1).padStart(2, "0"); | var bl = window.InovaAuth.birthLabel(acc.birth); document.getElementById("profileInfo").textContent = "Telemóvel: " + acc.phone + " · Email: " + acc.email + (bl ? " · Aniversário: " + bl : ""); | O aniversário é opcional e já não tem ano. |
| `conta/index.html` | document.getElementById("setGenderM").querySelector("input").checked = acc.gender === "M"; document.getElementById("setGenderF").querySelector("input").checked = acc.gender === "F"; document.getElementById("setGenderM").classList.toggle("picked", acc.gender === "M"); document.getElementById("setGenderF").classList.toggle("picked", acc.gender === "F"); | var bp = window.InovaAuth.birthParts(acc.birth); document.getElementById("setBirthDay").value = bp.d; document.getElementById("setBirthMonth").value = bp.m; | Configurações: aniversário em vez de sexo. |
| `conta/index.html` | var genderChecked = document.querySelector('input[name="sGender"]:checked'); var btn = signupForm.querySelector('button[type=submit]'); btn.disabled = true; window.InovaAuth.register({ name: document.getElementById("sName").value, phone: document.getElementById("sPhone").value, email: document.getElementById("sEmail").value, birth: document.getElementById("sBirth").value, gender: genderChecked ? genderChecked.value … | var btn = signupForm.querySelector('button[type=submit]'); var bd = document.getElementById("sBirthDay").value, bm = document.getElementById("sBirthMonth").value; if ((bd && !bm) \|\| (!bd && bm)) { msg(document.getElementById("signupMsg"), "Escolha o dia e o mês do aniversário, ou deixe os dois em branco.", false); return; } btn.disabled = true; window.InovaAuth.register({ name: document.getElementById("sName").val… | O registo já não envia o sexo; o aniversário é opcional (dia e mês). |
| `conta/index.html` | if (confirm("Apagar a sua conta? Os selos e prémios serão perdidos definitivamente.")) { window.InovaAuth.removeCurrent(); } | if (confirm("Apagar a sua conta? Os selos, os prémios e as suas publicações e comentários serão apagados definitivamente.")) { window.InovaAuth.removeCurrent().then(function (r) { if (r && r.error) msg(document.getElementById("setMsg"), r.error, false); }); } | Apagar a conta apaga também as publicações e comentários (art. 17.º RGPD) e mostra o erro se não for possível. |
| `conta/index.html` | document.querySelectorAll('input[name="setGender"]').forEach(function (r) { r.addEventListener("change", function () { document.getElementById("setGenderM").classList.toggle("picked", r.value === "M" && r.checked); document.getElementById("setGenderF").classList.toggle("picked", r.value === "F" && r.checked); var acc0 = window.InovaAuth.current(); if ((setPhoto === undefined \|\| setPhoto === null) && !setChar && (!… | **(removido)** | Removido o tratamento do campo «Sexo» das configurações. |
| `conta/index.html` | var g = document.querySelector('input[name="setGender"]:checked'); document.getElementById("setAvatar").src = window.InovaAuth.defaultAvatar(g ? g.value : "", ""); | document.getElementById("setAvatar").src = window.InovaAuth.defaultAvatar("", document.getElementById("setName").value); | Sem sexo. |
| `conta/index.html` | var g = document.querySelector('input[name="setGender"]:checked'); var changes = { name: document.getElementById("setName").value.trim(), phone: document.getElementById("setPhone").value.trim(), gender: g ? g.value : "" }; | var bd = document.getElementById("setBirthDay").value, bm = document.getElementById("setBirthMonth").value; if ((bd && !bm) \|\| (!bd && bm)) { msg(sm, "Escolha o dia e o mês do aniversário, ou deixe os dois em branco.", false); return; } var changes = { name: document.getElementById("setName").value.trim(), phone: document.getElementById("setPhone").value.trim(), birth: window.InovaAuth.birthFrom(bd, bm) }; | Guardar configurações sem sexo; com aniversário opcional. |
| `app/home/index.html` | Sexo* Masculino Feminino | **(removido)** | REMOVIDO o campo «Sexo*» (obrigatório): não é necessário para nenhuma finalidade do serviço (minimização, art. 5.º, n.º 1, al. c) RGPD). |
| `app/home/index.html` | Data de nascimento* (obrigatória) Para receber o seu voucher de aniversário 🎁 | Aniversário (opcional) Dia 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 Mês janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro Só o dia e o mês, para o seu cupão de aniversário 🎁 | «Data de nascimento* (obrigatória)» passa a «Aniversário (opcional)», só dia e mês. |
| `app/home/index.html` | Sexo Masculino Feminino | Aniversário (opcional) Dia 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 Mês janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro | REMOVIDO o campo «Sexo» das configurações; acrescentado «Aniversário (opcional)». |
| `app/home/index.html` | var b = new Date(acc.birth + "T12:00:00"); document.getElementById("profileInfo").textContent = "Telemóvel: " + acc.phone + " · Email: " + acc.email + " · Aniversário: " + String(b.getDate()).padStart(2, "0") + "/" + String(b.getMonth() + 1).padStart(2, "0"); | var bl = window.InovaAuth.birthLabel(acc.birth); document.getElementById("profileInfo").textContent = "Telemóvel: " + acc.phone + " · Email: " + acc.email + (bl ? " · Aniversário: " + bl : ""); | O aniversário é opcional e já não tem ano. |
| `app/home/index.html` | document.getElementById("setGenderM").querySelector("input").checked = acc.gender === "M"; document.getElementById("setGenderF").querySelector("input").checked = acc.gender === "F"; document.getElementById("setGenderM").classList.toggle("picked", acc.gender === "M"); document.getElementById("setGenderF").classList.toggle("picked", acc.gender === "F"); | var bp = window.InovaAuth.birthParts(acc.birth); document.getElementById("setBirthDay").value = bp.d; document.getElementById("setBirthMonth").value = bp.m; | Configurações: aniversário em vez de sexo. |
| `app/home/index.html` | /* Foto de perfil / personagem e sexo no registo */ var sPhoto = null, sChar = null; function updateAvatarPreview() { var checked = document.querySelector('input[name="sGender"]:checked'); var gender = checked ? checked.value : ""; document.getElementById("sAvatarPreview").src = sPhoto \|\| (sChar ? ((window.INOVA_PREFIX \|\| "") + sChar) : window.InovaAuth.defaultAvatar(gender, document.getElementById("sName").valu… | /* Foto de perfil / personagem no registo */ var sPhoto = null, sChar = null; function updateAvatarPreview() { document.getElementById("sAvatarPreview").src = sPhoto \|\| (sChar ? ((window.INOVA_PREFIX \|\| "") + sChar) : window.InovaAuth.defaultAvatar("", document.getElementById("sName").value)); } document.getElementById("sName").addEventListener("input", function () { if (!sPhoto && !sChar) updateAvatarPreview();… | Sem sexo: o avatar por omissão usa a inicial do nome. |
| `app/home/index.html` | var genderChecked = document.querySelector('input[name="sGender"]:checked'); var sb = e.target.querySelector('button[type=submit]'); sb.disabled = true; window.InovaAuth.register({ name: document.getElementById("sName").value, phone: document.getElementById("sPhone").value, email: document.getElementById("sEmail").value, birth: document.getElementById("sBirth").value, gender: genderChecked ? genderChecked.value : nu… | var sb = e.target.querySelector('button[type=submit]'); var bd = document.getElementById("sBirthDay").value, bm = document.getElementById("sBirthMonth").value; if ((bd && !bm) \|\| (!bd && bm)) { msg(document.getElementById("signupMsg"), "Escolha o dia e o mês do aniversário, ou deixe os dois em branco."); return; } sb.disabled = true; window.InovaAuth.register({ name: document.getElementById("sName").value, phone: … | O registo já não envia o sexo; o aniversário é opcional (dia e mês). |
| `app/home/index.html` | if (confirm("Apagar a conta? Selos e prémios serão perdidos definitivamente.")) { window.InovaAuth.removeCurrent(); } | if (confirm("Apagar a conta? Os selos, os prémios e as suas publicações e comentários serão apagados definitivamente.")) { window.InovaAuth.removeCurrent().then(function (r) { if (r && r.error) msg(document.getElementById("setMsg"), r.error); }); } | Apagar a conta apaga também as publicações e comentários (art. 17.º RGPD) e mostra o erro se não for possível. |
| `app/home/index.html` | document.querySelectorAll('input[name="setGender"]').forEach(function (r) { r.addEventListener("change", function () { document.getElementById("setGenderM").classList.toggle("picked", r.value === "M" && r.checked); document.getElementById("setGenderF").classList.toggle("picked", r.value === "F" && r.checked); var a0 = window.InovaAuth.current(); if ((setPhoto === undefined \|\| setPhoto === null) && !setChar && (!a0… | **(removido)** | Removido o tratamento do campo «Sexo» das configurações. |
| `app/home/index.html` | var g = document.querySelector('input[name="setGender"]:checked'); document.getElementById("setAvatar").src = window.InovaAuth.defaultAvatar(g ? g.value : "", ""); | document.getElementById("setAvatar").src = window.InovaAuth.defaultAvatar("", document.getElementById("setName").value); | Sem sexo. |
| `app/home/index.html` | var g = document.querySelector('input[name="setGender"]:checked'); var changes = { name: document.getElementById("setName").value.trim(), phone: document.getElementById("setPhone").value.trim(), gender: g ? g.value : "" }; | var bd = document.getElementById("setBirthDay").value, bm = document.getElementById("setBirthMonth").value; if ((bd && !bm) \|\| (!bd && bm)) { msg(sm, "Escolha o dia e o mês do aniversário, ou deixe os dois em branco."); return; } var changes = { name: document.getElementById("setName").value.trim(), phone: document.getElementById("setPhone").value.trim(), birth: window.InovaAuth.birthFrom(bd, bm) }; | Guardar configurações sem sexo; com aniversário opcional. |
| `agendar/index.html` | (nada) | **(removido)** | Minimização: evitar que se escrevam dados de saúde (categoria especial, art. 9.º RGPD) num campo livre sem as garantias adequadas. |

## Ponto 5 — avisos junto dos formulários

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `conta/index.html` | id="forgotLink" class="link-gold" style="font-size:.85rem;color:var(--gold-text)">Esqueci a minha senha | id="forgotLink" class="link-gold" style="font-size:.85rem;color:var(--gold-text)">Esqueci a minha palavra-passe | Aviso de proteção de dados junto do formulário de início de sessão (art. 13.º RGPD); «senha» → «palavra-passe». |
| `conta/index.html` | 🔒 A sua senha é protegida com criptografia (SHA-256 + salt) e os dados ficam guardados apenas neste dispositivo — nunca são enviados para terceiros. Ao criar conta, aceita a nossa Política de Privacidade e os Termos . | **(removido)** | REMOVIDO o texto «A sua senha é protegida com criptografia (SHA-256 + salt) e os dados ficam guardados apenas neste dispositivo — nunca são enviados para terceiros»: FALSO (os dados vão para a base de dados Firebase/Google e a palavra-passe é tratada pelo Firebase Authentication). Substituído pelo aviso do art. 13.º RGPD. |
| `app/home/index.html` | ✨ Confirmar marcação | ✨ Confirmar marcação | Aviso de proteção de dados junto do botão da marcação (art. 13.º RGPD). |
| `app/home/index.html` | Esqueci a minha senha | Esqueci a minha palavra-passe | Aviso de proteção de dados junto do formulário de início de sessão; «senha» → «palavra-passe». |
| `app/home/index.html` | 🔒 Senha protegida com criptografia (SHA-256 + salt), guardada só neste dispositivo. Ao criar conta, aceita a nossa Política de Privacidade e os Termos . | **(removido)** | REMOVIDO «Senha protegida com criptografia (SHA-256 + salt), guardada só neste dispositivo»: FALSO (a palavra-passe é tratada pelo Firebase Authentication e os dados da conta vão para a base de dados Firebase). Substituído pelo aviso do art. 13.º RGPD. |
| `app/home/index.html` | Publicar | Publicar | Aviso antes de publicar: visibilidade, fotografias de terceiros e dados de saúde. |
| `agendar/index.html` | A sua marcação fica registada diretamente para o estúdio. Confirmamos o seu horário em breve. Ao confirmar, aceita a nossa Política de Privacidade e os Termos . | **(removido)** | Substituídas duas linhas pequenas e de baixo contraste («A sua marcação fica registada diretamente para o estúdio…» e «Ao confirmar, aceita a nossa Política de Privacidade e os Termos») pelo aviso do art. 13.º RGPD, legível e junto do botão. A 1.ª frase mantém-se no texto de abertura da página; «aceita» a Política não faz sentido (é informação, não um contr… |

## Ponto 19 — serviços indisponíveis apresentados como disponíveis

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `processos/depilacao-laser/index.html` | (sem aviso: a página apresentava o serviço como se estivesse disponível) | Aviso «Temporariamente indisponível» no topo da página | Serviço que a Thayana ainda não faz estava apresentado como disponível (publicidade enganosa por omissão). |
| `processos/extensao-pestanas/index.html` | (sem aviso: a página apresentava o serviço como se estivesse disponível) | Aviso «Temporariamente indisponível» no topo da página | Serviço que a Thayana ainda não faz estava apresentado como disponível (publicidade enganosa por omissão). |
| `processos/labios/index.html` | (sem aviso: a página apresentava o serviço como se estivesse disponível) | Aviso «Temporariamente indisponível» no topo da página | Serviço que a Thayana ainda não faz estava apresentado como disponível (publicidade enganosa por omissão). |
| `processos/micropigmentacao-sobrancelhas/index.html` | (sem aviso: a página apresentava o serviço como se estivesse disponível) | Aviso «Temporariamente indisponível» no topo da página | Serviço que a Thayana ainda não faz estava apresentado como disponível (publicidade enganosa por omissão). |

## Ponto 20 — identificação do prestador

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `app/home/index.html` | 💬 WhatsApp | 💬 WhatsApp Prestador de serviços Inova Beauty — A PREENCHER NIF A PREENCHER Morada A PREENCHER Email A PREENCHER Telemóvel +351 919 277 205 Política de Privacidade · Termos e Condições · Política de Cookies · Cancelamento e reembolso · Livro de Reclamações | Identificação do prestador, ligações legais e Livro de Reclamações no ecrã inicial da app (DL 7/2004 art. 10.º; DL 156/2005). |
| `app/home/index.html` | Apagar conta | Apagar conta Prestador de serviços Inova Beauty — A PREENCHER NIF A PREENCHER Morada A PREENCHER Email A PREENCHER Telemóvel +351 919 277 205 Política de Privacidade · Termos e Condições · Política de Cookies · Cancelamento e reembolso · Livro de Reclamações | O mesmo bloco legal no ecrã «A minha conta» da app. |
| `404.html` | a{color:#7a5a2b} | a{color:#7a5a2b} .a-preencher{background:#ffe58a;color:#211a14;font-weight:600;padding:0 .3em;border-radius:4px} footer{margin-top:2rem;font-size:.85rem;line-height:1.65;color:#4a4038} footer p{margin:0 0 .4rem} | Estilo do rodapé legal da página 404. |
| `404.html` | (nada) | Prestador de serviços: Inova Beauty — A PREENCHER · NIF: A PREENCHER / Morada: A PREENCHER · Email: A PREENCHER · Telemóvel: +351 919 277 205 Política de Privacidade · Termos e Condições · Política de Cookies · Cancelamento e reembolso · Livro de Reclamações | Identificação do prestador e ligações legais também na página 404 (DL 7/2004 art. 10.º; DL 156/2005). |

## Ponto 23 / português de Portugal

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `conta/index.html` | Senha* (mín. 6 caracteres) | Palavra-passe* (mín. 6 caracteres) | Português de Portugal. |
| `conta/index.html` | Confirmar senha* | Confirmar palavra-passe* | Português de Portugal. |
| `conta/index.html` | Alterar senha (por email) | Alterar palavra-passe (por email) | Português de Portugal; aviso de proteção de dados junto do formulário. |
| `conta/index.html` | msg(lm, "✅ Se existir uma conta com " + email + ", enviámos um link para criar uma nova senha. Veja também o spam (lixo eletrónico).", true); | msg(lm, "✅ Se existir uma conta com " + email + ", enviámos um link para criar uma nova palavra-passe. Veja também o spam (lixo eletrónico).", true); | Português de Portugal. |
| `conta/index.html` | "✅ Enviámos um link para alterar a senha para " + acc.email + "." | "✅ Enviámos um link para alterar a palavra-passe para " + acc.email + "." | Português de Portugal. |
| `app/home/index.html` | Cupom (opcional) | Cupão (opcional) | Português de Portugal. |
| `app/home/index.html` | Senha | Palavra-passe | Português de Portugal. |
| `app/home/index.html` | Senha* (mín. 6) | Palavra-passe* (mín. 6) | Português de Portugal. |
| `app/home/index.html` | Confirmar senha* | Confirmar palavra-passe* | Português de Portugal. |
| `app/home/index.html` | Alterar senha | Alterar palavra-passe | Português de Portugal; aviso de proteção de dados. |
| `app/home/index.html` | lm.textContent = "✅ Se existir uma conta com " + email + ", enviámos um link para criar uma nova senha. Veja também o spam (lixo eletrónico)."; | lm.textContent = "✅ Se existir uma conta com " + email + ", enviámos um link para criar uma nova palavra-passe. Veja também o spam (lixo eletrónico)."; | Português de Portugal. |
| `app/home/index.html` | sm.textContent = "✅ Link para alterar senha enviado para " + acc.email + "."; | sm.textContent = "✅ Link para alterar a palavra-passe enviado para " + acc.email + "."; | Português de Portugal. |
| `agendar/index.html` | Cupom de desconto (opcional) | Cupão de desconto (opcional) | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `agendar/index.html` | if (r.expired) { couponHint.textContent = "⚠️ Este cupom já expirou."; return; } | if (r.expired) { couponHint.textContent = "⚠️ Este cupão já expirou."; return; } | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `agendar/index.html` | couponHint.textContent = "✅ Cupom válido: " + r.pct + "% de desconto" + | couponHint.textContent = "✅ Cupão válido: " + r.pct + "% de desconto" + | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `app/home/index.html` | hint.textContent = !r.valid ? "⚠️ " + r.reason : (r.expired ? "⚠️ Cupom expirado." : "✅ Válido: " + r.pct + "% de desconto."); | hint.textContent = !r.valid ? "⚠️ " + r.reason : (r.expired ? "⚠️ Cupão expirado." : "✅ Válido: " + r.pct + "% de desconto."); | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `app/index.html` | (nada) | **(removido)** | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `app/index.html` | Cupom de aniversário — 10% automático no seu mês | Cupão de aniversário — 10% automático no seu mês | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `conta/index.html` | (nada) | **(removido)** | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `index.html` | Crie a sua conta gratuita e receba automaticamente um cupom de 10% na semana do seu aniversário. É o nosso mimo para si. | Crie a sua conta gratuita e receba automaticamente um cupão de 10% na semana do seu aniversário. É o nosso mimo para si. | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | (nada) | **(removido)** | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Marcações das clientes, geração e validação de cupons e selos. | Marcações das clientes, geração e validação de cupões e selos. | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | 🎟️ Gerar cupom | 🎟️ Gerar cupão | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | ✅ Validar cupom | ✅ Validar cupão | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Valores calculados pelo preçário (com descontos de cupom aplicados). Serviços "sob consulta" são contados à parte, sem somar. | Valores calculados pelo preçário (com descontos de cupão aplicados). Serviços "sob consulta" são contados à parte, sem somar. | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Gerar novo cupom | Gerar novo cupão | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Gerar cupom | Gerar cupão | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Validar cupom da cliente | Validar cupão da cliente | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Código do cupom | Código do cupão | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Um cupom marcado como usado nunca mais valida — garante a utilização única. | Um cupão marcado como usado nunca mais valida — garante a utilização única. | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Cupons gerados | Cupões gerados | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | Cupons usados | Cupões usados | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | ⚠️ O histórico de cupons usados/gerados fica guardado neste dispositivo. As marcações ficam na base de dados (nuvem) e aparecem em qualquer dispositivo onde faça login. | ⚠️ O histórico de cupões usados/gerados fica guardado neste dispositivo. As marcações ficam na base de dados (nuvem) e aparecem em qualquer dispositivo onde faça login. | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | rows += ' Desconto cupom (' + r.pct + '%) −' + eur(desc) + ' '; | rows += ' Desconto cupão (' + r.pct + '%) −' + eur(desc) + ' '; | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | note = ' ⚠️ Cupom expirado — não aplicar desconto. '; | note = ' ⚠️ Cupão expirado — não aplicar desconto. '; | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | note = ' ⚠️ Cupom inválido — cobrar o valor normal. '; | note = ' ⚠️ Cupão inválido — cobrar o valor normal. '; | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | /* ---- cupons ---- */ | /* ---- cupões ---- */ | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | ' ' + (r.type === "aniversario" ? "🎂 Cupom de aniversário" : "🎟️ Cupom de desconto") + ' ' + | ' ' + (r.type === "aniversario" ? "🎂 Cupão de aniversário" : "🎟️ Cupão de desconto") + ' ' + | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | if (r.expired) { msg.className = "form-msg err"; msg.textContent = "❌ Cupom expirado."; return; } | if (r.expired) { msg.className = "form-msg err"; msg.textContent = "❌ Cupão expirado."; return; } | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | if (r.used) { msg.className = "form-msg err"; msg.textContent = "❌ Este cupom JÁ FOI UTILIZADO."; return; } | if (r.used) { msg.className = "form-msg err"; msg.textContent = "❌ Este cupão JÁ FOI UTILIZADO."; return; } | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | msg.textContent = "✅ Cupom VÁLIDO: " + r.pct + "% de desconto" + (r.type === "aniversario" ? " (aniversário)" : "") + "."; | msg.textContent = "✅ Cupão VÁLIDO: " + r.pct + "% de desconto" + (r.type === "aniversario" ? " (aniversário)" : "") + "."; | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | msg.className = "form-msg ok"; msg.textContent = "✅ Cupom aplicado e marcado como usado."; | msg.className = "form-msg ok"; msg.textContent = "✅ Cupão aplicado e marcado como usado."; | Português de Portugal: «cupom» → «cupão», «cupons» → «cupões». |
| `painel/index.html` | ' 🎟️ Cupom: ' + m.cupom | ' 🎟️ Cupão: ' + m.cupom | Português de Portugal. |
| `painel/index.html` | Entre com o email e senha de administradora. | Entre com o email e a palavra-passe de administradora. | Português de Portugal. |
| `painel/index.html` | Senha | Palavra-passe | Português de Portugal. |
| `painel/index.html` | >Esqueci a senha | >Esqueci a palavra-passe | Português de Portugal. |
| `painel/index.html` | enviámos um link para criar uma nova senha. | enviámos um link para criar uma nova palavra-passe. | Português de Portugal. |
| `painel/index.html` | 💰 Faturamento | 💰 Faturação | Português de Portugal (faturamento → faturação). |
| `painel/index.html` | e aparecem em qualquer dispositivo onde faça login. | e aparecem em qualquer dispositivo onde inicie sessão. | Português de Portugal. |
| `contato/index.html` | Contato — Inova Beauty | Contacto — Inova Beauty | Português de Portugal: «Contato» → «Contacto». |
| `contato/index.html` | (nada) | **(removido)** | Português de Portugal. |
| `contato/index.html` | Contato | Contacto | Português de Portugal. |
| `app/index.html` | Conta com login e senha — registo também pela app | Conta com início de sessão e palavra-passe — registo também pela app | Português de Portugal. |

## Ponto 14 — títulos, rótulos, nomes

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `app/home/index.html` | Olá! 👋 | Olá! 👋 | O ecrã inicial da app não tinha título de nível 1 (WCAG 1.3.1 / 2.4.6). |

## Ponto 13 — «saltar para o conteúdo»

| Ficheiro | Antes | Depois | Porquê |
|---|---|---|---|
| `app/home/index.html` | (nada) | Saltar para o conteúdo | Ligação «Saltar para o conteúdo» como primeiro elemento focável da app (WCAG 2.4.1). |
| `app/home/index.html` | document.querySelectorAll("[data-goto]").forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-goto")); }); }); | document.querySelectorAll("[data-goto]").forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-goto")); }); }); // «Saltar para o conteúdo»: leva o foco ao ecrã que está aberto document.getElementById("skipLink").addEventListener("click", function (e) { e.preventDefault(); var m = document.querySelector(".app-screen.active"); if (m) { m.setAttribute("tabindex", "-1"); m.focus(); … | Comportamento da ligação «Saltar para o conteúdo» na app. |
| `painel/index.html` | (nada) | Saltar para o conteúdo | Ligação «Saltar para o conteúdo» também no painel (WCAG 2.4.1). |

## Código (resumo, sem o código)

| Ficheiro | Ponto | O que mudou e porquê |
|---|---|---|
| `coupon.js` | 6 | O cupão de aniversário só precisa do dia e do mês (RGPD art. 5.º, n.º 1, al. c): minimização). |
| `coupon.js` | 6 | Aceitar «MM-DD» (novo) e «AAAA-MM-DD» (antigo). |
| `coupon.js` | 23 | Português de Portugal (comentário). |
| `auth.js` | 23 | Português de Portugal (comentário). |
| `auth.js` | 6 | Avatar sem depender do sexo (campo «Sexo» removido do site). |
| `auth.js` | 23 | Português de Portugal (mensagem ao utilizador). |
| `auth.js` | 6 | Deixam de ser obrigatórios a data de nascimento completa e o sexo; o aniversário passa a ser opcional e só dia/mês. |
| `auth.js` | 6 | Conta nova (online): já não guarda o sexo nem o ano de nascimento. |
| `auth.js` | 6 | Conta nova (modo local): já não guarda o sexo nem o ano de nascimento. |
| `auth.js` | 6 | Contas antigas: apaga o sexo e o ano de nascimento quando a pessoa abre a sessão. |
| `auth.js` | 6 | Função que limpa o sexo e o ano de nascimento das contas antigas. |
| `auth.js` | 6 | Contas antigas (modo local): apaga o sexo e o ano de nascimento. |
| `auth.js` | 6 | Atualizar o perfil já não aceita o sexo; o aniversário guarda-se só como dia e mês. |
| `auth.js` | 6 | Apagar a conta passa a apagar também as publicações, comentários e «gostos» da pessoa (o texto da Política de Privacidade promete-o) e deixa de poder falhar a meio. |
| `auth.js` | 6 | Marcação: deixa de guardar o email da conta (o estúdio contacta por telemóvel/WhatsApp; a ligação à conta faz-se por clienteUid). |
| `auth.js` | 6 | Marcação manual: já não cria o campo email vazio. |
| `auth.js` | 6 | Auxiliares para mostrar/editar o aniversário só com dia e mês. |
| `auth.js` | 6 | Expor os auxiliares do aniversário. |
| `styles.css` | 6 | Removido o estilo do seletor de sexo; acrescentado o do aniversário (dia/mês). |
| `main.js` | 5 | O chat é um formulário de texto: aviso junto do campo a dizer o que acontece ao que se escreve (nada é guardado nem enviado; art. 13.º RGPD / transparência). |
| `styles.css` | 5 | Estilo do aviso do chat. |
| `(várias páginas)` | 14 | WCAG 2.5.3, 1.3.1, 2.4.6; axe: label-content-name-mismatch, heading-order, region. |
| `styles.css` | 11 | O estado «indisponível» escurecia tudo com opacity (.55/.68), o que baixava o contraste do texto abaixo de 4,5:1 (3,11 a 4,07). Agora o texto mantém a cor e o estado vê-se pela imagem a cinzento, pela borda tracejada e pela etiqueta. |
| `styles.css` | 14 | O título da app passou de a ; o h1 tinha cor escura sobre fundo escuro (contraste 1:1). Passa a herdar a cor clara. |

## Ficheiros novos e substituídos

- **Novos:** `privacidade/`, `termos/`, `cookies/`, `cancelamento/` (gerados por `scripts/legal/build_all.py`), `idiomas/legal-en.js`, `idiomas/legal-es.js`, `CREDITOS.md`, `docs/AUDITORIA_JURIDICA.md`, `docs/ACESSIBILIDADE.md`, `scripts/legal/*`, `scripts/preencher_dados_legais.py`, `fonts/` (letra alojada no site), `vendor/firebase/` (SDK alojado no site).
- **Substituídos por completo:** `privacidade/index.html` e `termos/index.html` (texto antigo guardado em `docs/auditoria-juridica/`), `img/og-image.jpg` (a anterior anunciava Micropigmentação e Laser; está no histórico do Git, commit `03d2253`).
- **Apagados:** nenhum ficheiro do repositório foi apagado.

