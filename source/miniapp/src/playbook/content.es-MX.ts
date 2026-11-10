/**
 * NEW FILE: src/playbook/content.es-MX.ts
 * -----------------------------------------------------------------------
 * Spanish translation of the playbook content. Keys (block.key, topic.key)
 * are IDENTICAL to content.en.ts — only title/description/quickAnswer/
 * steps/scenarios/importantDetails/checklist/sourceNote text is translated.
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
      title: "Por qué ocurren los bans de TikTok",
      description:
        "Entiende la restricción que recibiste antes de decidir qué hacer a continuación.",
      topics: [
        {
          key: "types-of-restrictions",
          title: "Tipos de restricciones",
          quickAnswer:
            "El curso separa varias situaciones: una advertencia, un LIVE que se corta, el acceso a LIVE restringido, una suspensión o ban de cuenta, y una caída repentina de visibilidad.",
          steps: [
            "Revisa si TikTok mostró una advertencia o notificación de infracción.",
            "Revisa si el LIVE se detuvo.",
            "Revisa si el acceso a LIVE todavía está disponible.",
            "Revisa si la restricción afecta a toda la cuenta.",
            "Guarda la notificación para poder identificar el motivo y la duración.",
          ],
          scenarios: [
            "Recibes una advertencia pero el LIVE sigue disponible.",
            "El LIVE actual se corta.",
            "El acceso a LIVE deja de estar disponible por un periodo de tiempo.",
            "La cuenta queda suspendida o banneada.",
            "El alcance cae de repente sin una notificación clara.",
          ],
          importantDetails: [
            "No trates cada problema como el mismo tipo de restricción.",
            "El primer objetivo es identificar qué cambió realmente TikTok en la cuenta.",
          ],
        },
        {
          key: "warning-vs-live-restriction-vs-account-ban",
          title: "Advertencia vs. restricción de LIVE vs. ban de cuenta",
          quickAnswer:
            "El curso trata una advertencia, la pérdida de acceso a LIVE y una suspensión o ban a nivel de cuenta como resultados diferentes. Revisa la notificación y las funciones que siguen disponibles antes de actuar.",
          steps: [
            "Abre la notificación de infracción o restricción.",
            "Revisa si el LIVE actual terminó.",
            "Revisa si todavía puedes iniciar otro LIVE.",
            "Revisa si el resto de la cuenta se puede seguir usando.",
            "Registra el motivo indicado y la duración de la restricción.",
          ],
          importantDetails: [
            "El curso no ofrece una acción de recuperación universal para cada tipo de restricción.",
            "Usa el aviso real y el estado actual de la cuenta como punto de partida.",
          ],
        },
        {
          key: "visibility-restrictions",
          title: "Restricciones de visibilidad",
          quickAnswer:
            "Una caída repentina de visibilidad o alcance se trata como una señal aparte que hay que investigar, sobre todo cuando no hay una notificación clara de ban de cuenta.",
          steps: [
            "Revisa si hay alguna nueva advertencia o notificación de infracción.",
            "Revisa si el acceso a LIVE todavía está disponible.",
            "Registra qué cambió y cuándo ocurrió.",
            "Revisa la configuración usada durante el LIVE afectado antes de la siguiente transmisión.",
          ],
          importantDetails: [
            "El material proporcionado no define una prueba de diagnóstico garantizada para el alcance reducido.",
            "Documenta el incidente en lugar de asumir la causa.",
          ],
        },
        {
          key: "identify-the-reason",
          title: "Cómo identificar el motivo",
          quickAnswer:
            "Empieza con la propia notificación de TikTok: captúrala, identifica el motivo indicado, revisa la duración de la restricción y registra qué estaba pasando durante el LIVE.",
          steps: [
            "Abre la notificación de TikTok.",
            "Toma una captura de pantalla.",
            "Identifica el motivo de infracción que muestra el aviso.",
            "Revisa la duración de la restricción o la fecha de vencimiento cuando se muestre.",
            "Registra qué pasó durante el LIVE para poder revisar el incidente después.",
          ],
          scenarios: [
            "La notificación da un motivo y una duración claros.",
            "El LIVE se detuvo, pero todavía necesitas verificar si el acceso a LIVE sigue disponible.",
            "El alcance cayó sin una notificación clara, así que el incidente debe documentarse para revisión.",
          ],
        },
      ],
    },
    {
      key: "avoid-tiktok-bans-during-lives",
      position: 2,
      title: "Cómo evitar los bans de TikTok durante los Lives",
      description:
        "Prepara la pantalla, el discurso y la estructura del LIVE antes de empezar a transmitir.",
      topics: [
        {
          key: "what-you-show-on-screen",
          title: "Qué muestras en pantalla",
          quickAnswer:
            "Mantén el LIVE enfocado en el gráfico y el área de trading. El curso grabado recomienda evitar branding innecesario del broker, elementos innecesarios de la interfaz de la plataforma y texto desordenado en pantalla.",
          steps: [
            "Prepara el gráfico de trading y el terminal antes del LIVE.",
            "Revisa qué balance, montos de operaciones, resultados de trading, branding del broker, Notes y links están visibles.",
            "Quita los elementos innecesarios de la interfaz de la plataforma del área visible.",
            "Mantén la pantalla visualmente activa mientras explicas el gráfico, en lugar de dejarla completamente estática por periodos largos.",
          ],
          scenarios: [
            "Una vista limpia enfocada en el gráfico donde la explicación sigue siendo el contenido visual principal.",
            "Una vista de terminal desordenada que muestra elementos innecesarios de la interfaz y que debería limpiarse antes de iniciar el LIVE.",
          ],
          importantDetails: [
            "El material del speaker recomienda centrarse principalmente en el gráfico / área de trading.",
            "Revisa el balance de la cuenta, los montos de operaciones, los resultados de trading, el nombre/logo del broker, Notes y links como parte de la preparación de pantalla.",
          ],
        },
        {
          key: "what-you-say-during-a-live",
          title: "Qué dices durante un LIVE",
          quickAnswer:
           "Presenta el LIVE como contenido educativo: explica qué ves y por qué. Debe prepararse con anticipación la forma de hablar sobre el broker o la plataforma, el dinero y las ganancias, Telegram y las preguntas de registro.",
          steps: [
            "Prepara cómo vas a describir el setup y los resultados de trading.",
            "Evita frases que garanticen ganancias.",
            "Prepara respuestas a preguntas sobre el broker y el registro en lugar de improvisar bajo presión.",
            "Usa la configuración aprobada de Notes para la información de plataformas externas, en lugar de decirle repetidamente a los viewers que salgan de TikTok para ir a Telegram.",
          ],
          scenarios: [
            "En lugar de una orden directa como 'compra ahora', explica la lógica del gráfico detrás de la operación.",
            "Cuando un viewer pregunta cómo empezar, explica el siguiente paso solo después de que haya contexto e interés genuino.",
          ],
          importantDetails: [
            "El curso distingue la explicación educativa de las órdenes tipo señal sin contexto.",
            "Cómo hablar de dinero, ganancias, Telegram y registro es parte del plan de comunicación previo al LIVE.",
          ],
        },
        {
          key: "how-you-run-the-live",
          title: "Cómo conduces el LIVE",
          quickAnswer:
            "Realiza un LIVE activo y educativo: explica el gráfico, interactúa con los viewers, muestra el flujo real del trading y mantén la presentación en movimiento en lugar de dejar una pantalla estática y repetitiva.",
          steps: [
            "Abre con una introducción corta e interacción con los viewers.",
            "Pasa a explicaciones educativas del gráfico.",
            "Explica la lógica antes de una operación en vivo en lugar de entrar en silencio.",
            "Reacciona con calma tanto a las operaciones ganadoras como a las perdedoras.",
            "Sigue haciendo preguntas a los viewers para que el LIVE se mantenga interactivo.",
          ],
          scenarios: [
            "Explica un nivel de soporte o un patrón y pregunta a los viewers si pueden verlo.",
            "Si una operación pierde, explica que las pérdidas son parte del trading y continúa el proceso con calma.",
          ],
          importantDetails: [
            "La lección grabada usa una estructura de LIVE de cuatro partes: apertura, contenido educativo, operación en vivo, cierre.",
            "El material enfatiza la constancia en las transmisiones y la interacción genuina con los viewers.",
          ],
        },
        {
          key: "pre-live-safety-checklist",
          title: "Checklist de seguridad antes del LIVE",
          quickAnswer:
            "Completa una última revisión de la cuenta de TikTok, la pantalla de trading visible, Notes, la configuración técnica y el terminal antes de presionar Go LIVE.",
          steps: [
            "Revisa el estado de la cuenta de TikTok y el acceso a LIVE.",
            "Prepara la pantalla de trading y el terminal.",
            "Revisa el balance visible, los resultados de trading, el branding del broker, Notes, links y otros textos en pantalla.",
            "Revisa audio, internet, batería y equipo.",
            "Confirma que el terminal ya está configurado antes de que empiece el LIVE.",
            "Haz la revisión final de preparación y solo entonces inicia el LIVE.",
          ],
          importantDetails: [
            "Una lección grabada recomienda tener al menos un 80 % de batería o conectar el cargador antes de la transmisión.",
            "El curso usa una configuración de dos dispositivos: el terminal de trading en uno y TikTok LIVE en otro.",
            "El internet debe revisarse antes de la transmisión, no después de que ya haya empezado.",
          ],
          checklist: {
            title: "Checklist de seguridad antes del LIVE",
            description:
              "El checklist práctico finalizado combina la preparación de pantalla y la revisión técnica final en una sola herramienta.",
            items: [
              "Estado de la cuenta de TikTok revisado",
              "Acceso a LIVE revisado",
              "Pantalla de trading y terminal preparados",
              "Balance y resultados de trading revisados",
              "Branding del broker y texto en pantalla revisados",
              "Notes y links revisados",
              "Audio funcionando",
              "Conexión a internet revisada",
              "Batería y equipo listos",
              "Terminal de trading configurado",
              "Revisión final de preparación completada",
            ],
          },
        },
      ],
    },
    {
      key: "what-to-do-if-banned",
      position: 3,
      title: "Qué hacer si banean tu cuenta de TikTok durante un Live",
      description:
        "Documenta el incidente, sigue la ruta de recuperación disponible y regresa solo después de que se restaure el acceso.",
      topics: [
        {
          key: "identify-what-happened",
          title: "Identifica qué pasó",
          quickAnswer:
            "Primero identifica el resultado exacto: advertencia, LIVE cortado, acceso a LIVE restringido, suspensión/ban de cuenta, o una caída repentina de visibilidad.",
          steps: [
            "Lee la notificación de restricción.",
            "Revisa si el LIVE se cortó.",
            "Revisa si el acceso a LIVE sigue disponible.",
            "Revisa si toda la cuenta está afectada.",
            "Guarda el aviso y los detalles de la restricción.",
          ],
        },
        {
          key: "immediate-actions",
          title: "Acciones inmediatas",
          quickAnswer:
            "No adivines. Abre el aviso, guarda evidencia, registra el motivo y la duración, y documenta qué estaba pasando durante el LIVE.",
          steps: [
            "Abre la notificación de TikTok.",
            "Toma una captura de pantalla.",
            "Identifica el motivo de la infracción.",
            "Revisa la duración de la restricción.",
            "Registra qué pasó durante el LIVE.",
            "Corrige la configuración antes del siguiente LIVE según lo que encontraste.",
          ],
          importantDetails: [
            "El material del speaker recomienda pedir ayuda a los Academy Experts cuando sea necesario.",
          ],
        },
        {
          key: "submit-an-appeal",
          title: "Cómo enviar una apelación",
          quickAnswer:
            "Cuando haya una apelación disponible, empieza desde la notificación de infracción, abre la opción de apelación, envía la información solicitada y sigue el estado de la apelación.",
          steps: [
            "Encuentra la notificación de infracción.",
            "Revisa si hay una opción de apelación disponible.",
            "Abre el flujo de apelación.",
            "Proporciona la información solicitada en la apelación.",
            "Sigue el estado de la apelación.",
          ],
          sourceNote:
            "El material del curso proporcionado no contiene una guía detallada paso a paso de la apelación de TikTok, así que esta página no inventa una.",
        },
        {
          key: "while-account-is-restricted",
          title: "Mientras tu cuenta está restringida",
          quickAnswer:
            "Revisa qué funciones de la cuenta siguen disponibles, atiende el problema indicado en el aviso, mantén la conexión con tu audiencia a través de tu comunidad existente, y espera hasta que se permita reanudar las transmisiones.",
          steps: [
            "Revisa qué funciones de la cuenta siguen disponibles.",
            "Atiende el problema identificado en el aviso de restricción.",
            "Mantén la comunicación con tu audiencia a través de tu comunidad existente.",
            "Sigue el periodo de restricción y el estado de la cuenta.",
            "Prepara el siguiente LIVE solo después de revisar el problema que causó la restricción.",
          ],
          importantDetails: [
            "El material del curso distingue la gestión de cuentas de eludir intencionalmente una restricción activa con otra cuenta.",
            "Un periodo de descanso por sí solo no se presenta como una forma garantizada de eliminar una restricción.",
          ],
        },
        {
          key: "return-to-streaming",
          title: "Cómo volver a transmitir",
          quickAnswer:
            "Regresa solo después de que se restaure el acceso a LIVE. Revisa la cuenta de nuevo, completa otra vez el checklist de seguridad, prepara la siguiente transmisión y luego reanuda.",
          steps: [
            "Revisa si se restauró el acceso a LIVE.",
            "Revisa el estado actual de la cuenta.",
            "Completa de nuevo el Checklist de seguridad antes del LIVE.",
            "Prepara el siguiente LIVE con la configuración corregida.",
            "Reanuda las transmisiones cuando esté permitido.",
            "Reporta el incidente a los Academy Experts cuando el proceso del curso lo requiera.",
          ],
        },
      ],
    },
    {
      key: "account-rotation-strategy",
      position: 4,
      title: "Estrategia de rotación de cuentas de TikTok",
      description:
        "Prepara cuentas principal y de respaldo para que un problema en una cuenta no detenga todo el flujo de streaming.",
      topics: [
        {
          key: "why-you-need-account-strategy",
          title: "Por qué necesitas una estrategia de cuentas",
          quickAnswer:
            "Depender de una sola cuenta de TikTok crea un punto único de falla. El curso recomienda preparar cuentas de respaldo y mantener la conexión con la audiencia a través de Telegram para que el streaming pueda recuperarse de problemas de cuenta.",
          importantDetails: [
            "Las cuentas de respaldo se presentan como herramientas de continuidad, no como una garantía contra restricciones.",
            "Telegram es parte de la estrategia de continuidad porque la conexión con la audiencia puede mantenerse fuera de la cuenta de TikTok afectada.",
          ],
        },
        {
          key: "how-many-accounts",
          title: "Cuántas cuentas necesitas",
          quickAnswer:
            "La estructura final del curso usa una Cuenta Principal, Cuenta de Respaldo 1, Cuenta de Respaldo 2, y cuentas adicionales cuando sea necesario.",
          importantDetails: [
            "Los speakers grabados describen configuraciones distintas, entre una y tres cuentas de respaldo.",
            "La fuente indica explícitamente que no se deben combinar sin explicarlo las distintas recomendaciones de los instructores en un método único inventado.",
          ],
          sourceNote:
            "El material proporcionado no establece un único número independiente de las recomendaciones de cada instructor, más allá de la estructura del curso de una cuenta principal, dos respaldos nombrados y cuentas adicionales opcionales.",
        },
        {
          key: "account-roles-and-setup",
          title: "Roles de cuenta y configuración",
          quickAnswer:
            "Define cuál cuenta es la Principal y cuáles son de respaldo, luego mantén una identidad de streamer, nombres de perfil, links, accesos y seguridad consistentes en toda la configuración.",
          steps: [
            "Identifica la Cuenta Principal.",
            "Identifica la Cuenta de Respaldo 1 y la Cuenta de Respaldo 2.",
            "Mantén la identidad de streamer consistente entre cuentas.",
            "Revisa nombres de perfil, branding y links.",
            "Registra los datos de acceso a la cuenta y los detalles de seguridad.",
          ],
        },
        {
          key: "rotation-and-resting",
          title: "Rotación y descanso",
          quickAnswer:
            "Usa la rotación y el descanso planificados como herramientas de gestión de cuentas: registra advertencias y restricciones, sabe qué cuenta está activa, y regresa una cuenta afectada solo cuando su estado lo permita.",
          steps: [
            "Registra qué cuenta está activa actualmente.",
            "Registra advertencias y restricciones de cada cuenta.",
            "Registra los periodos de descanso cuando sean parte del método del speaker.",
            "Revisa el acceso a LIVE antes de regresar una cuenta al streaming.",
          ],
          importantDetails: [
            "Los módulos grabados contienen distintos métodos de rotación/descanso de diferentes speakers.",
            "El Playbook conserva esas diferencias en lugar de aparentar que hay un método universal.",
            "Descansar una cuenta no se presenta como algo que elimine automáticamente una restricción activa.",
          ],
        },
        {
          key: "account-tracking",
          title: "Seguimiento de cuentas",
          quickAnswer:
            "Mantén un tracker de cuentas simple para saber siempre el rol, estado, acceso a LIVE, historial de advertencias, última fecha de LIVE y siguiente acción de cada cuenta.",
          steps: [
            "Registra el nombre de la cuenta y su rol.",
            "Registra si la cuenta está activa, restringida o inactiva.",
            "Registra si el acceso a LIVE está disponible.",
            "Registra advertencias y restricciones previas.",
            "Registra la fecha del último LIVE.",
            "Registra la siguiente actividad planeada o acción permitida.",
          ],
        },
        {
          key: "practical-examples",
          title: "Ejemplos prácticos",
          quickAnswer:
            "Usa la estrategia de cuentas para manejar cuatro situaciones recurrentes: un día normal de streaming, una advertencia, la pérdida temporal de acceso a LIVE, y el regreso a operaciones normales.",
          scenarios: [
            "Día normal: identifica la cuenta activa, confirma el acceso a LIVE, y registra la última/siguiente actividad.",
            "Advertencia: documenta el aviso y actualiza el estado de esa cuenta antes de planear el siguiente LIVE.",
            "Pérdida temporal de acceso a LIVE: mantén visible el estado de la cuenta afectada en el tracker y sigue el proceso de restricción/recuperación.",
            "Regreso a operaciones normales: confirma que el acceso se restauró y completa de nuevo las revisiones previas al LIVE.",
          ],
        },
      ],
    },
    {
      key: "where-to-buy-tiktok-accounts",
      position: 5,
      title: "Dónde comprar cuentas de TikTok",
      description:
        "Compara crear y calentar tu propia cuenta con comprar una cuenta existente, y luego inspecciona la cuenta antes de comprarla.",
      topics: [
        {
          key: "create-and-warm-up-vs-buy",
          title: "Crear y calentar vs. comprar",
          quickAnswer:
            "El curso presenta dos rutas: crear y calentar tu propia cuenta de TikTok, o comprar una cuenta existente. Crear toma más tiempo; comprar puede ser más rápido pero requiere revisar con cuidado el historial y los accesos de la cuenta.",
          scenarios: [
            "Crear y calentar: más tiempo de preparación, pero controlas el historial de la cuenta y la identidad de streamer desde el inicio.",
            "Comprar una existente: acceso potencialmente más rápido a una cuenta establecida, pero hay que revisar el historial, infracciones previas, el vendedor y el acceso de recuperación.",
          ],
        },
        {
          key: "buying-pros-and-cons",
          title: "Ventajas y desventajas",
          quickAnswer:
            "Crear te da más control sobre el historial de la cuenta pero toma tiempo. Comprar puede dar acceso más rápido a una cuenta establecida, pero viene con riesgos de historial, vendedor, propiedad y recuperación que deben revisarse.",
          importantDetails: [
            "Crear y calentar: tiempo de preparación, control sobre el historial, identidad de streamer, acceso a LIVE, costos y limitaciones.",
            "Comprar una existente: velocidad, acceso a LIVE ya existente, edad/historial de la cuenta, infracciones previas, riesgos de vendedor y recuperación.",
          ],
        },
        {
          key: "where-to-find-accounts",
          title: "Dónde encontrar cuentas",
          quickAnswer:
            "El curso hace referencia a plataformas de compra y venta de cuentas de TikTok, vendedores mencionados por los instructores y recomendaciones de otros streamers. El material proporcionado no contiene un nombre definitivo de plataforma para publicar aquí.",
          steps: [
            "Empieza desde un marketplace o fuente de vendedor usada en el material del curso.",
            "Revisa la credibilidad del vendedor antes de evaluar la cuenta misma.",
            "No te saltes el checklist de verificación de la cuenta solo porque la fuente fue recomendada.",
          ],
          sourceNote:
            "El guion grabado contiene un marcador de posición para el nombre del marketplace, así que el Playbook intencionalmente no inventa uno.",
        },
        {
          key: "what-to-check-before-buying",
          title: "Qué revisar antes de comprar",
          quickAnswer:
            "Antes de comprar, verifica la antigüedad, la región, los seguidores, el acceso a LIVE, el historial de la cuenta, el historial de contenido, la propiedad de la cuenta y el acceso para recuperarla, y el precio.",
          steps: [
            "Revisa cuándo se creó la cuenta.",
            "Revisa si la región coincide con la audiencia objetivo.",
            "Revisa el número de seguidores y si el acceso a LIVE está realmente habilitado.",
            "Revisa advertencias, bans, restricciones y el historial de contenido previos.",
            "Confirma la propiedad y el acceso de recuperación.",
            "Compara el precio con lo que realmente está incluido.",
          ],
          importantDetails: [
            "Un speaker grabado recomienda una antigüedad de cuenta de al menos 6 meses.",
            "El mismo speaker recomienda al menos 1,000 seguidores y LIVE habilitado.",
            "El speaker describe las cuentas ya preparadas con un costo de alrededor de $3–$10.",
            "Estos números son recomendaciones del speaker en el material del curso grabado, no una garantía universal de la plataforma.",
          ],
        },
        {
          key: "purchase-walkthrough",
          title: "Guía del proceso de compra",
          quickAnswer:
            "Revisa el listado, verifica los parámetros clave de la cuenta, identifica señales de alerta y decide si la cuenta debe aceptarse o rechazarse.",
          steps: [
            "Abre el listado de la cuenta.",
            "Revisa antigüedad, región, seguidores y acceso a LIVE.",
            "Revisa historial, restricciones y contenido previo.",
            "Revisa la propiedad y el acceso de recuperación.",
            "Identifica cualquier cosa que no coincida con el listado o con tu audiencia objetivo.",
            "Decide si continuar o rechazar la oferta.",
          ],
        },
        {
          key: "buying-checklist",
          title: "Checklist de compra",
          quickAnswer:
            "Usa este checklist antes de cada compra para que la decisión se base en los parámetros reales de la cuenta, no solo en la descripción del vendedor.",
          importantDetails: [
            "El paquete final del curso incluye esto como uno de los tres checklists prácticos independientes.",
          ],
          checklist: {
            title: "Checklist de compra de cuentas de TikTok",
            description:
              "Un checklist práctico de verificación de cuenta para completar antes de comprar.",
            items: [
              "Antigüedad de la cuenta revisada",
              "Región comparada con la audiencia objetivo",
              "Número de seguidores revisado",
              "Acceso a LIVE confirmado",
              "Bans, advertencias y restricciones previas revisadas",
              "Actividad de la cuenta e historial de contenido revisados",
              "Credibilidad del vendedor revisada",
              "Propiedad y acceso de recuperación confirmados",
              "Precio revisado",
            ],
            note:
              "Ejemplo del speaker: al menos 6 meses de antigüedad, al menos 1,000 seguidores, LIVE habilitado, y aproximadamente $3–$10 por cuentas ya preparadas.",
          },
        },
      ],
    },
    {
      key: "tiktok-warm-up-strategy",
      position: 6,
      title: "Estrategia de calentamiento de cuentas de TikTok",
      description:
        "Prepara una cuenta nueva o adquirida antes de su primer LIVE usando la secuencia de calentamiento descrita en la lección grabada.",
      topics: [
        {
          key: "what-is-warm-up",
          title: "Qué es el calentamiento",
          quickAnswer:
            "El calentamiento es el periodo de preparación antes del primer LIVE. La lección grabada describe usar la cuenta con normalidad, consumiendo contenido relevante de trading, en lugar de empezar a transmitir de inmediato.",
          importantDetails: [
            "El speaker grabado describe un periodo de calentamiento de alrededor de 1–2 días.",
            "Ese tiempo se presenta como el método del speaker, no como un requisito garantizado por TikTok.",
          ],
        },
        {
          key: "account-preparation",
          title: "Preparación de la cuenta",
          quickAnswer:
            "Antes del calentamiento y del primer LIVE, completa el perfil, establece la identidad de streamer, asegura la cuenta y confirma el acceso a LIVE.",
          steps: [
            "Completa el perfil.",
            "Define una identidad de streamer consistente.",
            "Configura la seguridad y el acceso de la cuenta.",
            "Revisa si el acceso a LIVE está disponible.",
          ],
        },
        {
          key: "warm-up-activities",
          title: "Actividades de calentamiento",
          quickAnswer:
            "La lección grabada empieza con una actividad normal de visualización de contenido de trading, y luego agrega interacción genuina como likes, comentarios y follows antes de pasar a actividad de contenido regular.",
          steps: [
            "Abre TikTok y busca contenido relacionado con trading.",
            "Mira videos de trading relevantes; el ejemplo grabado menciona alrededor de 20–30 minutos durante el periodo inicial.",
            "Durante la siguiente etapa, da like a contenido, escribe comentarios y sigue cuentas de trading.",
            "No publiques de inmediato durante la etapa temprana de calentamiento descrita por el speaker.",
            "Más adelante, desarrolla actividad normal de cuenta y contenido original a medida que continúa la preparación de la cuenta.",
          ],
          importantDetails: [
            "El speaker describe las primeras 1–2 horas como actividad de visualización/búsqueda.",
            "Las siguientes 2–3 horas agregan likes, comentarios y follows.",
            "En la noche, el speaker recomienda navegar el feed normalmente.",
          ],
        },
        {
          key: "warm-up-timeline",
          title: "Cronología del calentamiento",
          quickAnswer:
            "El método grabado dura alrededor de 1–2 días. La información de tiempos es más detallada para las horas iniciales; la fuente no proporciona un cronograma exacto específico para el Día 2.",
          steps: [
            "Primeras 1–2 horas: abre la app, busca contenido de trading y mira contenido relacionado con trading.",
            "Dentro de ese periodo de visualización, el speaker pone como ejemplo ver videos durante 20–30 minutos.",
            "Siguientes 2–3 horas: da like a contenido, escribe comentarios, sigue cuentas de trading, y todavía no publiques.",
            "En la noche: navega el feed normalmente.",
            "Continúa el periodo de calentamiento hasta que la cuenta esté lista para el primer LIVE; la lección grabada describe el periodo total como de alrededor de 1–2 días.",
          ],
          sourceNote:
            "La fuente no da un cronograma exacto específico para el Día 2, así que el Playbook no lo inventa.",
        },
        {
          key: "first-live-readiness",
          title: "Preparación para el primer LIVE",
          quickAnswer:
            "Antes del primer LIVE, confirma el acceso a LIVE, revisa el estado de la cuenta, revisa el perfil y el contenido, prepara la transmisión y completa las revisiones finales de seguridad.",
          steps: [
            "Confirma el acceso a LIVE.",
            "Revisa el estado de la cuenta.",
            "Revisa el perfil y el contenido.",
            "Prepara la primera transmisión y la configuración del terminal.",
            "Completa el Checklist de seguridad antes del LIVE.",
          ],
          importantDetails: [
            "La lección de calentamiento grabada considera como una señal práctica que el feed empiece a alinearse de forma natural con contenido de trading.",
          ],
        },
        {
          key: "warm-up-plan",
          title: "Plan de calentamiento",
          quickAnswer:
            "Usa la secuencia de calentamiento de 1–2 días del speaker como plan de ejecución, y termina con una revisión de preparación para el primer LIVE.",
          sourceNote:
            "La fuente da acciones exactas para las horas iniciales, pero no contiene un cronograma detallado específico para el Día 2.",
          checklist: {
            title: "Plan de calentamiento de cuentas de TikTok",
            description:
              "La herramienta práctica finalizada convierte el método de calentamiento grabado en un plan cronológico.",
            items: [
              "Perfil completado y acceso a la cuenta asegurado",
              "Acceso a LIVE revisado",
              "Búsqueda inicial de contenido de trading completada",
              "Contenido de trading relevante visto",
              "Likes, comentarios y follows agregados durante la siguiente etapa de calentamiento",
              "Sin publicaciones inmediatas durante la etapa temprana descrita por el speaker",
              "Navegación normal del feed completada",
              "Estado de la cuenta revisado de nuevo antes del primer LIVE",
              "Checklist de seguridad antes del LIVE completado",
            ],
            note:
              "Cronología del speaker: alrededor de 1–2 días en total; las primeras 1–2 horas enfocadas en visualización/búsqueda, seguidas de 2–3 horas de interacción, y luego navegación normal en la noche.",
          },
        },
      ],
    },
  ];
  
  export const playbookQuickAccess: PlaybookQuickAccessItem[] = [
    {
      key: "pre-live",
      label: "Antes del LIVE",
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
      label: "Calentamiento",
      blockKey: "tiktok-warm-up-strategy",
      topicKey: "warm-up-plan",
    },
  ];
  