export type AppLanguage = "es" | "en";

export type MessageKey =
  | "header.menu"
  | "header.howItWorks"
  | "header.sponsors"
  | "header.leaderboard"
  | "header.logout"
  | "header.pointsUnit"
  | "header.userDefault"
  | "header.loadingPoints"
  | "header.changeToEnglish"
  | "header.changeToSpanish"
  | "header.installApp"
  | "header.installAppIphone"
  | "header.installAppAndroid"
  | "header.alreadyInstalled"
  | "header.addedToHome"
  | "header.installCancelled"
  | "header.installHintIphone"
  | "header.installHintAndroid"
  | "header.installHintGeneric"
  | "header.openMenu"
  | "header.languageSelector"
  | "footer.poweredBy"
  | "footer.knowMore"
  | "raffle.moreInfo"
  | "raffle.timeLeftToWin"
  | "raffle.hurryUp"
  | "raffle.description"
  | "raffle.followUs"
  | "raffle.ended"
  | "raffle.gotIt"
  | "auth.login.userEmail"
  | "auth.login.password"
  | "auth.login.enter"
  | "auth.login.or"
  | "auth.login.welcome"
  | "auth.login.linkedin"
  | "auth.login.signup"
  | "auth.email.invalid"
  | "auth.register.email"
  | "auth.register.password"
  | "auth.register.fullName"
  | "auth.register.companyName"
  | "auth.register.jobTitle"
  | "auth.register.linkedInOptional"
  | "auth.register.register"
  | "auth.register.agree"
  | "auth.register.terms"
  | "welcome.title"
  | "leaderboard.title"
  | "common.emptyList"
  | "common.unexpectedError"
  | "common.goBack"
  | "common.sponsor"
  | "common.sponsorNotFound"
  | "sponsor.scanQr"
  | "sponsor.scanTitlePrefix"
  | "sponsor.scanTitleSuffix"
  | "sponsor.scanInvalidPayload"
  | "sponsor.scanWrongSponsor"
  | "sponsor.scanNotAuthenticated"
  | "sponsor.scanUnexpectedError"
  | "sponsor.scanStartCameraError"
  | "sponsor.scanAlreadyScanned"
  | "sponsor.scanValidConfirm"
  | "sponsor.scanConfirmButton"
  | "sponsor.scanSuccess"
  | "sponsor.scanParticipationEnded"
  | "sponsor.openLogoLink"
  | "linkedin.backToLogin"
  | "leaderboard.pointsPlural"
  | "leaderboard.pointsSingular"
  | "howItWorks.title"
  | "howItWorks.sectionHowWorksTitle"
  | "howItWorks.sectionHowWorksBody"
  | "howItWorks.sectionWhatIsTitle"
  | "howItWorks.sectionWhatIsBody1"
  | "howItWorks.sectionWhatIsBody2"
  | "howItWorks.sectionWhatIsBody3"
  | "howItWorks.sectionParticipateTitle"
  | "howItWorks.sectionParticipateItem1"
  | "howItWorks.sectionParticipateItem2"
  | "howItWorks.sectionParticipateItem3"
  | "howItWorks.sectionParticipateItem4"
  | "howItWorks.sectionWinnerTitle"
  | "howItWorks.sectionWinnerIntro"
  | "howItWorks.sectionWinnerItem1"
  | "howItWorks.sectionWinnerItem2"
  | "howItWorks.sectionWinnerItem3"
  | "howItWorks.sectionWinnerNote"
  | "howItWorks.sectionPrizeTitle"
  | "howItWorks.sectionPrizeIntro"
  | "howItWorks.sectionPrizeBody"
  | "howItWorks.sectionConditionsTitle"
  | "howItWorks.sectionConditionsItem1"
  | "howItWorks.sectionConditionsItem2"
  | "howItWorks.sectionConditionsItem3"
  | "howItWorks.sectionConditionsItem4"
  | "howItWorks.sectionConditionsItem5"
  | "howItWorks.sectionTransparencyTitle"
  | "howItWorks.sectionTransparencyItem1"
  | "howItWorks.sectionTransparencyItem2"
  | "howItWorks.sectionTransparencyItem3"
  | "howItWorks.sectionDataTitle"
  | "howItWorks.sectionDataBody";

