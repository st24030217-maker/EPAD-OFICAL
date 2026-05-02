// ============================================================
// LOADER
// ============================================================
(function () {
  function startLoader() {
    const statuses = [
      "Cargando m\u00F3dulos...",
      "Verificando credenciales...",
      "Preparando dashboard...",
      "Cargando cursos...",
      "Sistema listo \u2713",
    ];
    let pct = 0,
      si = 0;
    const bar = document.getElementById("loader-bar");
    const statusEl = document.getElementById("loader-status-text");
    if (!bar || !statusEl) {
      const loaderEl = document.getElementById("loader");
      const appEl = document.getElementById("app");
      if (loaderEl) loaderEl.style.display = "none";
      if (appEl) appEl.style.display = "block";
      try {
        initApp();
      } catch (e) {
        console.error("initApp error:", e);
      }
      return;
    }
    const iv = setInterval(() => {
      pct += Math.random() * 14 + 4;
      if (pct > 100) pct = 100;
      bar.style.width = pct + "%";
      if (pct > si * 20 && si < statuses.length) {
        statusEl.textContent = statuses[si];
        si++;
      }
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          try {
            document.getElementById("loader").classList.add("loader-exit");
            setTimeout(() => {
              document.getElementById("loader").style.display = "none";
              document.getElementById("app").style.display = "block";
              initApp();
            }, 600);
          } catch (e) {
            console.error("Error en loader:", e);
            document.getElementById("loader").style.display = "none";
            document.getElementById("app").style.display = "block";
            try {
              initApp();
            } catch (e2) {
              console.error("initApp error:", e2);
            }
          }
        }, 400);
      }
    }, 100);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLoader);
  } else {
    startLoader();
  }
})();

