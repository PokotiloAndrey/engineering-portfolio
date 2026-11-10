/**
 * NEW FILE: src/playbook/content.pt-BR.ts
 * -----------------------------------------------------------------------
 * Portuguese (Brazil) translation of the playbook content. Keys
 * (block.key, topic.key) are IDENTICAL to content.en.ts — only the text
 * is translated.
 * -----------------------------------------------------------------------
 */
import type {
    PlaybookBlock,
    PlaybookQuickAccessItem,
  } from "@/types/playbook";
  
  export const playbookBlocks: PlaybookBlock[] = [
    {
      key: "why-tiktok-bans-happen",
      position: 1,
      title: "Por que acontecem os bans do TikTok",
      description:
        "Entenda a restrição que você recebeu antes de decidir o que fazer a seguir.",
      topics: [
        {
          key: "types-of-restrictions",
          title: "Tipos de restrições",
          quickAnswer:
            "O curso separa várias situações: um aviso, uma Live sendo encerrada, o acesso à Live sendo restringido, uma suspensão ou ban de conta, e uma queda repentina de visibilidade.",
          steps: [
            "Verifique se o TikTok mostrou um aviso ou notificação de violação.",
            "Verifique se a Live foi interrompida.",
            "Verifique se o acesso à Live ainda está disponível.",
            "Verifique se a restrição afeta toda a conta.",
            "Salve a notificação para poder identificar o motivo e a duração.",
          ],
          scenarios: [
            "Você recebe um aviso, mas a Live continua disponível.",
            "A Live atual é encerrada.",
            "O acesso à Live fica indisponível por um período.",
            "A conta é suspensa ou banida.",
            "O alcance cai de repente sem uma notificação clara.",
          ],
          importantDetails: [
            "Não trate todo problema como o mesmo tipo de restrição.",
            "O primeiro objetivo é identificar o que o TikTok realmente mudou na conta.",
          ],
        },
        {
          key: "warning-vs-live-restriction-vs-account-ban",
          title: "Aviso vs. restrição de Live vs. ban de conta",
          quickAnswer:
            "O curso trata um aviso, a perda de acesso à Live e uma suspensão ou ban no nível da conta como resultados diferentes. Verifique a notificação e os recursos que continuam disponíveis antes de agir.",
          steps: [
            "Abra a notificação de violação ou restrição.",
            "Verifique se a Live atual terminou.",
            "Verifique se você ainda pode iniciar outra Live.",
            "Verifique se o restante da conta continua usável.",
            "Registre o motivo informado e a duração da restrição.",
          ],
          importantDetails: [
            "O curso não fornece uma ação de recuperação universal para cada tipo de restrição.",
            "Use o aviso real e o status atual da conta como ponto de partida.",
          ],
        },
        {
          key: "visibility-restrictions",
          title: "Restrições de visibilidade",
          quickAnswer:
            "Uma queda repentina de visibilidade ou alcance é tratada como um sinal separado a ser investigado, especialmente quando não há uma notificação clara de ban de conta.",
          steps: [
            "Verifique se há algum novo aviso ou notificação de violação.",
            "Verifique se o acesso à Live ainda está disponível.",
            "Registre o que mudou e quando aconteceu.",
            "Revise a configuração usada durante a Live afetada antes da próxima transmissão.",
          ],
          importantDetails: [
            "O material fornecido não define um teste de diagnóstico garantido para alcance reduzido.",
            "Documente o incidente em vez de assumir a causa.",
          ],
        },
        {
          key: "identify-the-reason",
          title: "Como identificar o motivo",
          quickAnswer:
            "Comece pela própria notificação do TikTok: capture-a, identifique o motivo informado, verifique a duração da restrição e registre o que estava acontecendo durante a Live.",
          steps: [
            "Abra a notificação do TikTok.",
            "Faça uma captura de tela.",
            "Identifique o motivo da violação mostrado no aviso.",
            "Verifique a duração da restrição ou a data de expiração, quando exibida.",
            "Registre o que aconteceu durante a Live para que o incidente possa ser revisado depois.",
          ],
          scenarios: [
            "A notificação dá um motivo e uma duração claros.",
            "A Live parou, mas você ainda precisa verificar se o acesso à Live continua disponível.",
            "O alcance caiu sem uma notificação clara, então o incidente precisa ser documentado para revisão.",
          ],
        },
      ],
    },
    {
      key: "avoid-tiktok-bans-during-lives",
      position: 2,
      title: "Como evitar bans do TikTok durante as Lives",
      description:
        "Prepare a tela, o discurso e a estrutura da Live antes de começar a transmitir.",
      topics: [
        {
          key: "what-you-show-on-screen",
          title: "O que você mostra na tela",
          quickAnswer:
            "Mantenha a Live focada no gráfico e na área de trading. O curso gravado recomenda evitar branding desnecessário da corretora, elementos desnecessários da interface da plataforma e texto desorganizado na tela.",
          steps: [
            "Prepare o gráfico de trading e o terminal antes da Live.",
            "Revise quais saldo, valores de operações, resultados de trading, branding da corretora, Notes e links estão visíveis.",
            "Remova elementos desnecessários da interface da plataforma da área visível.",
            "Mantenha a tela visualmente ativa enquanto explica o gráfico, em vez de deixá-la totalmente estática por longos períodos.",
          ],
          scenarios: [
            "Um layout limpo e focado no gráfico, onde a explicação continua sendo o conteúdo visual principal.",
            "Uma visão do terminal desorganizada que expõe elementos desnecessários da interface e deveria ser limpa antes de ir ao vivo.",
          ],
          importantDetails: [
            "O material do palestrante recomenda especificamente focar principalmente no gráfico / área de trading.",
            "Revise saldo da conta, valores de operações, resultados de trading, nome/logo da corretora, Notes e links como parte da preparação da tela.",
          ],
        },
        {
          key: "what-you-say-during-a-live",
          title: "O que você diz durante uma Live",
          quickAnswer:
            "Apresente a Live como conteúdo educativo: explique o que você vê e por quê. O curso também destaca menções à corretora/plataforma, afirmações sobre dinheiro e lucro, Telegram e perguntas de registro como discurso que deve ser preparado com antecedência.",
          steps: [
            "Prepare como você vai descrever a configuração e os resultados de trading.",
            "Evite frases que garantam lucro.",
            "Prepare respostas para perguntas sobre a corretora e o registro em vez de improvisar sob pressão.",
            "Use a configuração aprovada do Notes para informações de plataformas externas, em vez de dizer repetidamente aos viewers para saírem do TikTok e irem para o Telegram.",
          ],
          scenarios: [
            "Em vez de um comando simples como 'compre agora', explique a lógica do gráfico por trás da operação.",
            "Quando um viewer pergunta como começar, explique o próximo passo somente depois que houver contexto e interesse genuíno.",
          ],
          importantDetails: [
            "O curso distingue a explicação educativa de comandos no estilo de sinal sem contexto.",
            "Como falar sobre dinheiro, lucros, Telegram e registro faz parte do plano de comunicação antes da Live.",
          ],
        },
        {
          key: "how-you-run-the-live",
          title: "Como você conduz a Live",
          quickAnswer:
            "Conduza uma Live ativa e educativa: explique o gráfico, interaja com os viewers, mostre o fluxo real do trading e mantenha a apresentação em movimento em vez de deixar uma tela estática e repetitiva.",
          steps: [
            "Abra com uma introdução curta e interação com os viewers.",
            "Avance para explicações educativas do gráfico.",
            "Explique a lógica antes de uma operação ao vivo em vez de entrar em silêncio.",
            "Reaja com calma tanto às operações ganhadoras quanto às perdedoras.",
            "Continue fazendo perguntas aos viewers para manter a Live interativa.",
          ],
          scenarios: [
            "Explique um nível de suporte ou um padrão e pergunte aos viewers se conseguem ver.",
            "Se uma operação perder, explique que perdas fazem parte do trading e continue o processo com calma.",
          ],
          importantDetails: [
            "A lição gravada usa uma estrutura de Live em quatro partes: abertura, conteúdo educativo, operação ao vivo, encerramento.",
            "O material enfatiza a consistência das transmissões e a interação genuína com os viewers.",
          ],
        },
        {
          key: "pre-live-safety-checklist",
          title: "Checklist de segurança antes da Live",
          quickAnswer:
            "Complete uma verificação final da conta do TikTok, da tela de trading visível, do Notes, da configuração técnica e do terminal antes de apertar Go Live.",
          steps: [
            "Verifique o status da conta do TikTok e o acesso à Live.",
            "Prepare a tela de trading e o terminal.",
            "Revise saldo visível, resultados de trading, branding da corretora, Notes, links e outros textos na tela.",
            "Verifique áudio, internet, bateria e equipamento.",
            "Confirme que o terminal já está configurado antes de a Live começar.",
            "Faça a verificação final de preparação e só então inicie a Live.",
          ],
          importantDetails: [
            "Uma lição gravada recomenda pelo menos 80% de bateria ou conectar o carregador antes da transmissão.",
            "O curso usa uma configuração de dois dispositivos: o terminal de trading em um e o TikTok Live em outro.",
            "A internet deve ser verificada antes da transmissão, não depois de já ter começado.",
          ],
          checklist: {
            title: "Checklist de segurança antes da Live",
            description:
              "O checklist prático finalizado combina a preparação da tela e a verificação técnica final em uma única ferramenta.",
            items: [
              "Status da conta do TikTok verificado",
              "Acesso à Live verificado",
              "Tela de trading e terminal preparados",
              "Saldo e resultados de trading revisados",
              "Branding da corretora e texto na tela revisados",
              "Notes e links revisados",
              "Áudio funcionando",
              "Conexão com a internet verificada",
              "Bateria e equipamento prontos",
              "Terminal de trading configurado",
              "Verificação final de preparação concluída",
            ],
          },
        },
      ],
    },
    {
      key: "what-to-do-if-banned",
      position: 3,
      title: "O que fazer se sua conta do TikTok for banida durante uma Live",
      description:
        "Documente o incidente, siga o caminho de recuperação disponível e volte somente depois que o acesso for restaurado.",
      topics: [
        {
          key: "identify-what-happened",
          title: "Identifique o que aconteceu",
          quickAnswer:
            "Primeiro identifique o resultado exato: aviso, Live encerrada, acesso à Live restringido, suspensão/ban de conta, ou uma queda repentina de visibilidade.",
          steps: [
            "Leia a notificação de restrição.",
            "Verifique se a Live foi encerrada.",
            "Verifique se o acesso à Live continua disponível.",
            "Verifique se toda a conta foi afetada.",
            "Salve o aviso e os detalhes da restrição.",
          ],
        },
        {
          key: "immediate-actions",
          title: "Ações imediatas",
          quickAnswer:
            "Não adivinhe. Abra o aviso, salve evidências, registre o motivo e a duração, e documente o que estava acontecendo durante a Live.",
          steps: [
            "Abra a notificação do TikTok.",
            "Faça uma captura de tela.",
            "Identifique o motivo da violação.",
            "Verifique a duração da restrição.",
            "Registre o que aconteceu durante a Live.",
            "Corrija a configuração antes da próxima Live com base no que você encontrou.",
          ],
          importantDetails: [
            "O material do palestrante recomenda pedir ajuda aos Academy Experts quando necessário.",
          ],
        },
        {
          key: "submit-an-appeal",
          title: "Como enviar um recurso",
          quickAnswer:
            "Quando houver um recurso disponível, comece pela notificação de violação, abra a opção de recurso, envie as informações solicitadas e acompanhe o status do recurso.",
          steps: [
            "Encontre a notificação de violação.",
            "Verifique se há uma opção de recurso disponível.",
            "Abra o fluxo de recurso.",
            "Forneça as informações solicitadas no recurso.",
            "Acompanhe o status do recurso.",
          ],
          sourceNote:
            "O material do curso fornecido não contém um passo a passo detalhado do recurso do TikTok, então esta página não inventa um.",
        },
        {
          key: "while-account-is-restricted",
          title: "Enquanto sua conta está restrita",
          quickAnswer:
            "Verifique quais recursos da conta ainda estão disponíveis, resolva o problema indicado no aviso, mantenha a conexão com sua audiência através da sua comunidade existente, e espere até que a conta tenha permissão para retomar as transmissões.",
          steps: [
            "Verifique quais recursos da conta continuam disponíveis.",
            "Resolva o problema identificado no aviso de restrição.",
            "Mantenha a comunicação com sua audiência através da sua comunidade existente.",
            "Acompanhe o período de restrição e o status da conta.",
            "Prepare a próxima Live somente após revisar o problema que causou a restrição.",
          ],
          importantDetails: [
            "O material do curso diferencia a gestão de contas de burlar intencionalmente uma restrição ativa com outra conta.",
            "Um período de descanso por si só não é apresentado como uma forma garantida de remover uma restrição.",
          ],
        },
        {
          key: "return-to-streaming",
          title: "Como voltar a transmitir",
          quickAnswer:
            "Volte somente depois que o acesso à Live for restaurado. Verifique a conta novamente, complete o checklist de segurança de novo, prepare a próxima transmissão e então retome.",
          steps: [
            "Verifique se o acesso à Live foi restaurado.",
            "Verifique o status atual da conta.",
            "Complete novamente o Checklist de segurança antes da Live.",
            "Prepare a próxima Live com a configuração corrigida.",
            "Retome as transmissões quando permitido.",
            "Relate o incidente aos Academy Experts quando o processo do curso exigir.",
          ],
        },
      ],
    },
    {
      key: "account-rotation-strategy",
      position: 4,
      title: "Estratégia de rotação de contas do TikTok",
      description:
        "Prepare contas principal e reserva para que o problema em uma conta não pare todo o fluxo de trabalho de streaming.",
      topics: [
        {
          key: "why-you-need-account-strategy",
          title: "Por que você precisa de uma estratégia de contas",
          quickAnswer:
            "Depender de uma única conta do TikTok cria um ponto único de falha. O curso recomenda preparar contas reserva e manter a conexão com a audiência através do Telegram para que o streaming possa se recuperar de problemas de conta.",
          importantDetails: [
            "As contas reserva são apresentadas como ferramentas de continuidade, não como uma garantia contra restrições.",
            "O Telegram é parte da estratégia de continuidade porque a conexão com a audiência pode permanecer fora da conta do TikTok afetada.",
          ],
        },
        {
          key: "how-many-accounts",
          title: "Quantas contas você precisa",
          quickAnswer:
            "A estrutura final do curso usa uma Conta Principal, Conta Reserva 1, Conta Reserva 2, e contas adicionais quando necessário.",
          importantDetails: [
            "Os palestrantes gravados descrevem configurações diferentes, variando de uma a três contas reserva.",
            "A fonte diz explicitamente para não combinar silenciosamente essas diferentes recomendações de palestrantes em um método único inventado.",
          ],
          sourceNote:
            "Não há um número único independente de palestrante finalizado no material fornecido, além da estrutura do curso de uma conta principal mais duas contas reserva nomeadas e contas adicionais opcionais.",
        },
        {
          key: "account-roles-and-setup",
          title: "Funções e configuração das contas",
          quickAnswer:
            "Defina qual conta é a Principal e quais são reservas, depois mantenha uma identidade de streamer, nomeação de perfil, links, acesso e segurança consistentes em toda a configuração.",
          steps: [
            "Identifique a Conta Principal.",
            "Identifique a Conta Reserva 1 e a Conta Reserva 2.",
            "Mantenha a identidade de streamer consistente entre as contas.",
            "Revise nomes de perfil, branding e links.",
            "Registre o acesso e os detalhes de segurança das contas.",
          ],
        },
        {
          key: "rotation-and-resting",
          title: "Rotação e descanso",
          quickAnswer:
            "Use rotação e descanso planejados como ferramentas de gestão de contas: acompanhe avisos e restrições, saiba qual conta está ativa, e só volte com uma conta afetada quando o status permitir.",
          steps: [
            "Acompanhe qual conta está ativa atualmente.",
            "Registre avisos e restrições de cada conta.",
            "Registre períodos de descanso quando fizerem parte do método do palestrante.",
            "Verifique o acesso à Live antes de voltar com uma conta ao streaming.",
          ],
          importantDetails: [
            "Os módulos gravados contêm diferentes métodos de rotação/descanso de diferentes palestrantes.",
            "O Playbook preserva essas diferenças em vez de fingir que existe um método universal.",
            "Descansar uma conta não é apresentado como algo que remove automaticamente uma restrição ativa.",
          ],
        },
        {
          key: "account-tracking",
          title: "Acompanhamento de contas",
          quickAnswer:
            "Mantenha um rastreador de contas simples para sempre saber a função, status, acesso à Live, histórico de avisos, data da última Live e próxima ação de cada conta.",
          steps: [
            "Registre o nome da conta e sua função.",
            "Registre se a conta está ativa, restrita ou inativa.",
            "Registre se o acesso à Live está disponível.",
            "Registre avisos e restrições anteriores.",
            "Registre a data da última Live.",
            "Registre a próxima atividade planejada ou ação permitida.",
          ],
        },
        {
          key: "practical-examples",
          title: "Exemplos práticos",
          quickAnswer:
            "Use a estratégia de contas para lidar com quatro situações recorrentes: um dia normal de streaming, um aviso, a perda temporária de acesso à Live, e o retorno às operações normais.",
          scenarios: [
            "Dia normal: identifique a conta ativa, confirme o acesso à Live, e registre a última/próxima atividade.",
            "Aviso: documente o aviso e atualize o status dessa conta antes de planejar a próxima Live.",
            "Perda temporária de acesso à Live: mantenha o status da conta afetada visível no rastreador e siga o processo de restrição/recuperação.",
            "Retorno às operações normais: confirme que o acesso foi restaurado e complete novamente as verificações antes da Live.",
          ],
        },
      ],
    },
    {
      key: "where-to-buy-tiktok-accounts",
      position: 5,
      title: "Onde comprar contas do TikTok",
      description:
        "Compare criar e aquecer sua própria conta com comprar uma conta existente, e depois inspecione a conta antes de comprar.",
      topics: [
        {
          key: "create-and-warm-up-vs-buy",
          title: "Criar e aquecer vs. comprar",
          quickAnswer:
            "O curso apresenta dois caminhos: criar e aquecer sua própria conta do TikTok, ou comprar uma conta existente. Criar leva mais tempo; comprar pode ser mais rápido, mas exige verificações cuidadosas do histórico e do acesso da conta.",
          scenarios: [
            "Criar e aquecer: mais tempo de preparação, mas você controla o histórico da conta e a identidade de streamer desde o início.",
            "Comprar existente: acesso potencialmente mais rápido a uma conta estabelecida, mas o histórico, violações anteriores, o vendedor e o acesso de recuperação precisam ser verificados.",
          ],
        },
        {
          key: "buying-pros-and-cons",
          title: "Vantagens e desvantagens",
          quickAnswer:
            "Criar dá mais controle sobre o histórico da conta, mas leva tempo. Comprar pode dar acesso mais rápido a uma conta estabelecida, mas vem com riscos de histórico, vendedor, propriedade e recuperação que precisam ser verificados.",
          importantDetails: [
            "Criar e aquecer: tempo de preparação, controle sobre o histórico, identidade de streamer, acesso à Live, custos e limitações.",
            "Comprar existente: velocidade, acesso à Live já existente, idade/histórico da conta, violações anteriores, riscos de vendedor e recuperação.",
          ],
        },
        {
          key: "where-to-find-accounts",
          title: "Onde encontrar contas",
          quickAnswer:
            "O curso menciona marketplaces de contas do TikTok, vendedores citados pelos palestrantes, e recomendações de outros streamers. O material fornecido não contém um nome de marketplace finalizado para publicar aqui.",
          steps: [
            "Comece por um marketplace ou fonte de vendedor usada no material do curso.",
            "Verifique a credibilidade do vendedor antes de avaliar a conta em si.",
            "Não pule o checklist de verificação da conta só porque a fonte foi recomendada.",
          ],
          sourceNote:
            "O roteiro gravado contém um espaço reservado para o nome do marketplace, então o Playbook intencionalmente não inventa um.",
        },
        {
          key: "what-to-check-before-buying",
          title: "O que verificar antes de comprar",
          quickAnswer:
            "Antes de comprar, verifique idade, região, seguidores, acesso à Live, histórico da conta, histórico de conteúdo, propriedade/acesso de recuperação e preço.",
          steps: [
            "Verifique quando a conta foi criada.",
            "Verifique se a região corresponde ao público-alvo.",
            "Verifique o número de seguidores e se o acesso à Live está realmente habilitado.",
            "Revise avisos, bans, restrições e histórico de conteúdo anteriores.",
            "Confirme a propriedade e o acesso de recuperação.",
            "Compare o preço com o que realmente está incluído.",
          ],
          importantDetails: [
            "Um palestrante gravado recomenda uma idade de conta de pelo menos 6 meses.",
            "O mesmo palestrante recomenda pelo menos 1.000 seguidores e Live habilitada.",
            "O palestrante descreve contas prontas custando cerca de $3–$10.",
            "Esses números são recomendações do palestrante no material do curso gravado, não uma garantia universal da plataforma.",
          ],
        },
        {
          key: "purchase-walkthrough",
          title: "Passo a passo da compra",
          quickAnswer:
            "Revise o anúncio, verifique os parâmetros principais da conta, identifique sinais de alerta e decida se a conta deve ser aceita ou rejeitada.",
          steps: [
            "Abra o anúncio da conta.",
            "Verifique idade, região, seguidores e acesso à Live.",
            "Revise histórico, restrições e conteúdo anterior.",
            "Verifique a propriedade e o acesso de recuperação.",
            "Identifique qualquer coisa que não corresponda ao anúncio ou ao seu público-alvo.",
            "Decida se vai seguir adiante ou rejeitar a oferta.",
          ],
        },
        {
          key: "buying-checklist",
          title: "Checklist de compra",
          quickAnswer:
            "Use este checklist antes de cada compra para que a decisão se baseie nos parâmetros reais da conta, não apenas na descrição do vendedor.",
          importantDetails: [
            "O pacote final do curso inclui isso como um dos três checklists práticos independentes.",
          ],
          checklist: {
            title: "Checklist de compra de contas do TikTok",
            description:
              "Um checklist prático de verificação de conta para completar antes da compra.",
            items: [
              "Idade da conta verificada",
              "Região verificada em relação ao público-alvo",
              "Número de seguidores verificado",
              "Acesso à Live confirmado",
              "Bans, avisos e restrições anteriores revisados",
              "Atividade da conta e histórico de conteúdo revisados",
              "Credibilidade do vendedor verificada",
              "Propriedade e acesso de recuperação confirmados",
              "Preço revisado",
            ],
            note:
              "Exemplo do palestrante: pelo menos 6 meses de idade, pelo menos 1.000 seguidores, Live habilitada, e cerca de $3–$10 por contas prontas.",
          },
        },
      ],
    },
    {
      key: "tiktok-warm-up-strategy",
      position: 6,
      title: "Estratégia de aquecimento de contas do TikTok",
      description:
        "Prepare uma conta nova ou adquirida antes da primeira Live usando a sequência de aquecimento descrita na lição gravada.",
      topics: [
        {
          key: "what-is-warm-up",
          title: "O que é o aquecimento",
          quickAnswer:
            "O aquecimento é o período de preparação antes da primeira Live. A lição gravada descreve usar a conta normalmente em torno de conteúdo de trading relevante, em vez de começar a transmitir imediatamente.",
          importantDetails: [
            "O palestrante gravado descreve um período de aquecimento de cerca de 1–2 dias.",
            "Esse tempo é apresentado como o método do palestrante, não como uma exigência garantida do TikTok.",
          ],
        },
        {
          key: "account-preparation",
          title: "Preparação da conta",
          quickAnswer:
            "Antes do aquecimento e da primeira Live, complete o perfil, estabeleça a identidade de streamer, proteja a conta e confirme o acesso à Live.",
          steps: [
            "Complete o perfil.",
            "Defina uma identidade de streamer consistente.",
            "Configure a segurança e o acesso da conta.",
            "Verifique se o acesso à Live está disponível.",
          ],
        },
        {
          key: "warm-up-activities",
          title: "Atividades de aquecimento",
          quickAnswer:
            "A lição gravada começa com um comportamento normal de visualização em torno de conteúdo de trading, e depois adiciona engajamento genuíno como curtidas, comentários e follows antes de avançar para atividade de conteúdo regular.",
          steps: [
            "Abra o TikTok e pesquise conteúdo relacionado a trading.",
            "Assista a vídeos de trading relevantes; o exemplo gravado menciona cerca de 20–30 minutos durante o período inicial.",
            "Durante a próxima etapa, curta conteúdo, escreva comentários e siga contas de trading.",
            "Não publique imediatamente durante a etapa inicial de aquecimento descrita pelo palestrante.",
            "Depois, desenvolva atividade normal da conta e conteúdo original conforme a preparação da conta continua.",
          ],
          importantDetails: [
            "O palestrante descreve as primeiras 1–2 horas como atividade de visualização/pesquisa.",
            "As próximas 2–3 horas adicionam curtidas, comentários e follows.",
            "À noite, o palestrante recomenda navegar pelo feed normalmente.",
          ],
        },
        {
          key: "warm-up-timeline",
          title: "Cronograma de aquecimento",
          quickAnswer:
            "O método gravado dura cerca de 1–2 dias. O detalhamento de tempo é mais forte para as horas iniciais; a fonte não fornece um cronograma separado minuto a minuto para o Dia 2.",
          steps: [
            "Primeiras 1–2 horas: abra o app, pesquise sobre trading e assista a conteúdo relacionado a trading.",
            "Dentro desse período de visualização, o palestrante dá um exemplo de assistir vídeos por 20–30 minutos.",
            "Próximas 2–3 horas: curta conteúdo, escreva comentários, siga contas de trading, e ainda não publique.",
            "À noite: navegue pelo feed normalmente.",
            "Continue o período de aquecimento até que a conta esteja pronta para a primeira Live; a lição gravada descreve o período total como cerca de 1–2 dias.",
          ],
          sourceNote:
            "A fonte não dá um cronograma exato e independente para o Dia 2, então o Playbook não inventa um.",
        },
        {
          key: "first-live-readiness",
          title: "Preparação para a primeira Live",
          quickAnswer:
            "Antes da primeira Live, confirme o acesso à Live, verifique o status da conta, revise o perfil e o conteúdo, prepare a transmissão e complete as verificações finais de segurança.",
          steps: [
            "Confirme o acesso à Live.",
            "Verifique o status da conta.",
            "Revise o perfil e o conteúdo.",
            "Prepare a primeira transmissão e a configuração do terminal.",
            "Complete o Checklist de segurança antes da Live.",
          ],
          importantDetails: [
            "A lição de aquecimento gravada usa o feed se alinhando naturalmente com conteúdo de trading como um sinal prático de preparação.",
          ],
        },
        {
          key: "warm-up-plan",
          title: "Plano de aquecimento",
          quickAnswer:
            "Use a sequência de aquecimento de 1–2 dias do palestrante como plano de execução, e termine com uma verificação de preparação para a primeira Live.",
          sourceNote:
            "A fonte dá ações exatas para as horas iniciais, mas não contém um cronograma detalhado separado para o Dia 2.",
          checklist: {
            title: "Plano de aquecimento de contas do TikTok",
            description:
              "A ferramenta prática finalizada transforma o método de aquecimento gravado em um plano cronológico.",
            items: [
              "Perfil completado e acesso da conta protegido",
              "Acesso à Live verificado",
              "Pesquisa inicial de conteúdo de trading concluída",
              "Conteúdo de trading relevante assistido",
              "Curtidas, comentários e follows adicionados durante a próxima etapa de aquecimento",
              "Nenhuma publicação imediata durante a etapa inicial descrita pelo palestrante",
              "Navegação normal do feed concluída",
              "Status da conta verificado novamente antes da primeira Live",
              "Checklist de segurança antes da Live concluído",
            ],
            note:
              "Cronograma do palestrante: cerca de 1–2 dias no total; primeiras 1–2 horas focadas em visualização/pesquisa, seguidas de 2–3 horas de engajamento, depois navegação normal à noite.",
          },
        },
      ],
    },
  ];
  
  export const playbookQuickAccess: PlaybookQuickAccessItem[] = [
    {
      key: "pre-live",
      label: "Antes da Live",
      blockKey: "avoid-tiktok-bans-during-lives",
      topicKey: "pre-live-safety-checklist",
    },
    {
      key: "buying",
      label: "Compra",
      blockKey: "where-to-buy-tiktok-accounts",
      topicKey: "buying-checklist",
    },
    {
      key: "warm-up",
      label: "Aquecimento",
      blockKey: "tiktok-warm-up-strategy",
      topicKey: "warm-up-plan",
    },
  ];
  