export const messages: Record<AppLanguage, Record<MessageKey, string>> = {
  es: {
    "header.menu": "Menu",
    "header.howItWorks": "¿Cómo funciona?",
    "header.sponsors": "Patrocinadores",
    "header.leaderboard": "Clasificación",
    "header.logout": "Logout",
    "header.pointsUnit": "puntos",
    "header.userDefault": "Usuario",
    "header.loadingPoints": "Cargando puntos...",
    "header.changeToEnglish": "Change to English",
    "header.changeToSpanish": "Cambiar a Español",
    "header.installApp": "Añadir a pantalla de inicio",
    "header.installAppIphone": "Añadir a inicio (iPhone)",
    "header.installAppAndroid": "Instalar app (Android)",
    "header.alreadyInstalled": "La app ya está instalada.",
    "header.addedToHome": "La app se añadió a inicio.",
    "header.installCancelled": "La instalación fue cancelada.",
    "header.installHintIphone":
      "iPhone: abre el menú de Safari (Compartir) y pulsa 'Añadir a pantalla de inicio'.",
    "header.installHintAndroid":
      "Android: abre el menú del navegador (3 puntos) y pulsa 'Añadir a pantalla de inicio' o 'Instalar app'.",
    "header.installHintGeneric":
      "Usa el menú del navegador y selecciona 'Añadir a pantalla de inicio'.",
    "header.openMenu": "Abrir menú",
    "header.languageSelector": "Selector de idioma",
    "footer.poweredBy": "Powered by:",
    "footer.knowMore": "Encuentra tu nuevo reto",
    "raffle.moreInfo": "Más info",
    "raffle.timeLeftToWin": "Concurso acaba en:",
    "raffle.hurryUp": "¡Date prisa! solo falta:",
    "raffle.description":
      "Solo por pasar por los stands de nuestros sponsors en la Conferencia, podrás entrar en el sorteo de un Máster Online de Neoland 100% gratuito.",
    "raffle.followUs": "Sigue a Neoland en:",
    "raffle.ended": "El tiempo para participar ha terminado.",
    "raffle.gotIt": "Entendido",
    "auth.login.userEmail": "Usuario (email)",
    "auth.login.password": "Contraseña",
    "auth.login.enter": "Entrar",
    "auth.login.or": "o",
    "auth.login.welcome": "Welcome to the BCN Office Challenge! Please log in to continue.",
    "auth.login.linkedin": "Iniciar sesión con LinkedIn",
    "auth.login.signup": "¿No tienes cuenta? Regístrate",
    "auth.email.invalid": "Introduce un email válido.",
    "auth.register.email": "Email",
    "auth.register.password": "Contraseña",
    "auth.register.fullName": "Nombre completo",
    "auth.register.companyName": "Empresa",
    "auth.register.jobTitle": "Puesto",
    "auth.register.linkedInOptional": "LinkedIn (opcional)",
    "auth.register.register": "Registrarse",
    "auth.register.agree": "Acepto los",
    "auth.register.terms": "términos y condiciones",
    "welcome.title": "Patrocinadores",
    "leaderboard.title": "Clasificación",
    "common.emptyList": "Lista vacía",
    "common.unexpectedError": "Error inesperado",
    "common.goBack": "Volver",
    "common.sponsor": "Patrocinador",
    "common.sponsorNotFound": "Patrocinador no encontrado.",
    "sponsor.scanQr": "Escanear QR",
    "sponsor.scanTitlePrefix": "Escanea el código de",
    "sponsor.scanTitleSuffix": "",
    "sponsor.scanInvalidPayload": "El QR no es válido",
    "sponsor.scanWrongSponsor": "Este QR no pertenece a este sponsor",
    "sponsor.scanNotAuthenticated": "Usuario no autenticado",
    "sponsor.scanUnexpectedError": "Error inesperado durante el escaneo",
    "sponsor.scanStartCameraError": "No se pudo iniciar la cámara",
    "sponsor.scanAlreadyScanned": "Este sponsor ya está escaneado.",
    "sponsor.scanValidConfirm":
      "QR válido para este sponsor. Pulsa para confirmar.",
    "sponsor.scanConfirmButton": "Confirmar escaneo",
    "sponsor.scanSuccess": "Escaneo completado correctamente.",
    "sponsor.scanParticipationEnded": "El tiempo para participar ha terminado.",
    "sponsor.openLogoLink":
      "Abrir la web del patrocinador en una pestaña nueva",
    "linkedin.backToLogin": "Volver al login",
    "leaderboard.pointsPlural": "points",
    "leaderboard.pointsSingular": "Point",
    "howItWorks.title": "Codemotion Digital Passport",
    "howItWorks.sectionHowWorksTitle": "🚀 Cómo funciona",
    "howItWorks.sectionHowWorksBody":
      "El Digital Passport de Codemotion es una experiencia interactiva diseñada para conectar a los asistentes con nuestros sponsors y recompensar a los más curiosos (y rápidos 👀).",
    "howItWorks.sectionWhatIsTitle": "🎯 ¿En qué consiste?",
    "howItWorks.sectionWhatIsBody1":
      "Durante el evento, podrás participar en el Digital Passport visitando los stands de los sponsors participantes.",
    "howItWorks.sectionWhatIsBody2":
      "En cada booth encontrarás un código QR único.",
    "howItWorks.sectionWhatIsBody3":
      "Cada vez que escanees uno, acumularás puntos en tu perfil. Tu progreso se reflejará en tiempo real en un leaderboard público.",
    "howItWorks.sectionParticipateTitle": "🧭 ¿Cómo participar?",
    "howItWorks.sectionParticipateItem1":
      "Regístrate en el Digital Passport (link o acceso desde la app/evento).",
    "howItWorks.sectionParticipateItem2":
      "Visita los stands de los sponsors participantes.",
    "howItWorks.sectionParticipateItem3":
      "Escanea el QR exclusivo de cada stand.",
    "howItWorks.sectionParticipateItem4":
      "Suma puntos y escala posiciones en el ranking.",
    "howItWorks.sectionWinnerTitle": "🏆 ¿Cómo se decide el ganador?",
    "howItWorks.sectionWinnerIntro": "El ganador será el participante que:",
    "howItWorks.sectionWinnerItem1":
      "Haya escaneado todos los códigos QR disponibles (pasaporte completo).",
    "howItWorks.sectionWinnerItem2":
      "Haya acumulado la mayor puntuación.",
    "howItWorks.sectionWinnerItem3":
      "En caso de empate, haya completado el recorrido en el menor tiempo posible.",
    "howItWorks.sectionWinnerNote":
      "Importante: el sistema registra automáticamente la hora de cada escaneo.",
    "howItWorks.sectionPrizeTitle": "🎁 Premio",
    "howItWorks.sectionPrizeIntro": "El ganador recibirá:",
    "howItWorks.sectionPrizeBody":
      "Un Máster de Neoland, valorado en más de 2.000€, a elegir entre las opciones disponibles en su catálogo formativo.",
    "howItWorks.sectionConditionsTitle": "📜 Condiciones importantes",
    "howItWorks.sectionConditionsItem1":
      "Cada QR solo puede escanearse una vez por participante.",
    "howItWorks.sectionConditionsItem2":
      "Los códigos QR son personales e intransferibles dentro del contexto del evento.",
    "howItWorks.sectionConditionsItem3":
      "Cualquier intento de fraude, manipulación del sistema o comportamiento abusivo implicará la descalificación inmediata.",
    "howItWorks.sectionConditionsItem4":
      "La organización se reserva el derecho de verificar la validez de las participaciones.",
    "howItWorks.sectionConditionsItem5":
      "La participación implica la aceptación de estas condiciones.",
    "howItWorks.sectionTransparencyTitle": "⚖️ Transparencia y sistema",
    "howItWorks.sectionTransparencyItem1":
      "El leaderboard se actualiza en tiempo real, pero puede haber pequeños retrasos técnicos.",
    "howItWorks.sectionTransparencyItem2":
      "En caso de incidencias técnicas, la organización se reserva el derecho de revisar manualmente los resultados.",
    "howItWorks.sectionTransparencyItem3":
      "La decisión final sobre el ganador corresponde a la organización del evento.",
    "howItWorks.sectionDataTitle": "🔒 Protección de datos",
    "howItWorks.sectionDataBody":
      "Los datos recogidos se utilizarán únicamente para la gestión del Digital Passport y la asignación del premio, conforme a la normativa vigente en protección de datos.",
  },
  en: {
    "header.menu": "Menu",
    "header.howItWorks": "How does it work?",
    "header.sponsors": "Sponsors",
    "header.leaderboard": "Leaderboard",
    "header.logout": "Logout",
    "header.pointsUnit": "points",
    "header.userDefault": "User",
    "header.loadingPoints": "Loading points...",
    "header.changeToEnglish": "Change to English",
    "header.changeToSpanish": "Cambiar a Español",
    "header.installApp": "Add to Home Screen",
    "header.installAppIphone": "Add to Home Screen (iPhone)",
    "header.installAppAndroid": "Install app (Android)",
    "header.alreadyInstalled": "App is already installed.",
    "header.addedToHome": "App added to home screen.",
    "header.installCancelled": "Installation was cancelled.",
    "header.installHintIphone":
      "iPhone: open Safari menu (Share) and tap 'Add to Home Screen'.",
    "header.installHintAndroid":
      "Android: open browser menu (3 dots) and tap 'Add to Home screen' or 'Install app'.",
    "header.installHintGeneric":
      "Use your browser menu and select 'Add to Home Screen'.",
    "header.openMenu": "Open menu",
    "header.languageSelector": "Language selector",
    "footer.poweredBy": "Powered by:",
    "footer.knowMore": "Find your new challenge",
    "raffle.moreInfo": "More info",
    "raffle.timeLeftToWin": "Time left to win:",
    "raffle.hurryUp": "Hurry up! only this much left:",
    "raffle.description":
      "Just by visiting our sponsors' stands at the Conference, you can enter the raffle for a 100% free Neoland Master's Online program.",
    "raffle.followUs": "Follow Neoland on:",
    "raffle.ended": "The time to participate has ended.",
    "raffle.gotIt": "Got it!",
    "auth.login.userEmail": "User (email)",
    "auth.login.password": "Password",
    "auth.login.enter": "Enter",
    "auth.login.or": "or",
    "auth.login.welcome": "Bienvenido al BCN Office Challenge! Por favor, inicia sesión para continuar.",
    "auth.login.linkedin": "Sign in with LinkedIn",
    "auth.login.signup": "Don't have an account? Sign up",
    "auth.email.invalid": "Please enter a valid email.",
    "auth.register.email": "Email",
    "auth.register.password": "Password",
    "auth.register.fullName": "Full name",
    "auth.register.companyName": "Company name",
    "auth.register.jobTitle": "Job title",
    "auth.register.linkedInOptional": "LinkedIn (optional)",
    "auth.register.register": "Register",
    "auth.register.agree": "Agree the",
    "auth.register.terms": "terms and conditions",
    "welcome.title": "Sponsors",
    "leaderboard.title": "Leaderboard",
    "common.emptyList": "Empty list",
    "common.unexpectedError": "Unexpected error",
    "common.goBack": "Go back",
    "common.sponsor": "Sponsor",
    "common.sponsorNotFound": "Sponsor not found.",
    "sponsor.scanQr": "Scan QR",
    "sponsor.scanTitlePrefix": "Scan the",
    "sponsor.scanTitleSuffix": "Code",
    "sponsor.scanInvalidPayload": "Invalid QR payload",
    "sponsor.scanWrongSponsor": "This QR does not belong to this sponsor",
    "sponsor.scanNotAuthenticated": "User is not authenticated",
    "sponsor.scanUnexpectedError": "Unexpected error during QR scan",
    "sponsor.scanStartCameraError": "Could not start camera",
    "sponsor.scanAlreadyScanned": "This sponsor is already scanned.",
    "sponsor.scanValidConfirm":
      "QR is valid for this sponsor. Tap to confirm.",
    "sponsor.scanConfirmButton": "Confirm scan",
    "sponsor.scanSuccess": "Scan completed successfully.",
    "sponsor.scanParticipationEnded": "The time to participate has ended.",
    "sponsor.openLogoLink": "Open the sponsor website in a new tab",
    "linkedin.backToLogin": "Back to login",
    "leaderboard.pointsPlural": "points",
    "leaderboard.pointsSingular": "Point",
    "howItWorks.title": "Codemotion Digital Passport",
    "howItWorks.sectionHowWorksTitle": "🚀 How it works",
    "howItWorks.sectionHowWorksBody":
      "Codemotion Digital Passport is an interactive experience designed to connect attendees with our sponsors and reward the most curious (and fastest 👀).",
    "howItWorks.sectionWhatIsTitle": "🎯 What is it about?",
    "howItWorks.sectionWhatIsBody1":
      "During the event, you can join the Digital Passport by visiting participating sponsors' stands.",
    "howItWorks.sectionWhatIsBody2":
      "At each booth you will find a unique QR code.",
    "howItWorks.sectionWhatIsBody3":
      "Every time you scan one, you earn points in your profile. Your progress is reflected in real time on a public leaderboard.",
    "howItWorks.sectionParticipateTitle": "🧭 How to participate?",
    "howItWorks.sectionParticipateItem1":
      "Register in the Digital Passport (link or access from the app/event).",
    "howItWorks.sectionParticipateItem2":
      "Visit the participating sponsors' stands.",
    "howItWorks.sectionParticipateItem3":
      "Scan the exclusive QR code at each stand.",
    "howItWorks.sectionParticipateItem4":
      "Earn points and climb positions in the ranking.",
    "howItWorks.sectionWinnerTitle": "🏆 How is the winner decided?",
    "howItWorks.sectionWinnerIntro": "The winner will be the participant who:",
    "howItWorks.sectionWinnerItem1":
      "Scanned all available QR codes (complete passport).",
    "howItWorks.sectionWinnerItem2":
      "Has the highest total score.",
    "howItWorks.sectionWinnerItem3":
      "In case of a tie, completed the route in the shortest time.",
    "howItWorks.sectionWinnerNote":
      "Important: the system automatically records the time of each scan.",
    "howItWorks.sectionPrizeTitle": "🎁 Prize",
    "howItWorks.sectionPrizeIntro": "The winner will receive:",
    "howItWorks.sectionPrizeBody":
      "A Neoland Master's program valued at more than 2,000 EUR, to choose from the options available in their training catalog.",
    "howItWorks.sectionConditionsTitle": "📜 Important conditions",
    "howItWorks.sectionConditionsItem1":
      "Each QR can only be scanned once per participant.",
    "howItWorks.sectionConditionsItem2":
      "QR codes are personal and non-transferable within the event context.",
    "howItWorks.sectionConditionsItem3":
      "Any attempt of fraud, system manipulation, or abusive behavior implies immediate disqualification.",
    "howItWorks.sectionConditionsItem4":
      "The organization reserves the right to verify the validity of participations.",
    "howItWorks.sectionConditionsItem5":
      "Participation implies acceptance of these conditions.",
    "howItWorks.sectionTransparencyTitle": "⚖️ Transparency and system",
    "howItWorks.sectionTransparencyItem1":
      "The leaderboard updates in real time, but there may be small technical delays.",
    "howItWorks.sectionTransparencyItem2":
      "In case of technical incidents, the organization reserves the right to manually review the results.",
    "howItWorks.sectionTransparencyItem3":
      "The final decision about the winner belongs to the event organization.",
    "howItWorks.sectionDataTitle": "🔒 Data protection",
    "howItWorks.sectionDataBody":
      "The collected data will only be used for Digital Passport management and prize assignment, according to current data protection regulations.",
  },
};