// ============================================================
// APP STATE
// ============================================================
function showPublic() {
  document.getElementById("public-site").style.display = "block";
  document.getElementById("login-page").style.display = "none";
  document.getElementById("dashboard-page").style.display = "none";
}
function showLogin() {
  document.getElementById("public-site").style.display = "none";
  document.getElementById("login-page").style.display = "flex";
  document.getElementById("dashboard-page").style.display = "none";
}
function toggleMobileUsisamm() {
  const btn = document.getElementById("mobile-usicamm-btn");
  const sub = document.getElementById("mobile-usicamm-sub");
  btn.classList.toggle("open");
  sub.classList.toggle("open");
}
function toggleMobileMenu() {
  const m = document.getElementById("mobile-menu");
  const h = document.getElementById("hamburger-btn");
  m.classList.toggle("open");
  h.classList.toggle("active");
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("scroll", () => {
  const n = document.getElementById("pub-nav");
  if (n)
    n.style.boxShadow =
      window.scrollY > 40 ? "0 2px 20px rgba(0,0,0,0.12)" : "";
});

// ============================================================
// COURSES DATA
// ============================================================
// Datos trasladados a js/data.js
let COURSES = [];
let courseIdCounter = PUBLIC_COURSES.length + 1;
let currentFilter = "todos";

function filterCourses(cat, btn) {
  currentFilter = cat;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  let activeBtn = btn;
  if (!activeBtn) {
    activeBtn = Array.from(document.querySelectorAll(".filter-btn")).find((b) =>
      b.getAttribute("onclick")?.includes(`filterCourses('${cat}'`),
    );
  }
  if (activeBtn) {
    activeBtn.classList.add("active");
  } else {
    // Fallback: activar el botón "Todos" si no se encuentra ninguno
    const todosBtn = Array.from(document.querySelectorAll(".filter-btn")).find(
      (b) => b.getAttribute("onclick")?.includes("filterCourses('todos'"),
    );
    if (todosBtn) todosBtn.classList.add("active");
  }
  renderCourses();
}

function renderCourses() {
  try {
    const grid = document.getElementById("courses-grid");
    if (!grid) {
      console.warn("courses-grid not found");
      return;
    }
    const allCourses = PUBLIC_COURSES.concat(COURSES);
    if (allCourses.length === 0) {
      grid.innerHTML =
        '<div style="text-align:center;padding:48px 0;color:var(--text-muted);">Pr\u00F3ximamente se publicar\u00E1n cursos.</div>';
      return;
    }
    const badgeLabels = {
      hot: "<i data-lucide='star' style='width:14px;height:14px;fill:currentColor'></i> Popular",
      new: "+ Nuevo",
      top: "<i data-lucide='award' style='width:14px;height:14px'></i> Top",
    };
    grid.innerHTML = allCourses
      .map(
        (c) => `
                  <div class="course-card" onclick="openModal(${c.id})">
                    <div class="course-thumb" style='background:${c.color};'>
                      ${c.badge ? `<div class="course-badge ${c.badge}">${badgeLabels[c.badge] || c.badge}</div>` : ""}
                      <div class="course-thumb-icon" style='font-family:'Merriweather',serif;font-weight:700;font-size:32px;color:#fff;letter-spacing:1px;'>${c.icon}</div>
                    </div>
                    <div class="course-body">
                      <div class="course-cat" style='color:var(--accent);'>${c.catLabel || c.cat || ""}</div>
                      <div class="course-name">${c.name.replace(/\x60/g, "\\`")}</div>
                      <div class="course-desc">${c.desc.replace(/\x60/g, "\\`")}</div>
                      <div style='display:flex;align-items:center;justify-content:space-between;margin-top:auto;'>
                        <div>
                          <span style='font-size:16px;font-weight:700;color:var(--primary);'>${c.price.replace(/\x60/g, "\\`")}</span>
                          ${c.oldPrice ? `<span style='font-size:13px;color:var(--text-muted);text-decoration:line-through;margin-left:8px;'>${c.oldPrice.replace(/\x60/g, "\\`")}</span>` : ""}
                        </div>
                        <span style='font-size:11px;color:var(--text-muted);'>\u23F1 ${c.hours}</span>
                      </div>
                    </div>
                  </div>`,
      )
      .join("");
  } catch (e) {
    console.error("renderCourses error:", e);
  }
}

// ============================================================
// TESTIMONIALS
// ============================================================
// Testimonios trasladados a js/data.js
function renderTestimonials() {
  try {
    const grid = document.getElementById("testimonials-grid");
    if (!grid) {
      console.warn("testimonials-grid not found");
      return;
    }
    grid.innerHTML = TESTIMONIALS.map(
      (t) => `
                  <div class="testimonial-card">
                    <div class="testimonial-stars">${"\u2605".repeat(t.stars)}</div>
                    <div class="testimonial-text">"${t.text}"</div>
                    <div class="testimonial-author">
                      <div class="t-avatar" style='background:${t.color};'>${t.author
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}</div>
                      <div>
                        <div style='font-weight:600;font-size:13px;color:var(--text);'>${t.author}</div>
                        <div style='font-size:12px;color:var(--text-muted);'>${t.role}</div>
                      </div>
                    </div>
                  </div>`,
    ).join("");
  } catch (e) {
    console.error("renderTestimonials error:", e);
  }
}

// ============================================================
// MODAL \u2014 INSCRIPCI\u00D3N + PAGO EN L\u00CDNEA
// ============================================================
let currentCourse = null;
let enrollData = {};

function openModal(id) {
  const c = PUBLIC_COURSES.concat(COURSES).find((x) => x.id === id);
  if (!c) return;
  currentCourse = c;
  showStep1(c);
  document.getElementById("modal-overlay").classList.add("open");
}

function showStep1(c) {
  const isConsultar = c.price === "Consultar";
  document.getElementById("modal-body").innerHTML = `
                <div class="modal-course-info">
                  <div class="modal-course-thumb" style='background:${c.color}'>${c.icon}</div>
                  <div>
                    <div class="modal-course-name">${c.name.replace(/\x60/g, "\\`")}</div>
                    <div class="modal-course-price">${c.price.replace(/\x60/g, "\\`")} \u00B7 ${c.hours} \u00B7 Calif. ${c.rating}</div>
                  </div>
                </div>
                ${
                  !isConsultar && c.price !== "Gratis"
                    ? `
                <div class="pay-steps">
                  <div class="pay-step active"><div class="step-circle">1</div><div class="step-label">Datos</div></div>
                  <div class="pay-step"><div class="step-circle">2</div><div class="step-label">Pago</div></div>
                  <div class="pay-step"><div class="step-circle">3</div><div class="step-label">Confirmaci\u00F3n</div></div>
                </div>`
                    : ""
                }
                ${
                  isConsultar
                    ? `
                <div class="modal-title">Consultar precio</div>
                <div class="modal-sub">Completa tus datos y un asesor te contactar\u00E1 con el precio y disponibilidad.</div>
                `
                    : `
                <div class="modal-title">${c.price === "Gratis" ? "Inscripci\u00F3n gratuita" : "Datos de inscripci\u00F3n"}</div>
                <div class="modal-sub">Complete sus datos para ${c.price === "Gratis" ? "acceder al curso" : "continuar al pago"}.</div>
                `
                }
                <div class="form-row">
                  <div class="form-group"><label class="form-label">Nombre *</label><input class="form-input" placeholder="Tu nombre" id="f-nombre"></div>
                  <div class="form-group"><label class="form-label">Apellido *</label><input class="form-input" placeholder="Tu apellido" id="f-apellido"></div>
                </div>
                <div class="form-group"><label class="form-label">Correo electr\u00F3nico *</label><input class="form-input" type="email" placeholder="tu@correo.com" id="f-email"></div>
                <div class="form-group"><label class="form-label">Tel\u00E9fono (opcional)</label><input class="form-input" type="tel" placeholder="+52 618 000 0000" id="f-tel"></div>
                <div class="form-group"><label class="form-label">\u00BFC\u00F3mo nos conociste?</label>
                  <select class="form-input" id="f-como"><option value="">Selecciona una opci\u00F3n</option><option>Redes sociales</option><option>Google</option><option>Recomendaci\u00F3n</option><option>Otro</option></select>
                </div>
                <button class="btn-submit" onclick="${
                  isConsultar
                    ? `consultarPrecioWhatsApp('${c.name.replace(/'/g, "\\'")}')`
                    : c.price === "Gratis"
                      ? `submitFree("${c.name.replace(/\x60/g, "\\`").replace(/"/g, '\\"')}")`
                      : "goStep2()"
                }">
                  ${isConsultar ? "\uD83D\uDCAC Consultar por WhatsApp \u2192" : c.price === "Gratis" ? "Inscribirme gratis \u2192" : "Continuar al pago \u2192"}
                </button>`;
}

function consultarPrecioWhatsApp(curso) {
  const nombre = document.getElementById("f-nombre")?.value.trim() || "";
  const email = document.getElementById("f-email")?.value.trim() || "";
  if (!nombre || !email) {
    alert("Por favor completa tu nombre y correo para continuar.");
    return;
  }
  const msg = encodeURIComponent(
    `Hola, me interesa el curso *${curso}* y quiero conocer el precio y disponibilidad.\n\nMi nombre es: ${nombre}\nMi correo: ${email}\n\n¡Gracias!`,
  );
  window.open("https://wa.me/528719164677?text=" + msg, "_blank");
}

function goStep2() {
  const nombre = document.getElementById("f-nombre").value.trim();
  const apellido = document.getElementById("f-apellido").value.trim();
  const email = document.getElementById("f-email").value.trim();
  if (!nombre || !email) {
    alert("Por favor completa los campos requeridos.");
    return;
  }
  enrollData = {
    nombre,
    apellido,
    email,
    tel: document.getElementById("f-tel").value,
  };
  const c = currentCourse;
  document.getElementById("modal-body").innerHTML = `
                <div class="modal-course-info">
                  <div class="modal-course-thumb" style='background:${c.color}'>${c.icon}</div>
                  <div><div class="modal-course-name">${c.name.replace(/\x60/g, "\\`")}</div><div class="modal-course-price">${c.price.replace(/\x60/g, "\\`")} \u00B7 ${c.hours}</div></div>
                </div>
                <div class="pay-steps">
                  <div class="pay-step done"><div class="step-circle">\u2713</div><div class="step-label">Datos</div></div>
                  <div class="pay-step active"><div class="step-circle">2</div><div class="step-label">Pago</div></div>
                  <div class="pay-step"><div class="step-circle">3</div><div class="step-label">Confirmaci\u00F3n</div></div>
                </div>
                <div class="modal-title">Informaci\u00F3n de pago</div>
                <div class="modal-sub">Realiza tu pago por transferencia o dep\u00F3sito y env\u00EDanos tu comprobante por WhatsApp.</div>

                <div style='background:#f0f7ff;border:1px solid #bdd6f5;border-radius:10px;padding:18px 20px;margin:16px 0;'>
                  <div style='font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:12px;'>&#9673; Beneficiario</div>
                  <div style='font-size:17px;font-weight:700;color:var(--text);margin-bottom:16px;'>H\u00E9ctor Orrante Sustaita</div>
                  <div style='font-size:12px;color:var(--text-muted);margin-bottom:6px;'>Los datos de cuenta (CLABE / No. de tarjeta) te ser\u00E1n enviados de forma privada por WhatsApp por uno de nuestros asesores.</div>
                </div>

                <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between'>
                  <div>
                    <div style='font-size:13px;font-weight:600;color:var(--success)'>Total a pagar</div>
                    <div style='font-size:22px;font-weight:800;color:var(--primary);font-family:'Merriweather',serif'>${c.price.replace(/\x60/g, "\\`")}</div>
                  </div>
                  <div style='text-align:right;font-size:11px;color:var(--text-muted)'>Pago \u00FAnico<br>Acceso de por vida</div>
                </div>

                <button class="btn-pay" style="margin-top:4px;background:#25d366;border-color:#25d366;" onclick="solicitarDatosPago('${c.name}','${c.price}')">
                  &#9635; Solicitar datos de pago por WhatsApp
                </button>

                <div style='margin:18px 0 0 0;border-top:1px solid var(--border);padding-top:18px;'>
                  <div style='font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;text-align:center;'>¿Ya realizaste tu transferencia?</div>
                  <div style='background:#fffbea;border:1px solid #f6d860;border-radius:10px;padding:14px 16px;margin-bottom:14px;font-size:12px;color:#7a6000;'>
                    <strong>Pasos:</strong><br>
                    1. Solicita tus datos bancarios por WhatsApp<br>
                    2. Realiza tu transferencia o depósito<br>
                    3. Envía tu comprobante al asesor por WhatsApp<br>
                    4. Haz clic en el botón de abajo para registrar tu solicitud
                  </div>
                  <div class="form-group" style='margin-bottom:10px;'>
                    <label class="form-label">Número de referencia / folio (opcional)</label>
                    <input class="form-input" id="f-referencia" placeholder="Ej. 123456789 o REF-XYZ" />
                  </div>
                  <button class="btn-pay" style="margin-top:4px;background:linear-gradient(135deg,var(--accent),var(--accent-light));border-color:var(--accent);color:#1a2a3a;" onclick="goStep3()">
                    ✓ Ya realicé mi pago — Confirmar inscripción
                  </button>
                </div>

                <div style='text-align:center;margin-top:10px'><button class="btn-back" onclick="showStep1(currentCourse)">\u2190 Volver a datos</button></div>`;
}

function solicitarDatosPago(curso, precio) {
  const nombre = enrollData.nombre || "";
  const msg = encodeURIComponent(
    `Hola, me interesa inscribirme al curso *${curso.replace(/\x60/g, "\\`")}* (${precio}).\n\nMi nombre es: ${nombre.replace(/\x60/g, "\\`")}\n\nPor favor env\u00EDenme los datos de pago. \u00A1Gracias! :)`,
  );
  window.open("https://wa.me/528719164677?text=" + msg, "_blank");
}

function goStep3() {
  const referencia =
    document.getElementById("f-referencia")?.value.trim() || "";
  enrollData.referencia = referencia;
  // Enviar notificación por WhatsApp al asesor con los datos del comprobante
  const c = currentCourse;
  const nombre = enrollData.nombre || "";
  const email = enrollData.email || "";
  const tel = enrollData.tel || "No proporcionado";
  const msg = encodeURIComponent(
    `✅ *NUEVO PAGO REGISTRADO — EPAD*\n\n📚 Curso: *${c.name}*\n💰 Monto: ${c.price}\n\n👤 Alumno: ${nombre} ${enrollData.apellido || ""}\n📧 Email: ${email}\n📱 Tel: ${tel}${referencia ? `\n🔖 Referencia: ${referencia}` : ""}\n\n_El alumno indica que ya realizó su transferencia. Favor de verificar y enviar accesos._`,
  );
  window.open("https://wa.me/528719164677?text=" + msg, "_blank");
  showPaymentSuccess();
}

function showPaymentSuccess() {
  const c = currentCourse;
  const referencia = enrollData.referencia || "";
  const folioId =
    "EPAD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("modal-body").innerHTML = `
                <div class="pay-steps">
                  <div class="pay-step done"><div class="step-circle">\u2713</div><div class="step-label">Datos</div></div>
                  <div class="pay-step done"><div class="step-circle">\u2713</div><div class="step-label">Pago</div></div>
                  <div class="pay-step active"><div class="step-circle">\u2713</div><div class="step-label">Confirmaci\u00F3n</div></div>
                </div>
                <div class="success-msg">
                  <div class="success-icon"><i data-lucide='check' style='color:var(--success)'></i></div>
                  <div class="success-title">\u00A1Solicitud registrada!</div>
                  <p class="success-desc">
                    Hola <strong>${enrollData.nombre.replace(/\x60/g, "\\`")}</strong>, hemos recibido tu solicitud de inscripci\u00F3n a <strong>${c.name.replace(/\x60/g, "\\`")}</strong> por <strong>${c.price.replace(/\x60/g, "\\`")}</strong>.<br><br>
                    Un asesor verificar\u00E1 tu pago y te enviar\u00E1 tus accesos a <strong>${enrollData.email.replace(/\x60/g, "\\`")}</strong> en breve.<br><br>
                    \u00A1Bienvenido/a a EPAD! \uD83C\uDF93
                  </p>
                  <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin:16px 0;font-size:12px;color:var(--success);text-align:left'>
                    <strong>Folio de solicitud:</strong> ${folioId} &nbsp;\u00B7&nbsp; ${new Date().toLocaleDateString("es-MX")}
                    ${referencia ? `<br><strong>Referencia de pago:</strong> ${referencia.replace(/</g, "&lt;")}` : ""}
                  </div>
                  <div style='background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:#7a6000;text-align:left;'>
                    \uD83D\uDCA1 <strong>Siguiente paso:</strong> Si a\u00FAn no lo has hecho, env\u00EDa tu comprobante de pago por WhatsApp para agilizar la activaci\u00F3n de tu cuenta.
                  </div>
                  <button class="btn-pay" style="background:#25d366;border-color:#25d366;margin-bottom:10px;" onclick="window.open('https://wa.me/528719164677?text=${encodeURIComponent("Hola, acabo de registrar mi pago. Mi folio es: " + folioId + ". Adjunto mi comprobante.")}','_blank')">
                    \u2705 Enviar comprobante por WhatsApp
                  </button>
                  <button class="btn-submit" style="margin-top:4px;background:var(--surface2);color:var(--text-secondary);border:1.5px solid var(--border);" onclick="closeModal()">Cerrar</button>
                </div>`;
}

function submitFree(courseName) {
  const nombre = document.getElementById("f-nombre").value.trim();
  const email = document.getElementById("f-email").value.trim();
  if (!nombre || !email) {
    alert("Por favor llena los campos requeridos.");
    return;
  }
  document.getElementById("modal-body").innerHTML = `
                <div class="success-msg">
                  <div class="success-icon"><i data-lucide='star' style='width:14px;height:14px;fill:currentColor'></i></div>
                  <div class="success-title">\u00A1Inscripci\u00F3n exitosa!</div>
                  <p class="success-desc">Hola <strong>${nombre.replace(/\x60/g, "\\`")}</strong>, te has inscrito a <strong>${courseName.replace(/\x60/g, "\\`")}</strong>.<br><br>En breve recibir\u00E1s un correo en <strong>${email.replace(/\x60/g, "\\`")}</strong> con tus credenciales de acceso.<br><br>\u00A1Bienvenido/a a EPAD!</p>
                  <button class="btn-submit" style="margin-top:16px" onclick="closeModal()">Cerrar</button>
                </div>`;
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

// ============================================================
// AUTH
// ============================================================
// ============================================================
// FIREBASE — Configuración
// Pasos para obtener estos valores:
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto → Agrega una app Web (</>)
// 3. Copia el firebaseConfig que te muestra y pégalo aquí:
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBn_s9pZ2hiKvcldj370DwUxtQdZFDQsUM",
  authDomain: "epad-10bea.firebaseapp.com",
  projectId: "epad-10bea",
  storageBucket: "epad-10bea.firebasestorage.app",
  messagingSenderId: "840894333945",
  appId: "1:840894333945:web:9537845922b06fb14f328",
  measurementId: "G-PJBVFHDXFL",
};

// Inicializar Firebase (los SDKs llegan desde index.html)
const fbApp = firebase.initializeApp(firebaseConfig);
const fbAuth = firebase.auth();
const fbDB = firebase.firestore();

// Estado global
let currentUser = null; // usuario de Firebase Auth
let currentPerfil = null; // doc de /perfiles/{uid}
let currentSuscripcion = null; // doc de /suscripciones/{uid}

// ── Escucha cambios de sesión (login / logout / refresh) ──────
fbAuth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    await cargarPerfilYSuscripcion(user.uid);
  } else {
    currentUser = null;
    currentPerfil = null;
    currentSuscripcion = null;
  }
  checkPlaneacionesAccess();
});

async function cargarPerfilYSuscripcion(uid) {
  try {
    const perfilSnap = await fbDB.collection("perfiles").doc(uid).get();
    currentPerfil = perfilSnap.exists ? perfilSnap.data() : null;

    const susSnap = await fbDB.collection("suscripciones").doc(uid).get();
    currentSuscripcion = susSnap.exists ? susSnap.data() : null;
  } catch (e) {
    console.error("Error cargando perfil:", e);
  }
}

// ── TRIAL / PAYWALL LOGIC ──────────────────────────────────────
const TRIAL_DAYS = 7;

function trialDaysLeft(trialFinTimestamp) {
  const fin = trialFinTimestamp?.toDate
    ? trialFinTimestamp.toDate()
    : new Date(trialFinTimestamp);
  const diff = Math.ceil((fin - Date.now()) / (24 * 60 * 60 * 1000));
  return diff;
}

function checkPlaneacionesAccess() {
  const banner = document.getElementById("trial-banner");
  const paywall = document.getElementById("paywall-msg");

  if (!currentUser || !currentSuscripcion) {
    if (paywall) {
      paywall.innerHTML = `
              <div class="paywall-icon"><i data-lucide='clipboard-list'></i></div>
              <div class="paywall-title">Acceso para docentes registrados</div>
              <div class="paywall-desc">Para usar las Planeaciones Didácticas necesitas una cuenta gratuita. ¡Los primeros 7 días son sin costo!</div>
              <div class="paywall-timer"><i data-lucide='gift'></i> 7 días gratis · Sin tarjeta requerida</div>
              <button class="paywall-btn" onclick="showUserLogin(); setTimeout(()=>switchToRegister(),100);"><i data-lucide='rocket'></i> Crear cuenta gratuita</button>
              <div class="paywall-login-link" onclick="showUserLogin()">¿Ya tienes cuenta? Inicia sesión</div>
            `;
      paywall.style.display = "flex";
    }
    if (banner) banner.style.display = "none";
    return false;
  }

  const s = currentSuscripcion;

  if (s.estado === "activa") {
    if (paywall) paywall.style.display = "none";
    if (banner) banner.style.display = "none";
    return true;
  }

  if (s.estado === "trial") {
    const left = trialDaysLeft(s.trial_fin);
    if (left > 0) {
      if (paywall) paywall.style.display = "none";
      if (banner) {
        banner.style.display = "flex";
        const el = document.getElementById("trial-days-left");
        if (el) el.textContent = left === 1 ? "1 día" : left + " días";
      }
      return true;
    }
  }

  // Trial vencido o cancelado
  if (paywall) {
    paywall.innerHTML = `
            <div class="paywall-icon"><i data-lucide='lock'></i></div>
            <div class="paywall-title">Suscripción Requerida</div>
            <div class="paywall-desc">Tu período de prueba gratuita de ${TRIAL_DAYS} días ha terminado. Para seguir creando Planeaciones Didácticas, activa tu suscripción.</div>
            <div class="paywall-timer"><i data-lucide='timer'></i> Tu prueba venció · Acceso bloqueado</div>
            <button class="paywall-btn" onclick="openPaywallModal()"><i data-lucide='rocket'></i> Activar suscripción — $149/mes</button>
            <div class="paywall-login-link" onclick="doLogoutDocente()">Cerrar sesión</div>
          `;
    paywall.style.display = "flex";
  }
  if (banner) banner.style.display = "none";
  return false;
}

function openPaywallModal() {
  alert(
    "🚀 Módulo de pago próximamente.\n\nContacta a EPAD para activar tu suscripción:\n📱 WhatsApp · 📧 contacto@epad.mx\n\nPrecio: $149/mes — Acceso ilimitado a Planeaciones IA",
  );
}

// ── REGISTER (Docente — Trial) ────────────────────────────────
async function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();
  const errEl = document.getElementById("reg-error");
  const btnReg = document.querySelector("#register-form .btn-login");

  if (!name || !email || !pass) {
    errEl.textContent = "Por favor completa todos los campos.";
    errEl.style.display = "block";
    return;
  }
  if (pass.length < 6) {
    errEl.textContent = "La contraseña debe tener al menos 6 caracteres.";
    errEl.style.display = "block";
    return;
  }

  errEl.style.display = "none";
  if (btnReg) {
    btnReg.disabled = true;
    btnReg.textContent = "Creando cuenta…";
  }

  try {
    const cred = await fbAuth.createUserWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;
    const now = firebase.firestore.Timestamp.now();
    const trialFin = firebase.firestore.Timestamp.fromDate(
      new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
    );

    // Crear perfil en Firestore
    await fbDB.collection("perfiles").doc(uid).set({
      nombre: name,
      email: email,
      rol: "docente",
      creadoEn: now,
    });

    // Crear suscripción trial
    await fbDB.collection("suscripciones").doc(uid).set({
      usuarioId: uid,
      estado: "trial",
      plan: "mensual",
      trialInicio: now,
      trial_fin: trialFin,
      creadoEn: now,
    });

    if (btnReg) {
      btnReg.disabled = false;
      btnReg.textContent = "🎉 Crear cuenta y comenzar prueba";
    }
    showPublic();
    showToast(
      "✓ ¡Bienvenido/a " +
        name.split(" ")[0] +
        "! Tienes " +
        TRIAL_DAYS +
        " días de acceso gratuito.",
    );
    setTimeout(() => {
      document
        .getElementById("planeaciones")
        .scrollIntoView({ behavior: "smooth" });
      checkPlaneacionesAccess();
    }, 300);
  } catch (e) {
    if (btnReg) {
      btnReg.disabled = false;
      btnReg.textContent = "🎉 Crear cuenta y comenzar prueba";
    }
    const msgs = {
      "auth/email-already-in-use":
        "Este correo ya tiene una cuenta. Inicia sesión.",
      "auth/invalid-email": "El correo no es válido.",
      "auth/weak-password": "La contraseña es muy débil (mínimo 6 caracteres).",
    };
    errEl.textContent = msgs[e.code] || "Error: " + e.message;
    errEl.style.display = "block";
  }
}

// ── USER LOGIN (Docente) ──────────────────────────────────────
async function doUserLogin() {
  const email = document.getElementById("user-email").value.trim();
  const pass = document.getElementById("user-pass").value.trim();
  const errEl = document.getElementById("user-login-error");
  const btn = document.querySelector("#user-login-form .btn-login");

  errEl.style.display = "none";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Iniciando sesión…";
  }

  try {
    await fbAuth.signInWithEmailAndPassword(email, pass);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Acceder a Planeaciones";
    }
    showPublic();
    setTimeout(() => {
      document
        .getElementById("planeaciones")
        .scrollIntoView({ behavior: "smooth" });
      checkPlaneacionesAccess();
    }, 300);
  } catch (e) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Acceder a Planeaciones";
    }
    errEl.textContent = "Correo o contraseña incorrectos.";
    errEl.style.display = "block";
  }
}

async function doLogoutDocente() {
  await fbAuth.signOut();
  currentUser = null;
  currentPerfil = null;
  currentSuscripcion = null;
  checkPlaneacionesAccess();
}

function showUserLogin() {
  document.getElementById("public-site").style.display = "none";
  document.getElementById("login-page").style.display = "flex";
  document.getElementById("dashboard-page").style.display = "none";
  switchToUserLogin();
}

function switchToLogin() {
  document.getElementById("admin-login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("user-login-form").style.display = "none";
}
function switchToRegister() {
  document.getElementById("admin-login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
  document.getElementById("user-login-form").style.display = "none";
}
function switchToUserLogin() {
  document.getElementById("admin-login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("user-login-form").style.display = "block";
}

// ── ADMIN LOGIN (Panel de administración) ─────────────────────
async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();
  const err = document.getElementById("login-error");
  const btn = document.querySelector("#admin-login-form .btn-login");

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Verificando…";
  }

  try {
    const cred = await fbAuth.signInWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;

    // Verificar rol admin en Firestore
    const perfilSnap = await fbDB.collection("perfiles").doc(uid).get();
    const perfil = perfilSnap.data();

    if (!perfil || perfil.rol !== "admin") {
      err.textContent = "No tienes permisos de administrador.";
      err.style.display = "block";
      await fbAuth.signOut();
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Acceder al panel";
      }
      return;
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Acceder al panel";
    }
    document.getElementById("login-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "block";
    initDashboard();
  } catch (e) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Acceder al panel";
    }
    err.style.display = "block";
    setTimeout(() => (err.style.display = "none"), 3000);
  }
}

async function doLogout() {
  await fbAuth.signOut();
  document.getElementById("dashboard-page").style.display = "none";
  document.getElementById("login-email").value = "";
  document.getElementById("login-pass").value = "";
  showPublic();
}

document.getElementById("login-pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
document.getElementById("login-email").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("login-pass").focus();
});

// ============================================================
// DASHBOARD NAV
// ============================================================
function showSection(name, el) {
  document
    .querySelectorAll(".section-dash")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("section-" + name).classList.add("active");
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  el.classList.add("active");
  const titles = {
    overview: "Resumen general",
    analytics: "Anal\u00EDticas",
    users: "Usuarios",
    projects: "Proyectos",
    revenue: "Ingresos",
    reports: "Reportes",
    videos: "Videos",
    courses: "Cursos",
    settings: "Configuraci\u00F3n",
    "zona-materiales": "Zona de Aprendizaje",
  };
  document.getElementById("topbar-title").textContent = titles[name] || name;
}
function updateDate() {
  const el = document.getElementById("topbar-date");
  if (el)
    el.textContent = new Date().toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}

// ============================================================
// CHARTS
// ============================================================
function renderBarChart(id, d1, d2, labels) {
  const el = document.getElementById(id);
  if (!el) return;
  const max = Math.max(...d1, ...d2) || 1;
  el.innerHTML = labels
    .map((l, i) => {
      const h1 = Math.round((d1[i] / max) * 130),
        h2 = Math.round((d2[i] / max) * 130);
      return `<div class="bar-group">
                  <div style='display:flex;gap:3px;align-items:flex-end;height:130px'>
                    <div class="bar primary" style="height:${h1}px" data-label="2024: $${d1[i]}K"></div>
                    <div class="bar secondary" style="height:${h2}px" data-label="2025: $${d2[i]}K"></div>
                  </div>
                  <div class="bar-label">${l}</div>
                </div>`;
    })
    .join("");
  el.querySelectorAll(".bar").forEach((bar) => {
    bar.addEventListener("mouseenter", () => {
      const t = document.getElementById("tooltip");
      t.textContent = bar.dataset.label;
      t.style.opacity = "1";
    });
    bar.addEventListener("mousemove", (e) => {
      const t = document.getElementById("tooltip");
      t.style.left = e.pageX + 10 + "px";
      t.style.top = e.pageY - 30 + "px";
    });
    bar.addEventListener(
      "mouseleave",
      () => (document.getElementById("tooltip").style.opacity = "0"),
    );
  });
}

function renderDonut() {
  const data = [
    { label: "Software", val: 42, color: "#1a3a5c" },
    { label: "Consultor\u00EDa", val: 28, color: "#c8952a" },
    { label: "Soporte", val: 18, color: "#1e6b45" },
    { label: "Otros", val: 12, color: "#b22222" },
  ];
  const total = data.reduce((s, d) => s + d.val, 0);
  const cx = 70,
    cy = 70,
    r = 55,
    stroke = 22,
    circ = 2 * Math.PI * r;
  let offset = 0,
    paths = "";
  data.forEach((d) => {
    const pct = d.val / total,
      dash = pct * circ,
      gap = circ - dash;
    paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;
  });
  document.getElementById("donut-wrap").innerHTML = `
                <svg width="140" height="140" viewBox="0 0 140 140">${paths}
                  <text x="70" y="68" text-anchor="middle" font-size="13" font-weight="700" fill="var(--primary)" font-family="Merriweather,serif">Total</text>
                  <text x="70" y="84" text-anchor="middle" font-size="11" fill="var(--text-muted)">100%</text>
                </svg>
                <div class="donut-legend">${data.map((d) => `<div class="donut-item"><div class="donut-dot" style='background:${d.color}'></div><span style='flex:1;font-size:12px'>${d.label}</span><span style='font-size:12px;font-weight:600;color:var(--primary)'>${d.val}%</span></div>`).join("")}</div>`;
}

function renderLineChart() {
  const w = document.getElementById("line-chart-wrap");
  if (!w) return;
  const vals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const ww = w.clientWidth || 600,
    wh = 160,
    pad = 20;
  const minV = Math.min(...vals),
    maxV = Math.max(...vals),
    range = maxV - minV || 1;
  const pts = vals.map((v, i) => [
    pad + (i * (ww - pad * 2)) / (vals.length - 1),
    wh - pad - ((v - minV) / range) * (wh - pad * 2),
  ]);
  const path = "M" + pts.map((p) => p.join(",")).join(" L");
  const area =
    "M" +
    pts[0][0] +
    "," +
    wh +
    " L" +
    pts.map((p) => p.join(",")).join(" L") +
    " L" +
    pts[pts.length - 1][0] +
    "," +
    wh +
    " Z";
  w.innerHTML = `<svg width="100%" height="${wh}" viewBox="0 0 ${ww} ${wh}" preserveAspectRatio="none">
                <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--primary)" stop-opacity="0.15"/><stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/></linearGradient></defs>
                <path d="${area}" fill="url(#lg)"/>
                <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--primary)"><title>Sem ${i + 1}: ${vals[i]}</title></circle>`).join("")}
              </svg>`;
}

function renderActivity() {
  const items = [];
  document.getElementById("activity-feed").innerHTML = items
    .map(
      (i) => `
                <div class="activity-item">
                  <div class="activity-dot ${i.cls}">${i.icon}</div>
                  <div class="activity-text"><div class="a-title">${i.title}</div><div class="a-time">${i.time}</div></div>
                </div>`,
    )
    .join("");
}

function renderProgress() {
  const bars = [
    { label: "Ventas", val: 88, color: "var(--primary)" },
    { label: "Soporte", val: 74, color: "var(--accent)" },
    { label: "Desarrollo", val: 91, color: "var(--success-light)" },
    { label: "Marketing", val: 62, color: "var(--warning)" },
    { label: "Operaciones", val: 80, color: "#7c3aed" },
  ];
  document.getElementById("progress-bars").innerHTML = bars
    .map(
      (b) => `
                <div class="progress-item">
                  <div class="progress-header"><span>${b.label}</span><span style='color:var(--text-muted)'>${b.val}%</span></div>
                  <div class="progress-track"><div class="progress-fill" style='width:${b.val}%;background:${b.color}'></div></div>
                </div>`,
    )
    .join("");
}

function renderUsers() {
  const users = [
    // TODO: Agrega aqu\u00ED los usuarios
  ];
  window._users = users;
  renderUsersTable(users);
}

function renderUsersTable(users) {
  const sl = {
    active: "Activo",
    pending: "Pendiente",
    inactive: "Inactivo",
  };
  document.getElementById("users-tbody").innerHTML = users
    .map(
      (u) => `
                <tr>
                  <td><strong>${u.name}</strong></td>
                  <td style='color:var(--text-muted)'>${u.email}</td>
                  <td>${u.role}</td>
                  <td style='color:var(--text-muted)'>${u.last}</td>
                  <td><span class="status-badge ${u.status}">${sl[u.status]}</span></td>
                </tr>`,
    )
    .join("");
}

function filterTable(q) {
  const f = window._users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()) ||
      u.role.toLowerCase().includes(q.toLowerCase()),
  );
  renderUsersTable(f);
}

// ============================================================
// PROJECTS \u2014 DYNAMIC + EDITABLE
// ============================================================
let PROJECTS = [
  // TODO: Agrega aqu\u00ED los proyectos
];
let projIdCounter = 6;

function renderProjects() {
  const sl = {
    active: "En curso",
    pending: "En revisi\u00F3n",
    done: "Completado",
  };
  document.getElementById("projects-tbody").innerHTML = PROJECTS.map(
    (p) => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td style='color:var(--text-muted)'>${p.client}</td>
                  <td>
                    <div style='display:flex;align-items:center;gap:8px'>
                      <div class="progress-track" style='flex:1;height:6px'><div class="progress-fill" style='width:${p.pct}%;background:var(--primary)'></div></div>
                      <span style='font-size:11px;color:var(--text-muted);white-space:nowrap;min-width:28px'>${p.pct}%</span>
                    </div>
                  </td>
                  <td style='color:var(--text-muted)'>${formatDate(p.due)}</td>
                  <td><span class="status-badge ${p.status === "done" ? "active" : p.status}">${sl[p.status]}</span></td>
                  <td>
                    <button class="edit-btn" onclick="editProject(${p.id})">Editar</button>
                    <button class="del-btn" onclick="deleteProject(${p.id})">Eliminar</button>
                  </td>
                </tr>`,
  ).join("");
  updateProjKPIs();
}

function updateProjKPIs() {
  const active = PROJECTS.filter((p) => p.status === "active").length;
  const pending = PROJECTS.filter((p) => p.status === "pending").length;
  const done = PROJECTS.filter((p) => p.status === "done").length;
  document.getElementById("proj-kpi-active").textContent = active;
  document.getElementById("proj-kpi-pending").textContent = pending;
  document.getElementById("proj-kpi-done").textContent = done;
  document.getElementById("proj-kpi-total").textContent = PROJECTS.length;
  document.getElementById("kpi-projects").textContent = active;
}

function renderPublicProjects() {
  try {
    const grid = document.getElementById("projects-grid");
    if (!grid) {
      console.warn("projects-grid not found");
      return;
    }
    if (!PROJECTS || PROJECTS.length === 0) {
      grid.innerHTML =
        '<p style="color:var(--text-muted);text-align:center;padding:24px 0;">No hay proyectos disponibles.</p>';
      return;
    }
    const _sl = {
      active: "En curso",
      pending: "En revisi\u00F3n",
      done: "Completado",
    };
    const _sc = {
      active: "var(--success)",
      pending: "var(--warning)",
      done: "var(--primary)",
    };
    grid.innerHTML = PROJECTS.map(
      (p) => `
                  <div style='background:var(--surface);border-radius:var(--radius-lg);padding:20px;box-shadow:var(--shadow-sm);border:1px solid var(--border-light);margin-bottom:12px;'>
                    <div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;'>
                      <strong>${p.name}</strong>
                      <span style="background:${_sc[p.status] || "var(--primary)"};color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;">${_sl[p.status] || p.status}</span>
                    </div>
                    <div style='color:var(--text-muted);font-size:13px;margin-bottom:8px;'>${p.client}</div>
                    <div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'>
                      <div style='flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;'>
                        <div style='width:${p.pct}%;height:100%;background:var(--primary);border-radius:3px;'></div>
                      </div>
                      <span style='font-size:11px;color:var(--text-muted);'>${p.pct}%</span>
                    </div>
                    <span style='font-size:12px;color:var(--text-muted);'>Fecha l\u00EDmite: ${formatDate(p.due)}</span>
                  </div>`,
    ).join("");
  } catch (e) {
    console.error("renderPublicProjects error:", e);
  }
}

function renderAdminCourses() {
  const tbody = document.getElementById("courses-tbody");
  if (!tbody) return;
  if (COURSES.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px 0;">A\u00FAn no hay cursos. Haz clic en <strong>+ Agregar curso</strong> para comenzar.</td></tr>';
    return;
  }
  tbody.innerHTML = COURSES.map(
    (c) => `
                      <tr>
                        <td>${c.name}</td>
                        <td>${c.catLabel || c.cat || "General"}</td>
                        <td>${c.price || "-"}</td>
                        <td>${c.hours || "-"}</td>
                        <td>${c.students || "-"}</td>
                        <td>
                          <button class="edit-btn" onclick="openCourseModal(${c.id})">Editar</button>
                          <button class="del-btn" onclick="deleteCourse(${c.id})">Eliminar</button>
                        </td>
                      </tr>
                    `,
  ).join("");
}

function openCourseModal(editId) {
  document.getElementById("c-name").value = "";
  document.getElementById("c-desc").value = "";
  document.getElementById("c-cat").value = "";
  document.getElementById("c-price").value = "";
  document.getElementById("c-hours").value = "";
  document.getElementById("c-students").value = "";
  document.getElementById("c-rating").value = "";
  document.getElementById("c-badge").value = "";
  document.getElementById("c-color").value = "#2563eb";
  document.getElementById("c-icon").value = "ICN";
  const overlay = document.getElementById("course-modal-overlay");
  overlay.dataset.editId = editId || "";
  if (editId) {
    const c = COURSES.find((x) => x.id === parseInt(editId));
    if (c) {
      document.getElementById("c-name").value = c.name;
      document.getElementById("c-desc").value = c.desc || "";
      document.getElementById("c-cat").value = c.cat || "";
      document.getElementById("c-price").value = c.price || "";
      document.getElementById("c-hours").value = c.hours || "";
      document.getElementById("c-students").value = c.students || "";
      document.getElementById("c-rating").value = c.rating || "";
      document.getElementById("c-badge").value = c.badge || "";
      document.getElementById("c-color").value = c.color || "#2563eb";
      document.getElementById("c-icon").value = c.icon || "ICN";
    }
  }
  overlay.classList.add("open");
}

function closeCourseModal() {
  document.getElementById("course-modal-overlay").classList.remove("open");
}

function saveCourse() {
  const name = document.getElementById("c-name").value.trim();
  const desc = document.getElementById("c-desc").value.trim();
  const cat = document.getElementById("c-cat").value.trim();
  const price = document.getElementById("c-price").value.trim();
  const hours = document.getElementById("c-hours").value.trim();
  const students = document.getElementById("c-students").value.trim();
  const rating = document.getElementById("c-rating").value.trim();
  const badge = document.getElementById("c-badge").value;
  const color = document.getElementById("c-color").value || "#2563eb";
  const icon = document.getElementById("c-icon").value || "ICN";
  if (!name || !desc) {
    alert("Por favor completa el nombre y la descripci\u00F3n del curso.");
    return;
  }
  const overlay = document.getElementById("course-modal-overlay");
  const editId = overlay.dataset.editId;
  const course = {
    id: editId ? parseInt(editId) : courseIdCounter++,
    name,
    desc,
    cat,
    catLabel: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "General",
    hours: hours || "-",
    students: students || "-",
    rating: rating || "-",
    price: price || "Gratis",
    badge: badge || "",
    color,
    icon,
  };
  if (editId) {
    const idx = COURSES.findIndex((x) => x.id === parseInt(editId));
    if (idx >= 0) COURSES[idx] = { ...COURSES[idx], ...course };
  } else {
    COURSES.push(course);
  }
  saveState();
  renderAdminCourses();
  renderCourses();
  closeCourseModal();
  showToast(
    editId
      ? "Curso actualizado correctamente."
      : "Curso agregado correctamente.",
  );
}

function deleteCourse(id) {
  if (!confirm("\u00BFDesea eliminar este curso?")) return;
  COURSES = COURSES.filter((c) => c.id !== id);
  saveState();
  renderAdminCourses();
  renderCourses();
  showToast("Curso eliminado.");
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function saveState() {
  localStorage.setItem("epad_courses", JSON.stringify(COURSES));
  localStorage.setItem("epad_projects", JSON.stringify(PROJECTS));
  localStorage.setItem("epad_videos", JSON.stringify(VIDEOS));
  localStorage.setItem("epad_course_id", String(courseIdCounter));
  localStorage.setItem("epad_project_id", String(projIdCounter));
  localStorage.setItem("epad_video_id", String(videoIdCounter));
}

function loadState() {
  try {
    const storedCourses = JSON.parse(
      localStorage.getItem("epad_courses") || "null",
    );
    const storedProjects = JSON.parse(
      localStorage.getItem("epad_projects") || "null",
    );
    const storedVideos = JSON.parse(
      localStorage.getItem("epad_videos") || "null",
    );
    const storedCourseId = parseInt(localStorage.getItem("epad_course_id"), 10);
    const storedProjectId = parseInt(
      localStorage.getItem("epad_project_id"),
      10,
    );
    const storedVideoId = parseInt(localStorage.getItem("epad_video_id"), 10);

    if (Array.isArray(storedCourses)) {
      COURSES = storedCourses;
    }
    if (Array.isArray(storedProjects)) {
      PROJECTS = storedProjects;
    }
    if (Array.isArray(storedVideos)) {
      VIDEOS = storedVideos;
    }
    if (!Number.isNaN(storedCourseId) && storedCourseId > courseIdCounter) {
      courseIdCounter = storedCourseId;
    }
    if (!Number.isNaN(storedProjectId) && storedProjectId > projIdCounter) {
      projIdCounter = storedProjectId;
    }
    if (!Number.isNaN(storedVideoId) && storedVideoId > videoIdCounter) {
      videoIdCounter = storedVideoId;
    }
  } catch (error) {
    console.warn("No se pudo cargar el estado local:", error);
  }
}

function openProjectModal(editId) {
  const overlay = document.getElementById("proj-modal-overlay");
  // Reset form
  document.getElementById("p-nombre").value = "";
  document.getElementById("p-cliente").value = "";
  document.getElementById("p-fecha").value = "";
  document.getElementById("p-status").value = "active";
  document.getElementById("p-pct").value = 0;
  document.getElementById("p-pct-val").textContent = "0%";
  document.getElementById("p-desc").value = "";
  overlay.dataset.editId = "";
  if (editId) {
    const p = PROJECTS.find((x) => x.id === editId);
    if (p) {
      document.getElementById("p-nombre").value = p.name;
      document.getElementById("p-cliente").value = p.client;
      document.getElementById("p-fecha").value = p.due;
      document.getElementById("p-status").value = p.status;
      document.getElementById("p-pct").value = p.pct;
      document.getElementById("p-pct-val").textContent = p.pct + "%";
      overlay.dataset.editId = editId;
    }
  }
  overlay.classList.add("open");
}

function closeProjModal() {
  document.getElementById("proj-modal-overlay").classList.remove("open");
}

function saveProject() {
  const nombre = document.getElementById("p-nombre").value.trim();
  const cliente = document.getElementById("p-cliente").value.trim();
  const fecha = document.getElementById("p-fecha").value;
  const status = document.getElementById("p-status").value;
  const pct = parseInt(document.getElementById("p-pct").value);
  if (!nombre || !cliente || !fecha) {
    alert("Por favor completa los campos obligatorios (*).");
    return;
  }
  const editId = document.getElementById("proj-modal-overlay").dataset.editId;
  if (editId) {
    const idx = PROJECTS.findIndex((p) => p.id === parseInt(editId));
    if (idx >= 0) {
      PROJECTS[idx] = {
        ...PROJECTS[idx],
        name: nombre,
        client: cliente,
        due: fecha,
        status,
        pct,
      };
    }
  } else {
    PROJECTS.push({
      id: projIdCounter++,
      name: nombre,
      client: cliente,
      pct,
      due: fecha,
      status,
    });
  }
  saveState();
  renderProjects();
  renderPublicProjects();
  closeProjModal();
  showToast(
    editId
      ? "Proyecto actualizado correctamente."
      : "Proyecto agregado correctamente.",
  );
}

function editProject(id) {
  openProjectModal(id);
}

function deleteProject(id) {
  if (!confirm("\u00BFDesea eliminar este proyecto?")) return;
  PROJECTS = PROJECTS.filter((p) => p.id !== id);
  saveState();
  renderProjects();
  renderPublicProjects();
  showToast("Proyecto eliminado.");
}

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;bottom:28px;right:28px;background:var(--primary-dark);color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:9000;box-shadow:0 4px 20px rgba(0,0,0,0.2);transition:opacity 0.3s";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 3000);
}

function renderReports() {
  const r = [];
  document.getElementById("reports-list").innerHTML = r
    .map(
      (x) => `
                <div style='display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border-light)'>
                  <div style='display:flex;align-items:center;gap:14px'>
                    <div style='font-size:22px'>${x.type}</div>
                    <div><div style='font-size:14px;font-weight:500;color:var(--text)'>${x.name}</div><div style='font-size:12px;color:var(--text-muted)'>${x.date} \u00B7 ${x.size}</div></div>
                  </div>
                  <button class="topbar-btn" onclick="alert('Descargando ${x.name}...')">&#8659; Descargar</button>
                </div>`,
    )
    .join("");
}

function renderRevenueChart() {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const vals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  renderBarChart(
    "revenue-chart",
    vals.map((v) => Math.round(v * 0.85)),
    vals,
    months,
  );
}

function initDashboard() {
  updateDate();
  setInterval(updateDate, 60000);
  renderBarChart(
    "bar-chart",
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  );
  renderDonut();
  renderActivity();
  renderProgress();
  renderUsers();
  renderProjects();
  renderReports();
  renderRevenueChart();
  renderAdminVideos();
  renderAdminCourses();
  setTimeout(renderLineChart, 200);
  document.querySelectorAll(".cf-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".chart-filter")
        .querySelectorAll(".cf-btn")
        .forEach((b) => b.classList.remove("active"));
    });
  });
}

function initApp() {
  try {
    console.log("1. loadState");
    loadState();
    console.log("2. showPublic");
    showPublic();
    console.log("3. renderCourses");
    renderCourses();
    console.log("4. renderTestimonials");
    renderTestimonials();
    console.log("5. renderPublicVideos");
    renderPublicVideos();
    console.log("6. renderPublicProjects");
    renderPublicProjects();
    console.log("7. checkPlaneacionesAccess");
    checkPlaneacionesAccess();
    console.log("App initialized successfully");
  } catch (e) {
    console.error("Error in initApp:", e);
    // Show app anyway
    showPublic();
  }
}

// ============================================================
// VIDEOS \u2014 GESTI\u00D3N
// ============================================================
let VIDEOS = [
  {
    id: 1,
    title: "CALIDAD",
    desc: "Descubre c\u00F3mo garantizamos resultados de alto impacto en cada proyecto.",
    url: "1.mp4",
    duration: "3:12",
    cat: "Presentaci\u00F3n",
  },
  {
    id: 2,
    title: "COMODIDAD",
    desc: "Conoce nuestra experiencia de aprendizaje flexible y accesible para todos.",
    url: "2.mp4",
    duration: "2:48",
    cat: "Experiencia",
  },
  {
    id: 3,
    title: "EFECTIVIDAD",
    desc: "Ve ejemplos reales de c\u00F3mo transformamos conocimientos en resultados.",
    url: "3.mp4",
    duration: "4:05",
    cat: "Impacto",
  },
];
let videoIdCounter = 4;

function getEmbedUrl(url) {
  if (!url) return null;
  let yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return "https://www.youtube.com/embed/" + yt[1];
  if (url.includes("youtube.com/embed/")) return url;
  let vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return "https://player.vimeo.com/video/" + vi[1];
  if (/\.(mp4|webm|ogg)/i.test(url)) return url;
  return null;
}

function previewVideoUrl(val) {
  const embed = getEmbedUrl(val);
  const wrap = document.getElementById("v-preview-wrap");
  const frame = document.getElementById("v-preview");
  if (embed && !/\.(mp4|webm|ogg)/i.test(embed)) {
    frame.src = embed;
    wrap.style.display = "block";
  } else {
    frame.src = "";
    wrap.style.display = "none";
  }
}

function openVideoModal(editId) {
  document.getElementById("v-titulo").value = "";
  document.getElementById("v-desc").value = "";
  document.getElementById("v-url").value = "";
  document.getElementById("v-duracion").value = "";
  document.getElementById("v-cat").value = "";
  document.getElementById("v-preview-wrap").style.display = "none";
  document.getElementById("v-preview").src = "";
  const overlay = document.getElementById("video-modal-overlay");
  overlay.dataset.editId = editId || "";
  if (editId) {
    const v = VIDEOS.find((x) => x.id === editId);
    if (v) {
      document.getElementById("v-titulo").value = v.title;
      document.getElementById("v-desc").value = v.desc || "";
      document.getElementById("v-url").value = v.url;
      document.getElementById("v-duracion").value = v.duration || "";
      document.getElementById("v-cat").value = v.cat || "";
      previewVideoUrl(v.url);
    }
  }
  overlay.classList.add("open");
}

function closeVideoModal() {
  document.getElementById("video-modal-overlay").classList.remove("open");
  document.getElementById("v-preview").src = "";
}

function saveVideo() {
  const title = document.getElementById("v-titulo").value.trim();
  const url = document.getElementById("v-url").value.trim();
  if (!title || !url) {
    alert("Por favor completa el t\u00EDtulo y la URL del video.");
    return;
  }
  const overlay = document.getElementById("video-modal-overlay");
  const editId = overlay.dataset.editId;
  const videoObj = {
    id: editId ? parseInt(editId) : videoIdCounter++,
    title,
    desc: document.getElementById("v-desc").value.trim(),
    url,
    duration: document.getElementById("v-duracion").value.trim(),
    cat: document.getElementById("v-cat").value.trim(),
  };
  if (editId) {
    const idx = VIDEOS.findIndex((v) => v.id === parseInt(editId));
    if (idx >= 0) VIDEOS[idx] = videoObj;
  } else {
    VIDEOS.push(videoObj);
  }
  saveState();
  closeVideoModal();
  renderAdminVideos();
  renderPublicVideos();
  showToast(
    editId
      ? "Video actualizado correctamente."
      : "Video agregado correctamente.",
  );
}

function deleteVideo(id) {
  if (!confirm("\u00BFDesea eliminar este video?")) return;
  VIDEOS = VIDEOS.filter((v) => v.id !== id);
  saveState();
  renderAdminVideos();
  renderPublicVideos();
  showToast("Video eliminado.");
}

function renderAdminVideos() {
  const list = document.getElementById("admin-videos-list");
  if (!list) return;
  if (VIDEOS.length === 0) {
    list.innerHTML =
      '<div style="text-align:center;padding:40px 0;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:12px;">VIDEO</div><div style="font-size:14px;">A\u00FAn no hay videos. Haz clic en <strong>+ Agregar video</strong> para comenzar.</div></div>';
    return;
  }
  list.innerHTML = VIDEOS.map((v) => {
    const embed = getEmbedUrl(v.url);
    let thumbHtml = "VIDEO";
    if (embed && embed.includes("youtube.com/embed/")) {
      const vid = embed.split("/embed/")[1];
      thumbHtml =
        '<img src="https://img.youtube.com/vi/' +
        vid +
        '/mqdefault.jpg" style="width:100%;height:100%;object-fit:cover;">';
    }
    return (
      '<div class="admin-video-card">' +
      '<div class="admin-video-thumb">' +
      thumbHtml +
      "</div>" +
      '<div class="admin-video-info">' +
      '<div class="admin-video-title">' +
      v.title +
      "</div>" +
      '<div class="admin-video-url">' +
      v.url +
      "</div>" +
      (v.cat
        ? '<div style="font-size:11px;color:var(--accent);margin-top:3px;">' +
          v.cat +
          (v.duration ? " \u00B7 " + v.duration : "") +
          "</div>"
        : "") +
      "</div>" +
      '<div class="admin-video-actions">' +
      '<button class="edit-btn" onclick="openVideoModal(' +
      v.id +
      ')">Editar</button>' +
      '<button class="del-btn" onclick="deleteVideo(' +
      v.id +
      ')">Eliminar</button>' +
      "</div></div>"
    );
  }).join("");
}

function renderPublicVideos() {
  try {
    const grid = document.getElementById("videos-grid");
    const empty = document.getElementById("videos-empty");
    if (!grid) {
      console.warn("videos-grid not found");
      return;
    }
    if (!VIDEOS || VIDEOS.length === 0) {
      grid.innerHTML = "";
      if (empty) empty.style.display = "flex";
      return;
    }
    if (empty) empty.style.display = "none";
    grid.innerHTML = VIDEOS.map((v, idx) => {
      const embed = getEmbedUrl(v.url);
      const isHero = idx === 0;
      let mediaHtml = "";
      if (embed && /\.(mp4|webm|ogg)/i.test(embed)) {
        mediaHtml = `<video class="vid-frame" src="${embed}" autoplay muted loop playsinline style='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;'></video>`;
      } else if (embed) {
        const sep = embed.includes("?") ? "&" : "?";
        mediaHtml = `<iframe class="vid-frame" src="${embed}${sep}autoplay=0&mute=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style='position:absolute;top:0;left:0;width:100%;height:100%;border:none;'></iframe>`;
      } else {
        mediaHtml = `<div style='position:absolute;inset:0;background:linear-gradient(135deg,#1a3a5c,#122840);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;'>
                      <div style='font-size:48px;'>&#9654;</div>
                      <div style='color:rgba(255,255,255,0.5);font-size:13px;'>Video no disponible</div>
                    </div>`;
      }
      return `
                  <div class="video-card${isHero ? " vid-hero" : ""}" onclick="this.querySelector('.vid-frame') && (this.querySelector('.vid-frame').src += '')">
                    <div class="video-thumb-wrap" style="position:relative;padding-top:${isHero ? "48%" : "56.25%"};background:#000;overflow:hidden;">
                      ${mediaHtml}
                      <div class="vid-overlay">
                        ${v.cat ? `<div class="vid-cat">${v.cat}</div>` : ""}
                        <div class="vid-title-label">${v.title}</div>
                        ${v.duration ? `<div class="vid-duration">\u23F1 ${v.duration}</div>` : ""}
                      </div>
                    </div>
                  </div>`;
    }).join("");
  } catch (e) {
    console.error("renderPublicVideos error:", e);
  }
}

function vidToggleMute(btn) {
  const card = btn.closest(".video-card");
  const frame = card.querySelector(".vid-frame");
  if (!frame) return;
  btn._muted = btn._muted === undefined ? true : !btn._muted;
  btn._muted = !btn._muted;
  // Reload iframe with mute toggled
  const url = new URL(frame.src);
  url.searchParams.set("mute", btn._muted ? "1" : "0");
  frame.src = url.toString();
  btn.textContent = btn._muted ? "[muted]" : "[sound]";
}

// ============================================================
// WHATSAPP BOT \u2014 Con IA (Claude API) + Flujo mejorado
// ============================================================
const WA_NUMBER = "528719164677";
const WA_BOT_NAME = "Asistente EPAD";

// Modos: solo "menu" ahora
let waChatOpen = false;
let waStarted = false;

// \u2500\u2500 Flujo de men\u00FA mejorado \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const WA_FLOW = {
  start: {
    msg: "Hola. Bienvenido a *EPAD* \u2014 Equipo Pedag\u00F3gico de Apoyo Docente.\n\nSoy tu asistente virtual. \u00BFEn qu\u00E9 puedo ayudarte hoy?",
    options: [
      { label: "Planes USICAMM 2026", next: "usicamm" },
      {
        label: "Promoci\u00F3n Vertical 2026",
        next: "promocion_vertical",
      },
      { label: "Ver todos los cursos", next: "cursos" },
      { label: "Precios y formas de pago", next: "precios" },
      { label: "Preguntas frecuentes", next: "faq" },
      { label: "Hablar con un asesor", next: "asesor" },
    ],
  },

  cursos: {
    msg: `En *EPAD* tenemos:\n\n\u2022 *USICAMM 2026* \u2014 Cuadernillo, Simulador, Plataforma y Plan Completo\n\u2022 *Promoci\u00F3n Vertical 2026* \u2014 Direcci\u00F3n y Supervisi\u00F3n\n\u2022 *Tecnolog\u00EDa* \u00B7 *Negocios* \u00B7 *Dise\u00F1o* \u00B7 *Marketing* \u00B7 *Liderazgo*\n\n\u00BFQu\u00E9 te interesa?`,
    options: [
      { label: "USICAMM 2026", next: "usicamm" },
      {
        label: "Promoci\u00F3n Vertical 2026",
        next: "promocion_vertical",
      },
      { label: "Ver precios", next: "precios" },
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  usicamm: {
    msg: `&#9635; *Planes USICAMM 2026 \u2014 EPAD*\n\nPrep\u00E1rate con los mejores:\n*Profa. Roc\u00EDo \u00B7 El Crack \u00B7 Profe Paco R\u00EDos \u00B7 Mtra. Azalhia*\n\n&#9636; *Cuadernillo* \u2014 Material de estudio completo\n&#8982; *Simulador* \u2014 Reactivos reales cronometrados\n&#9632; *Plataforma web* \u2014 Contenido + seguimiento de avance\n&#9654; *Plan Completo* \u2014 Todo incluido + Sesiones en vivo + Dudas\n\n<i data-lucide='star' style='width:14px;height:14px;fill:currentColor'></i> *\u00A1Oferta!* Plan Completo: ~~$3,000~~ \u2192 *$1,499 MXN*\n\n\u00BFQu\u00E9 plan te interesa?`,
    options: [
      { label: "Horas Adicionales", next: "usicamm_horas" },
      { label: "Admisi\u00F3n B\u00E1sica", next: "usicamm_admision" },
      { label: "Promoci\u00F3n Horizontal", next: "usicamm_horizontal" },
      { label: "Promoci\u00F3n Vertical", next: "usicamm_vertical" },
      { label: "Cuadernillo", next: "plan_cuadernillo" },
      { label: "Simulador", next: "plan_simulador" },
      { label: "Plataforma web", next: "plan_plataforma" },
      { label: "Plan Completo", next: "plan_completo" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  usicamm_horas: {
    msg: `*Horas Adicionales USICAMM*

      Estos programas complementan tus horas lectivas con material pr\u00E1ctico, ejercicios y seguimiento personalizado para mejorar tu desempe\u00F1o.

      \u00BFDeseas inscribirte o hablar con un asesor?`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Volver a USICAMM", next: "usicamm" },
    ],
  },

  usicamm_admision: {
    msg: `*Admisi\u00F3n B\u00E1sica USICAMM*

      Incluye preparaci\u00F3n para el proceso de admisi\u00F3n, con teor\u00EDa, ejercicios guiados y asesor\u00EDa para cubrir requisitos.

      \u00BFTe gustar\u00EDa inscribirte o comunicarte con un asesor?`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Volver a USICAMM", next: "usicamm" },
    ],
  },

  usicamm_horizontal: {
    msg: `*Promoci\u00F3n Horizontal*

      Programa para avanzar en tu carrera docente sin cambiar de nivel, con contenido especializado y actualizaci\u00F3n profesional.

      \u00BFDeseas m\u00E1s informaci\u00F3n o quieres inscribirte?`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Volver a USICAMM", next: "usicamm" },
    ],
  },

  usicamm_vertical: {
    msg: `*Promoci\u00F3n Vertical*

      Orientado a docentes que buscan ascenso a Direcci\u00F3n o Supervisi\u00F3n. Incluye normativa, gesti\u00F3n escolar y liderazgo.

      \u00BFTe gustar\u00EDa inscribirte o hablar con un asesor?`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Volver a USICAMM", next: "usicamm" },
    ],
  },

  plan_cuadernillo: {
    msg: `Cuadernillo USICAMM 2026\n\n\u2022 Material de estudio impreso y digital\n\u2022 Temas clave del proceso USICAMM\n\u2022 Contenido actualizado 2025-2026\n\u2022 Elaborado por expertos EPAD\n\u2022 Ideal para estudiar a tu ritmo\n\n\u00BFTe gustar\u00EDa inscribirte o conocer el precio?`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Preguntar precio", next: "asesor" },
      { label: "Ver todos los planes", next: "usicamm" },
    ],
  },

  plan_simulador: {
    msg: `Simulador USICAMM 2026\n\n\u2022 Reactivos actualizados 2025-2026\n\u2022 Tiempo cronometrado como el examen real\n\u2022 Retroalimentaci\u00F3n por pregunta\n\u2022 Estad\u00EDsticas de avance personalizadas\n\u2022 Practica las veces que quieras\n\n\u00BFTe gustar\u00EDa inscribirte o conocer el precio?`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Preguntar precio", next: "asesor" },
      { label: "Ver todos los planes", next: "usicamm" },
    ],
  },

  plan_plataforma: {
    msg: `Plataforma de Estudio USICAMM 2026\n\n\u2022 Acceso desde cualquier dispositivo\n\u2022 Contenido estructurado por temas\n\u2022 Videos explicativos incluidos\n\u2022 Material descargable (PDF)\n\u2022 Seguimiento de tu progreso en tiempo real\n\u2022 Acceso de por vida\n\n\u00BFTe gustar\u00EDa inscribirte o conocer el precio?`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Preguntar precio", next: "asesor" },
      { label: "Ver todos los planes", next: "usicamm" },
    ],
  },

  plan_completo: {
    msg: `Plan Completo USICAMM 2026\n\nPromoci\u00F3n especial: ~~$3,000~~ \u2192 *$1,499 MXN*\n\nTodo en un solo plan:\n\u2022 Cuadernillo\n\u2022 Simulador\n\u2022 Plataforma web\n\u2022 Sesiones en vivo\n\u2022 Resoluci\u00F3n de dudas durante todo tu proceso\n\nLa opci\u00F3n m\u00E1s completa para llegar preparado al examen.`,
    options: [
      { label: "S\u00ED, me inscribo", next: "inscripcion" },
      { label: "Tengo una duda", next: "faq" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Ver todos los planes", next: "usicamm" },
    ],
  },

  promocion_vertical: {
    msg: `Promoci\u00F3n Vertical 2026 \u2014 EPAD\n\nEl camino a tu Direcci\u00F3n o Supervisi\u00F3n empieza aqu\u00ED.\n\n*3 \u00C1reas de estudio:*\n\u2022 *Aspectos Normativos* \u2014 NEM, Art. 3\u00B0, LCE, Derechos NNA\n\u2022 *Gesti\u00F3n Escolar* \u2014 CTE, Mejora Continua, Liderazgo para la Paz\n\u2022 *V\u00EDnculo con la Comunidad* \u2014 Familia, Vida Saludable, Protocolos\n\n*Inicio:* Lunes 27 de abril de 2026\n*Precio:* ~~$799 MXN~~ \u2192 *$199 MXN*\n\n\u00BFQu\u00E9 quieres saber?`,
    options: [
      { label: "\u00BFQu\u00E9 incluye?", next: "vertical_incluye" },
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  vertical_incluye: {
    msg: `Recursos incluidos \u2014 Promoci\u00F3n Vertical 2026\n\n\u2022 Audio tipo podcast \u2014 Escucha los temas cuando quieras\n\u2022 Grupo de WhatsApp \u2014 Comunidad de estudio y dudas\n\u2022 Videos explicativos \u2014 Contenido visual por \u00E1rea\n\u2022 Res\u00FAmenes \u2014 S\u00EDntesis de los temas clave\n\u2022 Presentaciones \u2014 Material visual descargable\n\u2022 Simuladores \u2014 Pr\u00E1ctica con reactivos reales\n\u2022 Bibliograf\u00EDa actualizada 2025-2026\n\nInicio: *27 de abril de 2026*\nInfo: *87-13-85-68-97*`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Ver precio", next: "precios" },
      { label: "Regresar", next: "promocion_vertical" },
    ],
  },

  precios: {
    msg: `Precios EPAD 2026\n\n*USICAMM 2026:*\n\u2022 Plan Completo: ~~$3,000~~ \u2192 *$1,499 MXN*\n\u2022 Planes individuales: consultar con asesor\n\n*Promoci\u00F3n Vertical 2026:*\n\u2022 ~~$799 MXN~~ \u2192 *$199 MXN*\n\nPago \u00FAnico \u2014 sin mensualidades\nTransferencia o dep\u00F3sito bancario\nEl asesor te env\u00EDa los datos por WhatsApp de forma privada\n\n\u00BFPor cu\u00E1l te decides?`,
    options: [
      { label: "Plan Completo USICAMM $1,499", next: "plan_completo" },
      {
        label: "Promoci\u00F3n Vertical $199",
        next: "promocion_vertical",
      },
      { label: "Solicitar datos de pago", next: "asesor" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  faq: {
    msg: `Preguntas frecuentes\n\nSelecciona tu duda`,
    options: [
      { label: "\u00BFCu\u00E1ndo inicia el curso?", next: "faq_inicio" },
      {
        label: "\u00BFC\u00F3mo accedo al material?",
        next: "faq_acceso",
      },
      { label: "\u00BFHay certificado?", next: "faq_certificado" },
      { label: "\u00BFC\u00F3mo realizo el pago?", next: "faq_pago" },
      { label: "\u00BFPuedo cambiar de plan?", next: "faq_cancelar" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  faq_inicio: {
    msg: `\u00BFCu\u00E1ndo inicia el curso?\n\n\u2022 Promoci\u00F3n Vertical 2026: Lunes 27 de abril de 2026\n\u2022 Planes USICAMM 2026: Acceso inmediato al inscribirte\n\nNo pierdas tiempo, inscr\u00EDbete hoy.`,
    options: [
      { label: "Inscribirme ahora", next: "inscripcion" },
      { label: "M\u00E1s preguntas", next: "faq" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  faq_acceso: {
    msg: `\u00BFC\u00F3mo accedo al material?\n\nDepende de tu plan:\n\n\u2022 Grupo de WhatsApp \u2014 El material llega directo a tu celular\n\u2022 Plataforma web \u2014 Accedes desde cualquier dispositivo con tu usuario\n\u2022 Podcast y videos \u2014 Disponibles en el grupo o plataforma\n\nTodo desde tu celular o computadora, sin complicaciones.`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "M\u00E1s preguntas", next: "faq" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  faq_certificado: {
    msg: `\u00BFHay certificado al terminar?\n\nS\u00ED. Al completar tu curso recibes:\n\n\u2022 Certificado digital avalado por EPAD\n\u2022 Descargable en PDF con c\u00F3digo QR de verificaci\u00F3n\n\u2022 V\u00E1lido para LinkedIn, CV y expediente profesional`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "M\u00E1s preguntas", next: "faq" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  faq_pago: {
    msg: `\u00BFC\u00F3mo realizo mi pago?\n\n1. Selecciona tu plan\n2. Llena tus datos de inscripci\u00F3n en la web\n3. Un asesor te env\u00EDa los datos bancarios por WhatsApp de forma privada y segura\n4. Realiza la transferencia y manda tu comprobante\n5. Listo, accedes a tu curso.\n\nBeneficiario: H\u00E9ctor Orrante Sustaita`,
    options: [
      { label: "Inscribirme ahora", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "M\u00E1s preguntas", next: "faq" },
    ],
  },

  faq_cancelar: {
    msg: `\u00BFPuedo cambiar o cancelar mi plan?\n\nS\u00ED, si necesitas hacer alg\u00FAn cambio comun\u00EDcate con nuestros asesores por WhatsApp y con gusto te orientamos.\n\n87-13-85-68-97\n\nEstamos para ayudarte en todo momento.`,
    options: [
      { label: "Hablar con asesor", next: "asesor" },
      { label: "M\u00E1s preguntas", next: "faq" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  inscripcion: {
    msg: `Excelente decisi\u00F3n.\n\nUn asesor de EPAD te guiar\u00E1 paso a paso. El proceso es r\u00E1pido y sencillo.\n\n\u00BFListo/a para comenzar?`,
    options: [
      { label: "Continuar en WhatsApp", next: "whatsapp_inscripcion" },
      { label: "Tengo una duda", next: "faq" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  asesor: {
    msg: `Con gusto.\n\nTe conectar\u00E9 con uno de nuestros asesores. Est\u00E1n disponibles para resolver todas tus dudas.\n\n87-13-85-68-97`,
    options: [
      { label: "Abrir WhatsApp ahora", next: "whatsapp_general" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  certificaciones: {
    msg: `Certificaciones EPAD\n\n\u2022 Certificado digital avalado por EPAD\n\u2022 PDF con c\u00F3digo QR de verificaci\u00F3n\n\u2022 V\u00E1lido para LinkedIn y CV\n\u2022 Reconocido por instituciones aliadas`,
    options: [
      { label: "Quiero inscribirme", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  que_incluye: {
    msg: `\u00BFQu\u00E9 incluye tu curso en EPAD?\n\n\u2022 Videos explicativos\n\u2022 Res\u00FAmenes y material descargable\n\u2022 Simuladores de pr\u00E1ctica\n\u2022 Presentaciones\n\u2022 Audio tipo podcast\n\u2022 Grupo de WhatsApp de apoyo\n\u2022 Certificado al completar`,
    options: [
      { label: "Inscribirme", next: "inscripcion" },
      { label: "Men\u00FA principal", next: "start" },
    ],
  },

  cat_tecnologia: {
    msg: `Cursos de Tecnolog\u00EDa en EPAD\n\n\u2022 Programaci\u00F3n web desde cero\n\u2022 Inteligencia Artificial aplicada\n\u2022 Ciberseguridad profesional\n\u2022 Cloud Computing\n\u2022 Desarrollo de apps m\u00F3viles`,
    options: [
      { label: "Inscribirme ahora", next: "inscripcion" },
      { label: "Hablar con asesor", next: "asesor" },
      { label: "Ver todos los cursos", next: "cursos" },
    ],
  },

  whatsapp_general: { msg: null, action: "wa_general" },
  whatsapp_inscripcion: { msg: null, action: "wa_inscripcion" },
};

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function waTime() {
  return new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waAddMsg(text, type) {
  const box = document.getElementById("wa-messages");
  const div = document.createElement("div");
  div.className = "wa-msg " + type;
  const safe = text.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  div.innerHTML =
    safe +
    '<div class="wa-msg-time">' +
    waTime() +
    (type === "user"
      ? " <i data-lucide='check' style='color:var(--success)'></i><i data-lucide='check' style='color:var(--success)'></i>"
      : "") +
    "</div>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function waAddTyping() {
  const box = document.getElementById("wa-messages");
  const div = document.createElement("div");
  div.className = "wa-typing";
  div.id = "wa-typing-indicator";
  div.innerHTML =
    '<div class="wa-dot"></div><div class="wa-dot"></div><div class="wa-dot"></div>';
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function waRemoveTyping() {
  const t = document.getElementById("wa-typing-indicator");
  if (t) t.remove();
}

function waAddOptions(options) {
  const box = document.getElementById("wa-messages");
  const prev = document.getElementById("wa-current-options");
  if (prev) prev.remove();
  const wrap = document.createElement("div");
  wrap.className = "wa-options";
  wrap.id = "wa-current-options";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "wa-opt-btn";
    btn.textContent = opt.label;
    btn.onclick = () => {
      wrap.remove();
      waAddMsg(opt.label, "user");
      setTimeout(() => waGo(opt.next), 400);
    };
    wrap.appendChild(btn);
  });
  box.appendChild(wrap);
  box.scrollTop = box.scrollHeight;
}

// \u2500\u2500 Cambio de modo \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function waSetMode(mode) {
  // solo men\u00FA
}

// \u2500\u2500 Flujo de \u00E1rbol \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function waGo(key) {
  const prev = document.getElementById("wa-current-options");
  if (prev) prev.remove();
  const node = WA_FLOW[key];
  if (!node) return;

  // Acciones especiales
  if (node.action) {
    const msgs = {
      wa_general:
        "Hola, me gustar\u00EDa obtener m\u00E1s informaci\u00F3n sobre EPAD.",
      wa_inscripcion:
        "Hola, estoy interesado/a en inscribirme a un curso de EPAD. \u00BFMe pueden orientar?",
    };
    const msg = encodeURIComponent(
      msgs[node.action] || "Hola, necesito informaci\u00F3n.",
    );
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + msg, "_blank");
    setTimeout(() => waGo("start"), 800);
    return;
  }

  waAddTyping();
  setTimeout(() => {
    waRemoveTyping();
    if (node.msg) waAddMsg(node.msg, "bot");
    if (node.options) setTimeout(() => waAddOptions(node.options), 300);
  }, 750);
}

// \u2500\u2500 Env\u00EDo de mensaje \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Historial de conversaci\u00F3n para el chatbot IA
let waChatHistory = [];

async function waSend() {
  const input = document.getElementById("wa-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  const prev = document.getElementById("wa-current-options");
  if (prev) prev.remove();
  waAddMsg(text, "user");
  waAddTyping();

  // Agregar al historial
  waChatHistory.push({ role: "user", content: text });
  // Limitar historial a 10 turnos
  if (waChatHistory.length > 20) waChatHistory = waChatHistory.slice(-20);

  try {
    const systemPrompt = `Eres el asistente virtual de EPAD (Equipo Pedag\u00F3gico de Apoyo Docente), una plataforma educativa mexicana para docentes. Responde siempre en espa\u00F1ol, de forma amable, clara y concisa (m\u00E1ximo 3 p\u00E1rrafos cortos).

      Informaci\u00F3n clave de EPAD:
      - Cursos USICAMM 2026: Cuadernillo, Simulador, Plataforma web, Plan Completo ($1,499 MXN, antes $3,000)
      - Promoci\u00F3n Vertical 2026: $199 MXN (antes $799), inicia 27 de abril 2026. Incluye podcast, grupo WhatsApp, videos, res\u00FAmenes, simuladores.
      - Instructores: Profa. Roc\u00EDo, El Crack, Profe Paco R\u00EDos, Mtra. Azalhia
      - WhatsApp de contacto: 87-13-85-68-97
      - Herramienta gratuita de planeaciones did\u00E1cticas con IA para nivel preescolar, primaria y secundaria (NEM/SEP 2022)
      - Certificados digitales con c\u00F3digo QR
      - Pago: transferencia bancaria, beneficiario H\u00E9ctor Orrante Sustaita

      Si preguntan por inscripci\u00F3n o pago, ind\u00EDcales que contacten al WhatsApp 87-13-85-68-97. S\u00E9 \u00FAtil y propositivo. No inventes precios ni fechas que no se mencionan.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: systemPrompt,
        messages: waChatHistory,
      }),
    });

    waRemoveTyping();

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    const reply =
      data.content?.[0]?.text ||
      "Gracias por tu mensaje. \u00BFEn qu\u00E9 m\u00E1s puedo ayudarte?";
    waChatHistory.push({ role: "assistant", content: reply });
    waAddMsg(reply, "bot");
    setTimeout(
      () =>
        waAddOptions([
          { label: "Ver cursos", next: "cursos" },
          { label: "Precios", next: "precios" },
          { label: "Hablar con asesor", next: "asesor" },
        ]),
      300,
    );
  } catch (e) {
    waRemoveTyping();
    waAddMsg(
      "Gracias por tu mensaje. Para una atenci\u00F3n personalizada, selecciona una opci\u00F3n o habla con un asesor.",
      "bot",
    );
    setTimeout(
      () =>
        waAddOptions([
          { label: "Hablar con asesor", next: "asesor" },
          { label: "Ver men\u00FA", next: "start" },
        ]),
      300,
    );
  }
}

// \u2500\u2500 Toggle del chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function waToggle() {
  waChatOpen = !waChatOpen;
  const chat = document.getElementById("wa-chat");
  const notif = document.getElementById("wa-notif");
  if (waChatOpen) {
    chat.classList.add("open");
    if (notif) notif.style.display = "none";
    if (!waStarted) {
      waStarted = true;
      setTimeout(() => waGo("start"), 600);
    }
  } else {
    chat.classList.remove("open");
  }
}

// \u2500\u2500 Chips de acceso r\u00E1pido \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function waChip(next) {
  const prev = document.getElementById("wa-current-options");
  if (prev) prev.remove();
  const labels = {
    usicamm: "Planes USICAMM 2026",
    promocion_vertical: "Promoci\u00F3n Vertical 2026",
    precios: "Ver precios",
    faq: "Preguntas frecuentes",
    asesor: "Hablar con asesor",
    inscripcion: "Inscribirme",
  };
  waAddMsg(labels[next] || next, "user");
  setTimeout(() => waGo(next), 300);
}

// \u2500\u2500 Mostrar bot autom\u00E1ticamente \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
setTimeout(() => {
  const notif = document.getElementById("wa-notif");
  if (notif) notif.style.display = "flex";
}, 4000);

// ============================================================
// PLANEACIONES DID\u00C1CTICAS
// ============================================================

const MATERIAS_INFO = {
  etica: { icon: "[Etica]", name: "\u00C9tica, Naturaleza y Sociedades" },
  saberes: {
    icon: "[Ciencia]",
    name: "Saberes y Pensamiento Cient\u00EDfico",
  },
  humano: { icon: "[Comunidad]", name: "De lo Humano y lo Comunitario" },
  lenguajes: { icon: "[Lenguaje]", name: "Lenguajes" },
};

const NIVEL_LABELS = {
  preescolar: "Nivel Preescolar",
  primaria: "Nivel Primaria",
  secundaria: "Nivel Secundaria",
};

const PREFIX = { preescolar: "pre", primaria: "pri", secundaria: "sec" };
let campoCounters = { preescolar: 1, primaria: 1, secundaria: 1 };
let selectedMateria = {
  preescolar: null,
  primaria: null,
  secundaria: null,
};

function selectNivel(nivel, btn) {
  document
    .querySelectorAll(".nivel-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  document
    .querySelectorAll(".nivel-content")
    .forEach((c) => c.classList.remove("active"));
  document.getElementById("nivel-" + nivel).classList.add("active");
}

function selectMateria(nivel, matKey, card) {
  selectedMateria[nivel] = matKey;
  const prefix = PREFIX[nivel];
  const info = MATERIAS_INFO[matKey];

  // Highlight card
  const grid = card.closest(".materias-grid");
  grid
    .querySelectorAll(".materia-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  // Update panel header
  document.getElementById("panel-icon-" + nivel).textContent = info.icon;
  document.getElementById("panel-title-" + nivel).textContent =
    "Planeaci\u00F3n \u2013 " + info.name;
  document.getElementById("panel-sub-" + nivel).textContent =
    NIVEL_LABELS[nivel];

  // Fill materia field
  document.getElementById(prefix + "-materia").value =
    info.icon + "  " + info.name;

  // Show panel
  const panel = document.getElementById("panel-" + nivel);
  panel.classList.add("visible");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  // Init validaci\u00F3n
  setTimeout(() => initValidation(nivel), 100);
}

function addCampo(nivel, prefix) {
  campoCounters[nivel]++;
  const n = campoCounters[nivel];
  const container = document.getElementById("campos-" + nivel);
  const div = document.createElement("div");
  div.className = "campo-row";
  div.id = "campo-" + prefix + "-" + n;
  div.innerHTML = `
                <div style='display:flex;align-items:center;gap:8px;'>
                  <div style='flex:1'>
                    <label class="pf-label">Momento</label>
                    <select class="pf-select" id="campo-${prefix}-${n}-momento">
                      <option>Inicio</option><option>Desarrollo</option><option>Cierre</option>
                    </select>
                  </div>
                  <button class="btn-del-campo" onclick="this.closest('.campo-row').remove()" title="Eliminar">\u2715</button>
                </div>
                <div>
                  <label class="pf-label">Tiempo estimado</label>
                  <input class="pf-input" id="campo-${prefix}-${n}-tiempo" placeholder="Ej. 30 min" />
                </div>
                <div style='grid-column:1/-1'>
                  <label class="pf-label">Descripci\u00F3n de la actividad</label>
                  <textarea class="pf-textarea" id="campo-${prefix}-${n}-act" placeholder="Describe la actividad..." style='min-height:70px'></textarea>
                </div>
                <div style='grid-column:1/-1'>
                  <label class="pf-label">Recursos / materiales</label>
                  <input class="pf-input" id="campo-${prefix}-${n}-rec" placeholder="Materiales necesarios..." />
                </div>
              `;
  container.appendChild(div);
}

function limpiarFormulario(nivel) {
  const prefix = PREFIX[nivel];
  const form = document.getElementById("form-" + nivel);
  form
    .querySelectorAll("input:not([readonly]), textarea")
    .forEach((el) => (el.value = ""));
  // Reset campo counters
  const container = document.getElementById("campos-" + nivel);
  const firstRow = container.querySelector(".campo-row");
  if (firstRow) {
    container.innerHTML = "";
    container.appendChild(firstRow);
    firstRow
      .querySelectorAll("input, textarea")
      .forEach((el) => (el.value = ""));
    firstRow.querySelectorAll("select").forEach((el) => (el.selectedIndex = 0));
  }
  campoCounters[nivel] = 1;
  // Hide preview
  const preview = document.getElementById("preview-" + nivel);
  if (preview) {
    preview.classList.remove("visible");
    preview.innerHTML = "";
  }
}

// \u2500\u2500 TOGGLE TEMA OSCURO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("epad_theme", newTheme);
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");
  if (icon) icon.innerHTML = newTheme === "dark" ? "&#9788;" : "&#9790;";
  if (label) label.textContent = newTheme === "dark" ? "Claro" : "Oscuro";
}

// Aplicar tema guardado al cargar
(function () {
  const saved = localStorage.getItem("epad_theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.addEventListener("DOMContentLoaded", () => {
      const icon = document.getElementById("theme-icon");
      const label = document.getElementById("theme-label");
      if (icon) icon.innerHTML = "&#9788;";
      if (label) label.textContent = "Claro";
    });
  }
})();

// \u2500\u2500 VALIDACI\u00D3N EN TIEMPO REAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function initValidation(nivel) {
  const prefix = {
    preescolar: "pre",
    primaria: "pri",
    secundaria: "sec",
  }[nivel];
  const fields = [
    { id: prefix + "-docente", msg: "Ingresa tu nombre", minLen: 3 },
    { id: prefix + "-grado", msg: "Ingresa el grado", minLen: 1 },
    {
      id: prefix + "-proposito",
      msg: "Describe el prop\u00F3sito (m\u00EDn. 10 caracteres)",
      minLen: 10,
    },
  ];
  const form = document.getElementById("form-" + nivel);
  if (!form) return;

  // Insert progress bar at top of form if not exists
  if (!form.querySelector(".form-progress")) {
    const progressWrap = document.createElement("div");
    progressWrap.className = "form-full";
    progressWrap.innerHTML =
      '<div class="form-progress-label" id="progress-label-' +
      nivel +
      '">Completa los campos requeridos</div><div class="form-progress"><div class="form-progress-fill" id="progress-fill-' +
      nivel +
      '" style="width:0%"></div></div>';
    form.insertBefore(progressWrap, form.firstChild);
  }

  fields.forEach(({ id, msg, minLen }) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Wrap with hint if not already
    if (
      !el.nextElementSibling ||
      !el.nextElementSibling.classList.contains("field-hint")
    ) {
      const hint = document.createElement("div");
      hint.className = "field-hint";
      hint.id = id + "-hint";
      el.parentNode.insertBefore(hint, el.nextSibling);
    }
    el.addEventListener("input", () =>
      validateField(el, msg, minLen, nivel, fields),
    );
    el.addEventListener("blur", () =>
      validateField(el, msg, minLen, nivel, fields),
    );
  });
}

function validateField(el, msg, minLen, nivel, fields) {
  const val = el.value.trim();
  const hint = document.getElementById(el.id + "-hint");
  if (val.length === 0) {
    el.classList.remove("valid", "invalid");
    if (hint) {
      hint.className = "field-hint";
      hint.textContent = "";
    }
  } else if (val.length < minLen) {
    el.classList.remove("valid");
    el.classList.add("invalid");
    if (hint) {
      hint.className = "field-hint error";
      hint.textContent = msg;
    }
  } else {
    el.classList.remove("invalid");
    el.classList.add("valid");
    if (hint) {
      hint.className = "field-hint ok";
      hint.textContent =
        "<i data-lucide='check' style='color:var(--success)'></i> Listo";
    }
  }
  // Update progress
  const prefix = {
    preescolar: "pre",
    primaria: "pri",
    secundaria: "sec",
  }[nivel];
  const allFields = fields.map((f) => document.getElementById(f.id));
  const filled = allFields.filter(
    (f) =>
      f &&
      f.value.trim().length >=
        (fields.find((x) => x.id === f.id) || { minLen: 1 }).minLen,
  ).length;
  const pct = Math.round((filled / fields.length) * 100);
  const fill = document.getElementById("progress-fill-" + nivel);
  const lbl = document.getElementById("progress-label-" + nivel);
  if (fill) fill.style.width = pct + "%";
  if (lbl)
    lbl.textContent =
      pct === 100
        ? "Formulario completo <i data-lucide='check' style='color:var(--success)'></i>"
        : "Campos completados: " + filled + " / " + fields.length;
}

// \u2500\u2500 EXPORTAR A EXCEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function exportarExcel(nivel) {
  const preview = document.getElementById("preview-" + nivel);
  if (!preview || !preview.innerHTML) return;

  // Collect data from preview tables
  const tables = preview.querySelectorAll(".preview-table");
  let csvRows = [];
  csvRows.push(["Planeaci\u00F3n Did\u00E1ctica EPAD", "", "", ""]);
  csvRows.push([
    "Exportado el",
    new Date().toLocaleDateString("es-MX"),
    "",
    "",
  ]);
  csvRows.push(["", "", "", ""]);

  tables.forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      csvRows.push(
        Array.from(cells).map(
          (c) =>
            '"' + c.innerText.replace(/"/g, '""').replace(/\n/g, " ") + '"',
        ),
      );
    });
    csvRows.push(["", "", "", ""]);
  });

  // Add section text content
  const sectionHeaders = preview.querySelectorAll(".preview-section-h");
  sectionHeaders.forEach((h) => {
    const next = h.nextElementSibling;
    if (next && next.tagName === "P") {
      csvRows.push([
        '"' + h.innerText + '"',
        '"' + next.innerText.replace(/"/g, '""') + '"',
        "",
        "",
      ]);
    }
  });

  const csvContent = "\uFEFF" + csvRows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "planeacion_epad_" +
    nivel +
    "_" +
    new Date().toISOString().slice(0, 10) +
    ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Planeaci\u00F3n exportada a Excel/CSV correctamente.");
}

// ============================================================
//  EPAD — Generación de planeaciones con Groq (Llama 3.3)
// ============================================================

const GROQ_API_KEY_PLAN = process.env.GROQ_API_KEY || "";
const GROQ_MODEL_PLAN = "llama-3.3-70b-versatile";

async function generarPlaneacion(nivel) {
  if (!checkPlaneacionesAccess()) {
    document
      .getElementById("planeaciones")
      .scrollIntoView({ behavior: "smooth" });
    showToast(
      "⚠ Crea una cuenta o suscríbete para generar planeaciones con IA.",
    );
    return;
  }

  const prefix = PREFIX[nivel];
  const matKey = selectedMateria[nivel];
  if (!matKey) {
    alert("Por favor selecciona una materia primero.");
    return;
  }

  const matInfo = MATERIAS_INFO[matKey];
  const docente =
    document.getElementById(prefix + "-docente").value.trim() || "Docente";
  const grado = document.getElementById(prefix + "-grado").value.trim() || "—";
  const ciclo =
    document.getElementById(prefix + "-ciclo").value.trim() || "2025–2026";
  const periodo =
    document.getElementById(prefix + "-periodo").value.trim() || "—";
  const proposito = document.getElementById(prefix + "-proposito").value.trim();
  const evalTipo = document.getElementById(prefix + "-eval-tipo").value;
  const evalInst = document.getElementById(prefix + "-eval-inst").value.trim();
  const adecuaciones = document
    .getElementById(prefix + "-adecuaciones")
    .value.trim();
  const notas = document.getElementById(prefix + "-notas").value.trim();

  const camposRows = document.querySelectorAll(
    "#campos-" + nivel + " .campo-row",
  );
  const actividades = [];
  camposRows.forEach((row) => {
    const act = { momento: "", tiempo: "", descripcion: "", recursos: "" };
    row.querySelectorAll("input, textarea, select").forEach((el) => {
      if (el.tagName === "SELECT") act.momento = el.value;
      else if (el.id?.includes("-tiempo")) act.tiempo = el.value;
      else if (el.tagName === "TEXTAREA") act.descripcion = el.value;
      else if (el.id?.includes("-rec")) act.recursos = el.value;
    });
    if (act.descripcion || act.momento) actividades.push(act);
  });

  const nLabel = NIVEL_LABELS[nivel];
  // Formatea las actividades de forma legible para el modelo
  const actividadesTexto =
    actividades.length > 0
      ? actividades
          .map(
            (a, i) =>
              `  ${i + 1}. [${a.momento || "Sin momento"}] ` +
              `Tiempo: ${a.tiempo || "no especificado"} — ` +
              `${a.descripcion || "Sin descripción"} ` +
              `(Recursos: ${a.recursos || "no especificados"})`,
          )
          .join("\n")
      : "  El docente no capturó actividades previas. Genera una secuencia completa desde cero.";

  const prompt = `
Genera una planeación didáctica enriquecida para el siguiente contexto docente:

═══ DATOS DEL DOCENTE ═══
• Nivel educativo : ${nLabel}
• Campo formativo : ${matInfo.name}
• Grado / Grupo   : ${grado}
• Docente         : ${docente}
• Ciclo escolar   : ${ciclo}
• Período         : ${periodo}

═══ PROPÓSITO ORIGINAL DEL DOCENTE ═══
"${proposito || "Desarrollar competencias acordes al campo formativo y al nivel educativo."}"

Enriquece este propósito con lenguaje NEM: integra saberes, habilidades y actitudes.

═══ ACTIVIDADES PLANIFICADAS POR EL DOCENTE ═══
${actividadesTexto}

Respeta y mejora estas actividades si existen. Si no hay actividades, diseña una
secuencia Inicio-Desarrollo-Cierre coherente con el propósito y el nivel educativo.

═══ EVALUACIÓN ═══
• Tipo       : ${evalTipo || "Por definir"}
• Instrumento: ${evalInst || "Por definir — elige el más apropiado para el campo formativo"}

═══ ADECUACIONES CURRICULARES ═══
${adecuaciones || "No especificadas — sugiere al menos una estrategia DUA y una para NEE."}

═══ NOTAS ADICIONALES DEL DOCENTE ═══
${notas || "Sin notas adicionales."}

Devuelve ÚNICAMENTE el JSON con la estructura establecida. Sin texto extra.
`.trim();

  const spinner = document.getElementById("spinner-" + nivel);
  const preview = document.getElementById("preview-" + nivel);
  spinner.classList.add("visible");
  preview.classList.remove("visible");
  preview.innerHTML = "";

  try {
    // ── Llamada a Groq (Llama 3.3) ───────────────────────────
    const systemPrompt = `Eres un experto en didáctica y curriculum de educación básica mexicana (Plan de Estudios 2022 NEM).
Genera ÚNICAMENTE un objeto JSON válido con esta estructura exacta. Sin texto extra, sin markdown, sin backticks, sin comentarios.

{
  "proposito_enriquecido": "string — propósito enriquecido con lenguaje NEM",
  "actividades": [
    {
      "momento": "Inicio",
      "tiempo": "string",
      "descripcion": "string detallada de la actividad",
      "recursos": "string",
      "consigna_alumno": "string — instrucción exacta que el docente lee en voz alta al grupo"
    },
    {
      "momento": "Desarrollo",
      "tiempo": "string",
      "descripcion": "string detallada",
      "recursos": "string",
      "consigna_alumno": "string"
    },
    {
      "momento": "Cierre",
      "tiempo": "string",
      "descripcion": "string detallada",
      "recursos": "string",
      "consigna_alumno": "string"
    }
  ],
  "evaluacion": {
    "tipo": "string",
    "instrumento": "string",
    "indicadores": ["string", "string", "string"]
  },
  "lista_cotejo": [
    { "criterio": "string — criterio observable y medible", "logrado": "", "en_proceso": "", "no_logrado": "" },
    { "criterio": "string", "logrado": "", "en_proceso": "", "no_logrado": "" },
    { "criterio": "string", "logrado": "", "en_proceso": "", "no_logrado": "" },
    { "criterio": "string", "logrado": "", "en_proceso": "", "no_logrado": "" },
    { "criterio": "string", "logrado": "", "en_proceso": "", "no_logrado": "" }
  ],
  "hoja_trabajo": {
    "titulo": "string — título atractivo para los alumnos",
    "instrucciones": "string — instrucciones claras dirigidas al alumno",
    "secciones": [
      { "tipo": "texto_libre", "titulo": "string", "lineas": 5 },
      { "tipo": "tabla", "titulo": "string", "columnas": ["string","string","string"], "filas": 4 },
      { "tipo": "reflexion", "pregunta": "string — pregunta de cierre reflexiva" }
    ]
  },
  "adecuaciones": { "dua": "string", "nee": "string" },
  "reflexion_docente": "string"
}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY_PLAN}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL_PLAN,
          max_tokens: 2000,
          temperature: 0.5,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.error?.message || `Error de API Groq (${response.status})`,
      );
    }

    const apiData = await response.json();
    const rawText = apiData.choices?.[0]?.message?.content || "";

    // Parsear el JSON que devuelve el modelo
    let planeacion;
    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      planeacion = JSON.parse(clean);
    } catch {
      throw new Error(
        "La IA devolvió un formato inesperado. Intenta de nuevo.",
      );
    }

    spinner.classList.remove("visible");
    renderPreview(nivel, planeacion, {
      docente,
      grado,
      ciclo,
      periodo,
      matInfo,
      nLabel,
    });
  } catch (err) {
    console.error("Error:", err);
    spinner.classList.remove("visible");
    preview.classList.add("visible");
    preview.innerHTML = `
      <div style='background:#fff0f0;border:1.5px solid #e53935;border-radius:12px;padding:28px 24px;text-align:center;color:#b71c1c;'>
        <div style='font-size:32px;margin-bottom:10px;'><i data-lucide='alert-triangle'></i></div>
        <div style='font-weight:700;font-size:16px;margin-bottom:8px;'>No se pudo generar la planeación</div>
        <div style='font-size:13px;margin-bottom:18px;'>${err.message}</div>
        <button onclick="generarPlaneacion('${nivel}')"
          style='background:#e53935;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-weight:600;cursor:pointer;'>
          <i data-lucide='refresh-cw'></i> Reintentar
        </button>
      </div>`;
  }
}

// ============================================================
//  RENDER PREVIEW — Planeación completa lista para imprimir
// ============================================================
function renderPreview(
  nivel,
  plan,
  { docente, grado, ciclo, periodo, matInfo, nLabel },
) {
  const preview = document.getElementById("preview-" + nivel);
  if (!preview) return;

  const actividades = Array.isArray(plan.actividades) ? plan.actividades : [];
  const evaluacion = plan.evaluacion || {};
  const adecuaciones = plan.adecuaciones || {};
  const listaCotejo = Array.isArray(plan.lista_cotejo) ? plan.lista_cotejo : [];
  const hoja = plan.hoja_trabajo || {};
  const secciones = Array.isArray(hoja.secciones) ? hoja.secciones : [];
  const indicadores = Array.isArray(evaluacion.indicadores)
    ? evaluacion.indicadores
    : [];

  const momentoColor = {
    Inicio: {
      bg: "#e8f5e9",
      border: "#27ae60",
      badge: "#27ae60",
      text: "#1a5c35",
    },
    Desarrollo: {
      bg: "#e8f0ff",
      border: "#2563a8",
      badge: "#2563a8",
      text: "#1a3a5c",
    },
    Cierre: {
      bg: "#fff8e6",
      border: "#c8952a",
      badge: "#c8952a",
      text: "#7a4a10",
    },
  };

  // ── Actividades ───────────────────────────────────────
  const actHTML =
    actividades
      .map((a) => {
        const c = momentoColor[a.momento] || momentoColor["Inicio"];
        return `
      <div style="border:2px solid ${c.border};border-radius:12px;margin-bottom:14px;overflow:hidden;page-break-inside:avoid;">
        <div style="background:${c.badge};padding:8px 16px;display:flex;align-items:center;gap:12px;">
          <span style="color:#fff;font-weight:800;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${a.momento || "Actividad"}</span>
          ${a.tiempo ? `<span style="color:rgba(255,255,255,0.85);font-size:12px;">⏱ ${a.tiempo}</span>` : ""}
        </div>
        <div style="background:${c.bg};padding:14px 16px;">
          <p style="font-size:13.5px;line-height:1.7;color:#1a1a1a;margin:0 0 8px;">${a.descripcion || "—"}</p>
          ${a.recursos ? `<p style="font-size:12px;color:#555;margin:0 0 8px;"><strong>📦 Recursos:</strong> ${a.recursos}</p>` : ""}
          ${
            a.consigna_alumno
              ? `
          <div style="background:rgba(255,255,255,0.7);border-left:3px solid ${c.border};padding:8px 12px;border-radius:0 8px 8px 0;margin-top:6px;">
            <span style="font-size:11px;font-weight:700;color:${c.text};text-transform:uppercase;letter-spacing:1px;">💬 Consigna al grupo</span>
            <p style="font-size:13px;font-style:italic;color:#333;margin:4px 0 0;">"${a.consigna_alumno}"</p>
          </div>`
              : ""
          }
        </div>
      </div>`;
      })
      .join("") || "<p style='color:#888;font-size:13px;'>Sin actividades.</p>";

  // ── Lista de cotejo ───────────────────────────────────
  const cotejoHTML = listaCotejo.length
    ? `
    <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px;">
      <thead>
        <tr style="background:#1a3a5c;color:#fff;">
          <th style="padding:10px 12px;text-align:left;width:55%;">Criterio de evaluación</th>
          <th style="padding:10px 8px;text-align:center;width:15%;">✅ Logrado</th>
          <th style="padding:10px 8px;text-align:center;width:15%;">🔄 En proceso</th>
          <th style="padding:10px 8px;text-align:center;width:15%;">❌ No logrado</th>
        </tr>
      </thead>
      <tbody>
        ${listaCotejo
          .map(
            (r, i) => `
        <tr style="background:${i % 2 === 0 ? "#f8faff" : "#fff"};">
          <td style="padding:10px 12px;border-bottom:1px solid #e0e8f5;">${r.criterio}</td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #e0e8f5;"><span style="display:inline-block;width:18px;height:18px;border:2px solid #27ae60;border-radius:4px;"></span></td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #e0e8f5;"><span style="display:inline-block;width:18px;height:18px;border:2px solid #2563a8;border-radius:4px;"></span></td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #e0e8f5;"><span style="display:inline-block;width:18px;height:18px;border:2px solid #e53935;border-radius:4px;"></span></td>
        </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
    : "";

  // ── Secciones hoja de trabajo ─────────────────────────
  const seccionesHTML = secciones
    .map((s) => {
      if (s.tipo === "texto_libre") {
        return `
        <div style="margin-bottom:20px;page-break-inside:avoid;">
          <p style="font-weight:700;font-size:13px;color:#1a3a5c;margin-bottom:8px;">📝 ${s.titulo || ""}</p>
          ${Array.from({ length: s.lineas || 5 }, () => `<div style="border-bottom:1.5px solid #bbb;height:28px;margin-bottom:2px;"></div>`).join("")}
        </div>`;
      }
      if (s.tipo === "tabla") {
        const cols = Array.isArray(s.columnas) ? s.columnas : [];
        return `
        <div style="margin-bottom:20px;page-break-inside:avoid;">
          <p style="font-weight:700;font-size:13px;color:#1a3a5c;margin-bottom:8px;">📊 ${s.titulo || ""}</p>
          <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
            <thead><tr>${cols.map((c) => `<th style="background:#1a3a5c;color:#fff;padding:8px 10px;text-align:left;border:1px solid #1a3a5c;">${c}</th>`).join("")}</tr></thead>
            <tbody>${Array.from({ length: s.filas || 3 }, () => `<tr>${cols.map(() => `<td style="border:1px solid #ccc;padding:10px;height:26px;"></td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>`;
      }
      if (s.tipo === "reflexion") {
        return `
        <div style="background:#f0f6ff;border-left:4px solid #2563a8;padding:14px 16px;border-radius:0 10px 10px 0;margin-bottom:20px;page-break-inside:avoid;">
          <p style="font-weight:700;font-size:13px;color:#1a3a5c;margin-bottom:10px;">💭 ${s.pregunta || "Reflexión"}</p>
          ${Array.from({ length: 4 }, () => `<div style="border-bottom:1.5px solid #bbb;height:26px;margin-bottom:4px;"></div>`).join("")}
        </div>`;
      }
      return "";
    })
    .join("");

  const indHTML = indicadores
    .map((i) => `<li style="margin-bottom:5px;font-size:13px;">${i}</li>`)
    .join("");

  // ── Estilos de impresión ──────────────────────────────
  if (!document.getElementById("epad-print-style")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style id="epad-print-style">
        @media print {
          body > *:not(#planeaciones) { display:none!important; }
          #planeaciones { display:block!important; }
          .pub-nav,.site-footer,.nivel-tabs,.materias-grid,.panel-header,
          .planeacion-form>div:not(.planeacion-preview),.btn-panel,
          .btn-add-campo,.eval-row,.ai-spinner,#ai-bubble,
          #scroll-progress,.trial-banner,.no-print { display:none!important; }
          .planeacion-preview { display:block!important;opacity:1!important; }
          .epad-print-page { page-break-after:always; }
          @page { margin:15mm; size:A4; }
        }
      </style>`,
    );
  }

  // ── RENDER FINAL ──────────────────────────────────────
  preview.innerHTML = `

  <!-- PÁGINA 1: PLANEACIÓN DIDÁCTICA -->
  <div class="epad-print-page" style="font-family:'Inter',Arial,sans-serif;color:#1a1a1a;max-width:800px;margin:0 auto;">

    <div style="border:2px solid #1a3a5c;border-radius:14px;overflow:hidden;margin-bottom:20px;">
      <div style="background:linear-gradient(135deg,#0d1f3c,#1a3a5c);padding:20px 24px;display:flex;align-items:center;gap:18px;">
        <div style="width:52px;height:52px;background:linear-gradient(135deg,#c8952a,#e8b84b);border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;flex-shrink:0;">EP</div>
        <div>
          <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.6);">EPAD · Equipo Pedagógico de Apoyo Docente</div>
          <div style="font-size:20px;font-weight:800;color:#fff;margin-top:2px;">Planeación Didáctica · ${nLabel}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:2px;">${matInfo?.name || ""}</div>
        </div>
      </div>
      <div style="background:#f8faff;padding:14px 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;border-top:2px solid #1a3a5c;">
        ${[
          ["👤 Docente", docente],
          ["📚 Grado/Grupo", grado],
          ["📅 Ciclo", ciclo],
          ["🗓 Período", periodo || "—"],
        ]
          .map(
            ([label, val]) => `
        <div>
          <div style="font-size:10px;color:#666;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${label}</div>
          <div style="font-size:13px;font-weight:700;color:#1a3a5c;margin-top:2px;">${val}</div>
        </div>`,
          )
          .join("")}
      </div>
    </div>

    <div style="background:#e8f0ff;border-left:5px solid #1a3a5c;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:20px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a3a5c;margin-bottom:6px;">🎯 Propósito / Aprendizaje esperado (NEM)</div>
      <div style="font-size:14px;line-height:1.75;">${plan.proposito_enriquecido || "—"}</div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a3a5c;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #e0e8f5;">📋 Secuencia Didáctica</div>
      ${actHTML}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
      <div style="border:1.5px solid #27ae60;border-radius:12px;padding:14px;background:#f0fff4;">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1a5c35;margin-bottom:8px;">✅ Evaluación</div>
        <p style="font-size:13px;margin:0 0 4px;"><strong>Tipo:</strong> ${evaluacion.tipo || "—"}</p>
        <p style="font-size:13px;margin:0 0 8px;"><strong>Instrumento:</strong> ${evaluacion.instrumento || "—"}</p>
        ${indHTML ? `<ul style="padding-left:16px;margin:0;">${indHTML}</ul>` : ""}
      </div>
      <div style="border:1.5px solid #c8952a;border-radius:12px;padding:14px;background:#fff8e6;">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#7a4a10;margin-bottom:8px;">♿ Adecuaciones Curriculares</div>
        ${adecuaciones.dua ? `<p style="font-size:13px;margin:0 0 6px;"><strong>DUA:</strong> ${adecuaciones.dua}</p>` : ""}
        ${adecuaciones.nee ? `<p style="font-size:13px;margin:0;"><strong>NEE:</strong> ${adecuaciones.nee}</p>` : ""}
      </div>
    </div>

    ${
      plan.reflexion_docente
        ? `
    <div style="background:#f8f0ff;border-left:5px solid #7c3aed;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:20px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#5b21b6;margin-bottom:6px;">💡 Reflexión Docente</div>
      <div style="font-size:13px;line-height:1.7;">${plan.reflexion_docente}</div>
    </div>`
        : ""
    }

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:28px;padding-top:16px;border-top:2px solid #e0e8f5;">
      ${["Firma del Docente", "Firma del Director(a)", "Sello Escolar"]
        .map(
          (label) => `
      <div style="text-align:center;">
        <div style="border-bottom:1.5px solid #555;height:40px;margin-bottom:6px;"></div>
        <div style="font-size:11px;color:#555;">${label}</div>
      </div>`,
        )
        .join("")}
    </div>
  </div>

  <!-- PÁGINA 2: LISTA DE COTEJO -->
  ${
    listaCotejo.length
      ? `
  <div class="epad-print-page" style="font-family:'Inter',Arial,sans-serif;color:#1a1a1a;max-width:800px;margin:32px auto 0;">
    <div style="border:2px solid #1a3a5c;border-radius:14px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0d1f3c,#1a3a5c);padding:16px 24px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.6);">EPAD · Instrumento de Evaluación</div>
        <div style="font-size:18px;font-weight:800;color:#fff;margin-top:2px;">Lista de Cotejo</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);">${matInfo?.name || ""} · ${nLabel} · ${grado}</div>
      </div>
      <div style="padding:18px 20px;">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:16px;margin-bottom:18px;padding-bottom:14px;border-bottom:1.5px solid #e0e8f5;">
          ${[
            ["Nombre del alumno(a)", ""],
            ["Fecha", ""],
            ["Calificación", ""],
          ]
            .map(
              ([label]) => `
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:4px;">${label}</div>
            <div style="border-bottom:1.5px solid #555;height:22px;"></div>
          </div>`,
            )
            .join("")}
        </div>
        ${cotejoHTML}
        <div style="margin-top:18px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1a3a5c;margin-bottom:8px;">Observaciones del docente</div>
          ${Array.from({ length: 3 }, () => `<div style="border-bottom:1.5px solid #bbb;height:26px;margin-bottom:6px;"></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`
      : ""
  }

  <!-- PÁGINA 3: HOJA DE TRABAJO DEL ALUMNO -->
  ${
    secciones.length
      ? `
  <div style="font-family:'Inter',Arial,sans-serif;color:#1a1a1a;max-width:800px;margin:32px auto 0;">
    <div style="border:2px solid #2563a8;border-radius:14px;overflow:hidden;margin-bottom:20px;">
      <div style="background:linear-gradient(135deg,#2563a8,#4a8fd4);padding:16px 24px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);">EPAD · Material de Trabajo para el Alumno</div>
        <div style="font-size:18px;font-weight:800;color:#fff;margin-top:2px;">${hoja.titulo || "Hoja de Trabajo"}</div>
      </div>
      <div style="background:#f0f6ff;padding:12px 20px;display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px;">
        ${[
          ["Nombre del alumno(a)", ""],
          ["Fecha", ""],
          ["Grado/Grupo", grado],
        ]
          .map(
            ([label, val]) => `
        <div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:4px;">${label}</div>
          ${val ? `<div style="font-size:13px;font-weight:700;color:#1a3a5c;">${val}</div>` : `<div style="border-bottom:1.5px solid #555;height:20px;"></div>`}
        </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="background:#fff8e6;border-left:5px solid #c8952a;padding:12px 16px;border-radius:0 10px 10px 0;margin-bottom:20px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#7a4a10;margin-bottom:4px;">📌 Instrucciones</div>
      <div style="font-size:13.5px;line-height:1.6;">${hoja.instrucciones || "Lee con atención y responde cada sección."}</div>
    </div>
    ${seccionesHTML}
  </div>`
      : ""
  }

  <!-- BOTONES (ocultos al imprimir) -->
  <div class="no-print" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px;padding:20px;background:#f0f6ff;border-radius:14px;">
    <button onclick="window.print()" style="flex:1;min-width:180px;padding:14px 24px;background:#1a3a5c;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;">
      🖨️ Imprimir todo (3 páginas)
    </button>
    <button onclick="generarPlaneacion('${nivel}')" style="flex:1;min-width:180px;padding:14px 24px;background:#fff;color:#1a3a5c;border:2px solid #1a3a5c;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;">
      ✨ Regenerar planeación
    </button>
  </div>`;

  preview.classList.add("visible");
  if (window.lucide) lucide.createIcons();
  setTimeout(
    () => preview.scrollIntoView({ behavior: "smooth", block: "start" }),
    100,
  );
}
// ============================================================
// ZONA MATERIALES — CLOUDINARY (archivos) + FIRESTORE (metadata)
// ============================================================

const ZM_CLOUD_NAME = "dgvfnfyto";
const ZM_UPLOAD_PRESET = "epad_uploads";
const ZM_COLLECTION = "zona_materiales"; // colección Firestore
const ZM_LS_KEY = "epad_zona_materiales"; // fallback localStorage

// ── Helpers de tipo ──────────────────────────────────────────
function zmTypeIcon(tipo) {
  if (tipo === "video") return { emoji: "📹", label: "Video", cls: "video" };
  if (tipo === "pdf") return { emoji: "📄", label: "PDF", cls: "pdf" };
  return { emoji: "📎", label: "Documento", cls: "documento" };
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Firestore: leer / guardar / borrar ───────────────────────
async function zmFSGetAll() {
  try {
    const snap = await fbDB
      .collection(ZM_COLLECTION)
      .orderBy("createdAt", "asc")
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    // fallback a localStorage si Firestore falla
    try {
      return JSON.parse(localStorage.getItem(ZM_LS_KEY) || "[]");
    } catch {
      return [];
    }
  }
}

async function zmFSSave(item) {
  // item ya tiene id generado; lo usamos como doc id
  const { id, ...data } = item;
  await fbDB.collection(ZM_COLLECTION).doc(id).set(data);
}

async function zmFSDelete(id) {
  await fbDB.collection(ZM_COLLECTION).doc(id).delete();
}

// ── Cache local para render rápido ──────────────────────────
let _zmCache = null;

async function zmGetAll() {
  if (_zmCache) return _zmCache;
  _zmCache = await zmFSGetAll();
  return _zmCache;
}

function zmInvalidateCache() {
  _zmCache = null;
}

// ── Subida a Cloudinary ──────────────────────────────────────
async function zmUploadToCloudinary(file, onProgress) {
  const url = `https://api.cloudinary.com/v1_1/${ZM_CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", ZM_UPLOAD_PRESET);
  fd.append("folder", "epad_zona");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(
          new Error(
            "Error Cloudinary: " + xhr.status + " — " + xhr.responseText,
          ),
        );
      }
    };
    xhr.onerror = () => reject(new Error("Error de red al subir archivo."));
    xhr.send(fd);
  });
}

// ── Render tarjetas ──────────────────────────────────────────
const ZM_SUBAREAS = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];

function zmBuildCard(item, isAdmin) {
  const { emoji, label, cls } = zmTypeIcon(item.tipo);
  const subAreaNames = {
    "1-1": "1.1 — Introducción Docente",
    "1-2": "1.2 — Fundamentos Avanzados",
    "2-1": "2.1 — Estrategias Activas",
    "2-2": "2.2 — Pedagogía Digital",
    "3-1": "3.1 — Casos Reales",
    "3-2": "3.2 — Examen de Maestría",
  };
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  const accessUrl = item.cloudinaryUrl || item.url || "";

  if (isAdmin) {
    return `
    <div class="material-card material-card-admin" id="zm-card-${item.id}">
      <div class="material-card-top">
        <div class="material-icon ${cls}">${emoji}</div>
        <div class="material-info">
          <div class="material-tipo-row">
            <span class="material-badge material-badge-${cls}">${label}</span>
            <span class="material-subarea-badge">📍 Subárea ${item.zona || ""}</span>
            ${item.sourceType === "cloudinary" ? '<span class="material-subarea-badge" style="color:#27ae60;border-color:rgba(39,174,96,.3);">☁️ Cloudinary</span>' : ""}
          </div>
          <div class="material-titulo">${escHtml(item.titulo)}</div>
          ${item.fileName ? `<div class="material-url-preview">📁 ${escHtml(item.fileName)}</div>` : ""}
          ${accessUrl && !item.fileName ? `<div class="material-url-preview">🔗 ${escHtml(accessUrl.length > 55 ? accessUrl.slice(0, 55) + "…" : accessUrl)}</div>` : ""}
          ${dateStr ? `<div class="material-date">Agregado: ${dateStr}</div>` : ""}
        </div>
      </div>
      <div class="material-card-actions">
        ${accessUrl ? `<button class="material-btn-access" onclick="window.open('${escHtml(accessUrl)}','_blank')">↗ Ver</button>` : ""}
        <button class="material-btn-edit" onclick="zmOpenEditModal('${item.id}')">✏️ Editar</button>
        <button class="material-btn-delete" onclick="zmDeleteMaterial('${item.id}')">🗑</button>
      </div>
    </div>`;
  }

  // Vista pública
  return `
    <div class="material-card" id="zm-card-${item.id}">
      <div class="material-card-top">
        <div class="material-icon ${cls}">${emoji}</div>
        <div class="material-info">
          <div class="material-tipo">${label}</div>
          <div class="material-titulo">${escHtml(item.titulo)}</div>
        </div>
      </div>
      <div class="material-card-actions">
        ${accessUrl ? `<button class="material-btn-access" onclick="window.open('${escHtml(accessUrl)}','_blank')">↗ Acceder</button>` : ""}
      </div>
    </div>`;
}

// ── Render admin + público ───────────────────────────────────
async function zmRenderAdmin() {
  const items = await zmGetAll();
  const subAreaNames = {
    "1-1": "1.1 Introducción",
    "1-2": "1.2 Fundamentos",
    "2-1": "2.1 Estrategias",
    "2-2": "2.2 Digital",
    "3-1": "3.1 Casos Reales",
    "3-2": "3.2 Maestría",
  };
  ZM_SUBAREAS.forEach((sub) => {
    const grid = document.getElementById("zm-cards-" + sub);
    const empty = document.getElementById("zm-empty-" + sub);
    if (!grid || !empty) return;
    const zone = items.filter((i) => i.zona === sub);
    if (zone.length === 0) {
      grid.innerHTML = "";
      empty.style.display = "";
    } else {
      empty.style.display = "none";
      grid.innerHTML = zone.map((i) => zmBuildCard(i, true)).join("");
    }
    // badge con conteo en tab
    const tabBtn = document.querySelector(`.zona-tab[onclick*="'${sub}'"]`);
    if (tabBtn) {
      const base = subAreaNames[sub] || sub;
      tabBtn.innerHTML =
        zone.length > 0
          ? `${base} <span style='background:var(--accent);color:#1a2a3a;border-radius:10px;padding:1px 7px;font-size:10px;font-weight:800;margin-left:4px;'>${zone.length}</span>`
          : base;
    }
  });
}

async function zmRenderPublic() {
  const items = await zmGetAll();
  ZM_SUBAREAS.forEach((sub) => {
    const container = document.getElementById("view-zona-" + sub);
    if (!container) return;
    const zone = items.filter((i) => i.zona === sub);
    container.innerHTML =
      zone.length === 0
        ? ""
        : '<div class="zona-sub-mat-grid">' +
          zone.map((i) => zmBuildCard(i, false)).join("") +
          "</div>";
  });
}

// ── Estado formulario ────────────────────────────────────────
let _zmPendingFile = null;
let _zmCurrentSource = "url";

function zmSetSource(mode) {
  _zmCurrentSource = mode;
  document.getElementById("zm-source-url").style.display =
    mode === "url" ? "" : "none";
  document.getElementById("zm-source-file").style.display =
    mode === "file" ? "" : "none";
  document
    .getElementById("zm-src-url-btn")
    .classList.toggle("active", mode === "url");
  document
    .getElementById("zm-src-file-btn")
    .classList.toggle("active", mode === "file");
}

function zmFileSelected(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 100 * 1024 * 1024) {
    alert(
      "El archivo supera 100 MB. Usa un enlace URL para archivos tan grandes.",
    );
    input.value = "";
    return;
  }
  _zmPendingFile = file;
  zmShowFilePreview(file);
  const ext = file.name.split(".").pop().toLowerCase();
  const tipo = document.getElementById("zm-tipo");
  if (["mp4", "webm", "mov", "avi"].includes(ext)) tipo.value = "video";
  else if (ext === "pdf") tipo.value = "pdf";
  else tipo.value = "documento";
  const tit = document.getElementById("zm-titulo");
  if (!tit.value.trim())
    tit.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

function zmShowFilePreview(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const icon = ["mp4", "webm", "mov"].includes(ext)
    ? "📹"
    : ext === "pdf"
      ? "📄"
      : ["doc", "docx"].includes(ext)
        ? "📝"
        : ["ppt", "pptx"].includes(ext)
          ? "📊"
          : ["xls", "xlsx"].includes(ext)
            ? "<i data-lucide='clipboard-list'></i>"
            : ["png", "jpg", "jpeg", "gif"].includes(ext)
              ? "🖼️"
              : "📎";
  const size =
    file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(1) + " KB"
      : (file.size / 1024 / 1024).toFixed(2) + " MB";
  document.getElementById("zm-file-preview-icon").textContent = icon;
  document.getElementById("zm-file-preview-name").textContent = file.name;
  document.getElementById("zm-file-preview-size").textContent = size;
  document.getElementById("zm-file-preview").style.display = "";
  document.getElementById("zm-dropzone").style.display = "none";
}

function zmClearFile() {
  _zmPendingFile = null;
  document.getElementById("zm-file-input").value = "";
  document.getElementById("zm-file-preview").style.display = "none";
  document.getElementById("zm-dropzone").style.display = "";
}

function zmDragOver(e) {
  e.preventDefault();
  document.getElementById("zm-dropzone").classList.add("drag-over");
}
function zmDragLeave() {
  document.getElementById("zm-dropzone").classList.remove("drag-over");
}
function zmDrop(e) {
  e.preventDefault();
  document.getElementById("zm-dropzone").classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (!file) return;
  zmFileSelected({ files: [file], value: "" });
  _zmPendingFile = file;
}

// ── Agregar material (URL o archivo Cloudinary) ──────────────
async function addZonaMaterial() {
  const titulo = (document.getElementById("zm-titulo")?.value || "").trim();
  const tipo = document.getElementById("zm-tipo")?.value || "video";
  const zona = document.getElementById("zm-zona")?.value || "1-1";
  const errEl = document.getElementById("zm-error");
  const okEl = document.getElementById("zm-success");
  const btn = document.querySelector('[onclick="addZonaMaterial()"]');

  if (errEl) errEl.style.display = "none";
  if (okEl) okEl.style.display = "none";

  if (!titulo) {
    if (errEl) {
      errEl.textContent = "Por favor escribe un título.";
      errEl.style.display = "";
    }
    return;
  }

  // ── Modo URL ──
  if (_zmCurrentSource === "url") {
    const url = (document.getElementById("zm-url")?.value || "").trim();
    if (!url) {
      if (errEl) {
        errEl.textContent = "Por favor pega una URL.";
        errEl.style.display = "";
      }
      return;
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const item = {
      id,
      titulo,
      tipo,
      url,
      zona,
      sourceType: "url",
      createdAt: new Date().toISOString(),
    };
    try {
      await zmFSSave(item);
      zmInvalidateCache();
      document.getElementById("zm-titulo").value = "";
      document.getElementById("zm-url").value = "";
      await zmRenderAdmin();
      await zmRenderPublic();
      switchZonaTab(zona);
      if (okEl) {
        okEl.textContent = `✓ "${titulo}" guardado en Subárea ${zona}.`;
        okEl.style.display = "";
      }
      setTimeout(() => {
        if (okEl) okEl.style.display = "none";
      }, 3500);
    } catch (err) {
      if (errEl) {
        errEl.textContent = "Error al guardar: " + err.message;
        errEl.style.display = "";
      }
    }
    return;
  }

  // ── Modo archivo → Cloudinary ──
  if (!_zmPendingFile) {
    if (errEl) {
      errEl.textContent = "Selecciona un archivo primero.";
      errEl.style.display = "";
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Subiendo… 0%";
  }

  // Barra de progreso en dropzone
  const dz = document.getElementById("zm-dropzone");
  let progressBar = document.getElementById("zm-upload-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.id = "zm-upload-progress";
    progressBar.style.cssText =
      "height:6px;background:var(--border);border-radius:6px;margin-top:10px;overflow:hidden;";
    progressBar.innerHTML =
      '<div id="zm-upload-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent-light));border-radius:6px;transition:width .2s;"></div>';
    document.getElementById("zm-file-preview").after(progressBar);
  }
  progressBar.style.display = "";

  try {
    const result = await zmUploadToCloudinary(_zmPendingFile, (pct) => {
      if (btn) btn.textContent = `Subiendo… ${pct}%`;
      const bar = document.getElementById("zm-upload-bar");
      if (bar) bar.style.width = pct + "%";
    });

    const id = "cld-" + Date.now().toString(36);
    const item = {
      id,
      titulo,
      tipo,
      zona,
      sourceType: "cloudinary",
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      fileName: _zmPendingFile.name,
      fileSize: _zmPendingFile.size,
      mimeType: _zmPendingFile.type,
      createdAt: new Date().toISOString(),
    };

    await zmFSSave(item);
    zmInvalidateCache();

    document.getElementById("zm-titulo").value = "";
    zmClearFile();
    progressBar.style.display = "none";
    await zmRenderAdmin();
    await zmRenderPublic();
    switchZonaTab(zona);

    if (okEl) {
      okEl.textContent = `✓ "${titulo}" subido a Cloudinary y guardado.`;
      okEl.style.display = "";
    }
    setTimeout(() => {
      if (okEl) okEl.style.display = "none";
    }, 4000);
  } catch (err) {
    if (errEl) {
      errEl.textContent = "Error: " + err.message;
      errEl.style.display = "";
    }
    progressBar.style.display = "none";
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "✦ Agregar material";
    }
  }
}

// ── Eliminar material ────────────────────────────────────────
async function zmDeleteMaterial(id) {
  if (!confirm("¿Eliminar este material? Esta acción no se puede deshacer."))
    return;
  try {
    await zmFSDelete(id);
    zmInvalidateCache();
    await zmRenderAdmin();
    await zmRenderPublic();
    showZonaAdminToast("🗑 Material eliminado.");
  } catch (err) {
    alert("Error al eliminar: " + err.message);
  }
}

// ── Tabs de subárea ──────────────────────────────────────────
function switchZonaTab(sub, btnEl) {
  ZM_SUBAREAS.forEach((s) => {
    const panel = document.getElementById("zm-panel-" + s);
    if (panel) panel.classList.toggle("active", s === sub);
  });
  if (btnEl) {
    document
      .querySelectorAll(".zona-tab")
      .forEach((b) => b.classList.remove("active"));
    btnEl.classList.add("active");
  } else {
    document.querySelectorAll(".zona-tab").forEach((b) => {
      b.classList.toggle(
        "active",
        b.getAttribute("onclick")?.includes(`'${sub}'`),
      );
    });
  }
}

// ── Modal Editar ─────────────────────────────────────────────
async function zmOpenEditModal(id) {
  const items = await zmGetAll();
  const item = items.find((i) => i.id === id);
  if (!item) return;

  const existing = document.getElementById("zm-edit-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "zm-edit-modal-overlay";
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(10,20,40,0.65);z-index:9000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);";
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const subAreaOptions = [
    ["1-1", "1.1 — Introducción Docente"],
    ["1-2", "1.2 — Fundamentos Avanzados"],
    ["2-1", "2.1 — Estrategias Activas"],
    ["2-2", "2.2 — Pedagogía Digital"],
    ["3-1", "3.1 — Casos Reales"],
    ["3-2", "3.2 — Examen de Maestría"],
  ]
    .map(
      ([val, txt]) =>
        `<option value="${val}" ${item.zona === val ? "selected" : ""}>${txt}</option>`,
    )
    .join("");

  const isCloudinary = item.sourceType === "cloudinary";
  const isFile = isCloudinary;

  overlay.innerHTML = `
    <div style='background:var(--surface);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);width:min(560px,95vw);max-height:90vh;overflow-y:auto;padding:28px 32px;position:relative;'>
      <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;'>
        <div>
          <div style='font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;'>Zona de Aprendizaje</div>
          <div style='font-family:'Merriweather',serif;font-size:18px;font-weight:700;color:var(--primary);'>Editar material</div>
        </div>
        <button onclick="document.getElementById('zm-edit-modal-overlay').remove()" style='background:var(--surface2);border:none;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:18px;color:var(--text-muted);'>✕</button>
      </div>
      <div style='display:grid;gap:14px;'>
        <div class="form-group">
          <label class="form-label">Título *</label>
          <input class="form-input" id="zm-edit-titulo" value="${escHtml(item.titulo)}" placeholder="Título del material" />
        </div>
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-input" id="zm-edit-tipo">
            <option value="video"     ${item.tipo === "video" ? "selected" : ""}>📹 Video</option>
            <option value="pdf"       ${item.tipo === "pdf" ? "selected" : ""}>📄 PDF</option>
            <option value="documento" ${item.tipo === "documento" ? "selected" : ""}>📎 Documento</option>
          </select>
        </div>
        ${
          !isFile
            ? `
        <div class="form-group">
          <label class="form-label">URL / Enlace</label>
          <input class="form-input" id="zm-edit-url" value="${escHtml(item.url || "")}" placeholder="https://..." />
        </div>`
            : `
        <div style='background:var(--surface2);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--text-muted);border:1px solid var(--border);'>
          ☁️ Archivo en Cloudinary:<br>
          <strong style='color:var(--text-primary);'>${escHtml(item.fileName || "")}</strong><br>
          <a href="${escHtml(item.cloudinaryUrl || "")}" target="_blank" style='color:var(--accent);font-size:11px;'>Ver archivo ↗</a>
        </div>`
        }
        <div class="form-group">
          <label class="form-label">Mover a subárea</label>
          <select class="form-input" id="zm-edit-zona">${subAreaOptions}</select>
        </div>
        <div id="zm-edit-error" style='display:none;color:#e74c3c;font-size:13px;padding:8px 12px;background:rgba(231,76,60,0.08);border-radius:8px;border:1px solid rgba(231,76,60,.2);'></div>
      </div>
      <div style='display:flex;gap:10px;margin-top:22px;'>
        <button onclick="zmSaveEdit('${id}')" style='flex:1;padding:13px;background:linear-gradient(135deg,var(--accent),var(--accent-light));color:#1a2a3a;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;'>💾 Guardar cambios</button>
        <button onclick="document.getElementById('zm-edit-modal-overlay').remove()" style='padding:13px 20px;background:var(--surface2);color:var(--text-secondary);border:1.5px solid var(--border);border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;'>Cancelar</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
}

async function zmSaveEdit(id) {
  const items = await zmGetAll();
  const item = items.find((i) => i.id === id);
  if (!item) return;

  const titulo = (
    document.getElementById("zm-edit-titulo")?.value || ""
  ).trim();
  const tipo = document.getElementById("zm-edit-tipo")?.value || "video";
  const zona = document.getElementById("zm-edit-zona")?.value || "1-1";
  const urlEl = document.getElementById("zm-edit-url");
  const url = urlEl ? urlEl.value.trim() : item.url || "";
  const errEl = document.getElementById("zm-edit-error");

  if (!titulo) {
    if (errEl) {
      errEl.textContent = "El título no puede estar vacío.";
      errEl.style.display = "";
    }
    return;
  }

  const updated = { ...item, titulo, tipo, zona, ...(urlEl ? { url } : {}) };
  const { id: _id, ...data } = updated;

  try {
    await fbDB.collection(ZM_COLLECTION).doc(id).update(data);
    zmInvalidateCache();
    await zmRenderAdmin();
    await zmRenderPublic();
    switchZonaTab(zona);
    document.getElementById("zm-edit-modal-overlay")?.remove();
    showZonaAdminToast(`✓ "${titulo}" actualizado.`);
  } catch (err) {
    if (errEl) {
      errEl.textContent = "Error al guardar: " + err.message;
      errEl.style.display = "";
    }
  }
}

// ── Toast ────────────────────────────────────────────────────
function showZonaAdminToast(msg) {
  let t = document.getElementById("zm-admin-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "zm-admin-toast";
    t.style.cssText =
      "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:13px 26px;border-radius:30px;font-size:14px;font-weight:700;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.25);transition:opacity 0.3s;pointer-events:none;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(t._tid);
  t._tid = setTimeout(() => {
    t.style.opacity = "0";
  }, 3000);
}

// ── Init ─────────────────────────────────────────────────────
// Patch showSection
// Patch de showSection para cargar materiales de Zona al navegar
const _origShowSection = showSection;
window.showSection = function (name, el) {
  _origShowSection(name, el);
  if (name === "zona-materiales") zmRenderAdmin();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => zmRenderPublic());
} else {
  zmRenderPublic();
}
